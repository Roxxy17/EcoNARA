// app/api/donations/[id]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

// Helper untuk memeriksa kepemilikan
async function checkDonationOwnership(supabase: any, donationId: string, userId: string) {
  const { data, error } = await supabase
    .from("donations")
    .select("user_id")
    .eq("id", donationId)
    .single();
  
  if (error || !data) {
    return { error: "Donation not found or not authorized.", status: 404 };
  }
  
  if (data.user_id !== userId) {
    return { error: "Forbidden: Not authorized to access this donation.", status: 403 };
  }
  
  return { error: null, status: 200 };
}

// GET /api/donations/[id]
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  
  const { error, status } = await checkDonationOwnership(supabase, id, user.id);
  if (error) {
    return NextResponse.json({ message: error }, { status });
  }

  const { data: donation, error: dbError } = await supabase
    .from("donations")
    .select("*")
    .eq("id", id)
    .single();

  if (dbError) {
    console.error("Supabase Error fetching single donation:", dbError);
    return NextResponse.json({ message: "Failed to fetch donation." }, { status: 500 });
  }

  return NextResponse.json(donation);
}

// PUT /api/donations/[id]
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { error, status } = await checkDonationOwnership(supabase, id, user.id);
  if (error) {
    return NextResponse.json({ message: error }, { status });
  }

  try {
    const body = await req.json();
    const { item_name, description } = body;

    const updateFields: { item_name?: string; description?: string } = {};
    if (item_name !== undefined) updateFields.item_name = item_name;
    if (description !== undefined) updateFields.description = description;

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ message: "No fields to update." }, { status: 400 });
    }

    const { data: updatedDonation, error: dbError } = await supabase
      .from("donations")
      .update(updateFields)
      .eq("id", id)
      .select()
      .single();

    if (dbError) {
      console.error("Supabase Error updating donation:", dbError);
      return NextResponse.json({ message: "Failed to update donation." }, { status: 500 });
    }

    return NextResponse.json(updatedDonation);
  } catch (error) {
    console.error("API Error updating donation:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/donations/[id]
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { error, status } = await checkDonationOwnership(supabase, id, user.id);
  if (error) {
    return NextResponse.json({ message: error }, { status });
  }

  const { error: dbError } = await supabase
    .from("donations")
    .delete()
    .eq("id", id);
  
  if (dbError) {
    console.error("Supabase Error deleting donation:", dbError);
    return NextResponse.json({ message: "Failed to delete donation." }, { status: 500 });
  }

  return NextResponse.json({ message: "Donation deleted successfully." }, { status: 200 });
}