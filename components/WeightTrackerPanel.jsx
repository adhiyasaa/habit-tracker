"use client";

import { useState, useEffect, useCallback } from "react";
import { Scale, Plus, Trash2, Loader2, ArrowDown, ArrowUp, Minus } from "lucide-react";
import { addWeightLog, getWeightLogs, deleteWeightLog } from "@/lib/store";
import { formatDateID } from "@/lib/constants";

export default function WeightTrackerPanel({ user }) {
  const [weight, setWeight] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const nick = user.nickname || "ayang";
  const nickCap = nick.charAt(0).toUpperCase() + nick.slice(1);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getWeightLogs(user.id);
      setLogs(data);
    } catch (err) {
      console.error("Error loading weight logs:", err);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!weight) return;

    const val = parseFloat(weight);
    if (isNaN(val) || val < 10 || val > 300) {
      alert("Masukkan berat badan yang valid (10 - 300 kg).");
      return;
    }

    try {
      setSubmitting(true);
      await addWeightLog({
        userId: user.id,
        weight: val,
        date: new Date().toISOString().split("T")[0],
      });
      setWeight("");
      await fetchLogs();
    } catch (err) {
      alert("Gagal mencatat berat badan: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (logId) => {
    if (window.confirm("Hapus catatan berat badan ini?")) {
      try {
        await deleteWeightLog(logId);
        await fetchLogs();
      } catch (err) {
        alert("Gagal menghapus catatan: " + err.message);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-card-border p-5 shadow-sm space-y-4 animate-fadeIn">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
          <Scale size={16} className="text-indigo-500" />
        </div>
        <div>
          <h3 className="font-bold text-xs text-slate-800">Log Berat Badan {nickCap}</h3>
          <p className="text-[10px] text-slate-400 font-semibold">Catatan berat badan harian atau mingguan.</p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Berat badan..."
            className="w-full pl-4 pr-10 py-2 rounded-xl border-2 border-card-border bg-white text-xs text-slate-800
              focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition-all font-semibold"
            required
            disabled={submitting}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">kg</span>
        </div>
        <button
          type="submit"
          disabled={submitting || !weight}
          className="px-4 py-2 rounded-xl text-white font-bold text-xs bg-indigo-500 hover:bg-indigo-650
            transition-all flex items-center gap-1 cursor-pointer disabled:bg-slate-200"
        >
          {submitting ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <>
              <Plus size={12} />
              Catat
            </>
          )}
        </button>
      </form>

      {/* Logs List */}
      <div className="space-y-2">
        <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider px-1">Riwayat Berat Badan</p>
        
        {loading ? (
          <div className="text-center py-4">
            <Loader2 size={14} className="animate-spin text-indigo-500 mx-auto" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs text-slate-400 font-semibold">Belum ada catatan berat badan</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto pr-1">
            {logs.map((log, index) => {
              const prevLog = logs[index + 1];
              let delta = null;
              if (prevLog) {
                delta = log.weight - prevLog.weight;
              }

              return (
                <div key={log.id} className="flex items-center justify-between py-2 first:pt-0 last:pb-0 group animate-fadeIn">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-800">{log.weight} kg</p>
                    <p className="text-[9px] text-slate-400 font-bold">{formatDateID(log.date)}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Delta Indicator */}
                    {delta !== null ? (
                      delta > 0 ? (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100">
                          <ArrowUp size={8} />
                          +{delta.toFixed(1)} kg
                        </span>
                      ) : delta < 0 ? (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">
                          <ArrowDown size={8} />
                          {delta.toFixed(1)} kg
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100">
                          <Minus size={8} />
                          Tetap
                        </span>
                      )
                    ) : (
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100">
                        Awal
                      </span>
                    )}

                    <button
                      onClick={() => handleDelete(log.id)}
                      className="p-1 rounded-lg text-slate-300 hover:text-danger hover:bg-danger-light transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100 cursor-pointer"
                      title="Hapus timbangan"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
