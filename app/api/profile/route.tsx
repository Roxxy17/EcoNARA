// app/api/profile/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Pastikan variabel lingkungan ini terdefinisi
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client untuk operasi yang terikat dengan RLS (Row Level Security) pengguna
function createSupabaseClientWithToken(token: string) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}

// Client admin untuk operasi yang memerlukan service role key (misalnya, upload ke storage, bypass RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Helper untuk upload file ke Supabase Storage
async function uploadToStorage(file: File, path: string, bucket: string) {
  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true, // Akan menimpa jika file dengan nama yang sama sudah ada
    });

  if (error) {
    console.error("Supabase Storage Upload Error:", error);
    throw new Error(error.message);
  }

  const { publicUrl } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(path).data;

  return publicUrl;
}

// GET /api/profile
export async function GET(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ message: "Missing authorization token" }, { status: 401 });
  }

  // Gunakan client dengan token pengguna untuk mengakses data profil mereka sendiri
  const supabase = createSupabaseClientWithToken(token);

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Authentication Error (GET profile):", userError?.message || "User not found");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Ambil user ID dari query parameter (jika ada, meskipun user.id lebih aman)
  const { searchParams } = new URL(req.url);
  const userIdFromQuery = searchParams.get("userId");
  const targetUserId = userIdFromQuery || user.id; // Prioritaskan user.id dari token

  if (targetUserId !== user.id) {
    // Ini adalah lapisan keamanan tambahan: pengguna hanya boleh mengambil profilnya sendiri
    // Jika Anda ingin admin bisa melihat profil lain, Anda perlu logika otorisasi di sini.
    return NextResponse.json({ message: "Forbidden: Cannot access other user's profile" }, { status: 403 });
  }

  // Ambil data dari tabel 'public.users' sesuai skema yang diberikan
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("id, email, nama, role, desa_id, poin_komunitas, created_at, updated_at")
    .eq("id", targetUserId)
    .single();

  if (profileError) {
    if (profileError.code === 'PGRST116') { // Supabase specific code for "no rows found"
        return NextResponse.json({ message: "User profile not found in database." }, { status: 404 });
    }
    console.error("Supabase Error fetching user profile:", profileError);
    return NextResponse.json(
      { message: profileError.message || "Failed to fetch user profile." },
      { status: 500 }
    );
  }

  return NextResponse.json(profile);
}
export async function PUT(req) {
  const supabase = createRouteHandlerClient({ cookies });
  
  // Dapatkan user dari sesi yang ada di cookies
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Jika tidak ada user, tolak permintaan
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { nama } = body;

    // Lakukan update data di database
    const { data, error } = await supabase
      .from("users")
      .update({ nama })
      .eq("id", user.id)
      .select()
      .single();

    // Tangani error dari Supabase
    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Tangani jika data tidak ditemukan (misal, user_id tidak valid)
    if (!data) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Kembalikan respons sukses
    return NextResponse.json(data);
  } catch (error) {
    // Tangani error parsing JSON atau error tak terduga
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}