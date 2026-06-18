'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';

interface GoogleUser {
  displayName?: string;
  emails?: { value: string }[];
  photos?: { value: string }[];
}

// =========================================================================
// 🌐 KONFIGURASI ALAMAT BACKEND (OTOMATIS / DINAMIS)
// =========================================================================
const PUBLIC_BACKEND_URL = 'https://alamat-terowongan-kamu.localltunnel.me'; 

const BACKEND_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : PUBLIC_BACKEND_URL;

function DashboardContent() {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  useEffect(() => {
    fetch(`${BACKEND_URL}/auth/user`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        // Jika session di backend ternyata sudah habis, langsung tendang ke /login
        if (!data.loggedIn) {
          window.location.href = '/login';
          return;
        }
        if (data.user) setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus({ type: 'idle', message: '' });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatus({ type: 'error', message: 'Silakan pilih file terlebih dahulu!' });
      return;
    }
    const formData = new FormData();
    formData.append('myFile', file);
    try {
      setStatus({ type: 'loading', message: 'Sedang mengunggah berkas...' });
      
      const response = await fetch(`${BACKEND_URL}/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setStatus({ type: 'success', message: '🎉 Selesai! File berhasil disimpan.' });
        setFile(null);
      } else {
        setStatus({ type: 'error', message: data.error || 'Gagal mengunggah file.' });
      }
    } catch {
      setStatus({ type: 'error', message: 'Gagal terhubung ke server backend.' });
    }
  };

  // 🚪 FUNGSI LOGOUT (SOLUSI TOTAL)
  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Panggil endpoint logout backend untuk menghapus session cookie di sana
      await fetch(`${BACKEND_URL}/logout`, { credentials: 'include', method: 'GET' });
    } catch (error) {
      console.error("Gagal menghubungi backend untuk logout:", error);
    } finally {
      // 2. Bersihkan state data user di frontend
      setUser(null);
      
      // 3. PAKSA browser pindah secara fisik ke halaman login pink kamu (/login)
      window.location.href = '/login';
    }
  };

  const userParam = {
    name: user?.displayName || 'Pengguna Google',
    email: user?.emails?.[0]?.value || 'user@gmail.com',
    avatar: user?.photos?.[0]?.value || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff0f5] flex items-center justify-center">
        <p className="text-pink-600 font-bold animate-pulse">Memproses Keluar...</p>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-soft-pink {
          background: linear-gradient(-45deg, #fff0f5, #ffe4e1, #fff5ee, #f3e5f5);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
      `}} />
      <div className="min-h-screen animate-soft-pink font-sans flex flex-col items-center justify-center p-6 space-y-6">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-pink-100 rounded-3xl p-8 shadow-xl shadow-pink-100/30 space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative mb-1">
              <img src={userParam.avatar} alt="Google Avatar"
                className="w-20 h-20 rounded-full border-4 border-pink-200 object-cover shadow-md"
                referrerPolicy="no-referrer" />
              <span className="absolute bottom-0 right-0 text-xl animate-bounce">👋</span>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-500 bg-rose-50/80 px-3 py-1.5 rounded-full border border-pink-100/60 shadow-sm animate-pulse">
              ✨ Sistem Terautentikasi
            </span>
            <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r bg-clip-text text-transparent from-slate-800 via-pink-700 to-rose-600">
              Selamat Datang di Dashboard
            </h1>
            <div className="space-y-0.5">
              <p className="text-base font-extrabold text-slate-800">{userParam.name}</p>
              <p className="text-xs font-medium text-slate-400">{userParam.email}</p>
            </div>
            <p className="text-[11px] font-medium text-slate-500 max-w-xs leading-relaxed pt-1 border-t border-pink-100/40 w-full mt-2">
              Anda berhasil masuk menggunakan akun <span className="font-bold text-pink-600 underline decoration-pink-300 decoration-wavy">Google</span>. Semua fitur unggah kini telah aktif sepenuhnya!
            </p>
          </div>
          <div className="h-[1px] bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-md font-bold text-pink-700">Upload Hub ✨</h3>
              <p className="text-[11px] text-pink-400">Mendukung Gambar (JPG, PNG) & PDF (Maks 5MB)</p>
            </div>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="relative border-2 border-dashed border-pink-200 hover:border-pink-400 rounded-2xl p-6 text-center bg-pink-50/20 hover:bg-pink-50/50 transition-all cursor-pointer">
                <input type="file" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="space-y-2 pointer-events-none">
                  <span className="text-3xl block text-pink-400">☁️</span>
                  <div className="text-xs font-bold text-slate-700">
                    {file ? (
                      <span className="text-pink-600 bg-pink-50 px-2 py-1 rounded-md block truncate max-w-[250px] mx-auto">
                        📂 {file.name}
                      </span>
                    ) : (
                      <span>Seret berkas ke sini atau <span className="text-pink-500 underline">Pilih File</span></span>
                    )}
                  </div>
                  {!file && <p className="text-[10px] text-slate-400">Klik untuk menjelajahi komputer</p>}
                </div>
              </div>
              <button type="submit" disabled={status.type === 'loading'}
                className={`w-full py-3 px-4 rounded-2xl text-sm font-bold text-white shadow-md transition-all active:scale-[0.99]
                  ${status.type === 'loading' ? 'bg-slate-300 shadow-none cursor-not-allowed' : 'bg-gradient-to-r from-pink-400 to-rose-400 hover:opacity-90 shadow-pink-200'}`}>
                {status.type === 'loading' ? 'Mengunggah...' : 'Mulai Unggah ✨'}
              </button>
            </form>
            {status.message && (
              <div className={`p-3 rounded-2xl text-xs font-bold text-center border animate-pulse
                ${status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : ''}
                ${status.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-700' : ''}
                ${status.type === 'loading' ? 'bg-pink-50 border-pink-100 text-pink-700' : ''}`}>
                {status.message}
              </div>
            )}
          </div>
        </div>
        
        <a href="#" onClick={handleLogout}
          className="text-xs font-bold text-pink-400 hover:text-rose-500 transition-colors underline">
          Keluar dari Akun
        </a>
      </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fff0f5] flex items-center justify-center">
        <p className="text-pink-600 font-bold animate-pulse">Memuat...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}