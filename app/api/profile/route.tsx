// File: /app/api/profile/route.ts

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Handler untuk MENGAMBIL data profil
export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Ambil semua data dari tabel 'users' dan juga nama desa dari tabel 'desa'
  const { data: profile, error } = await supabase
    .from("users")
    .select(`
      id,
      email,
      nama,
      role,
      poin_komunitas,
      created_at,
      updated_at,
      phone_number,
      is_role_confirmed,
      bio,
      desa:desa_id ( nama_desa )
    `)
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Supabase GET Profile Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(profile);
}

// Handler untuk MEMPERBARUI data profil
export async function PUT(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { nama, phone_number, bio } = body;

    const updates: { [key: string]: any } = {};
    if (nama !== undefined) updates.nama = nama;
    if (phone_number !== undefined) updates.phone_number = phone_number;
    if (bio !== undefined) updates.bio = bio;

    if (Object.keys(updates).length === 0) {
        return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }
    
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Supabase PUT Profile Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}