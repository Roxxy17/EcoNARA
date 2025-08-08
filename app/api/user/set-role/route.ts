// File: src/app/api/user/set-role/route.ts

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ambil 'role' dan 'desa_id' dari body
    const { role, desa_id } = await request.json();

    // Validasi peran
    const allowedRoles = ['Ketua', 'Warga'];
    if (!role || !allowedRoles.includes(role)) {
      return NextResponse.json({ error: 'Peran tidak valid.' }, { status: 400 });
    }

    // Validasi desa_id (harus ada dan harus berupa angka)
    if (!desa_id || typeof desa_id !== 'number') {
      return NextResponse.json({ error: 'Desa harus dipilih.' }, { status: 400 });
    }

    // Siapkan data untuk di-update
    const dataToUpdate = {
      role: role.toLowerCase() === 'ketua' ? 'ketua' : 'warga',
      desa_id: desa_id,
      is_role_confirmed: true
    };

    const { data, error } = await supabase
      .from('users')
      .update(dataToUpdate)
      .eq('id', session.user.id)
      .select('id, role, is_role_confirmed, desa_id')
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: 'Gagal memperbarui profil.', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Profil berhasil diperbarui!', user: data }, { status: 200 });

  } catch (err) {
    console.error('API Route Error:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}