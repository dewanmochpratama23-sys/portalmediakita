import React from 'react';

export default function SidebarDispatch({ articles, onWriteArticle, onSelectArticle }) {
  // Ambil artikel kategori opini/kebijakan
  const opinionArticles = articles.filter(a => !a.isLead).slice(0, 3);

  return (
    <aside className="space-y-6 lg:border-l lg:border-stone-300 lg:pl-8">
      {/* Box: Program Komunitas Penulis */}
      <div className="border border-stone-900 p-5 bg-[#F5F2EB]">
        <div className="text-[10px] font-bold uppercase tracking-widest text-red-900 mb-1">
          Ruang Partisipasi Warga
        </div>
        <h3 className="font-serif text-lg font-bold text-stone-950 leading-snug">
          Punya Liputan Daerah atau Opini Kritis?
        </h3>
        <p className="text-xs text-stone-700 mt-2 leading-relaxed">
          MediaKita membuka pintu seluas-luasnya bagi mahasiswa, akademisi, dan warga untuk mempublikasikan naskah dengan skema <strong className="text-stone-900">Bagi Hasil 70% dari penayangan iklan</strong>.
        </p>
        <div className="mt-4 pt-3 border-t border-stone-300 flex items-center justify-between">
          <button
            onClick={onWriteArticle}
            className="text-xs font-bold text-red-900 hover:text-stone-950 flex items-center gap-1"
          >
            Tulis Naskah Anda &rarr;
          </button>
          <span className="text-[10px] text-stone-500">Kurasi 2 Jam</span>
        </div>
      </div>

      {/* Section: Catatan & Esai Warga */}
      <div>
        <div className="border-b-2 border-stone-900 pb-1 mb-4 flex justify-between items-baseline">
          <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-stone-950">
            Opini &amp; Catatan Warga
          </h4>
          <span className="text-[10px] text-stone-500">Suara Komunitas</span>
        </div>

        <div className="space-y-4">
          {opinionArticles.map((art) => (
            <div key={art.id} className="border-b border-stone-200 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-900">
                {art.category}
              </span>
              <h5
                onClick={() => onSelectArticle && onSelectArticle(art)}
                className="font-serif text-sm font-bold text-stone-900 hover:text-red-900 cursor-pointer mt-0.5 leading-snug"
              >
                {art.title}
              </h5>
              <div className="text-[11px] text-stone-500 mt-1">
                {art.author.name} &bull; {art.publishedAt}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sponsor Lokal / Iklan UMKM (Editorial Sponsorship Box) */}
      <div className="border border-stone-300 p-4 bg-white text-center">
        <span className="text-[9px] uppercase tracking-widest text-stone-400 block mb-1">
          Pariwara Terverifikasi • UMKM
        </span>
        <div className="p-3 bg-stone-50 border border-stone-200 text-left">
          <div className="text-[10px] font-bold uppercase text-stone-500">
            Kemitraan UMKM Daerah
          </div>
          <h6 className="font-bold text-xs text-stone-900 mt-1">
            Kopi Robusta Lereng Semeru &bull; Petani Organik
          </h6>
          <p className="text-[11px] text-stone-600 mt-1">
            Diproduksi tanpa perantara tengkulak. Diskon 20% bagi pembaca setia MediaKita.
          </p>
          <a href="#" className="mt-2 inline-block text-[10px] font-bold text-red-900 underline">
            Kunjungi Etalase Petani &rarr;
          </a>
        </div>
      </div>
    </aside>
  );
}
