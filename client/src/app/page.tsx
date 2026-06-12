"use client";

import { useState } from "react";
import { Activity, Clock, Coffee, Moon, Monitor, Loader2, Sparkles } from "lucide-react";

export default function Home() {
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
    setLoading(true);
    setError(null);
    setResult(null);
    setRecommendations([]);

    try {
      const response = await fetch("http://localhost:5000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-amber-500/10 blur-[120px]"></div>
      </div>

      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl mb-4 border border-orange-100 shadow-xl">
            <Moon className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight bg-gradient-to-br from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Sleep Health AI
          </h1>
          <p className="text-slate-500 text-lg">
            Discover your sleep risk profile based on your daily habits.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-orange-100/50 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Stress Score */}
              <div className="space-y-3">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <Activity className="w-4 h-4 mr-2 text-orange-500" />
                  Stress Score (0-10)
                </label>
                <div className="relative group">
                  <input
                    type="range"
                    name="stress_score"
                    min="0"
                    max="10"
                    value={formData.stress_score}
                    onChange={handleChange}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <div className="text-right text-xs text-slate-500 font-mono mt-1">{formData.stress_score}/10</div>
                </div>
              </div>

              {/* Sleep Duration */}
              <div className="space-y-3">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <Clock className="w-4 h-4 mr-2 text-orange-500" />
                  Sleep Duration (hrs)
                </label>
                <input
                  type="number"
                  name="sleep_duration_hrs"
                  min="0"
                  max="24"
                  step="0.5"
                  value={formData.sleep_duration_hrs}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-sm"
                  placeholder="e.g. 7.5"
                  required
                />
              </div>

              {/* Caffeine Intake */}
              <div className="space-y-3">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <Coffee className="w-4 h-4 mr-2 text-orange-500" />
                  Caffeine Before Bed (mg)
                </label>
                <input
                  type="number"
                  name="caffeine_mg_before_bed"
                  min="0"
                  value={formData.caffeine_mg_before_bed}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-sm"
                  placeholder="e.g. 50"
                  required
                />
              </div>

              {/* Screen Time */}
              <div className="space-y-3">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <Monitor className="w-4 h-4 mr-2 text-orange-500" />
                  Screen Time Before Bed (mins)
                </label>
                <input
                  type="number"
                  name="screen_time_before_bed_mins"
                  min="0"
                  value={formData.screen_time_before_bed_mins}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-sm"
                  placeholder="e.g. 60"
                  required
                />
              </div>

              {/* Wake Episodes */}
              <div className="space-y-3 md:col-span-2">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <Moon className="w-4 h-4 mr-2 text-orange-500" />
                  Wake Episodes per Night
                </label>
                <input
                  type="number"
                  name="wake_episodes_per_night"
                  min="0"
                  value={formData.wake_episodes_per_night}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-sm"
                  placeholder="e.g. 1"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full relative group overflow-hidden rounded-xl p-[1px] shadow-md hover:shadow-lg transition-all"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 rounded-xl opacity-100 transition-opacity duration-500"></span>
                <div className="relative bg-orange-600 px-8 py-4 rounded-xl leading-none flex items-center justify-center space-x-2 transition-all duration-300 group-hover:bg-opacity-90">
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-orange-100" />
                      <span className="text-white font-semibold tracking-wide">Analyze Sleep Data</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>

          {/* Result Section */}
          {error && (
            <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-start shadow-sm">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {result !== null && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-1 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 shadow-sm">
                <div className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-white/50">
                  <div className="text-center mb-6">
                    <p className="text-orange-600/80 text-sm uppercase tracking-widest font-bold mb-2">Prediction Result</p>
                    <div className="flex items-center justify-center space-x-3">
                      <div className="text-5xl font-extrabold bg-gradient-to-br from-orange-600 to-amber-500 bg-clip-text text-transparent">
                        {result === 0 ? "Low Risk" : result === 1 ? "Moderate Risk" : "High Risk"}
                      </div>
                    </div>
                    <p className="text-slate-500 mt-4 text-sm font-medium">
                      Based on your input, the model predicts a {result === 0 ? "healthy" : "risky"} sleep profile.
                    </p>
                  </div>
                  
                  {recommendations.length > 0 && (
                    <div className="border-t border-slate-100 pt-5 mt-5">
                      <p className="text-slate-800 text-sm font-bold mb-3 flex items-center">
                        <Sparkles className="w-4 h-4 mr-2 text-orange-500" />
                        Personalized Recommendations
                      </p>
                      <ul className="space-y-2">
                        {recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start text-sm text-slate-600 font-medium">
                            <span className="text-orange-500 mr-2 mt-0.5">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
