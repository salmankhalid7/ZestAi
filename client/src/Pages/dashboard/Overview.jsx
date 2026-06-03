import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, BrainCircuit, Star, Activity, 
  TrendingUp, Zap, Target, ArrowRight 
} from "lucide-react";
import { fetchDashboardStats } from "../../services/Api/dashboardService";

const Overview = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetchDashboardStats();
        setStats(res.stats);
      } catch (err) {
        setError("Failed to load dashboard data.");
      }
    };
    fetchStats();
  }, []);

  const { learningScore, level } = useMemo(() => {
    if (!stats) return { learningScore: 0, level: "..." };
    const score = Math.min(100, Math.round(stats.totalDocuments * 10 + stats.totalQuizzes * 15 + (stats.avgScore || 0)));
    const lvl = score >= 75 ? "Advanced Learner 🚀" : score >= 40 ? "Intermediate Learner 📘" : "Beginner Explorer 🌱";
    return { learningScore: score, level: lvl };
  }, [stats]);

  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!stats) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, track your AI mastery.</p>
        </div>
        <button onClick={() => navigate('/dashboard/documents')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-emerald-200">
          <Zap size={16} /> New Upload
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Documents" value={stats.totalDocuments} color="blue" icon={FileText} />
        <StatCard title="Quizzes" value={stats.totalQuizzes} color="purple" icon={BrainCircuit} />
        <StatCard title="Avg Score" value={`${stats.avgScore || 0}%`} color="emerald" icon={Target} />
        <StatCard title="Favorites" value={stats.favorites} color="amber" icon={Star} />
      </div>

      {/* AI INSIGHTS */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl">
          <h2 className="text-emerald-400 font-bold tracking-widest uppercase text-xs">Mastery Level</h2>
          <p className="text-3xl font-bold mt-2 mb-6">{level}</p>
          <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${learningScore}%` }} />
          </div>
          <p className="text-gray-400 text-xs mt-3">{learningScore}% towards next milestone</p>
          <Zap className="absolute right-4 top-4 w-24 h-24 text-gray-800" />
        </div>

        <div className="bg-white border rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <h3 className="font-bold text-lg mb-4">Quick Links</h3>
          <div className="space-y-3">
            <ActionBtn label="AI Chat" onClick={() => navigate('/dashboard/ai-chat')} icon={BrainCircuit} />
            <ActionBtn label="Saved Insights" onClick={() => navigate('/dashboard/favorites')} icon={Star} />
            <ActionBtn label="Analytics" onClick={() => navigate('/dashboard/analytics')} icon={TrendingUp} />
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const StatCard = ({ title, value, color, icon: Icon }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600"
  };
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${colors[color]}`}>
        <Icon size={20} />
      </div>
      <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
};

const ActionBtn = ({ label, icon: Icon, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all text-gray-700 font-medium">
    <div className="flex items-center gap-3">
      <Icon size={18} className="text-gray-400" /> {label}
    </div>
    <ArrowRight size={16} className="text-gray-300" />
  </button>
);

export default Overview;