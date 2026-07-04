"use client";

import { Trophy, Target, TrendingUp } from "lucide-react";
import { REWARD_THRESHOLD, GYM_TARGET, LARI_TARGET } from "@/lib/constants";

export default function WeeklyStatsPanel({ stats, user }) {
  const { gymCount, lariCount, totalPoints, rewardEligible, pointsToReward, gymTarget, lariTarget } = stats;

  const gymPercent = Math.min((gymCount / GYM_TARGET) * 100, 100);
  const lariPercent = Math.min((lariCount / LARI_TARGET) * 100, 100);
  const pointsPercent = Math.min((totalPoints / REWARD_THRESHOLD) * 100, 100);

  const nick = user.nickname || "ayang";
  const nickCap = nick.charAt(0).toUpperCase() + nick.slice(1);

  return (
    <div className="space-y-3 stagger-children">
      {/* Reward Status Banner (Festive & Compact) */}
      <div
        className={`
          relative overflow-hidden rounded-2xl p-3.5 text-white shadow-md transition-all duration-300
          ${rewardEligible
            ? "bg-gradient-to-br from-teal-500 via-emerald-500 to-indigo-600 scale-[1.01]"
            : "bg-gradient-to-br from-slate-700 via-slate-650 to-slate-700"
          }
        `}
      >
        <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-20" />
        <div className="relative flex items-center gap-3">
          <div className={`
            w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0 animate-bounce
            ${rewardEligible ? "bg-white/25" : "bg-white/10"}
          `}>
            {rewardEligible ? "👑" : "🎯"}
          </div>
          <div className="flex-1">
            {rewardEligible ? (
              <>
                <p className="font-extrabold text-xs flex items-center gap-1">
                  <span>Target Mingguan Tercapai!</span>
                  <span>🎉🏆</span>
                </p>
                <p className="text-white/95 text-[10px] mt-0.5 leading-relaxed font-bold">
                  Selamat {nickCap}! Semua target kegiatan minggu ini sudah terpenuhi. Good job! 🌟💖
                </p>
              </>
            ) : (
              <>
                <p className="font-extrabold text-xs flex items-center gap-1">
                  <span>Semangat Kejar Target, {nickCap}!</span>
                  <span className="animate-pulse">✨</span>
                </p>
                <div className="text-white/85 text-[10px] mt-0.5 leading-relaxed font-bold">
                  {totalPoints < REWARD_THRESHOLD
                    ? `Kurang ${pointsToReward} poin lagi untuk mendapatkan reward pekan ini. Semangat! 💪`
                    : !gymTarget || !lariTarget
                    ? `Poin cukup! Selesaikan target ${!gymTarget ? "Gym 🏋️" : ""}${!gymTarget && !lariTarget ? " & " : ""}${!lariTarget ? "Lari 🏃" : ""} yaa...`
                    : "Semua target selesai! Kurang sedikit lagi untuk mendapatkan reward."
                  }
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Points Card (Sleek Emerald-Teal-Indigo Progress) */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-3.5 shadow-sm relative overflow-hidden">
        <div className="absolute -right-2 -bottom-2 text-4xl opacity-5 pointer-events-none select-none">
          ✨
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center text-xs text-teal-600 font-extrabold">
              📈
            </div>
            <span className="font-bold text-[10px] text-slate-700 uppercase tracking-wider">Weekly Score</span>
          </div>
          <span className="text-base font-black text-teal-650 animate-pulse">{totalPoints}</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-400 via-emerald-500 to-indigo-500 progress-bar-fill"
            style={{ width: `${pointsPercent}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[9px] font-extrabold text-slate-400">
          <span>{totalPoints} poin diperoleh</span>
          <span>Target: {REWARD_THRESHOLD}p</span>
        </div>
      </div>

      {/* Gym & Lari Target Cards (Clean Emerald completed theme) */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Gym Target */}
        <div className={`
          rounded-2xl border-2 p-3 transition-all duration-300
          ${gymTarget
            ? "border-emerald-300 bg-emerald-50/20 shadow-sm"
            : "border-card-border bg-white"
          }
        `}>
          <div className="flex items-center gap-1 mb-1.5">
            <span className="text-sm">🏋️</span>
            <span className="font-bold text-[10px] text-slate-700">🏋️ Target Gym 🏋️</span>
          </div>
          <div className="text-lg font-black mb-1 text-slate-800">
            {gymCount}<span className="text-[10px] font-semibold text-slate-400"> / {GYM_TARGET}x</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mb-1.5">
            <div
              className={`h-full rounded-full progress-bar-fill ${gymTarget ? "bg-gradient-to-r from-teal-400 to-emerald-500" : "bg-purple"}`}
              style={{ width: `${gymPercent}%` }}
            />
          </div>
          <span className={`
            inline-flex items-center gap-1 text-[8px] font-extrabold px-1.5 py-0.5 rounded-md
            ${gymTarget
              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
              : "bg-amber/10 text-amber border border-amber/20"
            }
          `}>
            {gymTarget ? "Selesai ✨" : "Belum Tercapai ⏰"}
          </span>
        </div>

        {/* Lari Target */}
        <div className={`
          rounded-2xl border-2 p-3 transition-all duration-300
          ${lariTarget
            ? "border-emerald-300 bg-emerald-50/20 shadow-sm"
            : "border-card-border bg-white"
          }
        `}>
          <div className="flex items-center gap-1 mb-1.5">
            <span className="text-sm">🏃</span>
            <span className="font-bold text-[10px] text-slate-700">🏃 Target Lari 🏃</span>
          </div>
          <div className="text-lg font-black mb-1 text-slate-800">
            {lariCount}<span className="text-[10px] font-semibold text-slate-400"> / {LARI_TARGET}x</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mb-1.5">
            <div
              className={`h-full rounded-full progress-bar-fill ${lariTarget ? "bg-gradient-to-r from-teal-400 to-emerald-500" : "bg-blue-500"}`}
              style={{ width: `${lariPercent}%` }}
            />
          </div>
          <span className={`
            inline-flex items-center gap-1 text-[8px] font-extrabold px-1.5 py-0.5 rounded-md
            ${lariTarget
              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
              : "bg-amber/10 text-amber border border-amber/20"
            }
          `}>
            {lariTarget ? "Selesai ✨" : "Belum Tercapai ⏰"}
          </span>
        </div>
      </div>
    </div>
  );
}
