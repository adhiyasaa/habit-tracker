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
  purple: { bg: "bg-purple-light/40", text: "text-purple", border: "border-purple/20" },
  accent: { bg: "bg-accent-light/40", text: "text-accent", border: "border-accent/20" },
  rose: { bg: "bg-rose-50", text: "text-rose-500", border: "border-rose-200" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-500", border: "border-indigo-200" },
  blue: { bg: "bg-blue-50", text: "text-blue-500", border: "border-blue-200" },
  amber: { bg: "bg-amber-light/40", text: "text-amber", border: "border-amber/20" },
  muted: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" },
};

const getCuteDateLabel = (dateStr) => {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split("T")[0];
  
  if (dateStr === today) {
    return "Hari Ini";
  } else if (dateStr === yesterday) {
    return "Kemarin";
  } else {
    return formatDateID(dateStr);
  }
};

export default function ActivityList({ activities, onDelete, user }) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-10 bg-white/60 rounded-3xl border border-card-border p-5 shadow-sm animate-fadeIn">
        <div className="text-4xl mb-2">📭</div>
        <p className="text-slate-700 font-bold text-xs">Belum ada aktivitas pekan ini</p>
        <p className="text-slate-400 text-[10px] mt-0.5">Gunakan tombol di bawah untuk mencatat kegiatan.</p>
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
    <div className="space-y-4 stagger-children">
      {Object.entries(grouped)
        .sort(([a], [b]) => new Date(b) - new Date(a))
        .map(([date, acts]) => (
          <div key={date} className="space-y-2">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 px-1 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-accent" />
              {getCuteDateLabel(date)}
            </p>
            <div className="space-y-2">
              {acts.map((activity) => {
                const typeInfo = ACTIVITY_TYPES.find((t) => t.id === activity.type);
                const Icon = typeInfo ? iconMap[typeInfo.icon] : Sparkles;
                const colors = typeInfo ? colorMap[typeInfo.color] : colorMap.muted;
                const moodInfo = MOODS.find((m) => m.id === activity.mood);
                const diffInfo = DIFFICULTIES.find((d) => d.id === activity.difficulty);

                return (
                  <div
                    key={activity.id}
                    className={`
                      flex items-center gap-3 p-3.5 rounded-2xl border bg-white
                      ${colors.border} hover:shadow-sm hover:scale-[1.005] transition-all group relative overflow-hidden
                    `}
                  >
                    <div className={`w-10 h-10 rounded-2xl ${colors.bg} flex items-center justify-center shrink-0`}>
                      <Icon size={20} className={colors.text} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="font-extrabold text-xs text-slate-800 truncate flex items-center gap-1.5">
                        <span>{activity.customName || typeInfo?.label || activity.type}</span>
                        {activity.type === "apresiasi" && (
                          <span className="text-[9px] bg-rose-50 text-rose-500 font-extrabold px-1.5 py-0.5 rounded-md border border-rose-100">Apresiasi 💖</span>
                        )}
                      </p>
                      
                      {/* Badge detail mood & difficulty */}
                      {(moodInfo || diffInfo) && (
                        <div className="flex flex-wrap gap-1">
                          {moodInfo && (
                            <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${moodInfo.color}`}>
                              <span>{moodInfo.emoji}</span>
                              <span>{moodInfo.label.replace(moodInfo.emoji, "").trim()}</span>
                            </span>
                          )}
                          {diffInfo && (
                            <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${diffInfo.color}`}>
                              <span>{diffInfo.emoji}</span>
                              <span>{diffInfo.label.replace(diffInfo.emoji, "").trim()}</span>
                            </span>
                          )}
                        </div>
                      )}

                      {activity.notes && (
                        <p className="text-xs text-slate-400 italic flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <FileText size={10} className="text-slate-400 shrink-0" />
                          <span className="truncate">"{activity.notes}"</span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 z-10">
                      <span className="text-xs font-bold text-accent bg-accent-light px-2 py-1 rounded-xl">
                        +{activity.points}
                      </span>
                      <button
                        onClick={() => {
                          if (window.confirm("Hapus catatan kegiatan ini?")) {
                            onDelete(activity.id);
                          }
                        }}
                        className="p-1 rounded-xl text-slate-300 hover:text-danger hover:bg-danger-light transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100 cursor-pointer"
                        title="Hapus aktivitas"
                      >
                        <Trash2 size={14} />
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
