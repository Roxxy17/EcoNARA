// app/api/donations/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

// GET /api/donations - Mengambil semua donasi pengguna yang login
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data: donations, error: dbError } = await supabase
    .from("donations")
    .select("*")
    .eq("user_id", user.id) // Filter hanya donasi milik pengguna
    .order("created_at", { ascending: false });

  if (dbError) {
    console.error("Supabase Error fetching donations:", dbError);
    return NextResponse.json({ message: "Failed to fetch donations." }, { status: 500 });
  }

  return NextResponse.json(donations);
}

// POST /api/donations - Membuat donasi baru
export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { item_name, description } = body;

    if (!item_name) {
      return NextResponse.json({ message: "Item name is required." }, { status: 400 });
    }

    const { data: newDonation, error: dbError } = await supabase
      .from("donations")
      .insert({
        user_id: user.id,
        item_name,
        description,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Supabase Error inserting donation:", dbError);
      return NextResponse.json({ message: "Failed to create donation." }, { status: 500 });
    }

    return NextResponse.json(newDonation, { status: 201 });
  } catch (error) {
    console.error("API Error creating donation:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}