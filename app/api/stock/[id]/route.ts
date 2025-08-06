import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Pastikan variabel lingkungan ini terdefinisi di .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
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

// --- GET /api/stock/[id] ---
// Mengambil satu item stok berdasarkan ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ message: "Unauthorized: Missing token" }, { status: 401 });
  }
  const token = authHeader.replace("Bearer ", "");

  const { user, error: userError } = await getUserProfileFromToken(token);
  if (userError || !user) {
    console.error("GET /api/stock/[id] - Authentication error:", userError?.message);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const stockId = params.id;

  // Query untuk mendapatkan item stok tunggal dan data pengguna yang berelasi
  const { data: stockItem, error: stockError } = await supabaseAdmin
    .from("stock")
    .select(`
      id,
      name,
      category,
      quantity,
      unit,
      added_date,
      created_at,
      user_id,
      users (
        nama
      )
    `)
    .eq("id", stockId)
    .single();

  if (stockError || !stockItem) {
    console.error("GET /api/stock/[id] - Supabase Error fetching stock:", stockError?.message);
    return NextResponse.json({ message: "Stock item not found" }, { status: 404 });
  }

  // Periksa otorisasi: apakah pengguna adalah pemilik stok atau ketua/admin
  const isOwner = stockItem.user_id === user.id;
  const isElevatedRole = user.role === "ketua" || user.role === "admin";
  if (!isOwner && !isElevatedRole) {
    return NextResponse.json({ message: "Forbidden: Not authorized to view this stock" }, { status: 403 });
  }
  
  // Format data untuk menyertakan user_name langsung
  const formattedData = {
    ...stockItem,
    user_name: stockItem.users?.nama || "Tidak Dikenal",
    users: undefined // Hapus objek users mentah dari respons
  };

  return NextResponse.json(formattedData);
}