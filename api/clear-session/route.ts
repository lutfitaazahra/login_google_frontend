import { NextResponse } from 'next/server';

const PUBLIC_BACKEND_URL = 'https://alamat-terowongan-kamu.localltunnel.me'; 

export async function GET(request: Request) {
  // Deteksi lokasi backend secara otomatis
  const hostname = request.headers.get('host') || '';
  const BACKEND_URL = hostname.includes('localhost') 
    ? 'http://localhost:5000' 
    : PUBLIC_BACKEND_URL;

  try {
    // 1. Tembak backend agar menghancurkan session-nya di sisi server
    await fetch(`${BACKEND_URL}/logout`, { method: 'GET' });
  } catch (err) {
    console.error("Backend logout failed or did not redirect", err);
  }

  // 2. Buat respon balik dan paksa hapus semua jenis cookie session dari browser secara instan
  const response = NextResponse.json({ success: true });
  response.cookies.set('connect.sid', '', { path: '/', expires: new Date(0) });
  response.cookies.delete('connect.sid');

  return response;
}