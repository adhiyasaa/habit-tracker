"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Calendar, Heart, RotateCcw, ArrowLeft, Lock, Send, X, Loader2 } from "lucide-react";
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
  const [showAffirmationModal, setShowAffirmationModal] = useState(false);
  const [affirmationText, setAffirmationText] = useState("");
  const [submittingAffirmation, setSubmittingAffirmation] = useState(false);

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

  // Set mount state and load stats
  useEffect(() => {
    setMounted(true);
    setView("gate");
    refreshStats();
  }, [refreshStats]);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (passwordInput === "everythingship") {
      setView("welcome");
      setPasswordInput("");
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPasswordInput("");
    }
  };

  const handleLock = () => {
    if (window.confirm("Kunci jurnal kembali? 🔒")) {
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

  const handleSubmitAffirmation = async (e) => {
    e.preventDefault();
    if (!affirmationText.trim()) return;

    if (affirmationText.length > 200) {
      alert("Pesan penyemangat maksimal 200 karakter.");
      return;
    }

    try {
      setSubmittingAffirmation(true);
      await addActivity({
        userId: activeTab,
        type: "apresiasi",
        notes: affirmationText.trim(),
        date: new Date().toISOString().split("T")[0],
      });
      setAffirmationText("");
      setShowAffirmationModal(false);
      await refreshStats();
    } catch (error) {
      console.error("Error submitting love affirmation:", error);
      alert("Gagal mengirim pesan penyemangat: " + error.message);
    } finally {
      setSubmittingAffirmation(false);
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
    if (window.confirm("Yakin ingin menghapus seluruh data? Nanti kenangan kita hilang lho... 🥺")) {
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
    latestAffirmation: null,
  };

  const activeNick = activeUser?.nickname || "ayang";
  const activeNickCap = activeNick.charAt(0).toUpperCase() + activeNick.slice(1);

  // Incoming love affirmation check (written by other partner)
  const otherUserId = activeTab === "tsalysa" ? "dias" : "tsalysa";
  const otherUser = USERS.find((u) => u.id === otherUserId);
  const incomingAffirmation = stats[otherUserId]?.latestAffirmation;

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="text-4xl mb-2 animate-bounce">💑</div>
          <p className="text-slate-400 text-[10px] font-semibold animate-pulse">Sabar ya, lagi disiapin dulu... ✨</p>
        </div>
      </div>
    );
  }

  // PASSWORD GATE VIEW (Sleek Dark Premium Mode Theme)
  if (view === "gate") {
    return (
      <div className="min-h-screen bg-slate-955 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
        
        {/* Sleek Radial Glows */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-teal-500 rounded-full mix-blend-screen filter blur-[120px] opacity-15 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500 rounded-full mix-blend-screen filter blur-[120px] opacity-15 pointer-events-none" />

        {/* Floating Motivation/Habit Emojis */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <span
              key={i}
              className="absolute text-xl opacity-10 animate-bounce"
              style={{
                left: `${(i * 7) % 100}%`,
                top: `${(i * 13) % 80 + 10}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${3 + (i % 3)}s`,
              }}
            >
              {["⚡", "🔥", "🎯", "🏆", "💪", "🏃", "💧", "🛌", "🌟", "📅"][i % 10]}
            </span>
          ))}
        </div>

        {/* Lock Card (Dark Glassmorphism) */}
        <div className="relative z-10 max-w-sm w-full bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 p-7 shadow-2xl text-center space-y-5 animate-scaleIn">
          <div className="space-y-2">
            {/* Mascot Emojis */}
            <div className="flex justify-center items-center gap-3 text-6xl mb-2 drop-shadow-sm">
              <span className="animate-wiggle">🐼</span>
              <span className="text-3xl text-rose-500 animate-pulse">❤️</span>
              <span className="animate-wiggle-reverse">🐻</span>
            </div>
            <h1 className="text-lg font-black bg-gradient-to-r from-teal-400 via-indigo-400 to-indigo-500 bg-clip-text text-transparent">
              Tsalysa and Dias's Daily Activity Journey 🔐
            </h1>
            <p className="text-[10px] text-slate-400 font-bold leading-relaxed max-w-xs mx-auto">
              Enter Sceret Code!
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-3.5">
            <div className="space-y-1">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Password rahasia kita..."
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-800 bg-slate-950 text-slate-100 text-center font-bold tracking-widest
                  placeholder:tracking-normal placeholder:font-medium placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-950 transition-all shadow-inner"
                required
              />
              {passwordError && (
                <p className="text-[9px] text-rose-450 font-extrabold animate-shake mt-1">
                  Kunci salah! Coba ingat sandi rahasia kita... 🥺
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-white font-extrabold text-xs bg-gradient-to-r from-teal-500 to-indigo-650 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-98 transition-all duration-200 cursor-pointer animate-pulseGlow"
            >
              Buka Jurnal Cinta ✨🔑
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Welcome Screen / Home Page (Sleek Dark Premium Mode Theme)
  if (view === "welcome") {
    const tsalysaPoints = stats["tsalysa"]?.totalPoints || 0;
    const diasPoints = stats["dias"]?.totalPoints || 0;

    return (
      <div className="min-h-screen bg-slate-955 text-slate-100 flex flex-col justify-between p-4 relative overflow-hidden select-none">
        
        {/* Sleek Radial Glows */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-teal-500 rounded-full mix-blend-screen filter blur-[120px] opacity-15 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500 rounded-full mix-blend-screen filter blur-[120px] opacity-15 pointer-events-none" />

        {/* Floating Motivation/Habit Emojis */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(18)].map((_, i) => (
            <span
              key={i}
              className="absolute text-xl opacity-10 animate-bounce"
              style={{
                left: `${(i * 6) % 100}%`,
                top: `${(i * 14) % 80 + 10}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${2.5 + (i % 3.5)}s`,
              }}
            >
              {["⚡", "🔥", "🎯", "🏆", "💪", "🏃", "💧", "🛌", "🌟", "📅"][i % 10]}
            </span>
          ))}
        </div>

        {/* Top Tagline */}
        <div className="relative z-10 text-center pt-2 flex justify-between items-center max-w-sm mx-auto w-full">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 shadow-sm text-[10px] font-bold text-teal-400 mx-auto">
            <span>✨ Tsalysa and Dias's Daily Activity Journey ✨</span>
          </div>
          
          <button
            onClick={handleLock}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer absolute right-2"
            title="Kunci jurnal"
          >
            <Lock size={12} />
          </button>
        </div>

        {/* Welcome Card (Sleek Dark Glassmorphism) */}
        <div className="relative z-10 max-w-xs mx-auto w-full bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 p-6 shadow-2xl text-center space-y-5 my-auto animate-scaleIn">
          <div className="space-y-2">
            {/* Mascot Emojis */}
            <div className="flex justify-center items-center gap-3 text-6xl drop-shadow-sm">
              <span className="animate-wiggle cursor-pointer" title="Panda Bebe">🐼</span>
              <span className="text-2xl text-rose-500 animate-pulse">❤️</span>
              <span className="animate-wiggle-reverse cursor-pointer" title="Bear Picil">🐻</span>
            </div>
            <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-teal-400 via-indigo-400 to-indigo-500 bg-clip-text text-transparent leading-tight">
              Couple Habit Tracker 💖
            </h1>
            <p className="text-slate-400 text-[10px] font-bold leading-relaxed max-w-xs mx-auto">
              Tempat rahasia kita buat saling dukung hidup sehat! Catat kegiatan harian, kumpulin poin, dan kejar reward mingguan! 🥰🌸
            </p>
          </div>

          {/* Mini Scoreboard (Weekly & Lifetime) */}
          <div className="grid grid-cols-2 gap-2 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-sm relative overflow-hidden">
            <div className="text-center space-y-0.5">
              <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">👩 Picil</p>
              <p className="text-[8px] font-bold text-slate-500 leading-none">Pekan / All-Time</p>
              <p className="text-xs font-black text-teal-400 mt-1">
                {tsalysaPoints}p <span className="text-slate-500 font-bold text-[9px]">/ {stats["tsalysa"]?.allTimePoints || 0}p</span>
              </p>
            </div>
            <div className="text-center space-y-0.5">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">👨 Bebe</p>
              <p className="text-[8px] font-bold text-slate-500 leading-none">Pekan / All-Time</p>
              <p className="text-xs font-black text-indigo-400 mt-1">
                {diasPoints}p <span className="text-slate-500 font-bold text-[9px]">/ {stats["dias"]?.allTimePoints || 0}p</span>
              </p>
            </div>
            <div className="absolute top-1/4 bottom-1/4 left-1/2 w-px bg-slate-800" />
          </div>

          <button
            onClick={() => setView("tracker")}
            className="w-full py-3 rounded-2xl text-white font-extrabold text-xs bg-gradient-to-r from-teal-500 to-indigo-650 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-98 transition-all duration-200 cursor-pointer animate-pulseGlow"
          >
            Masuk ke Jurnal Kita! 🚀
          </button>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-center text-[8px] text-teal-500 font-bold pb-1">
          Made with full of love by your smartass bf
        </div>
      </div>
    );
  }

  // Habit Tracker Dashboard View (Sleek Clean Light View with Teal/Indigo Aksen)
  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      
      {/* Decorative side emoji borders for desktop/tablet layout */}
      <div className="hidden lg:block fixed left-6 top-1/3 text-4xl space-y-6 opacity-30 select-none pointer-events-none">
        <div className="animate-bounce">🌸</div>
        <div className="animate-bounce" style={{ animationDelay: "0.5s" }}>🏋️</div>
        <div className="animate-bounce" style={{ animationDelay: "1s" }}>💧</div>
      </div>
      <div className="hidden lg:block fixed right-6 top-1/3 text-4xl space-y-6 opacity-30 select-none pointer-events-none">
        <div className="animate-bounce">💖</div>
        <div className="animate-bounce" style={{ animationDelay: "0.7s" }}>🏃</div>
        <div className="animate-bounce" style={{ animationDelay: "1.2s" }}>😴</div>
      </div>

      {/* Header (Compact) */}
      <header className="sticky top-0 z-40 glass border-b border-slate-200/50">
        <div className="max-w-2xl mx-auto px-4 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("welcome")}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
                title="Kembali ke halaman utama"
              >
                <ArrowLeft size={12} />
              </button>
              <div>
                <h1 className="text-xs font-black text-slate-800 flex items-center gap-1">
                  Jurnal Picil & Bebe 💑
                </h1>
                <p className="text-[9px] font-bold text-slate-400 flex items-center gap-0.5 mt-0.5">
                  <Calendar size={8} />
                  Pekan ini: {weekRange}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleLock}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-455 hover:bg-slate-50 transition-colors cursor-pointer"
                title="Kunci jurnal"
              >
                <Lock size={12} />
              </button>
              
              <button
                onClick={handleReset}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-450 hover:text-danger hover:bg-danger-light transition-colors cursor-pointer"
                title="Reset semua data"
              >
                <RotateCcw size={12} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation (Enlarged Emojis & Clean Teal/Indigo colors) */}
      <div className="sticky top-[47px] z-30 bg-background border-b border-card-border">
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
                    flex-1 py-2.5 px-3 text-center transition-all relative cursor-pointer
                    ${isActive ? "text-slate-850 font-black" : "text-slate-450 font-bold hover:text-slate-705"}
                  `}
                >
                  <span className="text-2xl block">{user.emoji}</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider block mt-1">
                    {user.name}
                  </span>
                  {userStats && (
                    <span className={`
                      mt-1.5 text-[8px] px-2 py-0.5 rounded-full font-extrabold inline-flex items-center gap-0.5
                      ${isActive ? "bg-slate-100 text-slate-800 border border-slate-200" : "bg-slate-50 text-slate-400 border border-slate-200/50"}
                    `}>
                      <span>{userStats.totalPoints}p</span>
                      <span className="opacity-55 font-bold">({userStats.allTimePoints}p)</span>
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

      {/* Main Content (Compact & Decorative) */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 pb-20 space-y-3.5">
        <div className="animate-fadeIn animate-duration-200 space-y-3.5" key={activeTab}>
          
          {/* Incoming Love Affirmation Card (Sleek Amber Theme Message Box) */}
          {incomingAffirmation && (
            <div className="bg-amber-50/60 border border-amber-250/70 rounded-2xl p-3.5 flex items-start gap-2.5 animate-fadeIn relative overflow-hidden shadow-sm text-slate-800">
              <div className="absolute -right-2 -bottom-2 text-6xl opacity-5 pointer-events-none select-none">
                💖
              </div>
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-sm shrink-0">
                💌
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <p className="text-[8px] font-extrabold text-amber-600 uppercase tracking-wider flex items-center gap-1">
                  <span>Pesan Cinta dari {otherUser.name} Hari Ini</span>
                  <span className="animate-bounce">✨</span>
                </p>
                <p className="text-xs font-bold text-slate-700 leading-relaxed italic break-words">
                  "{incomingAffirmation.notes}"
                </p>
              </div>
            </div>
          )}

          {/* Weekly Stats Panel */}
          <WeeklyStatsPanel stats={activeStats} user={activeUser} />

          {/* Weight Tracker Section */}
          <WeightTrackerPanel user={activeUser} />

          {/* Divider */}
          <div className="flex items-center gap-2 py-1">
            <div className="flex-1 h-px bg-card-border" />
            <span className="text-[8px] font-extrabold text-slate-450 uppercase tracking-wider px-1 flex items-center gap-1">
              🌸 Aktivitas {activeNickCap} 🌸
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

      {/* Floating Love Affirmation Trigger (Message Pop-up Pill Style) */}
      <button
        onClick={() => setShowAffirmationModal(true)}
        className="fixed bottom-[84px] right-4 z-40 sm:right-8 bg-white border border-slate-200/80 rounded-full px-3 py-1.5 shadow-lg flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer text-[10px] font-black text-slate-800 animate-pulseGlow"
        title="Kirim Afirmasi Cinta"
      >
        <span className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-[10px] shrink-0 text-orange-500 font-bold">
          💬
        </span>
        <span>Kirim Afirmasi Cinta 💌</span>
      </button>

      {/* Floating Action Button: Add Activity (Teal/Blue active theme) */}
      <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center">
        <button
          onClick={() => setShowModal(true)}
          className={`
            px-5 py-2.5 rounded-2xl text-white font-extrabold text-xs cursor-pointer
            bg-gradient-to-r ${activeUser.color}
            shadow-md hover:scale-[1.01] active:scale-[0.99]
            transition-all duration-150 flex items-center gap-2 border border-white/20 animate-pulseGlow
          `}
        >
          <Plus size={16} strokeWidth={3} />
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

      {/* Love Affirmation Input Modal */}
      {showAffirmationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay animate-fadeIn" onClick={() => setShowAffirmationModal(false)}>
          <div
            className="w-full max-w-sm mx-4 bg-white rounded-2xl shadow-2xl animate-scaleIn border border-amber-205 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-1">
                  <span>Sent Affirmation</span> 
                  <span className="animate-bounce">💖</span>
                </h3>
                <p className="text-[9px] text-white/90 leading-none mt-0.5">Tulis pesan penyemangat buat {otherUser.name}</p>
              </div>
              <button
                onClick={() => setShowAffirmationModal(false)}
                className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all"
              >
                <X size={14} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitAffirmation} className="p-4 space-y-4">
              <div className="space-y-1">
                <label className="block text-[9px] font-extrabold text-slate-450 uppercase tracking-wider">Affirmation Message</label>
                <textarea
                  value={affirmationText}
                  onChange={(e) => setAffirmationText(e.target.value)}
                  maxLength={200}
                  placeholder={`cth: Semangat olahraganya hari ini ${otherUser.nickname} sayang! Jangan lupa makan siang yaa... 🥰`}
                  rows={3}
                  required
                  className="w-full px-3 py-2 rounded-xl border-2 border-amber-100 bg-white text-xs text-slate-800
                    placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50
                    transition-all resize-none font-bold leading-relaxed shadow-inner"
                />
                <div className="flex justify-between text-[8px] font-bold text-slate-400 px-1">
                  <span>Mendapatkan +3 Poin</span>
                  <span>{affirmationText.length}/200</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingAffirmation || !affirmationText.trim()}
                className="w-full py-2 rounded-xl text-white font-extrabold text-xs bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-lg disabled:bg-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md animate-pulseGlow"
              >
                {submittingAffirmation ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <>
                    <Send size={12} />
                    Kirim Pesan 💌
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
