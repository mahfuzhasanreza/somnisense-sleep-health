"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { 
  Activity, Clock, Coffee, Moon, Monitor, Loader2, Sparkles, Target, 
  Database, BrainCircuit, CheckCircle2, AlertTriangle, ShieldAlert, Zap
} from "lucide-react";
import methodology from "../../../public/somnisense-methodology.png";
import architecture from "../../../public/SomniSense-web-app-architecture.png";

const chartData = [
  { name: 'Felt Rested RF Accuracy', score: 73.56 },
  { name: 'Felt Rested XGB Accuracy', score: 74.06 },
  { name: 'Sleep Risk XGB Accuracy', score: 94.80 },
  { name: 'Felt Rested AUC', score: 82.37 },
  { name: 'Sleep Risk F1', score: 87.00 },
];

export default function Dashboard() {
  const { token } = useAuth();
  
  const [formData, setFormData] = useState({
    stress_score: 5,
    sleep_duration_hrs: 7,
    caffeine_mg_before_bed: 0,
    screen_time_before_bed_mins: 30,
    wake_episodes_per_night: 0,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      setError("Please log in to use the live demo.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setRecommendations([]);

    try {
      const response = await fetch("http://localhost:5000/api/predict", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch prediction");
      }

      setResult(data.prediction);
      setRecommendations(data.recommendations || []);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 mx-auto space-y-16">
      
      {/* 1. HERO / PROJECT OVERVIEW */}
      <section>
        <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
          <div className="flex-1 space-y-4">
           
            <h1 className="mt-2 text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Sleep Health Prediction System
            </h1>
            <br></br>
            <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
              SomniSense: Somni means Sleep (Latin root), and Sense means understanding. <br></br>SomniSense is an AI-powered sleep understanding system. <br></br> <br></br> This is an advanced predictive analytics tool designed to evaluate sleep health parameters. 
              By utilizing behavioral sleep data, this system classifies user profiles into distinct risk 
              categories and probabilities, providing actionable insights for health optimization.
            </p>
          </div>
          
          <Card className="w-full md:w-90 shrink-0 bg-slate-700 text-white ">
            <CardHeader className="pb-3 border-b border-slate-800">
              <CardTitle className="text-white flex items-center text-sm">
                <Database className="w-4 h-4 mr-2 text-orange-500" /> Project Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-sm text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Dataset Size:</span>
                <span className="font-medium text-white">100,000 records</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Features:</span>
                <span className="font-medium text-white">32 input metrics</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Binary Target:</span>
                <span className="font-medium text-white">felt_rested</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Multiclass Target:</span>
                <span className="font-medium text-white">sleep_disorder_risk</span>
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-between">
                <span className="text-slate-400 block mb-1">Models Deployed:</span>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-slate-800 rounded text-xs font-bold text-orange-400">XGBoost</span>
                  <span className="px-2 py-1 bg-slate-800 rounded text-xs font-bold text-orange-400">Random Forest</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 2. PERFORMANCE METRICS CARDS */}
      <section>
        <div className="flex items-center space-x-2 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Key Performance Indicators</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-slate-500 uppercase tracking-wider">Felt Rested RF Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900">73.56%</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-slate-500 uppercase tracking-wider">Felt Rested XGB Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900">74.06%</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-slate-500 uppercase tracking-wider">Felt Rested AUC</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900">82.37%</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500 bg-green-50/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-green-700 uppercase tracking-wider font-bold">Sleep Risk XGB Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-green-700">94.80%</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500 bg-green-50/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-green-700 uppercase tracking-wider font-bold">Sleep Risk Macro F1</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-green-700">87.00%</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3. MODEL PERFORMANCE COMPARISON */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Model Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}} 
                    contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                  />
                  <Bar dataKey="score" fill="#ea580c" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 4. CONFUSION MATRIX SECTION */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Confusion Matrices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Felt Rested Classification</CardTitle>
              <p className="text-sm text-slate-500">Binary classification evaluating if a subject feels rested.</p>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="relative w-full aspect-square max-w-lg">
                <Image src="/ml-results/felt_rested_confusion_matrix.png" alt="Felt Rested Confusion Matrix" fill className="object-contain rounded-lg" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sleep Disorder Risk Classification</CardTitle>
              <p className="text-sm text-slate-500">Multiclass prediction evaluating low, moderate, and high risk.</p>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="relative w-full aspect-square max-w-lg">
                <Image src="/ml-results/sleep_disorder_risk_confusion_matrix.png" alt="Sleep Disorder Risk Confusion Matrix" fill className="object-contain rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 5. FEATURE IMPORTANCE & 6. SHAP SECTION */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Model Explainability</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>XGBoost Feature Importance</CardTitle>
              <p className="text-sm text-slate-500">
                These are the most influential behavioral features extracted internally by the XGBoost algorithm when predicting sleep disorder risks.
              </p>
            </CardHeader>
            <CardContent className="flex justify-center rounded-b-xl">
              <div className="relative w-full aspect-square max-w-lg">
                <Image src="/ml-results/top_features_sleep_risk.png" alt="Top Features" fill className="object-contain" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SHAP Global Interpretation</CardTitle>
              <p className="text-sm text-slate-500">
                SHAP (SHapley Additive exPlanations) values help interpret complex model predictions by illustrating how much each feature contributed to pushing the model output.
              </p>
            </CardHeader>
            <CardContent className="flex justify-center rounded-b-xl ">
              <div className="relative w-full aspect-square max-w-lg">
                <Image src="/ml-results/shap_interaction_value.png" alt="SHAP Plot" fill className="object-contain" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* MODEL EXPLAINABILITY & SYSTEM DESIGN */}
<section>
  <h2 className="text-2xl font-bold text-slate-900 mb-6">
    Methodology & Web App Architecture
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    {/* Methodology */}
    <Card>
      <CardHeader>
        <CardTitle>SomniSense Methodology</CardTitle>
        <p className="text-sm text-slate-500">
          End-to-end workflow of the proposed SomniSense framework,
          including data preprocessing, feature engineering, machine
          learning training, explainability analysis, and personalized
          recommendation generation.
        </p>
      </CardHeader>

      <CardContent className="flex justify-center rounded-b-xl">
        <div className="relative w-full aspect-square max-w-lg">
          <Image
            src={methodology}
            alt="SomniSense Methodology"
            fill
            className="object-contain"
          />
        </div>
      </CardContent>
    </Card>

    {/* Web Architecture */}
    <Card>
      <CardHeader>
        <CardTitle>Web Application Architecture</CardTitle>
        <p className="text-sm text-slate-500">
          Overall architecture of the SomniSense platform showing the
          interaction between Next.js frontend, Node.js backend,
          FastAPI ML service, MongoDB database, and trained XGBoost
          models.
        </p>
      </CardHeader>

      <CardContent className="flex justify-center rounded-b-xl">
        <div className="relative w-full aspect-square max-w-lg">
          <Image
            src={architecture}
            alt="SomniSense Web Architecture"
            fill
            className="object-contain"
          />
        </div>
      </CardContent>
    </Card>


  </div>
</section>

      {/* 7. FEATURE ENGINEERING SECTION */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Advanced Feature Engineering</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-orange-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-700 text-lg">sleep_efficiency</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-600"><strong>Formula:</strong> sleep_duration / time_in_bed</p>
              <p className="text-sm text-slate-600"><strong>Why:</strong> Normalizes duration against total time spent attempting to sleep.</p>
              <p className="text-sm text-slate-600"><strong>Impact:</strong> Highly predictive for identifying insomnia patterns.</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-700 text-lg">sleep_disturbance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-600"><strong>Formula:</strong> wake_episodes * avg_wake_duration</p>
              <p className="text-sm text-slate-600"><strong>Why:</strong> Captures the severity of fragmented sleep.</p>
              <p className="text-sm text-slate-600"><strong>Impact:</strong> Critical for predicting 'felt_rested' outcomes.</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-700 text-lg">stress_workload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-600"><strong>Formula:</strong> stress_score * workload_hours</p>
              <p className="text-sm text-slate-600"><strong>Why:</strong> Compounds mental strain with physical time spent working.</p>
              <p className="text-sm text-slate-600"><strong>Impact:</strong> Strong indicator for high sleep disorder risk.</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-700 text-lg">screen_caffeine</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-600"><strong>Formula:</strong> screen_time * caffeine_intake</p>
              <p className="text-sm text-slate-600"><strong>Why:</strong> Measures the combined stimulant effect prior to bed.</p>
              <p className="text-sm text-slate-600"><strong>Impact:</strong> Highlights lifestyle-induced sleep degradation.</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-700 text-lg">sleep_quality_duration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-600"><strong>Formula:</strong> sleep_quality_score * sleep_duration</p>
              <p className="text-sm text-slate-600"><strong>Why:</strong> Creates a single metric representing 'total restorative rest'.</p>
              <p className="text-sm text-slate-600"><strong>Impact:</strong> Highly correlated with positive next-day outcomes.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 8. PERSONALIZED RECOMMENDATION ENGINE */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Recommendation Engine Outputs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Alert>
            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
            <AlertDescription className="font-medium">Increase sleep duration to 7–8 hours</AlertDescription>
          </Alert>
          <Alert>
            <Zap className="w-5 h-5 text-amber-500 mt-0.5" />
            <AlertDescription className="font-medium">Avoid caffeine before bedtime</AlertDescription>
          </Alert>
          <Alert>
            <Monitor className="w-5 h-5 text-blue-500 mt-0.5" />
            <AlertDescription className="font-medium">Reduce screen time before sleep</AlertDescription>
          </Alert>
          <Alert>
            <Activity className="w-5 h-5 text-rose-500 mt-0.5" />
            <AlertDescription className="font-medium">Reduce stress through meditation</AlertDescription>
          </Alert>
          <Alert>
            <Moon className="w-5 h-5 text-indigo-500 mt-0.5" />
            <AlertDescription className="font-medium">Improve sleep consistency</AlertDescription>
          </Alert>
        </div>
      </section>
     

    </div>
  );
}
