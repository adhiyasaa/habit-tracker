/**
 * DEBUG HELPER - Jalankan di browser console (F12)
 * Copy-paste kode ini untuk test Supabase connection
 */

// Test 1: Check environment variables
console.log("=== TEST 1: Environment Variables ===");
console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:", process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? "✅ SET" : "❌ NOT SET");

// Test 2: Import Supabase client
console.log("\n=== TEST 2: Supabase Client ===");
import { supabase } from "@/lib/supabase";
console.log("Supabase client:", supabase);

// Test 3: Check if users table exists
console.log("\n=== TEST 3: Query Users Table ===");
const { data: usersData, error: usersError } = await supabase.from("users").select("*");
if (usersError) {
  console.error("❌ ERROR fetching users:", usersError);
  console.log("Possible causes:");
  console.log("1. Table 'users' doesn't exist");
  console.log("2. RLS policies not configured");
  console.log("3. Wrong credentials in .env.local");
} else {
  console.log("✅ Users found:", usersData);
}

// Test 4: Try to insert test activity
console.log("\n=== TEST 4: Test Insert Activity ===");
const testActivity = {
  user_id: "tsalysa",
  type: "gym",
  custom_name: null,
  notes: "Test activity",
  date: new Date().toISOString().split('T')[0],
  points: 10,
};
const { data: insertData, error: insertError } = await supabase
  .from("activities")
  .insert([testActivity])
  .select();

if (insertError) {
  console.error("❌ ERROR inserting activity:", insertError);
  console.log("Error details:", {
    message: insertError.message,
    code: insertError.code,
    details: insertError.details,
    hint: insertError.hint,
  });
  console.log("\nTo fix:");
  console.log("1. Check SQL script was executed in Supabase");
  console.log("2. Verify tables exist in Table Editor");
  console.log("3. Check RLS policies are configured");
} else {
  console.log("✅ Activity inserted successfully:", insertData);
}

// Test 5: Fetch all activities
console.log("\n=== TEST 5: Query Activities Table ===");
const { data: activitiesData, error: activitiesError } = await supabase.from("activities").select("*");
if (activitiesError) {
  console.error("❌ ERROR fetching activities:", activitiesError);
} else {
  console.log("✅ Activities found:", activitiesData);
}

console.log("\n=== DEBUG COMPLETE ===");
console.log("If all tests passed (✅), your Supabase setup is correct!");
console.log("If any test failed (❌), follow the suggestions above.");
