"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { History as HistoryIcon, Loader2, Calendar, Search, Filter } from "lucide-react";

interface Prediction {
  _id: string;
  userEmail: string;
  userInput: {
    stress_score: number;
    sleep_duration_hrs: number;
    caffeine_mg_before_bed: number;
    screen_time_before_bed_mins: number;
    wake_episodes_per_night: number;
  };
  predictionResult: {
    prediction: number;
    recommendations: string[];
  };
  timestamp: string;
}

export default function HistoryPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    async function fetchHistory() {
      if (!token) return;
      try {
        const res = await fetch("http://localhost:5000/api/predictions", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        setPredictions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (token) fetchHistory();
  }, [token]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  // Derived state for filtering and sorting
  const processedPredictions = [...predictions]
    .filter((p) => {
      if (!searchQuery) return true;
      const lowerQuery = searchQuery.toLowerCase();
      const recsMatch = p.predictionResult.recommendations?.some((r) => r.toLowerCase().includes(lowerQuery));
      const riskText = p.predictionResult.prediction === 0 ? "low risk" : p.predictionResult.prediction === 1 ? "moderate risk" : "high risk";
      return recsMatch || riskText.includes(lowerQuery);
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      if (sortBy === "oldest") return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      if (sortBy === "highest-risk") return b.predictionResult.prediction - a.predictionResult.prediction;
      if (sortBy === "lowest-risk") return a.predictionResult.prediction - b.predictionResult.prediction;
      return 0;
    });

  return (
    <div className="p-8 mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
        
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Your Prediction History</h1>
            <p className="text-slate-500">History for {user?.username}</p>
          </div>
        </div>

        {/* Search & Sort Controls */}
        {predictions.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-48 pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest-risk">Highest Risk</option>
                <option value="lowest-risk">Lowest Risk</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 mb-6">
          {error}
        </div>
      )}

      {predictions.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <p className="text-slate-500 mb-4">No predictions found yet.</p>
          <button 
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium hover:bg-orange-200 transition-colors"
          >
            Take your first assessment
          </button>
        </div>
      ) : processedPredictions.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <p className="text-slate-500">No predictions match your search criteria.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {processedPredictions.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2 text-slate-500 text-sm font-medium">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(item.timestamp).toLocaleString()}</span>
                </div>
                <div className={`px-4 py-1 rounded-full text-sm font-bold ${
                  item.predictionResult.prediction === 0 ? "bg-green-100 text-green-700" :
                  item.predictionResult.prediction === 1 ? "bg-amber-100 text-amber-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {item.predictionResult.prediction === 0 ? "Low Risk" :
                   item.predictionResult.prediction === 1 ? "Moderate Risk" : "High Risk"}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 text-sm">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-slate-400 text-xs uppercase font-bold mb-1">Stress</p>
                  <p className="font-semibold text-slate-700">{item.userInput?.stress_score || 0}/10</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-slate-400 text-xs uppercase font-bold mb-1">Sleep</p>
                  <p className="font-semibold text-slate-700">{item.userInput?.sleep_duration_hrs || 0} hrs</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-slate-400 text-xs uppercase font-bold mb-1">Caffeine</p>
                  <p className="font-semibold text-slate-700">{item.userInput?.caffeine_mg_before_bed || 0} mg</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-slate-400 text-xs uppercase font-bold mb-1">Screen Time</p>
                  <p className="font-semibold text-slate-700">{item.userInput?.screen_time_before_bed_mins || 0} min</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-slate-400 text-xs uppercase font-bold mb-1">Wakes</p>
                  <p className="font-semibold text-slate-700">{item.userInput?.wake_episodes_per_night || 0}</p>
                </div>
              </div>

              {item.predictionResult?.recommendations && item.predictionResult.recommendations.length > 0 && (
                <div className="border-t border-slate-100 pt-4 mt-2">
                  <p className="text-slate-700 text-sm font-bold mb-2">Recommendations:</p>
                  <ul className="space-y-1">
                    {item.predictionResult.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start text-xs text-slate-600 font-medium">
                        <span className="text-orange-500 mr-2 mt-0.5">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
