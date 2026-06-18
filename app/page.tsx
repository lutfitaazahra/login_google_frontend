"use client";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function LoginPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #fce4ec 0%, #ffeef5 50%, #fce4ec 100%)" }}>
      <div style={{ background: "white", borderRadius: "24px", padding: "2.5rem 2rem", maxWidth: "400px", width: "100%", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "inline-block", background: "#fce4ec", borderRadius: "20px", padding: "4px 14px", marginBottom: "1rem" }}>
          <span style={{ fontSize: "12px", color: "#c2185b", fontWeight: 500 }}>✨ SISTEM AUTENTIKASI</span>
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a2e", margin: "0 0 0.5rem" }}>Selamat Datang!</h1>
        <p style={{ fontSize: "14px", color: "#888", margin: "0 0 2rem" }}>Masuk untuk mengakses semua fitur unggah.</p>
        <hr style={{ border: "none", borderTop: "1px solid #f0f0f0", marginBottom: "1.5rem" }} />
        <p style={{ fontSize: "13px", color: "#888", marginBottom: "1rem" }}>Masuk menggunakan akun Google kamu</p>
        <a href={BACKEND_URL + "/auth/google"} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "12px 20px", borderRadius: "12px", border: "1.5px solid #e0e0e0", background: "white", cursor: "pointer", fontSize: "15px", fontWeight: 500, color: "#333", textDecoration: "none" }}>
          <svg width="20" height="20" viewBox="0 0 48 48"><path d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.9z" fill="#FFC107"/><path d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" fill="#FF3D00"/><path d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" fill="#4CAF50"/><path d="M43.6 20.1H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.7-.4-3.9z" fill="#1976D2"/></svg>
          Sign in with Google
        </a>
        <p style={{ fontSize: "12px", color: "#bbb", marginTop: "1.5rem" }}>Dengan masuk, kamu menyetujui <span style={{ color: "#e91e8c" }}>Syarat &amp; Ketentuan</span> kami.</p>
      </div>
    </div>
  );
}
