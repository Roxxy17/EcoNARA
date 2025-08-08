// File: src/app/api/admin/desa/route.ts

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Handler untuk metode POST
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Langkah 1: Verifikasi sesi pengguna
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Anda harus login.' }, { status: 401 });
    }

    // Langkah 2: Ambil profil pengguna untuk memeriksa perannya (role)
    // Catatan: Saya berasumsi tabel profil Anda bernama 'profiles' dan memiliki kolom 'role'.
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    // Langkah 3: Pastikan hanya admin yang bisa mengakses
    if (!userProfile || userProfile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Akses hanya untuk admin.' }, { status: 403 });
    }

    // Langkah 4: Ambil data dari body request
    const { nama_desa, kecamatan, provinsi } = await request.json();

    // Validasi input dasar
    if (!nama_desa) {
      return NextResponse.json({ error: 'Field "nama_desa" tidak boleh kosong.' }, { status: 400 });
    }

    // Langkah 5: Masukkan data baru ke tabel 'desa'
    const { data: newDesa, error: insertError } = await supabase
      .from('desa')
      .insert({
        nama_desa,
        kecamatan, // Boleh null
        provinsi,  // Boleh null
      })
      .select() // Mengambil data yang baru saja dibuat
      .single();

    if (insertError) {
      // Jika terjadi error dari Supabase, kirim sebagai response
      console.error('Supabase insert error:', insertError);
      return NextResponse.json({ error: 'Gagal menyimpan data ke database.', details: insertError.message }, { status: 500 });
    }

    // Langkah 6: Kirim response sukses beserta data yang baru dibuat
    return NextResponse.json({ message: 'Desa berhasil ditambahkan!', data: newDesa }, { status: 201 });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}