import React from 'react';

export default function LeadStory({ article, onSelectArticle, userRole, onDeleteArticle }) {
  if (!article) return null;

  return (
    <article className="flex flex-col justify-between relative group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="bg-stone-900 text-[#FAF8F5] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
              Laporan Utama
            </span>
            <span className="text-red-900 font-bold text-xs uppercase tracking-wide">
              {article.category}
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-stone-500 text-xs">{article.publishedAt}</span>
          </div>

          {/* Tombol Hapus Khusus Admin / Founder (Hanya muncul jika sedang login sebagai Admin) */}
          {userRole === 'admin' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`ADMIN: Hapus artikel "${article.title}" dari portal?`)) {
                  onDeleteArticle && onDeleteArticle(article.id);
                }
              }}
              className="bg-red-800 hover:bg-red-900 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow transition"
              title="Khusus Founder: Hapus artikel ini"
            >
              🗑️ Hapus Artikel (Admin)
            </button>
          )}
        </div>

        <h2
          onClick={() => onSelectArticle && onSelectArticle(article)}
          className="font-serif text-2xl sm:text-4xl font-black text-stone-950 leading-tight hover:text-red-900 transition cursor-pointer"
        >
          {article.title}
        </h2>

        <div className="mt-4 overflow-hidden rounded border border-stone-300 bg-stone-200">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-80 sm:h-96 object-cover filter contrast-[1.05]"
          />
          <div className="p-2 text-[11px] text-stone-500 bg-[#F5F2EB] border-t border-stone-200 flex justify-between items-center">
            <span>Dokumentasi liputan warga. Data tervalidasi redaksi independen.</span>
            <span className="font-semibold text-stone-600">Foto: {article.author.name} / MediaKita</span>
          </div>
        </div>

        <p className="font-serif text-stone-800 text-base sm:text-lg leading-relaxed mt-4">
          <span className="font-bold text-stone-950 tracking-wider">MALANG — </span>
          {article.excerpt}
        </p>
      </div>

      <div className="mt-6 pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between text-xs text-stone-500">
        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-900">Oleh {article.author.name}</span>
          <span>&bull;</span>
          <span>{article.author.role}</span>
          <span>&bull;</span>
          <span>{article.readingTime}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-stone-700 font-semibold">{(article.views || 0).toLocaleString('id-ID')} Pembaca</span>
          <span>&bull;</span>
          <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded">
            Royalti Penulis: 70% Aktif
          </span>
        </div>
      </div>
    </article>
  );
}
