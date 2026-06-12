"use client";

import { useState, useEffect } from "react";
import { Activity, Clock, Coffee, Moon, Monitor, Loader2, Sparkles, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

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

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

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
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-6 lg:p-12 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/5 blur-[120px]"></div>
      </div>

      <div className="max-w-6xl mx-auto w-full space-y-10">
        
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
        <section className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-100">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
              
              {/* Stress */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                  Stress ({formData.stress_score}/10)
                </label>
                <div className="flex items-center h-[42px]  rounded-xl transition-all">
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
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                   Sleep (hrs)
                </label>
                <input
                  type="number"
                  name="sleep_duration_hrs"
                  min="0"
                  max="24"
                  step="0.5"
                  value={formData.sleep_duration_hrs}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all outline-none"
                />
              </div>

              {/* Caffeine */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                  Caffeine (mg)
                </label>
                <input
                  type="number"
                  name="caffeine_mg_before_bed"
                  min="0"
                  value={formData.caffeine_mg_before_bed}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all outline-none"
                />
              </div>

              {/* Screen Time */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                  Screen (min)
                </label>
                <input
                  type="number"
                  name="screen_time_before_bed_mins"
                  min="0"
                  value={formData.screen_time_before_bed_mins}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all outline-none"
                />
              </div>

              {/* Wakes */}
              <div className="space-y-2">
                <label className="ml-1 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                   Wakes
                </label>
                <input
                  type="number"
                  name="wake_episodes_per_night"
                  min="0"
                  value={formData.wake_episodes_per_night}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all outline-none"
                />
              </div>

              {/* Submit Button in the same row */}
              <div className="h-[42px]">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-full rounded-xl shadow-md bg-orange-600 hover:bg-orange-500 text-white font-bold transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" /> Analyze
                    </>
                  )}
                </button>
              </div>

            </div>
          </form>
          
          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}
        </section>

        {/* Dynamic Stylized Result Output */}
        {result !== null && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Primary Score Card */}
              <div className={`col-span-1 p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center text-center border overflow-hidden relative ${
                result === 0 ? "bg-gradient-to-br from-green-500 to-emerald-600 border-green-400" :
                result === 1 ? "bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300" :
                "bg-gradient-to-br from-rose-500 to-red-600 border-rose-400"
              }`}>
                {/* Decorative background circle */}
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

              {/* Recommendations Dashboard */}
              <div className="col-span-1 lg:col-span-2 bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Sparkles className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Action Plan</h3>
                </div>

                {recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.map((rec, idx) => (
                      <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start space-x-4 hover:shadow-md transition-shadow">
                        <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-orange-500 shadow-sm shrink-0">
                          {idx + 1}
                        </div>
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
        
      </div>
    </div>
  );
}
