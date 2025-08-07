// File: src/app/api/stock/[id]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Pastikan variabel lingkungan ini terdefinisi di .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client admin untuk operasi yang memerlukan service role key (misalnya, bypass RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Helper function untuk mendapatkan user profile dan role dari token
async function getUserProfileFromToken(token: string) {
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    return { user: null, error: authError || new Error("User not found") };
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("users")
    .select("id, role, desa_id")
    .eq("id", user.id)
    .single();

  if (profileError) {
    return { user: null, error: profileError };
  }

  return { user: { ...user, ...profile }, error: null };
}

// --- PUT /api/stock/[id] ---
export async function PUT(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ message: "Unauthorized: Missing token" }, { status: 401 });
  }
  const token = authHeader.replace("Bearer ", "");

  const { user, error: userError } = await getUserProfileFromToken(token);
  if (userError || !user) {
    console.error("PUT /api/stock - Authentication error:", userError?.message);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Mengambil ID dari URL path
  const { pathname } = new URL(req.url);
  const stockId = pathname.split("/").pop(); // Mengambil bagian terakhir dari path
  if (!stockId) {
    return NextResponse.json({ message: "Stock ID is required" }, { status: 400 });
  }

  // Log ID yang diterima oleh server
  console.log("Server PUT: Attempting to update stock item with ID:", stockId);

  // Periksa apakah item stok ada dan user memiliki izin
  const { data: stockItem, error: stockFetchError } = await supabaseAdmin
    .from("stock")
    .select("user_id") // Ambil desa_id juga untuk pengecekan role ketua/admin
    .eq("id", stockId)
    .single();

  if (stockFetchError || !stockItem) {
    // Log error lebih detail, termasuk ID yang dicari
    console.error("PUT /api/stock - Stock item not found or fetch error:", stockFetchError?.message, "ID yang dicari:", stockId);
    return NextResponse.json({ message: "Stock item not found" }, { status: 404 });
  }

  const isOwner = stockItem.user_id === user.id;
  const isKetuaOrAdmin = (user.role === "ketua" || user.role === "admin");
  const isAuthorizedByDesa = isKetuaOrAdmin && user.desa_id === stockItem.desa_id;

  if (!isOwner && !isAuthorizedByDesa) {
    return NextResponse.json({ message: "Forbidden: Not authorized to update this stock" }, { status: 403 });
  }

  const body = await req.json();
  const { name, category, quantity, unit, added_date } = body;

  const { data: updatedStock, error: updateError } = await supabaseAdmin
    .from("stock")
    .update({
      name,
      category,
      quantity,
      unit,
      added_date,
      updated_at: new Date().toISOString(), // Tambahkan updated_at
    })
    .eq("id", stockId)
    .select()
    .single();

  if (updateError) {
    console.error("PUT /api/stock - Supabase Error updating stock:", updateError);
    return NextResponse.json({ message: "Failed to update stock" }, { status: 500 });
  }

  return NextResponse.json(updatedStock);
}

/// --- DELETE /api/stock/[id] ---
export async function DELETE(req: Request) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json({ message: "Unauthorized: Missing token" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");

    const { user, error: userError } = await getUserProfileFromToken(token);
    if (userError || !user) {
        console.error("DELETE /api/stock - Authentication error:", userError?.message);
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { pathname } = new URL(req.url);
    const stockId = pathname.split("/").pop();
    if (!stockId) {
        return NextResponse.json({ message: "Stock ID is required" }, { status: 400 });
    }

    // Log ID yang diterima oleh server
    console.log("Server DELETE: Attempting to delete stock item with ID:", stockId);

    // Ubah .single() menjadi .maybeSingle()
    const { data: stockItem, error: stockFetchError } = await supabaseAdmin
        .from("stock")
    .select("user_id")
        .eq("id", stockId)
        .maybeSingle(); // Perubahan ada di sini

    if (stockFetchError) {
        // Tangani error lain dari Supabase (misalnya, masalah koneksi)
        console.error("DELETE /api/stock - Supabase fetch error:", stockFetchError.message, "ID yang dicari:", stockId);
        return NextResponse.json({ message: "Failed to fetch stock item" }, { status: 500 });
    }

    if (!stockItem) {
        // Jika item tidak ditemukan, kembalikan 404
        console.error("DELETE /api/stock - Stock item not found. ID yang dicari:", stockId);
        return NextResponse.json({ message: "Stock item not found" }, { status: 404 });
    }

    const isOwner = stockItem.user_id === user.id;
    const isKetuaOrAdmin = (user.role === "ketua" || user.role === "admin");
    const isAuthorizedByDesa = isKetuaOrAdmin && user.desa_id === stockItem.desa_id;

    if (!isOwner && !isAuthorizedByDesa) {
        return NextResponse.json({ message: "Forbidden: Not authorized to delete this stock" }, { status: 403 });
    }

    const { error: deleteError } = await supabaseAdmin
        .from("stock")
        .delete()
        .eq("id", stockId);

    if (deleteError) {
        console.error("DELETE /api/stock - Supabase Error deleting stock:", deleteError);
        return NextResponse.json({ message: "Failed to delete stock" }, { status: 500 });
    }

    return NextResponse.json({ message: "Stock deleted successfully" });
}