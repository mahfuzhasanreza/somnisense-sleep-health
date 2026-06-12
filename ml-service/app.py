import os
import joblib
from fastapi import FastAPI, HTTPException
from typing import Dict, Any
import pandas as pd
import xgboost as xgb
import sklearn

app = FastAPI(title="ML Service API")

# Load Models and Artifacts
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")

def load_model(filename):
    return joblib.load(os.path.join(MODEL_DIR, filename))

risk_model = load_model("A_xgb_risk_model.pkl")
label_encoders = load_model("B_label_encoders.pkl")
feature_columns = load_model("C_feature_columns.pkl")
felt_model = load_model("D_xgb_felt_model.pkl")

def preprocess_input(data: Dict[str, Any]) -> pd.DataFrame:
    df = pd.DataFrame([data])
    
    for col, le in label_encoders.items():
        if col in df.columns:
            try:
                # Handle unseen labels by mapping to a known value or raising 400
                known_classes = set(le.classes_)
                # Let's check if the current values are known
                if not df[col].isin(known_classes).all():
                    # For a production system we might map to a special class,
                    # but here we just let it fail naturally or handle it manually.
                    raise ValueError(f"Contains unseen labels for {col}")
                df[col] = le.transform(df[col])
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Encoding error in {col}: {str(e)}")
                
    missing_cols = [col for col in feature_columns if col not in df.columns]
    for col in missing_cols:
        df[col] = 0 # fill missing with 0 or raise error? It's better to provide defaults for missing
        
    df = df[feature_columns]
    # Ensure types are numeric
    df = df.apply(lambda col: pd.to_numeric(col, errors='coerce'))
    return df

def make_prediction(model, df):
    try:
        # Check if the model is a Booster
        if hasattr(model, 'predict') and 'DMatrix' in str(type(model.predict)):
            # It's highly likely a booster if we need DMatrix but let's just try scikit-learn API first
            pass
        return model.predict(df)
    except Exception as e:
        if 'DMatrix' in str(e) or type(model).__name__ == 'Booster':
            return model.predict(xgb.DMatrix(df))
        raise

def generate_recommendations(payload: Dict[str, Any]):
    recs = []
    
    stress = float(payload.get('stress_score', 0))
    if stress > 6:
        recs.append("Consider relaxation techniques like meditation or deep breathing to lower stress before bed.")
        
    caffeine = float(payload.get('caffeine_mg_before_bed', 0))
    if caffeine > 30:
        recs.append("Reduce caffeine intake in the evening to avoid disrupting your sleep cycle.")
        
    duration = float(payload.get('sleep_duration_hrs', 8))
    if duration < 7:
        recs.append("Aim for at least 7-8 hours of sleep per night to allow your body to fully recover.")
        
    screen_time = float(payload.get('screen_time_before_bed_mins', 0))
    if screen_time > 30:
        recs.append("Limit screen time to less than 30 minutes before bed to reduce blue light exposure.")
        
    wake = float(payload.get('wake_episodes_per_night', 0))
    if wake > 1:
        recs.append("Try to maintain a cool room temperature and limit liquids right before bed to minimize waking up.")
        
    if not recs:
        recs.append("Your sleep habits look great! Keep maintaining your healthy routine.")
        
    return recs

@app.post("/predict")
async def predict(payload: Dict[str, Any]):
    try:
        df = preprocess_input(payload)
        prediction = make_prediction(risk_model, df)
        # Convert prediction to native python type
        if hasattr(prediction[0], 'item'):
            res = prediction[0].item()
        else:
            res = prediction[0]
            
        stress = float(payload.get('stress_score', 0))
        sleep = float(payload.get('sleep_duration_hrs', 0))
        caffeine = float(payload.get('caffeine_mg_before_bed', 0))
        
        response_data = {"prediction": res}
        
        if stress >= 8 and sleep <= 3 and caffeine >= 150:
            res = 2
            response_data["prediction"] = res
            response_data["risk"] = "high risk"
            
        response_data["recommendations"] = generate_recommendations(payload)
        return response_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/felt-predict")
async def felt_predict(payload: Dict[str, Any]):
    try:
        df = preprocess_input(payload)
        prediction = make_prediction(felt_model, df)
        if hasattr(prediction[0], 'item'):
            res = prediction[0].item()
        else:
            res = prediction[0]
            
        recommendations = generate_recommendations(payload)
        return {"prediction": res, "recommendations": recommendations}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
