// app/api/save-recipe/route.js
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
  // Dapatkan data resep dari body permintaan
  const recipeData = await request.json();
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    // 1. Dapatkan sesi pengguna secara aman di server
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Tidak terotentikasi. Silakan login terlebih dahulu.' }, { status: 401 });
    }

    // 2. Validasi data yang masuk
    if (!recipeData.title || !recipeData.steps || !recipeData.ingredients) {
      return NextResponse.json({ error: 'Data resep tidak lengkap.' }, { status: 400 });
    }

    // 3. Siapkan data lengkap untuk dimasukkan ke database
    // CATATAN: Pastikan tabel 'resep' Anda memiliki kolom-kolom ini.
    const recipeToInsert = {
      user_id: session.user.id,
      title: recipeData.title,
      description: recipeData.description,
      ingredients: recipeData.ingredients,   // Menyimpan array bahan (kolom: jsonb)
      cook_time: recipeData.cookTime,        // Menyimpan waktu masak (kolom: text)
      difficulty: recipeData.difficulty,     // Menyimpan tingkat kesulitan (kolom: text)
      nutrition: recipeData.nutrition,       // Menyimpan info nutrisi (kolom: text)
      cara_pembuatan: recipeData.steps,      // Menyimpan langkah-langkah (kolom: jsonb)
    };

    // 4. Masukkan data ke tabel 'resep'
    const { data, error } = await supabase.from('resep').insert([recipeToInsert]).select().single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error; // Lempar error untuk ditangkap di blok catch
    }

    // 5. Kirim kembali respons sukses dengan data yang baru disimpan
    return NextResponse.json({ message: 'Resep berhasil disimpan!', data }, { status: 201 });

  } catch (error) {
    console.error("Gagal menyimpan resep:", error.message);
    return NextResponse.json({ error: 'Terjadi kesalahan di server saat menyimpan resep.' }, { status: 500 });
  }
}