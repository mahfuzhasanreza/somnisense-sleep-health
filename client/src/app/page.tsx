"use client";

import { useState, useEffect } from "react";
import { Activity, Clock, Coffee, Moon, Monitor, Loader2, Sparkles, CheckCircle2, AlertTriangle, ShieldAlert, LineChart as LineChartIcon, History, Target } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Prediction {
  _id: string;
  userInput: {
    stress_score: number;
    sleep_duration_hrs: number;
  };
  predictionResult: {
    prediction: number;
  };
  timestamp: string;
}

export default function Home() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

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

  const [historyData, setHistoryData] = useState<Prediction[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const fetchHistory = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/predictions", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch history");
      const data = await res.json();
      setHistoryData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

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
      
      // Refresh history silently
      fetchHistory();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || !user) return null;

  // Compute Metrics
  const totalAssessments = historyData.length;
  const avgSleep = totalAssessments ? (historyData.reduce((acc, curr) => acc + curr.userInput.sleep_duration_hrs, 0) / totalAssessments).toFixed(1) : 0;
  const avgStress = totalAssessments ? (historyData.reduce((acc, curr) => acc + curr.userInput.stress_score, 0) / totalAssessments).toFixed(1) : 0;
  
  const riskCounts = historyData.reduce((acc, curr) => {
    const risk = curr.predictionResult.prediction;
    acc[risk] = (acc[risk] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  let mostCommonRisk = "N/A";
  if (totalAssessments > 0) {
    const highestKey = Object.keys(riskCounts).reduce((a, b) => riskCounts[Number(a)] > riskCounts[Number(b)] ? a : b);
    mostCommonRisk = Number(highestKey) === 0 ? "Low Risk" : Number(highestKey) === 1 ? "Moderate Risk" : "High Risk";
  }

  // Format chart data (reverse to show chronological order)
  const chartData = [...historyData].reverse().map(d => ({
    date: new Date(d.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    stress: d.userInput.stress_score,
    sleep: d.userInput.sleep_duration_hrs
  }));

  const riskChartData = [
    { name: 'Low', count: riskCounts[0] || 0, fill: '#10b981' },
    { name: 'Mod', count: riskCounts[1] || 0, fill: '#f59e0b' },
    { name: 'High', count: riskCounts[2] || 0, fill: '#f43f5e' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-6 lg:p-12 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/5 blur-[120px]"></div>
      </div>

      <div className="mx-auto w-full max-w-6xl space-y-10">
        
        {/* Header matching History route */}
        <div className="mb-8 flex items-center space-x-3">
          <div className="p-3 bg-white border border-orange-100 rounded-xl shadow-sm">
            <Sparkles className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Your Prediction</h1>
            <p className="text-slate-500">Enter your recent sleep habits to analyze your risk profile.</p>
          </div>
        </div>
        
        {/* Minimal Top Form Section */}
        <section className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
              {/* Stress */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                  Stress ({formData.stress_score}/10)
                </label>
                <div className="flex items-center h-[42px] px-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-orange-500/50 focus-within:border-orange-500 transition-all">
                  <input
                    type="range"
                    name="stress_score"
                    min="0"
                    max="10"
                    value={formData.stress_score}
                    onChange={handleChange}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500 outline-none"
                  />
                </div>
              </div>

              {/* Sleep Duration */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">Sleep (hrs)</label>
                <input
                  type="number" name="sleep_duration_hrs" min="0" max="24" step="0.5"
                  value={formData.sleep_duration_hrs} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all outline-none"
                />
              </div>

              {/* Caffeine */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">Caffeine (mg)</label>
                <input
                  type="number" name="caffeine_mg_before_bed" min="0"
                  value={formData.caffeine_mg_before_bed} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all outline-none"
                />
              </div>

              {/* Screen Time */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">Screen (min)</label>
                <input
                  type="number" name="screen_time_before_bed_mins" min="0"
                  value={formData.screen_time_before_bed_mins} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all outline-none"
                />
              </div>

              {/* Wakes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">Wakes</label>
                <input
                  type="number" name="wake_episodes_per_night" min="0"
                  value={formData.wake_episodes_per_night} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="h-[42px]">
                <button
                  type="submit" disabled={loading}
                  className="w-full h-full rounded-xl shadow-sm bg-orange-600 hover:bg-orange-500 text-white font-bold transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Analyze</>}
                </button>
              </div>
            </div>
          </form>
          {error && <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">{error}</div>}
        </section>

        {/* Dynamic Stylized Result Output */}
        {result !== null && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`col-span-1 p-8 rounded-3xl flex flex-col items-center justify-center text-center border overflow-hidden relative ${
                result === 0 ? "bg-gradient-to-br from-green-500 to-emerald-600 border-green-400" :
                result === 1 ? "bg-gradient-to-br from-amber-400 to-orange-600 border-amber-300" :
                "bg-gradient-to-br from-rose-500 to-red-600 border-red-400"
              }`}>
                <div className="absolute w-64 h-64 bg-white/10 rounded-full -top-10 -right-10 blur-3xl"></div>
                <div className="bg-white/20 p-4 rounded-2xl mb-6 backdrop-blur-sm">
                  {result === 0 ? <CheckCircle2 className="w-12 h-12 text-white" /> :
                   result === 1 ? <AlertTriangle className="w-12 h-12 text-white" /> :
                   <ShieldAlert className="w-12 h-12 text-white" />}
                </div>
                <h2 className="text-white/80 text-sm font-black uppercase tracking-widest mb-2">Risk Level</h2>
                <div className="text-5xl font-black text-white mb-2 tracking-tight">
                  {result === 0 ? "LOW" : result === 1 ? "MODERATE" : "HIGH"}
                </div>
                <p className="text-white/90 text-sm font-medium px-4">
                  Based on your analysis, you currently exhibit a {result === 0 ? "healthy" : "risky"} sleep profile.
                </p>
              </div>

              <div className="col-span-1 lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 flex flex-col">
                <div className="flex items-center space-x-3 mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Action Plan</h3>
                </div>
                {recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.map((rec, idx) => (
                      <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start space-x-4">
                        <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-orange-500 shrink-0 shadow-sm">{idx + 1}</div>
                        <p className="text-slate-700 text-sm font-medium leading-relaxed">{rec}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
                    <h4 className="text-lg font-bold text-slate-900 mb-1">Excellent Routine</h4>
                    <p className="text-slate-500 text-sm">Your sleep habits are perfectly optimized. Keep it up!</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* --- PERSONALIZED DASHBOARD SECTION --- */}
        {!loadingHistory && totalAssessments > 0 && (
          <section className="pt-8 border-t border-slate-200">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                <LineChartIcon className="w-6 h-6 text-slate-700" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Your Personalized Analytics</h2>
                <p className="text-slate-500">A summary of your historical sleep data and trends.</p>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-slate-500 uppercase tracking-wider flex items-center">
                    <History className="w-4 h-4 mr-2 text-slate-400" /> Assessments Taken
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-slate-900">{totalAssessments}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-slate-500 uppercase tracking-wider flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-500" /> Avg Sleep
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-slate-900">{avgSleep} <span className="text-base font-medium text-slate-400">hrs</span></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-slate-500 uppercase tracking-wider flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-rose-500" /> Avg Stress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-slate-900">{avgStress} <span className="text-base font-medium text-slate-400">/10</span></div>
                </CardContent>
              </Card>
              <Card className="bg-orange-50 border-orange-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-orange-600 uppercase tracking-wider flex items-center font-bold">
                    <Target className="w-4 h-4 mr-2 text-orange-500" /> Common Risk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black text-orange-700 mt-1">{mostCommonRisk}</div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Recharts Trends */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Behavioral Trends Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="left" domain={[0, 12]} tick={{fill: '#f43f5e', fontSize: 12}} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="right" orientation="right" domain={[0, 14]} tick={{fill: '#3b82f6', fontSize: 12}} axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                        />
                        <Legend iconType="circle" wrapperStyle={{fontSize: '14px', paddingTop: '10px'}} />
                        <Line yAxisId="left" type="monotone" dataKey="stress" name="Stress Score" stroke="#f43f5e" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                        <Line yAxisId="right" type="monotone" dataKey="sleep" name="Sleep (hrs)" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Distribution Bar Chart */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Risk Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={riskChartData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                        <YAxis allowDecimals={false} tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
        
      </div>
    </div>
  );
}
