import React from 'react';

export default function NewsGrid({ articles, onSelectArticle, userRole, onDeleteArticle }) {
  const gridArticles = articles.filter(a => !a.isLead);

  return (
    <div className="pt-8">
      <div className="border-b-2 border-stone-900 pb-2 mb-6 flex justify-between items-end">
        <h3 className="font-serif text-xl font-bold text-stone-950 uppercase tracking-tight">
          Liputan Khusus &amp; Warta Daerah
        </h3>
        <span className="text-xs text-stone-500">Jurnalisme Kolaboratif</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gridArticles.map((article) => (
          <article
            key={article.id}
            className="border border-stone-300 bg-white p-4 flex flex-col justify-between relative group hover:border-stone-500 transition"
          >
            <div>
              <div className="h-44 overflow-hidden mb-3 bg-stone-200 relative">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover filter contrast-[1.05]"
                />
                {/* Tombol Hapus Cepat Khusus Admin */}
                {userRole === 'admin' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`ADMIN: Hapus artikel "${article.title}"?`)) {
                        onDeleteArticle && onDeleteArticle(article.id);
                      }
                    }}
                    className="absolute top-2 right-2 bg-red-800 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow opacity-90 hover:opacity-100"
                    title="Hapus artikel ini"
                  >
                    🗑️ Hapus (Admin)
                  </button>
                )}
              </div>

              <span className="text-[10px] font-bold text-red-900 uppercase tracking-wider">
                {article.category}
              </span>
              <h4
                onClick={() => onSelectArticle && onSelectArticle(article)}
                className="font-serif text-base font-bold text-stone-950 mt-1 leading-snug hover:text-red-900 cursor-pointer"
              >
                {article.title}
              </h4>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between text-[11px] text-stone-500">
              <span className="font-medium text-stone-700">{article.author.name}</span>
              <span>{article.views.toLocaleString()} pembaca</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
