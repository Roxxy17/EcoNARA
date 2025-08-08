// File: src/app/api/stock/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Pastikan variabel lingkungan ini ada di .env.local Anda
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Helper untuk mendapatkan profil pengguna dari token
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

// --- GET /api/stock ---
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ message: "Unauthorized: Missing token" }, { status: 401 });
  }
  const token = authHeader.replace("Bearer ", "");

  const { user, error: userError } = await getUserProfileFromToken(token);
  if (userError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Menggunakan tabel 'stock' dan relasi ke 'users'
  let stockQuery = supabaseAdmin.from("stock").select(`
    *,
    users ( nama )
  `);

  // Logika filter yang benar untuk Ketua
  if (user.role === "ketua") {
    if (!user.desa_id) {
      return NextResponse.json({ message: "Forbidden: Ketua tidak terasosiasi dengan desa." }, { status: 403 });
    }
    // 1. Dapatkan semua ID pengguna di desa yang sama
    const { data: usersInDesa, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('desa_id', user.desa_id);

    if (usersError) throw usersError;

    const userIdsInDesa = usersInDesa.map(u => u.id);
    
    // 2. Ambil stok hanya dari pengguna di desa tersebut
    stockQuery = stockQuery.in('user_id', userIdsInDesa);

  } else if (user.role === "warga") {
    // Warga hanya bisa melihat stok miliknya sendiri
    stockQuery = stockQuery.eq("user_id", user.id);
  } else if (user.role !== "admin") {
    // Jika bukan admin, ketua, atau warga, tolak akses
    return NextResponse.json({ message: "Forbidden: Insufficient role" }, { status: 403 });
  }
  // Admin akan melihat semua stok karena tidak ada filter yang diterapkan

  const { data: stockData, error: stockError } = await stockQuery;

  if (stockError) {
    console.error("GET /api/stock - Supabase Error:", stockError);
    return NextResponse.json({ message: "Failed to fetch stock" }, { status: 500 });
  }

  // Format data agar user_name muncul dengan benar
  const formattedData = stockData.map(item => ({
    ...item,
    user_name: item.users?.nama || "Tidak Dikenal",
    users: undefined // Hapus objek users yang bersarang
  }));

  return NextResponse.json(formattedData);
}

// --- POST /api/stock ---
export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const token = authHeader.replace("Bearer ", "");
  const { user, error: userError } = await getUserProfileFromToken(token);
  if (userError || !user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, category, quantity, unit, added_date } = body;
  if (!name || !quantity || !unit) return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  
  const { data: newStock, error } = await supabaseAdmin
    .from("stock") // <-- Menggunakan tabel 'stock'
    .insert({ name, category, quantity, unit, added_date, user_id: user.id })
    .select()
    .single();

  if (error) {
    console.error("POST /api/stock - Supabase Error:", error);
    return NextResponse.json({ message: "Failed to create stock" }, { status: 500 });
  }
  return NextResponse.json(newStock, { status: 201 });
}