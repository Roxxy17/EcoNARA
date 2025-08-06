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

// PUT /api/profile
export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized: No token" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    // Gunakan supabaseAdmin untuk memverifikasi token di sisi server
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      console.error("Authentication Error (PUT profile):", authError?.message || "User not found");
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const contentType = req.headers.get("content-type");

    let nama: string | undefined;
    let email: string | undefined; // Email biasanya diupdate melalui auth.updateUser, bukan langsung di tabel users
    let avatar_url: string | undefined; // Jika Anda ingin menyimpan URL avatar di tabel users

    // Handle multipart/form-data (untuk upload file seperti avatar)
    if (contentType?.includes("multipart/form-data")) {
      const formData = await req.formData();
      const avatarFile = formData.get("avatar") as File;
      nama = formData.get("nama") as string || undefined;
      email = formData.get("email") as string || undefined; // Jika ingin mengizinkan update email via form data

      if (avatarFile && avatarFile.size > 0) {
        const path = `avatars/${user.id}/${avatarFile.name}`; // Path lebih spesifik per user
        avatar_url = await uploadToStorage(avatarFile, path, "smartpantry"); // Ganti 'smartpantry' dengan nama bucket Anda
      }
    }
    // Handle application/json
    else if (contentType?.includes("application/json")) {
      const body = await req.json();
      nama = body.nama || undefined;
      email = body.email || undefined;
      avatar_url = body.avatar_url || undefined; // Jika URL avatar dikirim langsung
    }
    // Unsupported content type
    else {
      return NextResponse.json({ error: "Unsupported Content-Type" }, { status: 415 });
    }

    const updateData: { [key: string]: any } = { updated_at: new Date().toISOString() };
    if (nama !== undefined) updateData.nama = nama;
    // Jika Anda ingin mengizinkan update email dari sini, pastikan
    // Supabase Auth juga diupdate atau kelola implikasinya.
    // Biasanya, email di tabel 'users' adalah salinan dari auth.users.email
    if (email !== undefined) updateData.email = email;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url; // Pastikan kolom ini ada di tabel public.users

    // Update tabel 'public.users'
    const { data: updatedProfile, error: updateError } = await supabaseAdmin
      .from("users")
      .update(updateData)
      .eq("id", user.id)
      .select("id, email, nama, role, desa_id, poin_komunitas, created_at, updated_at") // Pilih kolom yang diperbarui untuk dikembalikan
      .single();

    if (updateError) {
      console.error("Supabase Error updating user profile:", updateError);
      return NextResponse.json({ error: updateError.message || "Failed to update user profile." }, { status: 500 });
    }

    return NextResponse.json(updatedProfile, { status: 200 });

  } catch (err: any) {
    console.error("Unexpected error in PUT /api/profile:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
