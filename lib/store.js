// Supabase-based data store for the Couple Habit Tracker
import { supabase } from "./supabase";
import { getWeekStartDate, formatDate, POINTS_PER_ACTIVITY } from "./constants";

// Add a new activity
export async function addActivity({ userId, type, customName, notes, date, mood, difficulty }) {
  try {
    const activityData = {
      user_id: userId,
      type,
      custom_name: customName || null,
      notes: notes || "",
      mood: mood || null,
      difficulty: difficulty || null,
      date: date || formatDate(new Date()),
      points: POINTS_PER_ACTIVITY,
    };

    // Apresiasi (puji ayang) bernilai poin khusus (+15 poin)
    if (type === "apresiasi") {
      activityData.points = 15;
    }

    console.log("📝 Adding activity with data:", JSON.stringify(activityData, null, 2));

    const { data, error } = await supabase
      .from("activities")
      .insert([activityData])
      .select();

    if (error) {
      const errorMsg = `
        🔴 SUPABASE ERROR:
        - Code: ${error.code}
        - Message: ${error.message}
        - Details: ${error.details}
        - Hint: ${error.hint}
        
        This usually means:
        - User ID '${userId}' doesn't exist in users table
        - Or table/RLS policies not configured correctly
      `;
      console.error(errorMsg);
      throw new Error(`Database Error (${error.code}): ${error.message}. Details: ${error.details || error.hint || "No details"}`);
    }

    console.log("✅ Activity added successfully:", data);
    return data?.[0];
  } catch (err) {
    const errorInfo = {
      name: err.name,
      message: err.message,
      stack: err.stack,
      toString: err.toString(),
    };
    console.error("❌ FULL ERROR INFO:", JSON.stringify(errorInfo, null, 2));
    console.error("Error object:", err);
    throw err;
  }
}

// Delete an activity
export async function deleteActivity(activityId) {
  try {
    console.log(`🗑️ Deleting activity: ${activityId}`);

    const { error } = await supabase
      .from("activities")
      .delete()
      .eq("id", activityId);

    if (error) {
      console.error("🔴 Error deleting activity:", {
        code: error.code,
        message: error.message,
        details: error.details,
      });
      throw new Error(`Failed to delete activity: ${error.message}`);
    }

    console.log("✅ Activity deleted successfully");
  } catch (err) {
    console.error("❌ Exception in deleteActivity:", err.message);
    throw err;
  }
}

// Get all activities for a user in the current week
export async function getWeeklyActivities(userId, refDate = new Date()) {
  try {
    const weekStart = getWeekStartDate(refDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const startDateStr = formatDate(weekStart);
    const endDateStr = formatDate(weekEnd);

    console.log(`📅 Fetching activities for ${userId} between ${startDateStr} and ${endDateStr}`);

    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("user_id", userId)
      .gte("date", startDateStr)
      .lt("date", endDateStr)
      .order("date", { ascending: false });

    if (error) {
      console.error("🔴 Error fetching activities:", {
        code: error.code,
        message: error.message,
        details: error.details,
      });
      return [];
    }

    console.log(`✅ Found ${data?.length || 0} activities`);
    return data || [];
  } catch (err) {
    console.error("❌ Exception in getWeeklyActivities:", err.message);
    return [];
  }
}

// Get weekly stats & cumulative points for a user
export async function getWeeklyStats(userId, refDate = new Date()) {
  try {
    const activities = await getWeeklyActivities(userId, refDate);
    console.log(`Stats for ${userId}:`, activities);

    const gymCount = activities.filter((a) => a.type === "gym").length;
    const lariCount = activities.filter((a) => a.type === "lari").length;
    
    // Sum points for weekly activities
    const totalPoints = activities.reduce((sum, a) => sum + (a.points || 10), 0);
    const totalActivities = activities.length;

    // Fetch all activities ever to calculate Cumulative/Lifetime Points (All-Time Points)
    const { data: allActivities, error: allErr } = await supabase
      .from("activities")
      .select("points")
      .eq("user_id", userId);

    const allTimePoints = allErr
      ? totalPoints
      : allActivities.reduce((sum, a) => sum + (a.points || 10), 0);

    return {
      gymCount,
      lariCount,
      totalPoints,
      allTimePoints, // Skor kumulatif jangka panjang
      totalActivities,
      activities,
      gymTarget: gymCount >= 2,
      lariTarget: lariCount >= 2,
      rewardEligible: gymCount >= 2 && lariCount >= 2 && totalPoints >= 100,
      pointsToReward: Math.max(0, 100 - totalPoints),
    };
  } catch (err) {
    console.error("Error getting weekly stats:", err);
    return {
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
  }
}

// Get activities grouped by date for a user in the current week
export async function getActivitiesByDate(userId, refDate = new Date()) {
  const activities = await getWeeklyActivities(userId, refDate);
  const grouped = {};
  activities.forEach((a) => {
    if (!grouped[a.date]) grouped[a.date] = [];
    grouped[a.date].push(a);
  });
  return grouped;
}

// Clear all data (for testing)
export async function clearAllData() {
  const { error: err1 } = await supabase
    .from("activities")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  
  const { error: err2 } = await supabase
    .from("weight_logs")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (err1) console.error("Error clearing activities:", err1);
  if (err2) console.error("Error clearing weight logs:", err2);
}

// ============================================
// WEIGHT TRACKER HELPER FUNCTIONS
// ============================================

// Add a new weight log entry
export async function addWeightLog({ userId, weight, date }) {
  try {
    const logData = {
      user_id: userId,
      weight: parseFloat(weight),
      date: date || new Date().toISOString().split("T")[0]
    };
    
    console.log("📝 Adding weight log with data:", logData);
    
    const { data, error } = await supabase
      .from("weight_logs")
      .insert([logData])
      .select();
      
    if (error) {
      console.error("🔴 Error adding weight log:", error);
      throw new Error(`Gagal menyimpan timbangan: ${error.message}`);
    }
    
    return data?.[0];
  } catch (err) {
    console.error("❌ Exception in addWeightLog:", err);
    throw err;
  }
}

// Fetch all weight log entries for a user
export async function getWeightLogs(userId) {
  try {
    console.log(`📅 Fetching weight logs for ${userId}`);
    const { data, error } = await supabase
      .from("weight_logs")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });
      
    if (error) {
      console.error("🔴 Error fetching weight logs:", error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error("❌ Exception in getWeightLogs:", err);
    return [];
  }
}

// Delete a weight log entry
export async function deleteWeightLog(logId) {
  try {
    console.log(`🗑️ Deleting weight log: ${logId}`);
    const { error } = await supabase
      .from("weight_logs")
      .delete()
      .eq("id", logId);
      
    if (error) {
      console.error("🔴 Error deleting weight log:", error);
      throw new Error(error.message);
    }
  } catch (err) {
    console.error("❌ Exception in deleteWeightLog:", err);
    throw err;
  }
}
