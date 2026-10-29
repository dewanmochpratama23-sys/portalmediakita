import React, { useState } from 'react';

export default function LoginModal({ isOpen, onClose, targetRole, onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  
  // State Login
  const [password, setPassword] = useState('');
  
  // State Register Penulis Baru
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [expertise, setExpertise] = useState('Ekonomi Rakyat & UMKM');
  const [regPassword, setRegPassword] = useState('');
  
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const isAdmin = targetRole === 'admin';

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isAdmin) {
      if (password === 'admin123' || password === 'owner') {
        onLoginSuccess('admin', { name: "Pemilik Platform", role: "Super Admin Redaksi" });
        setPassword('');
        onClose();
      } else {
        setError('Kata sandi Redaksi salah! (Default: admin123)');
      }
    } else {
      // Login penulis umum
      if (password === 'penulis123' || password === 'jurnalis' || password === '') {
        onLoginSuccess('contributor', {
          name: "Budi Setiawan, M.Sc.",
          role: "Kontributor Warga",
          expertise: "Kebijakan Publik & Transportasi Perkotaan",
          idNumber: "MK-2026-084",
          verified: false,
          isKtpVerified: false
        });
        setPassword('');
        onClose();
      } else {
        setError('Kata sandi Kontributor salah! (Default: penulis123)');
      }
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim()) {
      setError('Nama lengkap dan email wajib diisi!');
      return;
    }

    // Buat profil penulis baru secara dinamis
    const randomId = Math.floor(100 + Math.random() * 900);
    const newAuthorProfile = {
      name: fullName.trim(),
      role: "Kontributor Warga",
      expertise: expertise,
      idNumber: `MK-2026-${randomId}`,
      verified: false,
      isKtpVerified: false,
      email: email.trim(),
      avatar: `https://images.unsplash.com/photo-${1530000000000 + randomId}?w=100&auto=format&fit=crop&q=80`
    };

    onLoginSuccess('contributor', newAuthorProfile);
    alert(`Selamat bergabung di MediaKita, ${fullName}!\nAkun Anda telah aktif dengan ID: MK-2026-${randomId}.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm p-4">
      <div className="bg-[#FAF8F5] border border-stone-400 max-w-sm w-full p-6 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-500 hover:text-stone-900 text-sm font-bold"
        >
          ✕
        </button>

        {/* Title */}
        <div className="text-center mb-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-red-900 mb-1">
            {isAdmin ? 'Akses Khusus Founder' : 'Gerbang Komunitas Penulis'}
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-950">
            {isAdmin ? 'Masuk Meja Redaksi' : mode === 'login' ? 'Masuk Akun Penulis' : 'Pendaftaran Penulis Baru'}
          </h3>
          <p className="text-xs text-stone-600 mt-1">
            {isAdmin
              ? 'Halaman terbatas hanya untuk pemilik platform dan kurator redaksi.'
              : mode === 'login'
              ? 'Masuk ke ruang kerja penulis Anda.'
              : 'Daftar gratis untuk mulai menulis & menikmati bagi hasil 70%.'}
          </p>
        </div>

        {/* Tab Switcher untuk Kontributor (Masuk vs Daftar Baru) */}
        {!isAdmin && (
          <div className="grid grid-cols-2 gap-1 bg-stone-200 p-0.5 rounded border border-stone-300 mb-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`py-1.5 rounded transition ${
                mode === 'login' ? 'bg-stone-900 text-[#FAF8F5]' : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              Sudah Punya Akun
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              className={`py-1.5 rounded transition ${
                mode === 'register' ? 'bg-stone-900 text-[#FAF8F5]' : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              Daftar Penulis Baru
            </button>
          </div>
        )}

        {/* FORM 1: LOGIN (ADMIN / PENULIS LAMA) */}
        {(isAdmin || mode === 'login') && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                {isAdmin ? 'PIN / Kunci Rahasia Admin' : 'Kata Sandi Penulis'}
              </label>
              <input
                type="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isAdmin ? 'Ketik admin123' : 'Ketik penulis123 (atau langsung Enter)'}
                className="w-full border border-stone-300 bg-white p-2.5 text-stone-900 focus:outline-none focus:border-stone-900 font-mono text-sm"
              />
              {error && (
                <p className="text-red-700 text-[11px] font-semibold mt-1.5">{error}</p>
              )}
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full bg-stone-900 text-[#FAF8F5] py-2.5 font-bold hover:bg-stone-800 transition"
              >
                {isAdmin ? 'Buka Meja Redaksi' : 'Masuk Workspace Penulis'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full border border-stone-300 text-stone-600 py-1.5 font-semibold hover:bg-stone-100"
              >
                Batal
              </button>
            </div>

            <div className="pt-2 border-t border-stone-200 text-center text-[10px] text-stone-500">
              {isAdmin ? (
                <span>Petunjuk uji coba PIN: <strong className="text-stone-800">admin123</strong></span>
              ) : (
                <span>Petunjuk akun demo: <strong className="text-stone-800">penulis123</strong></span>
              )}
            </div>
          </form>
        )}

        {/* FORM 2: PENDAFTARAN PENULIS BARU (REGISTER) */}
        {!isAdmin && mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-700 mb-0.5">
                Nama Lengkap &amp; Gelar
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Siti Rahmawati, S.Sos."
                className="w-full border border-stone-300 bg-white p-2 text-stone-900 focus:outline-none focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-700 mb-0.5">
                Alamat Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="emailanda@gmail.com"
                className="w-full border border-stone-300 bg-white p-2 text-stone-900 focus:outline-none focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-700 mb-0.5">
                Bidang / Minat Liputan
              </label>
              <select
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                className="w-full border border-stone-300 bg-white p-2 text-stone-800 focus:outline-none"
              >
                <option>Kebijakan Publik &amp; Hukum</option>
                <option>Ekonomi Rakyat &amp; UMKM</option>
                <option>Liputan Daerah &amp; Komunitas</option>
                <option>Opini &amp; Esai Bebas</option>
                <option>Riset, Teknologi, &amp; Kampus</option>
                <option>Lingkungan Hidup</option>
                <option>Seni &amp; Budaya</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-700 mb-0.5">
                Kata Sandi Baru
              </label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full border border-stone-300 bg-white p-2 text-stone-900 focus:outline-none focus:border-stone-900 font-mono text-sm"
              />
            </div>

            {error && (
              <p className="text-red-700 text-[11px] font-semibold">{error}</p>
            )}

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full bg-red-900 hover:bg-red-950 text-[#FAF8F5] py-2.5 font-bold transition shadow"
              >
                Daftar Jadi Kontributor (Royalti 70%)
              </button>
            </div>

            <p className="text-[10px] text-stone-500 text-center leading-tight pt-1">
              Dengan mendaftar, Anda menyetujui Pedoman Media Siber &amp; Pakta Integritas MediaKita.
            </p>
          </form>
        )}

      </div>
    </div>
  );
}
