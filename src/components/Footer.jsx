import React from 'react';

export default function Footer({ userRole, onNavigate, onOpenLogin, onOpenPedoman }) {
  return (
    <footer className="border-t-2 border-stone-900 bg-[#F5F2EB] text-stone-700 text-xs mt-16 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Main Grid Footer (Mirip Struktur Kompasiana & Media Nasional Profesional) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-stone-300">
          
          {/* Kolom 1: Brand Logo, Sertifikasi, & Social Media (4 Kolom) */}
          <div className="md:col-span-4 space-y-4">
            <div>
              <h4 className="font-serif font-black text-2xl tracking-tight text-stone-950 uppercase leading-none">
                MediaKita<span className="text-red-900">.</span>
              </h4>
              <p className="font-serif italic text-[11px] text-stone-600 mt-1">
                Jurnalisme Warga, Liputan Komunitas, &amp; Rujukan Publik
              </p>
            </div>

            <p className="text-[11px] text-stone-600 leading-relaxed pr-4">
              Platform media digital berbasis komunitas yang memberikan ruang bebas berekspresi bagi akademisi, mahasiswa, dan jurnalis warga dengan sistem bagi hasil royalti iklan 70%.
            </p>

            {/* Standar & Kepatuhan Etika Media */}
            <div className="pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                Kepatuhan Platform Digital:
              </span>
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <span className="bg-stone-200 text-stone-800 px-2 py-0.5 rounded border border-stone-300 font-semibold">
                  ✓ Safe Harbor UGC Menkominfo
                </span>
                <span className="bg-stone-200 text-stone-800 px-2 py-0.5 rounded border border-stone-300 font-semibold">
                  ✓ Pedoman Media Siber
                </span>
              </div>
            </div>

            {/* Ikon Media Sosial MediaKita */}
            <div className="pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
                Temukan MediaKita di:
              </span>
              <div className="flex items-center gap-2.5">
                {/* YouTube */}
                <a href="#" className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs hover:opacity-90 shadow-sm" title="YouTube MediaKita">
                  ▶
                </a>
                {/* Instagram */}
                <a href="#" className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs hover:opacity-90 shadow-sm" title="Instagram MediaKita">
                  📷
                </a>
                {/* Facebook */}
                <a href="#" className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs hover:opacity-90 shadow-sm" title="Facebook MediaKita">
                  f
                </a>
                {/* X / Twitter */}
                <a href="#" className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs hover:opacity-90 shadow-sm" title="X MediaKita">
                  𝕏
                </a>
              </div>
            </div>
          </div>

          {/* Kolom 2: Tentang & Legalitas (2 Kolom) */}
          <div className="md:col-span-2 space-y-2">
            <h6 className="font-bold text-[11px] text-stone-950 uppercase tracking-wider mb-3">
              Tentang &amp; Bantuan
            </h6>
            <ul className="space-y-1.5 text-[11px] text-stone-600">
              <li>
                <button onClick={onOpenPedoman} className="hover:text-stone-950 text-left">
                  Tentang MediaKita
                </button>
              </li>
              <li>
                <button onClick={onOpenPedoman} className="hover:text-stone-950 text-left font-semibold text-stone-900">
                  Syarat &amp; Ketentuan
                </button>
              </li>
              <li>
                <button onClick={onOpenPedoman} className="hover:text-stone-950 text-left">
                  Pedoman Media Siber
                </button>
              </li>
              <li>
                <button onClick={onOpenPedoman} className="hover:text-stone-950 text-left">
                  Kebijakan Privasi
                </button>
              </li>
              <li>
                <a href="mailto:redaksi@mediakita.id" className="hover:text-stone-950">
                  Bantuan &amp; Kontak Redaksi
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Program Komunitas & Royalti (3 Kolom - Seperti K-Rewards Kompasiana) */}
          <div className="md:col-span-3 space-y-2">
            <h6 className="font-bold text-[11px] text-stone-950 uppercase tracking-wider mb-3">
              Program Penulis
            </h6>
            <ul className="space-y-1.5 text-[11px] text-stone-600">
              <li>
                <span className="text-red-900 font-bold flex items-center gap-1">
                  <span>💰</span> Program Royalti 70% (K-Rewards)
                </span>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (userRole === 'reader') onOpenLogin('contributor');
                    else onNavigate('editor');
                  }}
                  className="hover:text-stone-950 text-left font-medium"
                >
                  Kirim Naskah Baru
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (userRole === 'reader') onOpenLogin('contributor');
                    else onNavigate('dashboard');
                  }}
                  className="hover:text-stone-950 text-left"
                >
                  Dashboard &amp; Cek Pendapatan
                </button>
              </li>
              <li>
                <span className="hover:text-stone-950 cursor-pointer">
                  Kurasi Naskah Pilihan Redaksi
                </span>
              </li>
              <li>
                <span className="hover:text-stone-950 cursor-pointer">
                  Kemitraan Promosi UMKM Daerah
                </span>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Rubrik Berita Warga (3 Kolom) */}
          <div className="md:col-span-3 space-y-2">
            <h6 className="font-bold text-[11px] text-stone-950 uppercase tracking-wider mb-3">
              Rubrik Liputan
            </h6>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] text-stone-600">
              <span className="hover:text-stone-950 cursor-pointer">Kebijakan Publik</span>
              <span className="hover:text-stone-950 cursor-pointer">Ekonomi Rakyat</span>
              <span className="hover:text-stone-950 cursor-pointer">Liputan Daerah</span>
              <span className="hover:text-stone-950 cursor-pointer">Opini Warga</span>
              <span className="hover:text-stone-950 cursor-pointer">Riset &amp; Sains</span>
              <span className="hover:text-stone-950 cursor-pointer">Seni &amp; Budaya</span>
              <span className="hover:text-stone-950 cursor-pointer">Gaya Hidup</span>
              <span className="hover:text-stone-950 cursor-pointer">Living Assistance</span>
            </div>
            
            <div className="pt-3 text-[10px] text-stone-500">
              <span className="font-bold text-stone-700 block">Surel Pengaduan &amp; Hak Jawab:</span>
              <span className="font-mono text-stone-900">redaksi@mediakita.id</span>
            </div>
          </div>

        </div>

        {/* Sub-Footer Bawah (Copyright & Akses Founder) */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-stone-500">
          <div>
            &copy; 2026 <strong>MediaKita.com</strong>. Hak cipta naskah dan opini berada pada masing-masing kontributor warga.
            
            {/* Pintu Akses Rahasia Khusus Founder */}
            <button
              onClick={() => onOpenLogin('admin')}
              title="Akses Rahasia Pengelola Platform"
              className="ml-3 text-stone-400 hover:text-stone-800 transition"
            >
              [Pintu Redaksi]
            </button>
          </div>

          <div className="flex items-center gap-4 text-[10px]">
            <span>Didukung Supabase &bull; Vercel CDN</span>
            <span className="text-stone-300">|</span>
            <span>Pintasan Founder: <kbd className="border border-stone-300 px-1 bg-white font-mono">Ctrl + Shift + A</kbd></span>
          </div>
        </div>

      </div>
    </footer>
  );
}
