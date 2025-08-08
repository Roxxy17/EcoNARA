// app/api/eco-habits/[id]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

// Helper function to get user and check ownership
async function getUserAndCheckOwnership(supabase: any, id: string, user: any) {
  const { data: ecoHabit, error: fetchError } = await supabase
    .from("eco_habits")
    .select("id, user_id")
    .eq("id", id)
    .single();

  if (fetchError) {
    if (fetchError.code === 'PGRST116') { // Supabase specific code for "no rows found"
      return { error: "Eco habit not found.", status: 404 };
    }
    console.error("Supabase Error fetching eco habit for ownership check:", fetchError);
    return { error: fetchError.message || "Failed to fetch eco habit.", status: 500 };
  }

  if (!ecoHabit) {
    return { error: "Eco habit not found.", status: 404 };
  }

  if (ecoHabit.user_id !== user.id) {
    return { error: "Forbidden: Not authorized to access this eco habit.", status: 403 };
  }

  return { ecoHabit, status: 200 };
}

// GET /api/eco-habits/[id]
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = createRouteHandlerClient({ cookies });

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Authentication Error (GET /api/eco-habits/[id]):", userError?.message || "User not found");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { ecoHabit, error, status } = await getUserAndCheckOwnership(supabase, id, user);
  if (error) {
    return NextResponse.json({ message: error }, { status });
  }

  // Jika otorisasi berhasil, ambil detail penuh
  const { data: fullEcoHabit, error: fetchError } = await supabase
    .from("eco_habits")
    .select("*") // Ambil semua kolom
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Supabase Error fetching full eco habit:", fetchError);
    return NextResponse.json(
      { message: fetchError.message || "Failed to fetch eco habit details." },
      { status: 500 }
    );
  }

  return NextResponse.json(fullEcoHabit);
}

// PUT /api/eco-habits/[id]
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = createRouteHandlerClient({ cookies });

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Authentication Error (PUT /api/eco-habits/[id]):", userError?.message || "User not found");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { error: ownershipError, status: ownershipStatus } = await getUserAndCheckOwnership(supabase, id, user);
  if (ownershipError) {
    return NextResponse.json({ message: ownershipError }, { status: ownershipStatus });
  }

  try {
    const body = await req.json();
    const { activity_type, points } = body;

    const updateFields: { activity_type?: string; points?: number; updated_at?: string } = {};
    if (activity_type !== undefined) updateFields.activity_type = activity_type;
    if (points !== undefined) updateFields.points = points;
    updateFields.updated_at = new Date().toISOString(); // Perbarui timestamp

    if (Object.keys(updateFields).length === 1 && updateFields.updated_at) { // Hanya updated_at yang berubah
      return NextResponse.json({ message: "No relevant fields to update." }, { status: 400 });
    }

    const { data: updatedEcoHabit, error: updateError } = await supabase
      .from("eco_habits")
      .update(updateFields)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Supabase Error updating eco habit:", updateError);
      return NextResponse.json(
        { message: updateError.message || "Failed to update eco habit." },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedEcoHabit);
  } catch (error) {
    console.error("API Error (PUT /api/eco-habits/[id]):", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/eco-habits/[id]
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = createRouteHandlerClient({ cookies });

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Authentication Error (DELETE /api/eco-habits/[id]):", userError?.message || "User not found");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { error: ownershipError, status: ownershipStatus } = await getUserAndCheckOwnership(supabase, id, user);
  if (ownershipError) {
    return NextResponse.json({ message: ownershipError }, { status: ownershipStatus });
  }

  try {
    const { error: deleteError } = await supabase
      .from("eco_habits")
      .delete()
      .eq("id", id); // RLS akan memastikan user_id cocok dengan auth.uid()

    if (deleteError) {
      console.error("Supabase Error deleting eco habit:", deleteError);
      return NextResponse.json(
        { message: deleteError.message || "Failed to delete eco habit." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Eco habit deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error("API Error (DELETE /api/eco-habits/[id]):", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}