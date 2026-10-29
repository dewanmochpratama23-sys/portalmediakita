import React from 'react';

export default function Masthead({
  userRole,
  currentAuthor,
  currentView,
  setCurrentView,
  activeCategory,
  setActiveCategory,
  onOpenLogin,
  onLogout
}) {
  const categories = [
    "Semua",
    "Kebijakan Publik",
    "Ekonomi Rakyat",
    "Liputan Daerah",
    "Opini & Esai",
    "Riset & Sains",
    "Seni & Budaya"
  ];

  return (
    <header className="border-b border-stone-900/10 bg-[#FAF8F5]">
      {/* Top Utility Bar */}
      <div className="border-b border-stone-200 bg-[#F5F2EB] text-[11px] text-stone-600 px-4 py-1.5 font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          <div className="flex items-center gap-3">
            <span className="font-bold text-stone-900 uppercase tracking-widest text-[10px]">Edisi Nasional</span>
            <span className="text-stone-300">|</span>
            <span>Kamis, 29 Oktober 2026</span>
            <span className="text-stone-300">|</span>
            <span className="flex items-center gap-1 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Jurnalisme Komunitas Terbuka
            </span>
          </div>

          {/* ============================================================== */}
          {/* ROLE-BASED NAVIGATION (TIDAK TERLIHAT OLEH PEMBACA BIASA!)     */}
          {/* ============================================================== */}
          
          {/* KONDISI 1: PEMBACA PUBLIK (DEFAULT) - BERSIH TOTAL TANPA TAB */}
          {userRole === 'reader' && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenLogin('contributor')}
                className="text-stone-800 hover:text-red-900 font-semibold transition"
              >
                Masuk Kontributor
              </button>
              <span className="text-stone-300">|</span>
              <span className="text-stone-600">Bagi Hasil 70% Penulis</span>
            </div>
          )}

          {/* KONDISI 2: JURNALIS / KONTRIBUTOR SUDAH LOGIN */}
          {userRole === 'contributor' && (
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-stone-200/90 p-0.5 rounded border border-stone-300 text-xs">
                <button
                  onClick={() => setCurrentView('portal')}
                  className={`px-2.5 py-1 rounded font-semibold transition ${
                    currentView === 'portal' ? 'bg-stone-900 text-[#FAF8F5]' : 'text-stone-700 hover:text-stone-950'
                  }`}
                >
                  Portal Berita
                </button>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-2.5 py-1 rounded font-semibold transition ${
                    currentView === 'dashboard' ? 'bg-stone-900 text-[#FAF8F5]' : 'text-stone-700 hover:text-stone-950'
                  }`}
                >
                  Dashboard Saya
                </button>
                <button
                  onClick={() => setCurrentView('editor')}
                  className={`px-2.5 py-1 rounded font-semibold transition ${
                    currentView === 'editor' ? 'bg-stone-900 text-[#FAF8F5]' : 'text-stone-700 hover:text-stone-950'
                  }`}
                >
                  + Tulis Naskah
                </button>
              </div>

              <span className="text-stone-300">|</span>
              <span className="font-bold text-stone-800">{currentAuthor ? currentAuthor.name : 'Akun Penulis'}</span>
              <button
                onClick={onLogout}
                className="text-red-800 hover:underline font-semibold text-[10px] ml-1"
              >
                (Keluar)
              </button>
            </div>
          )}

          {/* KONDISI 3: SUPER ADMIN / MEJA REDAKSI (HANYA ANDA) */}
          {userRole === 'admin' && (
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-red-950 text-white p-0.5 rounded border border-red-900 text-xs">
                <button
                  onClick={() => setCurrentView('portal')}
                  className={`px-2.5 py-1 rounded font-semibold transition ${
                    currentView === 'portal' ? 'bg-stone-900 text-white' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  Lihat Beranda
                </button>
                <button
                  onClick={() => setCurrentView('admin')}
                  className={`px-2.5 py-1 rounded font-semibold transition ${
                    currentView === 'admin' ? 'bg-red-800 text-white' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  🛡️ Panel Redaksi
                </button>
                <button
                  onClick={() => setCurrentView('editor')}
                  className={`px-2.5 py-1 rounded font-semibold transition ${
                    currentView === 'editor' ? 'bg-stone-900 text-white' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  Editor
                </button>
              </div>

              <span className="bg-red-100 text-red-900 font-bold px-1.5 py-0.5 rounded text-[10px]">
                Super Admin
              </span>
              <button
                onClick={onLogout}
                className="text-stone-600 hover:text-stone-900 underline text-[10px]"
              >
                Keluar
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Main Newspaper Masthead */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-4">
        
        <div className="flex items-center justify-between border-b border-stone-300 pb-3 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">Vol. IV — No. 128</span>
            <span className="text-stone-300">•</span>
            <span>Dikelola Bersama Penulis Warga</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Tombol Kirim Tulisan: Jika reader, buka login kontributor dulu! */}
            <button
              onClick={() => {
                if (userRole === 'reader') {
                  onOpenLogin('contributor');
                } else {
                  setCurrentView('editor');
                }
              }}
              className="bg-stone-900 text-[#FAF8F5] hover:bg-stone-800 font-semibold text-xs px-3.5 py-1.5 rounded transition"
            >
              + Kirim Tulisan Warga
            </button>
          </div>
        </div>

        <div className="py-5 text-center relative cursor-pointer" onClick={() => setCurrentView('portal')}>
          <div className="text-[11px] font-bold tracking-[0.25em] text-red-900 uppercase mb-1">
            Jurnalisme Warga &bull; Kolaborasi Publik &bull; Data Terbuka
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-black tracking-tight text-stone-950 uppercase leading-none">
            MediaKita
          </h1>
          <p className="font-serif italic text-stone-600 text-xs sm:text-sm mt-1.5">
            Wadah Suara Independen, Liputan Komunitas, dan Rujukan Harian Warga
          </p>
        </div>

        {/* Primary Editorial Navigation Bar */}
        <nav className="border-t-2 border-b border-stone-900 mt-2 py-2.5 flex items-center justify-between text-xs font-bold tracking-wide uppercase text-stone-800 overflow-x-auto">
          <div className="flex items-center gap-6 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setCurrentView('portal');
                }}
                className={`transition ${
                  activeCategory === cat ? 'text-red-900 underline underline-offset-4 decoration-2' : 'hover:text-red-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2 pl-4 text-stone-500 font-normal normal-case">
            <input
              type="text"
              placeholder="Cari topik atau nama penulis..."
              className="bg-stone-100 border border-stone-300 rounded px-2.5 py-1 text-xs text-stone-800 focus:outline-none focus:border-stone-800 w-48"
            />
          </div>
        </nav>

      </div>
    </header>
  );
}
