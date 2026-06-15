'use client';

import { useEffect, useState } from 'react';

// Interface untuk menampung data dari Google
interface GoogleUser {
  displayName?: string;
  emails?: { value: string }[];
  photos?: { value: string }[];
}

export default function DashboardPage() {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  // 1. Ambil Data Profil Google Asli dari Backend
  useEffect(() => {
    fetch('http://localhost:5000/auth/user', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn && data.user) {
          setUser(data.user);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Gagal memuat profil:', err);
        setLoading(false);
      });
  }, []);

  // 2. Fungsi Menangani Perubahan File
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus({ type: 'idle', message: '' });
    }
  };

  // 3. Fungsi Mengirim File ke Backend
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
      
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include', 
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: '🎉 Selesai! File berhasil disimpan.' });
        setFile(null); // Reset input file setelah sukses
      } else {
        setStatus({ type: 'error', message: data.error || 'Gagal mengunggah file.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Gagal terhubung ke server backend.' });
    }
  };

  // Variabel bantuan untuk menampilkan data profil Google
  const userParam = {
    name: user?.displayName || "Pengguna Google",
    email: user?.emails?.[0]?.value || "user@gmail.com",
    avatar: user?.photos?.[0]?.value || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100"
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff0f5] flex items-center justify-center">
        <p className="text-pink-600 font-bold animate-pulse">Memuat halaman dashboard...</p>
      </div>
    );
  }

  return (
    <>
      {/* ANIMASI WARNA BACKGROUND GERAK (SOFT PINK) */}
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
        
        {/* CONTAINER UTAMA (ALL IN ONE DI TENGAH) */}
        <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-pink-100 rounded-3xl p-8 shadow-xl shadow-pink-100/30 space-y-6">
          
          {/* ==========================================
              BAGIAN 1: PROFIL GOOGLE ASLI 
             ========================================== */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-3">
              <img 
                src={userParam.avatar} 
                alt="Google Avatar" 
                className="w-20 h-20 rounded-full border-4 border-pink-200 object-cover shadow-md"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 text-xl">👋</span>
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              Selamat Datang di Dashboard
            </h1>
            <p className="text-sm font-medium text-pink-600 mt-0.5">
              {userParam.name}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {userParam.email}
            </p>
          </div>

          {/* GARIS PEMBATAS ESTETIK */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-pink-200 to-transparent" />

          {/* ==========================================
              BAGIAN 2: UPLOAD HUB (FORM UNGHAH)
             ========================================== */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-md font-bold text-pink-700">Upload Hub ✨</h3>
              <p className="text-[11px] text-pink-400">Mendukung Gambar (JPG, PNG) & PDF (Maks 5MB)</p>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              {/* Dropzone Input Area */}
              <div className="relative border-2 border-dashed border-pink-200 hover:border-pink-400 rounded-2xl p-6 text-center bg-pink-50/20 hover:bg-pink-50/50 transition-all cursor-pointer">
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
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

              {/* Tombol Kirim Berkas */}
              <button 
                type="submit" 
                disabled={status.type === 'loading'}
                className={`w-full py-3 px-4 rounded-2xl text-sm font-bold text-white shadow-md transition-all active:scale-[0.99]
                  ${status.type === 'loading' 
                    ? 'bg-slate-300 shadow-none cursor-not-allowed' 
                    : 'bg-gradient-to-r from-pink-400 to-rose-400 hover:opacity-90 shadow-pink-200'
                  }`}
              >
                {status.type === 'loading' ? 'Mengunggah...' : 'Mulai Unggah ✨'}
              </button>
            </form>

            {/* Notifikasi Status Berhasil / Gagal */}
            {status.message && (
              <div className={`p-3 rounded-2xl text-xs font-bold text-center border animate-pulse
                ${status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : ''}
                ${status.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-700' : ''}
                ${status.type === 'loading' ? 'bg-pink-50 border-pink-100 text-pink-700' : ''}
              `}>
                {status.message}
              </div>
            )}
          </div>

        </div>

        {/* LINK LOGOUT KECIL DI BAWAH KOTAK */}
        <a 
          href="http://localhost:5000/logout" 
          className="text-xs font-bold text-pink-400 hover:text-rose-500 transition-colors underline"
        >
          Keluar dari Akun
        </a>

      </div>
    </>
  );
}