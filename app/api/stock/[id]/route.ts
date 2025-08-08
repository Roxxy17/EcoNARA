// File: src/app/api/stock/[id]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

async function getUserProfileFromToken(token: string) {
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return { user: null, error: authError };
  const { data: profile, error: profileError } = await supabaseAdmin.from("users").select("id, role, desa_id").eq("id", user.id).single();
  if (profileError) return { user: null, error: profileError };
  return { user: { ...user, ...profile }, error: null };
}

// Helper untuk otorisasi akses
async function authorizeAccess(user: any, stockId: string) {
    const { data: stockItem, error } = await supabaseAdmin
        .from("stock") // <-- Menggunakan tabel 'stock'
        .select("user_id")
        .eq("id", stockId)
        .single();

    if (error || !stockItem) {
        return { authorized: false, reason: "Stock item not found" };
    }
    if (stockItem.user_id === user.id) return { authorized: true }; // Pemilik
    if (user.role === 'admin') return { authorized: true }; // Admin

    if (user.role === 'ketua' && user.desa_id) {
        const { data: ownerProfile } = await supabaseAdmin.from("users").select("desa_id").eq("id", stockItem.user_id).single();
        if (ownerProfile && ownerProfile.desa_id === user.desa_id) {
            return { authorized: true }; // Ketua dari desa yang sama
        }
    }
    return { authorized: false, reason: "Forbidden" };
}

// --- PUT /api/stock/[id] ---
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const stockId = params.id;
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const token = authHeader.replace("Bearer ", "");
  const { user, error: userError } = await getUserProfileFromToken(token);
  if (userError || !user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { authorized, reason } = await authorizeAccess(user, stockId);
  if (!authorized) {
      return NextResponse.json({ message: reason }, { status: reason === "Stock item not found" ? 404 : 403 });
  }

  const body = await req.json();
  const { name, category, quantity, unit, added_date } = body;

  const { data: updatedStock, error: updateError } = await supabaseAdmin
    .from("stock") // <-- Menggunakan tabel 'stock'
    .update({ name, category, quantity, unit, added_date, updated_at: new Date().toISOString() })
    .eq("id", stockId)
    .select()
    .single();

  if (updateError) {
    console.error("PUT /api/stock/[id] - Supabase Error:", updateError);
    return NextResponse.json({ message: "Failed to update stock" }, { status: 500 });
  }
  return NextResponse.json(updatedStock);
}

// --- DELETE /api/stock/[id] ---
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const stockId = params.id;
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const token = authHeader.replace("Bearer ", "");
  const { user, error: userError } = await getUserProfileFromToken(token);
  if (userError || !user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { authorized, reason } = await authorizeAccess(user, stockId);
  if (!authorized) {
      return NextResponse.json({ message: reason }, { status: reason === "Stock item not found" ? 404 : 403 });
  }

  const { error: deleteError } = await supabaseAdmin
    .from("stock") // <-- Menggunakan tabel 'stock'
    .delete()
    .eq("id", stockId);

  if (deleteError) {
    console.error("DELETE /api/stock/[id] - Supabase Error:", deleteError);
    return NextResponse.json({ message: "Failed to delete stock" }, { status: 500 });
  }
  return NextResponse.json({ message: "Stock deleted successfully" });
}