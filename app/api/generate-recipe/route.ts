// src/app/api/generate-recipe/route.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse, type NextRequest } from "next/server";

// Inisialisasi model AI dengan kunci API dari environment variable
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

export async function POST(request: NextRequest) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const { ingredients } = await request.json();

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json(
        { error: "Bahan makanan tidak boleh kosong." },
        { status: 400 }
      );
    }

    // --- PERUBAHAN UTAMA DI SINI ---
    // Prompt diperbaiki untuk menghindari error sintaks.
    // Kita jelaskan kunci-kunci JSON yang dibutuhkan, bukan menempelkan strukturnya.
    const prompt = `
      Anda adalah seorang "AI Chef" ahli dalam gerakan "food rescue".
      Tugas Anda adalah membuat satu resep masakan yang kreatif, sederhana, dan lezat dari daftar bahan sisa yang diberikan.
      Bahan yang tersedia adalah: ${ingredients.join(", ")}.

      Berikan jawaban HANYA dalam format JSON yang valid, tanpa teks atau tanda backtick (\`) di luarnya.
      Pastikan JSON yang Anda berikan memiliki kunci-kunci berikut:
      - "title": (string) Nama resep yang menarik.
      - "description": (string) Deskripsi singkat dan menggugah selera, 1-2 kalimat.
      - "ingredients": (array of strings) Daftar bahan yang digunakan, boleh menambahkan 1-2 bahan umum seperti garam atau minyak.
      - "cookTime": (string) Estimasi waktu memasak, contoh: '20 menit'.
      - "difficulty": (string) Tingkat kesulitan, contoh: 'Mudah', 'Sedang', atau 'Sulit'.
      - "nutrition": (string) Info gizi singkat, contoh: 'Tinggi Serat'.
      - "steps": (array of strings) Langkah-langkah memasak yang jelas dan berurutan.

      Pastikan semua teks dalam JSON (termasuk title, description, dll) menggunakan Bahasa Indonesia yang baik.
    `;
    // --- AKHIR DARI PERUBAHAN ---

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Membersihkan output jika AI secara tidak sengaja menambahkan markdown
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    // Parsing teks JSON menjadi objek JavaScript
    const recipeJson = JSON.parse(cleanedText);

    return NextResponse.json(recipeJson);

  } catch (error) {
    console.error("Error saat generate resep:", error);
    return NextResponse.json(
      { error: "Maaf, AI Chef sedang sibuk. Silakan coba beberapa saat lagi." },
      { status: 500 }
    );
  }
}