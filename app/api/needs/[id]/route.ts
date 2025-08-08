// app/api/needs/[id]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

// Helper function to get user and check authorization
async function checkNeedAuthorization(supabase: any, needId: string, user: any) {
  // Ambil user_id dari kebutuhan
  const { data: need, error: fetchError } = await supabase
    .from("needs")
    .select("user_id")
    .eq("id", needId)
    .single();

  if (fetchError || !need) {
    return { error: "Need not found or not authorized.", status: 404 };
  }

  // Periksa apakah user adalah pemilik
  const isOwner = need.user_id === user.id;

  // Jika bukan pemilik, periksa apakah user adalah admin/ketua RT
  if (!isOwner) {
    // Ambil desa_id dari pemilik kebutuhan
    const { data: needOwnerProfile, error: ownerProfileError } = await supabase
        .from("users")
        .select("desa_id")
        .eq("id", need.user_id)
        .single();
    
    if (ownerProfileError || !needOwnerProfile) {
        return { error: "Could not find profile of need owner.", status: 500 };
    }

    // Periksa apakah user yang login memiliki role 'ketua' atau 'admin' dan di desa yang sama
    const isAuthorizedAdmin = (user.role === 'ketua' || user.role === 'admin') && user.desa_id === ownerProfile.desa_id;
    if (!isAuthorizedAdmin) {
        return { error: "Forbidden: Not authorized to update this need.", status: 403 };
    }
  }
  
  return { error: null, status: 200 };
}

// GET /api/needs/[id]
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Langsung ambil data jika RLS sudah diatur dengan benar
  const { data: fullNeed, error: fetchError } = await supabase
    .from("needs")
    .select("*, users(nama)")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Supabase Error fetching full need:", fetchError);
    if (fetchError.code === 'PGRST116') {
      return NextResponse.json({ message: "Need not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "Failed to fetch need details." }, { status: 500 });
  }

  return NextResponse.json(fullNeed);
}

// PUT /api/needs/[id]
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { error, status } = await checkNeedAuthorization(supabase, id, user);
  if (error) {
    return NextResponse.json({ message: error }, { status });
  }

  try {
    const body = await req.json();
    const { is_verified } = body;

    const { data: updatedNeed, error: updateError } = await supabase
      .from("needs")
      .update({ is_verified })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Supabase Error updating need:", updateError);
      return NextResponse.json({ message: "Failed to update need." }, { status: 500 });
    }

    return NextResponse.json(updatedNeed);
  } catch (error) {
    console.error("API Error (PUT /api/needs/[id]):", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/needs/[id]
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { error, status } = await checkNeedOwnership(supabase, id, user.id);
  if (error) {
    return NextResponse.json({ message: error }, { status });
  }

  const { error: deleteError } = await supabase
    .from("needs")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("Supabase Error deleting need:", deleteError);
    return NextResponse.json({ message: "Failed to delete need." }, { status: 500 });
  }

  return NextResponse.json({ message: "Need deleted successfully." }, { status: 200 });
}