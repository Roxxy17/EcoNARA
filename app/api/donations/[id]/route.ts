// app/api/donations/[id]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

// Helper untuk memeriksa kepemilikan
async function checkDonationOwnership(supabase: any, donationId: string, userId: string) {
  const { data, error } = await supabase
    .from("donations")
    .select("user_id")
    .eq("id", donationId)
    .single();
  
  if (error || !data) {
    return { error: "Donation not found or not authorized.", status: 404 };
  }
  
  if (data.user_id !== userId) {
    return { error: "Forbidden: Not authorized to access this donation.", status: 403 };
  }
  
  return { error: null, status: 200 };
}

// GET /api/donations/[id]
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  
  const { error, status } = await checkDonationOwnership(supabase, id, user.id);
  if (error) {
    return NextResponse.json({ message: error }, { status });
  }

  const { data: donation, error: dbError } = await supabase
    .from("donations")
    .select("*")
    .eq("id", id)
    .single();

  if (dbError) {
    console.error("Supabase Error fetching single donation:", dbError);
    return NextResponse.json({ message: "Failed to fetch donation." }, { status: 500 });
  }

  return NextResponse.json(donation);
}

// PUT /api/donations/[id]
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Penting: Logika otorisasi di sini.
  // Jika hanya pemilik donasi yang bisa mengubah, `checkDonationOwnership` sudah benar.
  // Namun, jika admin juga bisa mengubah status donasi orang lain, Anda perlu
  // menambahkan logika untuk memeriksa role admin di sini (misalnya, dari tabel `users` Anda).
  // Contoh:
  // const { data: profile, error: profileError } = await supabase.from('users').select('role').eq('id', user.id).single();
  // if (profileError || profile.role !== 'admin') {
  //   const { error, status } = await checkDonationOwnership(supabase, id, user.id);
  //   if (error) {
  //     return NextResponse.json({ message: error }, { status });
  //   }
  // }

  // Untuk saat ini, kita tetap menggunakan checkDonationOwnership yang ada,
  // yang berarti hanya pemilik donasi yang bisa mengubahnya.
  const { error, status } = await checkDonationOwnership(supabase, id, user.id);
  if (error) {
    return NextResponse.json({ message: error }, { status });
  }


  try {
    const body = await req.json();
    // Pastikan untuk menerima `status` dan `need_request_id` dari body
    const { item_name, description, status: newStatus, need_request_id } = body; 

    const updateFields: { 
      item_name?: string; 
      description?: string; 
      status?: string; 
      need_request_id?: number | null; 
    } = {};

    if (item_name !== undefined) updateFields.item_name = item_name;
    if (description !== undefined) updateFields.description = description;
    // Tambahkan `newStatus` ke updateFields
    if (newStatus !== undefined) updateFields.status = newStatus; 
    // Tambahkan `need_request_id` ke updateFields
    if (need_request_id !== undefined) updateFields.need_request_id = need_request_id; 

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ message: "No fields to update." }, { status: 400 });
    }

    const { data: updatedDonation, error: dbError } = await supabase
      .from("donations")
      .update(updateFields)
      .eq("id", id)
      .select(`
        *,
        users (
          nama,
          phone_number,
          email
        )
      `) // Pastikan juga select data user setelah update
      .single();

    if (dbError) {
      console.error("Supabase Error updating donation:", dbError);
      return NextResponse.json({ message: "Failed to update donation." }, { status: 500 });
    }

    return NextResponse.json(updatedDonation);
  } catch (error) {
    console.error("API Error updating donation:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


// DELETE /api/donations/[id]
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { error, status } = await checkDonationOwnership(supabase, id, user.id);
  if (error) {
    return NextResponse.json({ message: error }, { status });
  }

  const { error: dbError } = await supabase
    .from("donations")
    .delete()
    .eq("id", id);
  
  if (dbError) {
    console.error("Supabase Error deleting donation:", dbError);
    return NextResponse.json({ message: "Failed to delete donation." }, { status: 500 });
  }

  return NextResponse.json({ message: "Donation deleted successfully." }, { status: 200 });
}