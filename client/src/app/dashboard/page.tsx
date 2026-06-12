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

const chartData = [
  { name: 'Felt Rested RF Acc', score: 73.56 },
  { name: 'Felt Rested XGB Acc', score: 74.06 },
  { name: 'Sleep Risk XGB Acc', score: 94.80 },
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
    <div className="p-6 lg:p-12 max-w-7xl mx-auto space-y-16">
      
      {/* 1. HERO / PROJECT OVERVIEW */}
      <section>
        <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-2">
              <BrainCircuit className="w-4 h-4 mr-2" /> Machine Learning Project
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Sleep Health Prediction System
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
              An advanced predictive analytics tool designed to evaluate sleep health parameters. 
              By utilizing behavioral sleep data, this system classifies user profiles into distinct risk 
              categories and probabilities, providing actionable insights for health optimization.
            </p>
          </div>
          
          <Card className="w-full md:w-80 shrink-0 bg-slate-900 text-white border-slate-800">
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
              <div className="pt-3 border-t border-slate-800">
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
          <Target className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-slate-900">Key Performance Indicators</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-slate-500 uppercase tracking-wider">Felt Rested RF Acc</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900">73.56%</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-slate-500 uppercase tracking-wider">Felt Rested XGB Acc</CardTitle>
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
              <CardTitle className="text-xs text-green-700 uppercase tracking-wider font-bold">Sleep Risk XGB Acc</CardTitle>
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
              <div className="relative w-full aspect-square max-w-[400px]">
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
              <div className="relative w-full aspect-square max-w-[400px]">
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
            <CardContent className="flex justify-center bg-slate-50 rounded-b-xl border-t border-slate-100">
              <div className="relative w-full aspect-square max-w-[400px]">
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
            <CardContent className="flex justify-center bg-slate-50 rounded-b-xl border-t border-slate-100">
              <div className="relative w-full aspect-square max-w-[400px]">
                <Image src="/ml-results/shap_interaction_value.png" alt="SHAP Plot" fill className="object-contain" />
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

      {/* 9. LIVE PREDICTION DEMO */}
      <section className="bg-slate-900 rounded-3xl p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Live Model Inference</h2>
            <p className="text-slate-400">Test the XGBoost deployment by entering live behavioral parameters.</p>
          </div>

          <form onSubmit={handleSubmit} className="mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
              {/* Stress */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stress (0-10)</label>
                <input
                  type="number" name="stress_score" min="0" max="10"
                  value={formData.stress_score} onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Sleep Duration */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sleep (hrs)</label>
                <input
                  type="number" name="sleep_duration_hrs" min="0" max="24" step="0.5"
                  value={formData.sleep_duration_hrs} onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Caffeine */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Caff (mg)</label>
                <input
                  type="number" name="caffeine_mg_before_bed" min="0"
                  value={formData.caffeine_mg_before_bed} onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Screen Time */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Screen (min)</label>
                <input
                  type="number" name="screen_time_before_bed_mins" min="0"
                  value={formData.screen_time_before_bed_mins} onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Wakes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Wakes</label>
                <input
                  type="number" name="wake_episodes_per_night" min="0"
                  value={formData.wake_episodes_per_night} onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div className="h-[42px]">
                <button
                  type="submit" disabled={loading}
                  className="w-full h-full rounded-xl shadow-md bg-orange-600 hover:bg-orange-500 text-white font-bold transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-4 h-4 mr-2" /> Predict</>}
                </button>
              </div>
            </div>
          </form>

          {error && <div className="mb-6 p-4 rounded-xl bg-red-900/50 border border-red-800 text-red-200">{error}</div>}

          {result !== null && (
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="text-center md:text-left">
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Predicted Risk Level</p>
                  <div className={`text-4xl font-black ${
                    result === 0 ? "text-green-400" : result === 1 ? "text-amber-400" : "text-red-400"
                  }`}>
                    {result === 0 ? "LOW RISK" : result === 1 ? "MODERATE RISK" : "HIGH RISK"}
                  </div>
                </div>

                {recommendations.length > 0 && (
                  <div className="flex-1 md:border-l md:border-slate-700 md:pl-8">
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-3">Model Generated Advice</p>
                    <ul className="space-y-2">
                      {recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start text-slate-300 text-sm">
                          <span className="text-orange-500 mr-2">•</span> {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 10. FINAL INSIGHTS */}
      <section className="pb-12">
        <Card className="bg-slate-50">
          <CardHeader>
            <CardTitle className="text-xl">Executive Summary & Final Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 shrink-0" />
                <span className="text-slate-700 leading-relaxed"><strong>XGBoost Superiority:</strong> XGBoost achieved the best overall performance, dramatically outperforming Random Forest specifically in multi-class edge cases.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 shrink-0" />
                <span className="text-slate-700 leading-relaxed"><strong>High Accuracy:</strong> The Sleep Risk model achieved a robust <strong>~95% accuracy</strong>, demonstrating extreme reliability in distinguishing complex sleep disorder profiles.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 shrink-0" />
                <span className="text-slate-700 leading-relaxed"><strong>AUC Metric:</strong> The Felt Rested binary model achieved an <strong>AUC of 82.37%</strong>, indicating strong separability between rested and fatigued states.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 shrink-0" />
                <span className="text-slate-700 leading-relaxed"><strong>Feature Engine Impact:</strong> Extensive feature engineering (e.g. <code>sleep_efficiency</code>, <code>screen_caffeine</code>) significantly improved prediction quality over raw baseline features.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 shrink-0" />
                <span className="text-slate-700 leading-relaxed"><strong>Interpretability:</strong> Utilizing SHAP values improved interpretability, enabling the creation of the dynamic recommendation engine.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 shrink-0" />
                <span className="text-slate-700 leading-relaxed"><strong>Deployment Ready:</strong> The system architecture successfully bridges the gap between raw ML inference and a consumer-facing decision-support application.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

    </div>
  );
}
