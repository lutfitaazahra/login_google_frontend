import UploadForm from '../UploadForm'; // Sesuaikan lokasi filenya

export default function DashboardPage() {
  return (
    <div style={{ padding: '40px' }}>
      <h1>Selamat Datang di Dashboard</h1>
      <p>Anda berhasil login menggunakan Google.</p>
      
      {/* Tampilkan form upload di sini */}
      <UploadForm />
    </div>
  );
}