# SomniSense: AI-Powered Sleep Health Prediction System

SomniSense is an end-to-end Machine Learning and Web-based Sleep Health Prediction Platform that analyzes behavioral and lifestyle factors to predict sleep disorder risk and sleep recovery status ("felt rested").

The system combines Machine Learning, Explainable AI (XAI), Personalized Recommendations, and a Full-Stack Web Application to provide actionable sleep-health insights.

---

## Features

### Machine Learning Models

* Binary Classification:

  * Predicts whether a user feels rested after sleep (`felt_rested`)
* Multiclass Classification:

  * Predicts sleep disorder risk level (`sleep_disorder_risk`)
* XGBoost-based prediction engine
* Random Forest baseline comparison

### Explainable AI

* SHAP-based model interpretation
* Feature importance visualization
* Behavioral factor analysis

### Personalized Recommendations

Generates recommendations based on:

* Stress level
* Sleep duration
* Caffeine intake
* Screen exposure before sleep
* Night awakenings

### Web Application

* Live Prediction System
* Historical Prediction Tracking
* Sleep Analytics
* Model Insights & Explainability Dashboard

---

## System Architecture

```text
SomniSense
│
├── client/                 # Next.js Frontend
│
├── server/                 # Node.js + Express Backend
│
├── ml-service/             # FastAPI ML Service
│
└── README.md
```

---

## Technology Stack

### Frontend

* Next.js
* React
* Tailwind CSS
* TypeScript

### Backend

* Node.js
* Express.js

### Machine Learning Service

* FastAPI
* Python
* XGBoost
* Scikit-learn
* SHAP

### Database

* MongoDB

---

## Dataset

Dataset used:

**Sleep Health Daily Performance Dataset**

Source:

[Sleep Health Daily Performance Dataset Repository](https://github.com/mohan13krishna/Sleep-Health-Daily-Performance-Dataset?utm_source=chatgpt.com)

Dataset Size:

```text
100,000 Records
32 Features
```

---

## Machine Learning Performance

| Metric                   | Value  |
| ------------------------ | ------ |
| Felt Rested RF Accuracy  | 73.56% |
| Felt Rested XGB Accuracy | 74.06% |
| Felt Rested AUC          | 82.37% |
| Sleep Risk XGB Accuracy  | 94.80% |
| Sleep Risk Macro F1      | 87%    |

---

## Feature Engineering

The following engineered features were introduced:

```text
sleep_efficiency
sleep_disturbance
stress_workload
screen_caffeine
sleep_quality_duration
```

These features improved model interpretability and helped capture behavioral interactions affecting sleep quality.

---

# Running Locally

---

## 1. Start ML Service (FastAPI)

Navigate to the ML service directory:

```bash
cd ml-service
```

Activate the virtual environment:

```bash
source venv/bin/activate
```

Start FastAPI:

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

The ML API will be available at:

```text
http://localhost:8000
```

---

## 2. Start Express Backend

Navigate to the server directory:

```bash
cd server
```

Run:

```bash
npm start
```

or

```bash
node index.js
```

The backend server will run on its configured port.

---

## 3. Start Next.js Frontend

Navigate to the client directory:

```bash
cd client
```

Run:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

---

## Application Routes

### Dashboard

Displays:

* Model Performance Metrics
* Confusion Matrices
* SHAP Analysis
* Feature Importance
* Methodology Overview
* System Architecture

---

### Predict

Allows users to:

* Enter sleep-related behavioral information
* Predict sleep disorder risk
* Predict felt-rested outcome
* Receive personalized recommendations

---

### History

Stores previous predictions and displays:

* Historical records
* Risk trends
* User prediction logs

---

### Insights

Provides:

* Sleep analytics
* Explainable AI visualizations
* Behavioral factor analysis
* Feature contribution insights

---

## Demo Credentials

```text
Email:
mahfuz@gmail.com

Password:
mahfuz@gmail.com
```

---

## Research Contribution

SomniSense contributes:

* Sleep Disorder Risk Prediction
* Sleep Recovery Prediction
* Explainable Artificial Intelligence (SHAP)
* Feature Engineering for Sleep Analytics
* Personalized Recommendation Generation
* Full-Stack Deployment Architecture

---

## Repository Structure

```text
somnisense-sleep-health
│
├── client
│   ├── app
│   ├── components
│   ├── public
│   └── ...
│
├── server
│   ├── routes
│   ├── models
│   ├── middleware
│   └── ...
│
├── ml-service
│   ├── app.py
│   ├── A_xgb_risk_model.pkl
│   ├── B_label_encoders.pkl
│   ├── B_risk_encoder.pkl
│   ├── C_feature_columns.pkl
│   ├── D_xgb_felt_model.pkl
│   └── ...
│
└── README.md
```

---

## Authors

**Mahfuz Hasan Reza**