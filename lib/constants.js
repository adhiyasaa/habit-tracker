// Points & reward constants
export const POINTS_PER_ACTIVITY = 10;
export const REWARD_THRESHOLD = 100;
export const GYM_TARGET = 2;
export const LARI_TARGET = 2;

// Activity type definitions
export const ACTIVITY_TYPES = [
  { id: "gym", label: "Gym", icon: "Dumbbell", color: "purple" },
  { id: "lari", label: "Lari", icon: "Footprints", color: "accent" },
  { id: "apresiasi", label: "Puji Pasangan 💖", icon: "Heart", color: "rose" },
  { id: "tidur_cukup", label: "Tidur Cukup 😴", icon: "Moon", color: "indigo" },
  { id: "minum_air", label: "Minum Air 2L 💧", icon: "Droplet", color: "blue" },
  { id: "olahraga_lain", label: "Olahraga Lain", icon: "HeartPulse", color: "amber", custom: true },
  { id: "kegiatan_lain", label: "Kegiatan Lain", icon: "Sparkles", color: "muted", custom: true },
];

// Get the Monday of the current week (ISO week starts on Monday)
export function getWeekStartDate(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

// Format date to YYYY-MM-DD
export function formatDate(date) {
  return date.toISOString().split("T")[0];
}

// Format date to readable Indonesian
export function formatDateID(date) {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const d = new Date(date);
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
}

// Get week range string
export function getWeekRangeString(weekStart) {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  return `${formatDateID(weekStart)} — ${formatDateID(end)}`;
}

// Users
export const USERS = [
  { id: "tsalysa", name: "Picil", emoji: "👩", color: "from-pink-500 to-rose-400", nickname: "picil" },
  { id: "dias", name: "Bebe", emoji: "👨", color: "from-blue-500 to-indigo-400", nickname: "bebe" },
];

// Moods pas ngelakuin kegiatan
export const MOODS = [
  { id: "hepi", label: "Seneng banget 🥰", emoji: "🥰", color: "text-rose-500 bg-rose-50 border-rose-200" },
  { id: "capek_hepi", label: "Capek tapi hepi 🥵", emoji: "🥵", color: "text-orange-500 bg-orange-50 border-orange-200" },
  { id: "males", label: "Males sebenernya 😴", emoji: "😴", color: "text-blue-500 bg-blue-50 border-blue-200" },
  { id: "semangat", label: "Semangat pol! 🔥", emoji: "🔥", color: "text-red-500 bg-red-50 border-red-200" },
];

// Tingkat keseruan/kesulitan kegiatan
export const DIFFICULTIES = [
  { id: "enteng", label: "Enteng banget 🌟", emoji: "🌟", color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  { id: "lumayan", label: "Lumayan lah ⚡", emoji: "⚡", color: "text-purple-600 bg-purple-50 border-purple-200" },
  { id: "perjuangan", label: "Perjuangan pol! 🏆", emoji: "🏆", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
];

