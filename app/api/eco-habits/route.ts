// app/api/eco-habits/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

// GET /api/eco-habits
export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Authentication Error (GET /api/eco-habits):", userError?.message || "User not found");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: ecoHabits, error: fetchError } = await supabase
      .from("eco_habits")
      .select("*")
      .eq("user_id", user.id) // Pastikan hanya mengambil data milik user yang login
      .order("created_at", { ascending: false }); // Urutkan berdasarkan waktu terbaru

    if (fetchError) {
      console.error("Supabase Error fetching eco habits:", fetchError);
      return NextResponse.json(
        { message: fetchError.message || "Failed to fetch eco habits." },
        { status: 500 }
      );
    }

    return NextResponse.json(ecoHabits);
  } catch (error) {
    console.error("API Error (GET /api/eco-habits):", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/eco-habits
export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Authentication Error (POST /api/eco-habits):", userError?.message || "User not found");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { activity_type, points } = body;

    if (!activity_type || typeof points !== 'number') {
      return NextResponse.json({ message: "Invalid input: activity_type and points are required." }, { status: 400 });
    }

    const { data: newEcoHabit, error: insertError } = await supabase
      .from("eco_habits")
      .insert({
        user_id: user.id, // Otomatis set user_id dari user yang login
        activity_type,
        points,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Supabase Error inserting eco habit:", insertError);
      return NextResponse.json(
        { message: insertError.message || "Failed to add eco habit." },
        { status: 500 }
      );
    }

    return NextResponse.json(newEcoHabit, { status: 201 }); // 201 Created
  } catch (error) {
    console.error("API Error (POST /api/eco-habits):", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}