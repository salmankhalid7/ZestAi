import React, { useEffect, useState } from "react";
import {
  FileText,
  BrainCircuit,
  Layers,
  Target,
  Activity,
  Clock,
  CircleDot,
} from "lucide-react";
import { fetchDashboardStats } from "../services/Api/dashboardService";

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Session token not found. Please log in again.");
          return;
        }
        const response = await fetchDashboardStats();
        console.log("DASHBOARD RESPONSE:", response);
        setStats(response.stats);
      } catch (err) {
        console.log("ERROR:", err.response?.data || err.message);
        setError(
          err.response?.data?.message || "Failed to sync workspace statistics."
        );
      }
    };

    loadStats();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
        <p className="text-sm font-bold text-red-600 uppercase tracking-wider mb-2">
          Workspace Sync Failure
        </p>
        <p className="text-xs text-gray-500 font-semibold">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="w-8 h-8 border-[3px] border-gray-200 border-t-black rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
          Synchronizing Workspace Data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white select-none text-black">
      <div className="sticky top-0 z-30 h-16 bg-transparent md:hidden pointer-events-none w-full" />
      
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 md:space-y-8 animate-fadeIn">
        <div className="flex items-center gap-3 border-b-2 border-gray-300 pb-4">
          <Activity
            size={20}
            className="text-blue-600 animate-pulse shrink-0"
          />
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
            Learning Workspace Overview
          </h2>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* TOTAL DOCUMENTS */}
          <div className="bg-white border-2 border-gray-300 rounded-xl p-5 hover:border-blue-500 transition-all duration-200 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold tracking-wide text-gray-500 uppercase">
                Total Documents
              </h3>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border-2 border-blue-200">
                <FileText size={16} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {stats.totalDocuments}
            </p>
          </div>

          {/* TOTAL QUIZZES */}
          <div className="bg-white border-2 border-gray-300 rounded-xl p-5 hover:border-purple-500 transition-all duration-200 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold tracking-wide text-gray-500 uppercase">
                Quizzes Created
              </h3>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border-2 border-purple-200">
                <BrainCircuit size={16} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {stats.totalQuizzes}
            </p>
          </div>

          {/* TOTAL FLASHCARDS */}
          <div className="bg-white border-2 border-gray-300 rounded-xl p-5 hover:border-amber-500 transition-all duration-200 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold tracking-wide text-gray-500 uppercase">
                Active Flashcards
              </h3>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border-2 border-amber-200">
                <Layers size={16} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {stats.totalFlashcards}
            </p>
          </div>

          {/* AVERAGE SCORE */}
          <div className="bg-white border-2 border-gray-300 rounded-xl p-5 hover:border-emerald-500 transition-all duration-200 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold tracking-wide text-gray-500 uppercase">
                Average Score
              </h3>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border-2 border-emerald-200">
                <Target size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-0.5">
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
                {stats.avgScore}
              </p>
              <span className="text-xs sm:text-sm font-bold text-emerald-500">
                %
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {/* RECENT DOCUMENTS */}
          <div className="bg-white border-2 border-gray-300 rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-gray-200">
              <Clock size={16} className="text-blue-600" />
              <h3 className="text-sm font-bold text-gray-900 tracking-wide">
                Recent Documents
              </h3>
            </div>
            <div className="divide-y divide-gray-200 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
              {stats.recentDocs.length === 0 ? (
                <p className="text-xs text-gray-400 py-8 text-center font-semibold">
                  No documents analyzed yet.
                </p>
              ) : (
                stats.recentDocs.map((doc) => (
                  <div
                    key={doc._id}
                    className="py-3 px-1 text-xs sm:text-sm text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2.5 font-bold group cursor-pointer"
                  >
                    <CircleDot
                      size={6}
                      className="text-gray-400 group-hover:text-blue-500 transition-colors shrink-0"
                    />
                    <span className="truncate">{doc.title}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RECENT PERFORMANCE EVALUATIONS */}
          <div className="bg-white border-2 border-gray-300 rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-gray-200">
              <Target size={16} className="text-purple-600" />
              <h3 className="text-sm font-bold text-gray-900 tracking-wide">
                Recent Performance
              </h3>
            </div>
            <div className="divide-y divide-gray-200 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
              {stats.recentQuizzes.length === 0 ? (
                <p className="text-xs text-gray-400 py-8 text-center font-semibold">
                  No quizzes attempted yet.
                </p>
              ) : (
                stats.recentQuizzes.map((q) => {
                  const percentage = Math.round((q.score / q.total) * 100);
                  return (
                    <div
                      key={q._id}
                      className="py-3 px-1 flex items-center justify-between gap-2 text-xs sm:text-sm"
                    >
                      <div className="flex items-center gap-2.5 font-bold text-gray-700 truncate">
                        <BrainCircuit
                          size={15}
                          className="text-purple-500 shrink-0"
                        />
                        <span className="truncate">
                          Quiz Session Evaluation
                        </span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <span className="text-[10px] sm:text-[11px] text-gray-500 font-bold">
                          ({q.score}/{q.total} pts)
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-black tracking-wide border-2 ${
                            percentage >= 70
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                              : "bg-amber-50 text-amber-700 border-amber-300"
                          }`}
                        >
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;