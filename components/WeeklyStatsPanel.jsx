"use client";

import { Trophy, Target, TrendingUp } from "lucide-react";
import { REWARD_THRESHOLD, GYM_TARGET, LARI_TARGET } from "@/lib/constants";

export default function WeeklyStatsPanel({ stats, user }) {
  const { gymCount, lariCount, totalPoints, rewardEligible, pointsToReward, gymTarget, lariTarget } = stats;

  const gymPercent = Math.min((gymCount / GYM_TARGET) * 100, 100);
  const lariPercent = Math.min((lariCount / LARI_TARGET) * 100, 100);
  const pointsPercent = Math.min((totalPoints / REWARD_THRESHOLD) * 100, 100);

  // Nickname dinamis (tsalysa -> picil, dias -> bebe)
  const nick = user.nickname || "ayang";
  const nickCap = nick.charAt(0).toUpperCase() + nick.slice(1);

  return (
    <div className="space-y-4 stagger-children">
      {/* Reward Status Banner */}
      <div
        className={`
          relative overflow-hidden rounded-3xl p-5 text-white shadow-md transition-all duration-300
          ${rewardEligible
            ? "bg-gradient-to-br from-amber-500 to-orange-500 scale-[1.01]"
            : "bg-gradient-to-br from-slate-700 via-slate-650 to-slate-700"
          }
        `}
      >
        {rewardEligible && (
          <div className="absolute inset-0 animate-shimmer pointer-events-none" />
        )}
        <div className="relative flex items-center gap-4">
          <div className={`
            w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0
            ${rewardEligible ? "bg-white/20" : "bg-white/10"}
          `}>
            {rewardEligible ? "🏆" : "🎯"}
          </div>
          <div className="flex-1">
            {rewardEligible ? (
              <>
                <p className="font-extrabold text-base">{nickCap} Berhak Mendapatkan Reward! 🏆</p>
                <p className="text-white/90 text-xs mt-0.5 font-medium leading-relaxed">
                  Selamat {nickCap}! Semua target kegiatan minggu ini sudah terpenuhi. Good job! 🌟
                </p>
              </>
            ) : (
              <>
                <p className="font-extrabold text-sm">Kejar Target Pekan Ini, {nickCap}!</p>
                <div className="text-white/85 text-xs mt-0.5 font-medium leading-relaxed">
                  {totalPoints < REWARD_THRESHOLD
                    ? `Kurang ${pointsToReward} poin lagi untuk mendapatkan reward pekan ini. Semangat!`
                    : !gymTarget || !lariTarget
                    ? `Poin sudah cukup. Tinggal menyelesaikan target ${!gymTarget ? "Gym" : ""}${!gymTarget && !lariTarget ? " & " : ""}${!lariTarget ? "Lari" : ""} ya.`
                    : "Semua target selesai! Kurang sedikit lagi untuk mendapatkan reward pekan ini."
                  }
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Points Card */}
      <div className="bg-white rounded-3xl border border-card-border p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-accent-light flex items-center justify-center">
              <TrendingUp size={16} className="text-accent" />
            </div>
            <span className="font-bold text-xs text-slate-700">Poin Cinta Pekan Ini</span>
          </div>
          <span className="text-xl font-black text-accent">{totalPoints}</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-emerald-400 progress-bar-fill"
            style={{ width: `${pointsPercent}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400">
          <span>{totalPoints} poin diperoleh</span>
          <span>Target: {REWARD_THRESHOLD} poin</span>
        </div>
      </div>

      {/* Gym & Lari Target Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Gym Target */}
        <div className={`
          rounded-3xl border-2 p-4 transition-all duration-300
          ${gymTarget
            ? "border-accent bg-accent-light/20 shadow-sm"
            : "border-card-border bg-white"
          }
        `}>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-lg">🏋️</span>
            <span className="font-bold text-xs text-slate-700">Target Gym</span>
          </div>
          <div className="text-2xl font-black mb-1 text-slate-800">
            {gymCount}<span className="text-xs font-semibold text-slate-400"> / {GYM_TARGET}x</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mb-2">
            <div
              className={`h-full rounded-full progress-bar-fill ${gymTarget ? "bg-accent" : "bg-purple"}`}
              style={{ width: `${gymPercent}%` }}
            />
          </div>
          <span className={`
            inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full
            ${gymTarget
              ? "bg-accent/10 text-accent border border-accent/20"
              : "bg-amber/10 text-amber border border-amber/20"
            }
          `}>
            {gymTarget ? "Selesai" : "Belum Tercapai"}
          </span>
        </div>

        {/* Lari Target */}
        <div className={`
          rounded-3xl border-2 p-4 transition-all duration-300
          ${lariTarget
            ? "border-accent bg-accent-light/20 shadow-sm"
            : "border-card-border bg-white"
          }
        `}>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-lg">🏃</span>
            <span className="font-bold text-xs text-slate-700">Target Lari</span>
          </div>
          <div className="text-2xl font-black mb-1 text-slate-800">
            {lariCount}<span className="text-xs font-semibold text-slate-400"> / {LARI_TARGET}x</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mb-2">
            <div
              className={`h-full rounded-full progress-bar-fill ${lariTarget ? "bg-accent" : "bg-blue-500"}`}
              style={{ width: `${lariPercent}%` }}
            />
          </div>
          <span className={`
            inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full
            ${lariTarget
              ? "bg-accent/10 text-accent border border-accent/20"
              : "bg-amber/10 text-amber border border-amber/20"
            }
          `}>
            {lariTarget ? "Selesai" : "Belum Tercapai"}
          </span>
        </div>
      </div>
    </div>
  );
}
