"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Calendar, Heart, RotateCcw, ArrowLeft, Lock } from "lucide-react";
import { USERS, getWeekRangeString, getWeekStartDate } from "@/lib/constants";
import { addActivity, deleteActivity, getWeeklyStats, clearAllData } from "@/lib/store";
import WeeklyStatsPanel from "@/components/WeeklyStatsPanel";
import ActivityList from "@/components/ActivityList";
import ReportModal from "@/components/ReportModal";
import WeightTrackerPanel from "@/components/WeightTrackerPanel";

export default function Home() {
  const [view, setView] = useState("gate"); // "gate" | "welcome" | "tracker"
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [activeTab, setActiveTab] = useState("tsalysa");
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const weekRange = getWeekRangeString(getWeekStartDate());

  const refreshStats = useCallback(async () => {
    try {
      setLoading(true);
      const newStats = {};
      for (const user of USERS) {
        newStats[user.id] = await getWeeklyStats(user.id);
      }
      setStats(newStats);
    } catch (error) {
      console.error("Error refreshing stats:", error);
      alert("Gagal memuat data: " + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check unlock state on mount
  useEffect(() => {
    setMounted(true);
    const unlocked = localStorage.getItem("couple_tracker_unlocked");
    if (unlocked === "true") {
      setView("welcome");
    } else {
      setView("gate");
    }
    refreshStats();
  }, [refreshStats]);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (passwordInput === "everythingship") {
      localStorage.setItem("couple_tracker_unlocked", "true");
      setView("welcome");
      setPasswordInput("");
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPasswordInput("");
    }
  };

  const handleLock = () => {
    if (window.confirm("Kunci jurnal kembali?")) {
      localStorage.removeItem("couple_tracker_unlocked");
      setView("gate");
    }
  };

  const handleSubmitActivity = async (data) => {
    try {
      setLoading(true);
      await addActivity(data);
      await refreshStats();
      setShowModal(false);
    } catch (error) {
      console.error("Error adding activity:", error);
      alert("Gagal menambah aktivitas: " + error.message);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      setLoading(true);
      await deleteActivity(activityId);
      await refreshStats();
    } catch (error) {
      console.error("Error deleting activity:", error);
      alert("Gagal menghapus aktivitas: " + error.message);
    }
  };

  const handleReset = async () => {
    if (window.confirm("Yakin ingin menghapus seluruh data? Tindakan ini tidak bisa dibatalkan.")) {
      try {
        setLoading(true);
        await clearAllData();
        await refreshStats();
      } catch (error) {
        console.error("Error resetting data:", error);
        alert("Gagal mereset data: " + error.message);
      }
    }
  };

  const activeUser = USERS.find((u) => u.id === activeTab);
  const activeStats = stats[activeTab] || {
    gymCount: 0,
    lariCount: 0,
    totalPoints: 0,
    allTimePoints: 0,
    totalActivities: 0,
    activities: [],
    gymTarget: false,
    lariTarget: false,
    rewardEligible: false,
    pointsToReward: 100,
  };

  const activeNick = activeUser?.nickname || "ayang";
  const activeNickCap = activeNick.charAt(0).toUpperCase() + activeNick.slice(1);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">💑</div>
          <p className="text-muted text-xs font-semibold">Memuat...</p>
        </div>
      </div>
    );
  }

  // PASSWORD GATE VIEW (Minimalist & Professional)
  if (view === "gate") {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-slate-50 to-slate-100 flex flex-col justify-center items-center p-6 relative select-none">
        {/* Soft elegant blur circles */}
        <div className="absolute top-1/3 left-1/3 w-32 h-32 bg-pink-100 rounded-full filter blur-3xl opacity-60" />
        <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-indigo-100 rounded-full filter blur-3xl opacity-60" />

        {/* Lock Card */}
        <div className="relative z-10 max-w-sm w-full bg-white rounded-3xl border border-slate-200/60 p-8 shadow-md text-center space-y-5 animate-scaleIn">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-xl mx-auto shadow-sm">
              🔒
            </div>
            <h1 className="text-lg font-bold text-slate-800">Jurnal Picil & Bebe</h1>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Jurnal ini dilindungi kata sandi. Masukkan password untuk mengakses.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-1">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Password..."
                className="w-full px-4 py-2.5 rounded-xl border-2 border-card-border bg-white text-xs text-slate-800 text-center font-bold tracking-widest
                  placeholder:tracking-normal placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-50 transition-all"
                required
              />
              {passwordError && (
                <p className="text-[10px] text-rose-500 font-bold mt-1">
                  Password salah, silakan coba lagi.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-white font-bold text-xs bg-indigo-500 hover:bg-indigo-600 transition-all cursor-pointer shadow-sm"
            >
              Masuk
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Welcome Screen / Home Page (Clean & Premium)
  if (view === "welcome") {
    const tsalysaPoints = stats["tsalysa"]?.totalPoints || 0;
    const diasPoints = stats["dias"]?.totalPoints || 0;

    return (
      <div className="min-h-screen bg-gradient-to-tr from-pink-50 via-slate-50 to-blue-50 flex flex-col justify-between p-6 relative select-none">
        
        {/* Top Tagline */}
        <div className="relative z-10 text-center pt-4 flex justify-between items-center max-w-sm mx-auto w-full">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-slate-200/50 shadow-sm text-[10px] font-bold text-slate-600 mx-auto">
            <span>Jurnal Bersama Picil & Bebe</span>
          </div>
          
          {/* Quick Lock Button */}
          <button
            onClick={handleLock}
            className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer absolute right-4"
            title="Kunci jurnal"
          >
            <Lock size={12} />
          </button>
        </div>

        {/* Welcome Card */}
        <div className="relative z-10 max-w-sm mx-auto w-full bg-white rounded-3xl border border-slate-200/60 p-8 shadow-md text-center space-y-6 my-auto animate-scaleIn">
          <div className="space-y-3">
            <div className="flex justify-center items-center gap-2 text-5xl">
              <span className="animate-wiggle">🐼</span>
              <span className="animate-wiggle-reverse">🐻</span>
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-800">
              Couple Habit Tracker
            </h1>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
              Ruang bersama untuk melacak kebiasaan sehat dan aktivitas harian Picil & Bebe.
            </p>
          </div>

          {/* Mini Scoreboard (Weekly & Lifetime) */}
          <div className="grid grid-cols-2 gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/40 relative overflow-hidden">
            <div className="text-center space-y-0.5">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Picil</p>
              <p className="text-[9px] font-semibold text-slate-400">Pekan / Sepanjang Masa</p>
              <p className="text-sm font-black text-rose-500">
                {tsalysaPoints}p <span className="text-slate-400 font-semibold text-xs">/ {stats["tsalysa"]?.allTimePoints || 0}p</span>
              </p>
            </div>
            <div className="text-center space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bebe</p>
              <p className="text-[9px] font-semibold text-slate-400">Pekan / Sepanjang Masa</p>
              <p className="text-sm font-black text-indigo-500">
                {diasPoints}p <span className="text-slate-400 font-semibold text-xs">/ {stats["dias"]?.allTimePoints || 0}p</span>
              </p>
            </div>
            <div className="absolute top-1/4 bottom-1/4 left-1/2 w-px bg-slate-200" />
          </div>

          {/* CTA Button */}
          <button
            onClick={() => setView("tracker")}
            className="w-full py-3 rounded-2xl text-white font-extrabold text-xs bg-indigo-500 hover:bg-indigo-600 transition-all cursor-pointer shadow-sm"
          >
            Mulai Catat Kegiatan
          </button>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-center text-[9px] text-slate-400 pb-2">
          Jurnal Kebugaran & Kebiasaan Sehat
        </div>
      </div>
    );
  }

  // Habit Tracker Dashboard View (Sleek and Modern)
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/20">
        <div className="max-w-2xl mx-auto px-4 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Back to Home Button */}
              <button
                onClick={() => setView("welcome")}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
                title="Kembali ke halaman utama"
              >
                <ArrowLeft size={14} />
              </button>
              <div>
                <h1 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  Jurnal Picil & Bebe
                </h1>
                <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                  <Calendar size={10} />
                  Pekan ini: {weekRange}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              {/* Lock Button */}
              <button
                onClick={handleLock}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-550 hover:bg-slate-50 transition-colors cursor-pointer"
                title="Kunci jurnal"
              >
                <Lock size={14} />
              </button>
              
              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-danger hover:bg-danger-light transition-colors cursor-pointer"
                title="Reset semua data"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="sticky top-[58px] z-30 bg-background border-b border-card-border">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex">
            {USERS.map((user) => {
              const isActive = activeTab === user.id;
              const userStats = stats[user.id];
              return (
                <button
                  key={user.id}
                  onClick={() => setActiveTab(user.id)}
                  className={`
                    flex-1 py-3 px-4 text-center transition-all relative cursor-pointer
                    ${isActive ? "text-slate-800 font-extrabold" : "text-slate-450 font-bold hover:text-slate-700"}
                  `}
                >
                  <span className="text-base">{user.emoji}</span>
                  <span className="ml-1.5 text-xs">
                    {user.name}
                  </span>
                  {userStats && (
                    <span className={`
                      ml-1.5 text-[9px] px-2 py-0.5 rounded-full font-extrabold inline-flex items-center gap-1
                      ${isActive ? "bg-accent-light text-accent border border-accent/10" : "bg-slate-105 text-slate-400 border border-slate-200/50"}
                    `}>
                      <span>{userStats.totalPoints}p</span>
                      <span className="opacity-50 font-semibold">({userStats.allTimePoints}p)</span>
                    </span>
                  )}
                  {isActive && (
                    <div className={`absolute bottom-0 left-4 right-4 h-[3px] rounded-full bg-gradient-to-r ${user.color}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 pb-24 space-y-5">
        <div className="animate-fadeIn animate-duration-300" key={activeTab}>
          {/* Weekly Stats */}
          <WeeklyStatsPanel stats={activeStats} user={activeUser} />

          {/* Weight Tracker Section */}
          <div className="my-5">
            <WeightTrackerPanel user={activeUser} />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-card-border" />
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
              Aktivitas {activeNickCap}
            </span>
            <div className="flex-1 h-px bg-card-border" />
          </div>

          {/* Activity List */}
          <ActivityList
            activities={activeStats.activities}
            onDelete={handleDeleteActivity}
            user={activeUser}
          />
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center">
        <button
          onClick={() => setShowModal(true)}
          className={`
            px-5 py-3 rounded-2xl text-white font-extrabold text-xs cursor-pointer
            bg-indigo-500 hover:bg-indigo-600 shadow-md hover:shadow-lg active:scale-97
            transition-all duration-200 flex items-center gap-1.5 animate-pulseGlow
          `}
        >
          <Plus size={16} strokeWidth={2.5} />
          Tambah Kegiatan {activeNickCap}
        </button>
      </div>

      {/* Report Modal */}
      {showModal && (
        <ReportModal
          user={activeUser}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitActivity}
        />
      )}
    </div>
  );
}
