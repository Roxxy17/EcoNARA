// app/api/needs/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";


export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const isVerifiedFilter = searchParams.get("is_verified");

  let query = supabase.from("needs").select("*, users(nama)");

  // Tambahkan filter jika parameter is_verified ada
  if (isVerifiedFilter !== null) {
    query = query.eq("is_verified", isVerifiedFilter === "true");
  }

  const { data: needs, error: dbError } = await query
    .order("created_at", { ascending: false });

  if (dbError) {
    console.error("Supabase Error fetching needs:", dbError);
    return NextResponse.json({ message: "Failed to fetch needs." }, { status: 500 });
  }

  return NextResponse.json(needs);
}


// POST /api/needs - Membuat permintaan kebutuhan baru
export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Authentication Error (POST /api/needs):", userError?.message || "User not found");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { item_name, description, is_urgent, latitude, longitude } = body;

    if (!item_name) {
      return NextResponse.json({ message: "Item name is required." }, { status: 400 });
    }

    const { data: newNeed, error: dbError } = await supabase
      .from("needs")
      .insert({
        user_id: user.id,
        item_name,
        description,
        is_urgent: is_urgent || false,
        latitude,
        longitude,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Supabase Error inserting need:", dbError);
      return NextResponse.json({ message: dbError.message || "Failed to create need." }, { status: 500 });
    }

    return NextResponse.json(newNeed, { status: 201 });
  } catch (error) {
    console.error("API Error (POST /api/needs):", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}