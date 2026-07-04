"use client";

import { useState } from "react";
import { X, Dumbbell, Footprints, HeartPulse, Sparkles, FileText, Send, Loader2, Calendar, Heart, Moon, Droplet } from "lucide-react";
import { ACTIVITY_TYPES, POINTS_PER_ACTIVITY, MOODS, DIFFICULTIES } from "@/lib/constants";

const iconMap = {
  Dumbbell,
  Footprints,
  Heart,
  Moon,
  Droplet,
  HeartPulse,
  Sparkles,
};

export default function ReportModal({ user, onClose, onSubmit }) {
  const [selectedType, setSelectedType] = useState(null);
  const [customName, setCustomName] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [mood, setMood] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Dynamic nicknames
  const nick = user.nickname || "ayang";
  const nickCap = nick.charAt(0).toUpperCase() + nick.slice(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedType) {
      alert(`Pilih jenis kegiatannya dulu ya, ${nickCap}! 🥺`);
      return;
    }

    const activity = ACTIVITY_TYPES.find((a) => a.id === selectedType);
    if (activity?.custom && !customName.trim()) {
      alert("Nama kegiatannya tidak boleh kosong.");
      return;
    }

    if (activity?.custom && customName.length > 50) {
      alert("Nama kegiatan maksimal 50 karakter.");
      return;
    }

    if (notes.length > 200) {
      alert("Catatan/pesan maksimal 200 karakter.");
      return;
    }

    // Safety future date checking
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (selectedDate > today) {
      alert("Tidak bisa mencatat kegiatan untuk masa depan.");
      return;
    }

    setSubmitting(true);

    // Simulate slight delay for UX
    await new Promise((r) => setTimeout(r, 400));

    onSubmit({
      userId: user.id,
      type: selectedType,
      customName: customName.trim() || null,
      notes: notes.trim(),
      date,
      mood: mood || null,
      difficulty: difficulty || null,
    });

    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const selectedActivity = ACTIVITY_TYPES.find((a) => a.id === selectedType);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center modal-overlay animate-fadeIn" onClick={onClose}>
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto border border-pink-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Festive) */}
        <div className={`px-6 pt-6 pb-5 bg-gradient-to-r ${user.color} rounded-t-3xl sm:rounded-t-3xl text-white relative overflow-hidden`}>
          <div className="absolute right-0 top-0 opacity-15 translate-x-4 -translate-y-4 text-9xl pointer-events-none select-none">
            💖
          </div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h2 className="text-base font-black tracking-tight flex items-center gap-1">
                <span>Catat Kegiatan {nickCap}</span> 
                <span className="animate-bounce">📝</span>
              </h2>
              <p className="text-white/95 text-[10px] font-extrabold mt-1 flex items-center gap-1 bg-black/15 px-2.5 py-0.5 rounded-full w-fit">
                {user.emoji} Dapatkan +{selectedType === "gym" || selectedType === "lari" ? 10 : 5} poin cinta! 💕
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/35 text-white transition-all hover:scale-105 active:scale-95"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {success ? (
          <div className="p-8 text-center animate-scaleIn">
            <div className="text-5xl mb-3 animate-bounce">🎉</div>
            <p className="text-base font-extrabold text-accent">Hore! Berhasil Dicatat! 💖</p>
            <p className="text-xs text-muted mt-1">Poin langsung masuk untuk {nickCap}!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Activity Type Selection */}
            <div className="space-y-2">
              <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <span>Pilih jenis kegiatan yaa</span>
                <span>👇</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ACTIVITY_TYPES.map((activity) => {
                  const Icon = iconMap[activity.icon];
                  const isSelected = selectedType === activity.id;
                  return (
                    <button
                      key={activity.id}
                      type="button"
                      onClick={() => {
                        setSelectedType(activity.id);
                        if (!activity.custom) setCustomName("");
                      }}
                      className={`
                        relative p-3 rounded-2xl border transition-all duration-200
                        flex flex-col items-center gap-1.5 text-center cursor-pointer
                        ${
                          isSelected
                            ? activity.color === "purple"
                              ? "border-purple bg-purple-light/20 shadow-md scale-[1.01]"
                              : activity.color === "accent"
                              ? "border-accent bg-accent-light/20 shadow-md scale-[1.01]"
                              : activity.color === "rose"
                              ? "border-rose-500 bg-rose-50/50 shadow-md scale-[1.01]"
                              : activity.color === "indigo"
                              ? "border-indigo-500 bg-indigo-50/50 shadow-md scale-[1.01]"
                              : activity.color === "blue"
                              ? "border-blue-500 bg-blue-50/50 shadow-md scale-[1.01]"
                              : activity.color === "amber"
                              ? "border-amber bg-amber-light/20 shadow-md scale-[1.01]"
                              : "border-slate-400 bg-slate-100 shadow-md scale-[1.01]"
                            : "border-slate-200 bg-white hover:border-slate-350 hover:bg-slate-50"
                        }
                      `}
                    >
                      {Icon && (
                        <Icon
                          size={26}
                          className={
                            isSelected
                              ? activity.color === "purple"
                                ? "text-purple"
                                : activity.color === "accent"
                                ? "text-accent"
                                : activity.color === "rose"
                                ? "text-rose-500"
                                : activity.color === "indigo"
                                ? "text-indigo-500"
                                : activity.color === "blue"
                                ? "text-blue-500"
                                : activity.color === "amber"
                                ? "text-amber"
                                : "text-slate-655"
                              : "text-slate-400"
                          }
                        />
                      )}
                      <span className={`text-[11px] font-bold ${isSelected ? "text-slate-800 font-extrabold" : "text-slate-500"}`}>
                        {activity.label}
                      </span>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-accent flex items-center justify-center animate-scaleIn">
                          <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Name Input (for olahraga_lain and kegiatan_lain) */}
            {selectedActivity?.custom && (
              <div className="animate-fadeIn space-y-1">
                <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <span>Nama kegiatannya apa nih?</span>
                  <span>🤔</span>
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  maxLength={50}
                  placeholder={
                    selectedType === "olahraga_lain"
                      ? "Renang, badminton, yoga..."
                      : "Masak bareng, membaca, beres-beres..."
                  }
                  className="w-full px-3 py-2 rounded-xl border-2 border-pink-100 bg-white text-xs text-slate-800
                    placeholder:text-slate-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-50
                    transition-all font-bold shadow-inner"
                  required
                />
              </div>
            )}

            {/* Custom Date Picker */}
            <div className="space-y-1 animate-fadeIn">
              <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={13} className="text-slate-405" />
                Tanggal Kegiatan 📅
              </label>
              <input
                type="date"
                value={date}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border-2 border-pink-100 bg-white text-xs text-slate-800
                  focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-50 transition-all font-bold shadow-inner"
                required
              />
            </div>

            {/* Mood Selector */}
            <div className="space-y-1 animate-fadeIn">
              <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">
                Gimana rasanya pas ngelakuin? 🥰
              </label>
              <div className="grid grid-cols-2 gap-2">
                {MOODS.map((m) => {
                  const isSelected = mood === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMood(m.id)}
                      className={`
                        px-3 py-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer
                        ${
                          isSelected
                            ? `${m.color} border-current scale-[1.01] shadow-md font-black`
                            : "border-slate-200 bg-white text-slate-550 hover:border-slate-350"
                        }
                      `}
                    >
                      <span className="text-xs">{m.emoji}</span>
                      <span>{m.label.replace(m.emoji, "").trim()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty Selector */}
            <div className="space-y-1 animate-fadeIn">
              <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">
                Tingkat Usaha 💪
              </label>
              <div className="grid grid-cols-3 gap-2">
                {DIFFICULTIES.map((d) => {
                  const isSelected = difficulty === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDifficulty(d.id)}
                      className={`
                        px-2 py-2 rounded-xl border text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer
                        ${
                          isSelected
                            ? `${d.color} border-current scale-[1.01] shadow-md font-black`
                            : "border-slate-200 bg-white text-slate-550 hover:border-slate-350"
                        }
                      `}
                    >
                      <span className="text-sm">{d.emoji}</span>
                      <span className="text-center leading-tight">{d.label.replace(d.emoji, "").trim()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">
                <FileText size={13} className="text-slate-405" />
                Catatan / Pesan buat {nickCap} (opsional) 💬
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={200}
                placeholder={`Tulis pesan atau catatan untuk ${nick}...`}
                rows={2}
                className="w-full px-3 py-2 rounded-xl border-2 border-pink-100 bg-white text-xs text-slate-800
                  placeholder:text-slate-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-50
                  transition-all resize-none font-bold shadow-inner"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!selectedType || (selectedActivity?.custom && !customName.trim()) || submitting}
              className={`
                w-full py-2.5 rounded-xl font-extrabold text-white text-xs cursor-pointer
                flex items-center justify-center gap-2 transition-all duration-200
                ${
                  !selectedType || (selectedActivity?.custom && !customName.trim())
                    ? "bg-slate-300 cursor-not-allowed"
                    : `bg-gradient-to-r ${user.color} hover:shadow-md hover:scale-[1.005] active:scale-[0.99]`
                }
              `}
            >
              {submitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  <Send size={12} />
                  Simpan Kegiatan 💌
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
