// app/api/my-recipes/route.js
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    // Dapatkan sesi pengguna secara aman di server
    const { data: { session } } = await supabase.auth.getSession();

    // Jika tidak ada sesi (user tidak login), kembalikan array kosong
    if (!session) {
      return NextResponse.json([], { status: 200 });
    }

    // Ambil SEMUA kolom detail resep dari database
    const { data, error } = await supabase
      .from('resep')
      .select('id, title, description, created_at, ingredients, cook_time, difficulty, nutrition, cara_pembuatan')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false }); // Urutkan dari yang terbaru

    if (error) {
      throw error;
    }

    // Kirim data resep sebagai respons
    return NextResponse.json(data);

  } catch (error) {
    console.error("Gagal mengambil resep pengguna:", error.message);
    return NextResponse.json({ error: 'Gagal mengambil resep.' }, { status: 500 });
  }
}