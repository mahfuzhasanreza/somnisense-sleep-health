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
    <div className="min-h-screen bg-slate-50 flex flex-col p-6 lg:p-8 relative overflow-hidden">
        {/* --- PERSONALIZED DASHBOARD SECTION --- */}
        {!loadingHistory && totalAssessments > 0 && (
          <section className="">
            <div className="flex items-center space-x-3 mb-8">
              
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Your Personalized Analytics</h2>
                <p className="text-slate-500">A summary of your historical sleep data and trends.</p>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-slate-500 uppercase tracking-wider flex items-center">
                    Assessments Taken
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-slate-900">{totalAssessments}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-slate-500 uppercase tracking-wider flex items-center">
                    Avg Sleep
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-slate-900">{avgSleep} <span className="text-base font-medium text-slate-400">hrs</span></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-slate-500 uppercase tracking-wider flex items-center">
                    Avg Stress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-slate-900">{avgStress} <span className="text-base font-medium text-slate-400">/10</span></div>
                </CardContent>
              </Card>
              <Card className="bg-orange-50 border-orange-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-orange-600 uppercase tracking-wider flex items-center font-bold">
                   Common Risk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black text-orange-700 mt-1">{mostCommonRisk}</div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Recharts Trends */}
              <Card className="lg:col-span-3">
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
  );
}
