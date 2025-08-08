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

    const { role } = await request.json();
    const allowedRoles = ['Ketua', 'Warga']; // Enum Anda menggunakan 'ketua', sesuaikan jika perlu
    if (!role || !allowedRoles.includes(role)) {
      return NextResponse.json({ error: 'Peran tidak valid.' }, { status: 400 });
    }

    // Update peran DAN set is_role_confirmed menjadi TRUE
    const { data, error } = await supabase
      .from('users')
      .update({
        role: role.toLowerCase(), // Simpan sebagai 'ketua' atau 'warga' (huruf kecil)
        is_role_confirmed: true
      })
      .eq('id', session.user.id)
      .select('id, role, is_role_confirmed')
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: 'Gagal memperbarui peran.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Peran berhasil diperbarui!', user: data }, { status: 200 });

  } catch (err) {
    console.error('API Route Error:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}