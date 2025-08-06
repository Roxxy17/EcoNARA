// app/api/stock/route.ts
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

// --- GET /api/stock ---
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ message: "Unauthorized: Missing token" }, { status: 401 });
  }
  const token = authHeader.replace("Bearer ", "");

  const { user, error: userError } = await getUserProfileFromToken(token);
  if (userError || !user) {
    console.error("GET /api/stock - Authentication error:", userError?.message);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let stockQuery = supabaseAdmin.from("stock").select(`
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
  `);

  if (user.role === "ketua" || user.role === "admin") {
    if (user.desa_id) {
      stockQuery = stockQuery.eq("desa_id", user.desa_id);
    } else {
      console.warn("Ketua/Admin tanpa desa_id. Mengambil semua stok.");
    }
  } else if (user.role === "warga") {
    stockQuery = stockQuery.eq("user_id", user.id);
  } else {
    return NextResponse.json({ message: "Forbidden: Insufficient role" }, { status: 403 });
  }

  const { data: stockData, error: stockError } = await stockQuery;

  if (stockError) {
    console.error("GET /api/stock - Supabase Error fetching stock:", stockError);
    return NextResponse.json({ message: "Failed to fetch stock" }, { status: 500 });
  }

  const formattedData = stockData.map(item => ({
    ...item,
    user_name: item.users?.nama || "Tidak Dikenal",
    users: undefined
  }));

  return NextResponse.json(formattedData);
}

// --- POST /api/stock ---
export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ message: "Unauthorized: Missing token" }, { status: 401 });
  }
  const token = authHeader.replace("Bearer ", "");

  const { user, error: userError } = await getUserProfileFromToken(token);
  if (userError || !user) {
    console.error("POST /api/stock - Authentication error:", userError?.message);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== 'warga' && user.role !== 'ketua' && user.role !== 'admin') {
    return NextResponse.json({ message: "Forbidden: Insufficient role to add stock" }, { status: 403 });
  }

  const body = await req.json();
  const { name, category, quantity, unit, added_date } = body;

  if (!name || !quantity || !unit) {
    return NextResponse.json({ message: "Missing required fields: name, quantity, unit" }, { status: 400 });
  }
  
  const { data: newStock, error } = await supabaseAdmin
    .from("stock")
    .insert({
      name,
      category,
      quantity,
      unit,
      added_date,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("POST /api/stock - Supabase Error creating new stock:", error);
    return NextResponse.json({ message: "Failed to create new stock" }, { status: 500 });
  }

  return NextResponse.json(newStock, { status: 201 });
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

  const { pathname } = new URL(req.url);
  const stockId = pathname.split("/").pop();
  if (!stockId) {
    return NextResponse.json({ message: "Stock ID is required" }, { status: 400 });
  }

  const { data: stockItem, error: stockFetchError } = await supabaseAdmin
    .from("stock")
    .select("user_id")
    .eq("id", stockId)
    .single();

  if (stockFetchError || !stockItem) {
    console.error("PUT /api/stock - Stock item not found or fetch error:", stockFetchError?.message);
    return NextResponse.json({ message: "Stock item not found" }, { status: 404 });
  }

  const isOwner = stockItem.user_id === user.id;
  const isElevatedRole = user.role === "ketua" || user.role === "admin";
  if (!isOwner && !isElevatedRole) {
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
      updated_at: new Date().toISOString(),
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

// --- DELETE /api/stock/[id] ---
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

  const { data: stockItem, error: stockFetchError } = await supabaseAdmin
    .from("stock")
    .select("user_id")
    .eq("id", stockId)
    .single();

  if (stockFetchError || !stockItem) {
    console.error("DELETE /api/stock - Stock item not found or fetch error:", stockFetchError?.message);
    return NextResponse.json({ message: "Stock item not found" }, { status: 404 });
  }

  const isOwner = stockItem.user_id === user.id;
  const isElevatedRole = user.role === "ketua" || user.role === "admin";
  if (!isOwner && !isElevatedRole) {
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