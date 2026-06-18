'use client';

import { useState } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

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
      setStatus({ type: 'loading', message: 'Sedang mengunggah...' });
      const response = await fetch(BACKEND_URL + '/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setStatus({ type: 'success', message: 'File berhasil disimpan.' });
        setFile(null);
      } else {
        setStatus({ type: 'error', message: data.error || 'Gagal mengunggah file.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Gagal terhubung ke server.' });
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      <h3 style={{ color: '#be185d', fontWeight: 700, textAlign: 'center' }}>Upload Hub</h3>
      <p style={{ color: '#f9a8d4', fontSize: 12, textAlign: 'center' }}>JPG, PNG, PDF - Maks 5MB</p>
      <form onSubmit={handleUpload}>
        <div style={{ border: '2px dashed #fbcfe8', borderRadius: 16, padding: 24, textAlign: 'center', margin: '12px 0', position: 'relative' }}>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
          />
          <p style={{ fontSize: 13, color: '#374151' }}>
            {file ? file.name : 'Seret berkas ke sini atau Pilih File'}
          </p>
          {!file && <p style={{ fontSize: 11, color: '#9ca3af' }}>Klik untuk menjelajahi komputer</p>}
        </div>
        <button
          type="submit"
          disabled={status.type === 'loading'}
          style={{ width: '100%', padding: '12px', borderRadius: 16, border: 'none', background: '#f472b6', color: 'white', fontWeight: 700, cursor: 'pointer' }}
        >
          {status.type === 'loading' ? 'Mengunggah...' : 'Mulai Unggah'}
        </button>
      </form>
      {status.message && (
        <p style={{ textAlign: 'center', fontSize: 12, marginTop: 8, color: status.type === 'success' ? 'green' : 'red' }}>
          {status.message}
        </p>
      )}
      <a
        href={BACKEND_URL + '/logout'}
        style={{ display: 'block', textAlign: 'center', fontSize: 12, color: '#f472b6', marginTop: 16 }}
      >
        Keluar dari Akun
      </a>
    </div>
  );
}
