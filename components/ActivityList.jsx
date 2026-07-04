"use client";

import { Trash2, FileText, Dumbbell, Footprints, Heart, Moon, Droplet, HeartPulse, Sparkles } from "lucide-react";
import { ACTIVITY_TYPES, MOODS, DIFFICULTIES, formatDateID } from "@/lib/constants";

const iconMap = {
  Dumbbell,
  Footprints,
  Heart,
  Moon,
  Droplet,
  HeartPulse,
  Sparkles,
};

const colorMap = {
  purple: { bg: "bg-purple-light/40", text: "text-purple", border: "border-purple/25" },
  accent: { bg: "bg-accent-light/40", text: "text-accent", border: "border-accent/25" },
  rose: { bg: "bg-rose-50", text: "text-rose-500", border: "border-rose-250" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-500", border: "border-indigo-250" },
  blue: { bg: "bg-blue-50", text: "text-blue-500", border: "border-blue-250" },
  amber: { bg: "bg-amber-light/40", text: "text-amber", border: "border-amber/25" },
  muted: { bg: "bg-slate-100", text: "text-slate-650", border: "border-slate-250" },
};

const getCuteDateLabel = (dateStr) => {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split("T")[0];
  
  if (dateStr === today) {
    return "Hari Ini ✨";
  } else if (dateStr === yesterday) {
    return "Kemarin ⏰";
  } else {
    return formatDateID(dateStr);
  }
};

export default function ActivityList({ activities, onDelete, user }) {
  const nick = user.nickname || "ayang";
  
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 bg-white/70 backdrop-blur-md rounded-2xl border-2 border-pink-100 p-4 shadow-sm animate-fadeIn">
        <div className="text-4xl mb-2 animate-bounce">🌸</div>
        <p className="text-slate-700 font-extrabold text-xs">Belum ada aktivitas pekan ini 🥺</p>
        <p className="text-slate-450 text-[9px] mt-0.5 font-semibold">Yuk catat kegiatan positi pertama kamu sekarang!</p>
      </div>
    );
  }

  // Group by date
  const grouped = {};
  activities
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .forEach((a) => {
      if (!grouped[a.date]) grouped[a.date] = [];
      grouped[a.date].push(a);
    });

  return (
    <div className="space-y-3 stagger-children">
      {Object.entries(grouped)
        .sort(([a], [b]) => new Date(b) - new Date(a))
        .map(([date, acts]) => (
          <div key={date} className="space-y-1.5 animate-fadeIn">
            <p className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider mb-0.5 px-1 flex items-center gap-1">
              <span className="text-rose-455 text-sm">🌸</span>
              {getCuteDateLabel(date)}
            </p>
            <div className="space-y-2">
              {acts.map((activity) => {
                const isApresiasi = activity.type === "apresiasi";
                const typeInfo = isApresiasi
                  ? { id: "apresiasi", label: "Afirmasi Cinta", icon: "Heart", color: "rose" }
                  : ACTIVITY_TYPES.find((t) => t.id === activity.type);

                const Icon = typeInfo ? iconMap[typeInfo.icon] : Sparkles;
                const colors = typeInfo ? colorMap[typeInfo.color] : colorMap.muted;
                const moodInfo = MOODS.find((m) => m.id === activity.mood);
                const diffInfo = DIFFICULTIES.find((d) => d.id === activity.difficulty);

                return (
                  <div
                    key={activity.id}
                    className={`
                      flex items-center gap-3 p-3 rounded-2xl border bg-white
                      ${colors.border} hover:shadow-sm hover:scale-[1.002] transition-all group relative overflow-hidden
                    `}
                  >
                    {/* Enlarged Icon Wrapper to w-10 h-10 and icon size to 20 */}
                    <div className={`w-10 h-10 rounded-2xl ${colors.bg} flex items-center justify-center shrink-0`}>
                      <Icon size={20} className={colors.text} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <p className="font-extrabold text-xs text-slate-800 truncate flex items-center gap-1">
                        <span>{activity.customName || typeInfo?.label || activity.type}</span>
                        {isApresiasi && (
                          <span className="text-[8px] bg-rose-50 text-rose-500 font-extrabold px-1.5 py-0.5 rounded-md border border-rose-100 animate-pulse">Love Affirmation 💖</span>
                        )}
                      </p>
                      
                      {/* Badge detail mood & difficulty */}
                      {(moodInfo || diffInfo) && (
                        <div className="flex flex-wrap gap-1">
                          {moodInfo && (
                            <span className={`inline-flex items-center gap-0.5 text-[8px] font-bold px-1.5 py-0.2 rounded-md border ${moodInfo.color}`}>
                              <span>{moodInfo.emoji}</span>
                              <span>{moodInfo.label.replace(moodInfo.emoji, "").trim()}</span>
                            </span>
                          )}
                          {diffInfo && (
                            <span className={`inline-flex items-center gap-0.5 text-[8px] font-bold px-1.5 py-0.2 rounded-md border ${diffInfo.color}`}>
                              <span>{diffInfo.emoji}</span>
                              <span>{diffInfo.label.replace(diffInfo.emoji, "").trim()}</span>
                            </span>
                          )}
                        </div>
                      )}

                      {activity.notes && (
                        <p className="text-[11px] text-slate-550 italic flex items-center gap-1 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                          <FileText size={9} className="text-slate-400 shrink-0" />
                          <span className="truncate">"{activity.notes}"</span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 z-10">
                      {/* Enlarged Points Badge */}
                      <span className="text-xs font-black text-accent bg-accent-light px-2 py-0.5 rounded-lg border border-accent/20">
                        +{activity.points || (activity.type === 'gym' || activity.type === 'lari' ? 10 : 5)}p
                      </span>
                      <button
                        onClick={() => {
                          if (window.confirm("Hapus catatan kegiatan ini, " + nick + "? 🥺")) {
                            onDelete(activity.id);
                          }
                        }}
                        className="p-1 rounded-lg text-slate-300 hover:text-danger hover:bg-danger-light transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100 cursor-pointer"
                        title="Hapus aktivitas"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
}
