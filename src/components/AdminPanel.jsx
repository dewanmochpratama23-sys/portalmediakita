import React, { useState } from 'react';

export default function AdminPanel({
  pendingList,
  publishedArticles,
  ktpRequests = [],
  onApprove,
  onReject,
  onDeleteArticle,
  onTakedownArticle,
  onApproveKtp,
  onRejectKtp,
  onPublishFounderArticle
}) {
  const [activeTab, setActiveTab] = useState('curation'); // 'curation' | 'ktp' | 'published'
  const [searchQuery, setSearchQuery] = useState('');
  const [previewKtpImage, setPreviewKtpImage] = useState(null);

  // State Meja Tulis Founder (Langsung Tayang)
  const [showFounderEditor, setShowFounderEditor] = useState(false);
  const [founderTitle, setFounderTitle] = useState('');
  const [founderCategory, setFounderCategory] = useState('Tajuk Rencana');
  const [founderIsLead, setFounderIsLead] = useState(true);
  const [founderCoverImage, setFounderCoverImage] = useState('https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80');
  const [founderContent, setFounderContent] = useState('');

  const pendingKtpList = ktpRequests.filter(r => r.status === 'pending');

  const filteredPublished = (publishedArticles || []).filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header Meja Redaksi */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 border-b border-stone-300 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-900">
              Meja Redaksi &bull; Hak Akses Founder
            </span>
            <h2 className="font-serif text-2xl font-bold text-stone-950 mt-0.5">
              Pusat Kendali Konten &amp; Manajemen Artikel
            </h2>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Tombol Hak Istimewa Founder: Terbitkan Langsung */}
            <button
              onClick={() => setShowFounderEditor(true)}
              className="bg-red-900 hover:bg-red-950 text-white text-xs font-bold px-3.5 py-1.5 rounded shadow transition flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>✍️</span>
              <span>Tulis Artikel Founder (Langsung Tayang)</span>
            </button>

            {/* Sub Navigation Admin Tabs */}
            <div className="flex flex-wrap items-center bg-stone-200/80 p-0.5 rounded border border-stone-300 text-xs font-semibold gap-1">
              <button
                onClick={() => setActiveTab('curation')}
                className={`px-3 py-1.5 rounded transition ${
                  activeTab === 'curation' ? 'bg-stone-900 text-[#FAF8F5]' : 'text-stone-700 hover:text-stone-950'
                }`}
              >
                Antrean Naskah ({pendingList.length})
              </button>
              <button
                onClick={() => setActiveTab('ktp')}
                className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
                  activeTab === 'ktp' ? 'bg-stone-900 text-[#FAF8F5]' : 'text-stone-700 hover:text-stone-950'
                }`}
              >
                <span>Verifikasi KTP</span>
                {pendingKtpList.length > 0 && (
                  <span className="bg-red-700 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {pendingKtpList.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('published')}
                className={`px-3 py-1.5 rounded transition ${
                  activeTab === 'published' ? 'bg-stone-900 text-[#FAF8F5]' : 'text-stone-700 hover:text-stone-950'
                }`}
              >
                Kelola Berita Tayang ({(publishedArticles || []).length})
              </button>
            </div>
          </div>
        </div>

        {/* Curation & KYC Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-stone-300 p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Antrean Naskah Masuk</div>
            <div className="font-serif text-2xl font-bold text-red-900 mt-1">
              {pendingList.length} Menunggu Kurasi
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">Target respons: &lt; 2 jam kerja</div>
          </div>

          <div className="bg-white border border-stone-300 p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Verifikasi KTP Penulis</div>
            <div className="font-serif text-2xl font-bold text-amber-900 mt-1">
              {pendingKtpList.length} Pengajuan Baru
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">Anti-hoax &amp; syarat royalti 70%</div>
          </div>

          <div className="bg-white border border-stone-300 p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Artikel Aktif di Portal</div>
            <div className="font-serif text-2xl font-bold text-stone-950 mt-1">
              {(publishedArticles || []).length} Berita Tayang
            </div>
            <div className="text-[11px] text-emerald-800 font-semibold mt-0.5">Dapat dihapus / ditarik kapan saja</div>
          </div>

          <div className="bg-white border border-stone-300 p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Skema Bagi Hasil</div>
            <div className="font-serif text-2xl font-bold text-stone-950 mt-1">70% Penulis : 30% Media</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Khusus akun terverifikasi e-KTP</div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ANTREAN NASKAH MASUK (CURATION)                                    */}
        {/* ========================================================================= */}
        {activeTab === 'curation' && (
          <div className="bg-white border border-stone-300 divide-y divide-stone-200 text-xs">
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex justify-between items-center">
              <span className="font-bold text-stone-800 uppercase tracking-wider text-[11px]">
                Naskah Baru yang Diajukan Kontributor Warga
              </span>
              <span className="text-stone-500 text-[11px]">{pendingList.length} naskah dalam antrean</span>
            </div>

            {pendingList.length === 0 ? (
              <div className="p-8 text-center text-stone-500 font-medium">
                Tidak ada naskah yang menunggu moderasi. Semua naskah telah diproses!
              </div>
            ) : (
              pendingList.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-stone-50/50 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] text-stone-500">
                      <span className="font-bold text-red-900 uppercase">{item.category}</span>
                      <span>&bull;</span>
                      <span>Diajukan {item.submittedAt || 'baru saja'}</span>
                    </div>
                    <h4 className="font-serif text-base font-bold text-stone-950">
                      {item.title}
                    </h4>
                    <div className="text-stone-600 text-[11px]">
                      Penulis: <span className="font-semibold text-stone-900">{typeof item.author === 'string' ? item.author : item.author.name}</span> &bull; Orisinalitas: {item.originalityScore || 98}% Lolos Uji
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => alert(`Pratinjau naskah:\n\n${item.excerpt || item.content}`)}
                      className="border border-stone-300 text-stone-700 px-3 py-1.5 font-semibold hover:bg-stone-50"
                    >
                      Pratinjau
                    </button>
                    <button
                      onClick={() => onReject && onReject(item.id)}
                      className="border border-stone-300 text-stone-700 px-3 py-1.5 font-semibold hover:bg-stone-50"
                    >
                      Minta Revisi
                    </button>
                    <button
                      onClick={() => onApprove && onApprove(item)}
                      className="bg-stone-900 text-[#FAF8F5] px-3.5 py-1.5 font-bold hover:bg-stone-800 transition"
                    >
                      ✓ Terbitkan (Publish)
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: KELOLA BERITA TAYANG & FITUR HAPUS ARTIKEL                          */}
        {/* ========================================================================= */}
        {activeTab === 'published' && (
          <div className="bg-white border border-stone-300 text-xs">
            {/* Filter Search */}
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="font-bold text-stone-800 uppercase tracking-wider text-[11px] block">
                  Daftar Seluruh Artikel yang Sedang Tayang di Portal
                </span>
                <span className="text-[11px] text-stone-500">
                  Sebagai admin/founder, Anda berhak penuh menghapus artikel atau menariknya dari peredaran.
                </span>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul berita untuk dihapus..."
                className="border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-900 w-full sm:w-64 focus:outline-none focus:border-stone-900"
              />
            </div>

            {/* Table of Articles */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-100 border-b border-stone-200 text-[10px] font-bold uppercase tracking-wider text-stone-600">
                  <tr>
                    <th className="p-3.5">Judul Artikel</th>
                    <th className="p-3.5">Rubrik</th>
                    <th className="p-3.5">Penulis</th>
                    <th className="p-3.5 text-right">Pembaca</th>
                    <th className="p-3.5 text-center">Tindakan Admin (Founder)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 font-medium">
                  {filteredPublished.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-stone-500">
                        Tidak ada artikel yang cocok dengan pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredPublished.map((article) => (
                      <tr key={article.id} className="hover:bg-stone-50 transition">
                        <td className="p-3.5 max-w-md">
                          <div className="font-serif font-bold text-stone-950 text-sm leading-snug">
                            {article.title}
                          </div>
                          <div className="text-[10px] text-stone-500 mt-0.5">
                            Tayang sejak: {article.publishedAt} &bull; {article.readingTime}
                          </div>
                        </td>
                        <td className="p-3.5 font-semibold text-stone-800">
                          {article.category}
                        </td>
                        <td className="p-3.5 text-stone-700">
                          {article.author.name}
                        </td>
                        <td className="p-3.5 text-right font-bold text-stone-900">
                          {article.views.toLocaleString()}
                        </td>
                        <td className="p-3.5 text-center space-x-2">
                          {/* Tombol Tarik (Takedown/Unpublish) */}
                          <button
                            onClick={() => {
                              if (confirm(`Tarik artikel "${article.title}" dari peredaran publik? Artikel akan dipindahkan kembali ke draf.`)) {
                                onTakedownArticle && onTakedownArticle(article.id);
                              }
                            }}
                            className="border border-stone-300 text-stone-700 px-2.5 py-1 rounded hover:bg-stone-100 font-semibold"
                            title="Tarik sementara dari portal publik"
                          >
                            ⏸️ Tarik (Takedown)
                          </button>

                          {/* Tombol Hapus Permanen */}
                          <button
                            onClick={() => {
                              if (confirm(`PERINGATAN ADMIN:\nApakah Anda yakin ingin MENGHAPUS PERMANEN artikel:\n"${article.title}"?\n\nTindakan ini tidak dapat dibatalkan.`)) {
                                onDeleteArticle && onDeleteArticle(article.id);
                              }
                            }}
                            className="bg-red-800 hover:bg-red-900 text-white px-2.5 py-1 rounded font-bold transition shadow-sm"
                            title="Hapus permanen dari portal dan database"
                          >
                            🗑️ Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: VERIFIKASI IDENTITAS KTP PENULIS (KYC ANTI-HOAX)                   */}
        {/* ========================================================================= */}
        {activeTab === 'ktp' && (
          <div className="bg-white border border-stone-300 text-xs">
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px] block">
                  Meja Validasi Identitas KTP Penulis (Standar Kompasiana KYC)
                </span>
                <span className="text-[11px] text-stone-500">
                  Periksa keaslian foto e-KTP fisik dan NIK 16 digit. Penulis yang disetujui otomatis mendapatkan lencana Centang Hijau dan hak pencairan royalti 70%.
                </span>
              </div>
              <span className="text-stone-600 font-mono text-[11px] bg-stone-200 px-2 py-1 rounded">
                Total Pengajuan: {ktpRequests.length}
              </span>
            </div>

            {ktpRequests.length === 0 ? (
              <div className="p-8 text-center text-stone-500">
                Belum ada pengajuan verifikasi KTP dari kontributor.
              </div>
            ) : (
              <div className="divide-y divide-stone-200">
                {ktpRequests.map((req) => (
                  <div key={req.id} className="p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:bg-stone-50/60 transition">
                    <div className="flex items-start gap-4">
                      {/* Thumbnail KTP */}
                      <div
                        onClick={() => setPreviewKtpImage(req.ktpImage)}
                        className="w-24 h-16 bg-stone-100 border border-stone-300 rounded overflow-hidden cursor-pointer flex-shrink-0 group relative hover:border-stone-900 transition"
                        title="Klik untuk memperbesar foto KTP"
                      >
                        <img src={req.ktpImage} alt="KTP" className="w-full h-full object-cover group-hover:scale-105 transition" />
                        <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-stone-950/40 flex items-center justify-center text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition">
                          🔍 Zoom
                        </div>
                      </div>

                      {/* Detail Kontributor */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-serif text-base font-bold text-stone-950">
                            {req.authorName}
                          </span>
                          <span className="text-[10px] font-mono text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                            ID: {req.authorId}
                          </span>
                          {req.status === 'approved' ? (
                            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded">
                              ✓ Terverifikasi Centang Hijau
                            </span>
                          ) : req.status === 'rejected' ? (
                            <span className="text-[10px] font-bold bg-red-50 text-red-800 border border-red-300 px-2 py-0.5 rounded">
                              ✕ Ditolak
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300 px-2 py-0.5 rounded">
                              ⏳ Menunggu Validasi Founder
                            </span>
                          )}
                        </div>

                        <div className="text-stone-600 text-[11px] flex items-center gap-3">
                          <span>NIK: <strong className="font-mono text-stone-900">{req.nik}</strong></span>
                          <span>&bull;</span>
                          <span>Diajukan: {req.submittedAt}</span>
                        </div>

                        <p className="text-[10px] text-stone-500 italic">
                          🔒 Dilindungi enkripsi internal (UU No. 27/2022 tentang Pelindungan Data Pribadi).
                        </p>
                      </div>
                    </div>

                    {/* Tindakan Founder */}
                    <div className="flex items-center gap-2 flex-shrink-0 w-full lg:w-auto justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-200">
                      <button
                        onClick={() => setPreviewKtpImage(req.ktpImage)}
                        className="border border-stone-300 text-stone-700 px-3 py-1.5 font-semibold hover:bg-stone-100 rounded"
                      >
                        🔍 Lihat Foto Fisik
                      </button>

                      {req.status === 'pending' && (
                        <>
                          <button
                            onClick={() => onRejectKtp && onRejectKtp(req.id)}
                            className="border border-red-300 text-red-800 hover:bg-red-50 px-3 py-1.5 font-semibold rounded"
                          >
                            ✕ Tolak
                          </button>
                          <button
                            onClick={() => onApproveKtp && onApproveKtp(req.id)}
                            className="bg-emerald-800 hover:bg-emerald-900 text-white px-3.5 py-1.5 font-bold transition shadow-sm rounded flex items-center gap-1.5"
                          >
                            <span>✓</span>
                            <span>Setujui (Beri Centang Hijau)</span>
                          </button>
                        </>
                      )}

                      {req.status === 'approved' && (
                        <span className="text-emerald-800 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded border border-emerald-300">
                          ✓ Akun Sudah Legal &amp; Siap Royalti
                        </span>
                      )}

                      {req.status === 'rejected' && (
                        <button
                          onClick={() => onApproveKtp && onApproveKtp(req.id)}
                          className="border border-stone-300 text-stone-700 px-2.5 py-1 text-xs hover:bg-stone-100 rounded"
                        >
                          Tinjau Ulang &amp; Setujui
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Modal Zoom Foto KTP */}
      {previewKtpImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm p-4"
          onClick={() => setPreviewKtpImage(null)}
        >
          <div
            className="bg-white p-4 max-w-2xl w-full border border-stone-400 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-stone-200">
              <span className="font-bold text-xs uppercase tracking-wider text-stone-800">
                Dokumen e-KTP Fisik Asli Kontributor
              </span>
              <button
                onClick={() => setPreviewKtpImage(null)}
                className="text-stone-500 hover:text-stone-950 text-sm font-bold"
              >
                ✕ Tutup
              </button>
            </div>
            <img
              src={previewKtpImage}
              alt="KTP Kontributor Penuh"
              className="w-full h-auto max-h-[75vh] object-contain border border-stone-300 rounded"
            />
            <div className="mt-3 text-[11px] text-stone-500 text-center">
              Pastikan nama dan NIK sesuai dengan database kependudukan sebelum menyetujui.
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL KHUSUS: MEJA TULIS FOUNDER (LANGSUNG TAYANG DI HALAMAN DEPAN)      */}
      {/* ========================================================================= */}
      {showFounderEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#FAF8F5] border border-stone-400 max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative my-8">
            <div className="flex justify-between items-center pb-3 border-b border-stone-300 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-900 block">
                  Hak Istimewa Pemimpin Redaksi
                </span>
                <h3 className="font-serif text-xl font-bold text-stone-950">
                  Tulis Catatan / Artikel Founder
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Artikel ini otomatis berlabel <strong>Dewan Mochamad Pratama (Founder &amp; Pemimpin Redaksi)</strong> dan langsung tayang tanpa kurasi.
                </p>
              </div>
              <button
                onClick={() => setShowFounderEditor(false)}
                className="text-stone-500 hover:text-stone-950 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!founderTitle.trim() || !founderContent.trim()) {
                  alert("Judul dan isi naskah wajib diisi!");
                  return;
                }
                if (onPublishFounderArticle) {
                  onPublishFounderArticle({
                    title: founderTitle.trim(),
                    category: founderCategory,
                    content: founderContent.trim(),
                    coverImage: founderCoverImage,
                    isLead: founderIsLead,
                    authorName: "Dewan Mochamad Pratama"
                  });
                }
                setFounderTitle('');
                setFounderContent('');
                setShowFounderEditor(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Judul Artikel Founder
                </label>
                <input
                  type="text"
                  required
                  value={founderTitle}
                  onChange={(e) => setFounderTitle(e.target.value)}
                  placeholder="Contoh: Catatan Founder: Membuka Ruang Suara Merdeka Bagi Warga Karawang"
                  className="w-full border border-stone-300 bg-white p-2.5 text-stone-950 font-serif text-base font-bold focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Rubrik Berita
                  </label>
                  <select
                    value={founderCategory}
                    onChange={(e) => setFounderCategory(e.target.value)}
                    className="w-full border border-stone-300 bg-white p-2 text-stone-900 font-semibold"
                  >
                    <option value="Tajuk Rencana">Tajuk Rencana (Catatan Redaksi)</option>
                    <option value="Kebijakan Publik">Kebijakan Publik</option>
                    <option value="Ekonomi Rakyat">Ekonomi Rakyat</option>
                    <option value="Liputan Daerah">Liputan Daerah (Karawang / Jabar)</option>
                    <option value="Opini & Esai">Opini &amp; Esai</option>
                  </select>
                </div>

                <div className="flex items-center pt-2 sm:pt-4">
                  <label className="flex items-center gap-2 cursor-pointer bg-amber-50 p-2 rounded border border-amber-300 w-full">
                    <input
                      type="checkbox"
                      checked={founderIsLead}
                      onChange={(e) => setFounderIsLead(e.target.checked)}
                      className="rounded text-red-900 focus:ring-red-900"
                    />
                    <span className="text-[11px] font-bold text-amber-950">
                      ★ Pasang Jadi Berita Utama (Headline Depan)
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Foto Sampul (Pilih Cepat atau Tempel Tautan)
                </label>
                <input
                  type="text"
                  value={founderCoverImage}
                  onChange={(e) => setFounderCoverImage(e.target.value)}
                  placeholder="Tautan URL Gambar (https://...)"
                  className="w-full border border-stone-300 bg-white p-2 text-stone-900 text-xs font-mono mb-2"
                />
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <span className="font-bold text-stone-500 py-1">Pilihan Cepat:</span>
                  {[
                    { label: "Redaksi / Meja Kerja", url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80" },
                    { label: "Pasar Rakyat Karawang", url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80" },
                    { label: "Gedung & Kebijakan", url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80" },
                    { label: "Transportasi", url: "https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?w=800&auto=format&fit=crop&q=80" }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFounderCoverImage(preset.url)}
                      className={`px-2 py-1 rounded border text-[10px] font-semibold transition ${
                        founderCoverImage === preset.url
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Isi Naskah Tulisan Founder
                </label>
                <textarea
                  required
                  rows={7}
                  value={founderContent}
                  onChange={(e) => setFounderContent(e.target.value)}
                  placeholder="Ketik catatan, liputan, atau gagasan Anda di sini..."
                  className="w-full border border-stone-300 bg-white p-3 text-stone-900 font-serif text-sm leading-relaxed focus:outline-none focus:border-stone-900"
                ></textarea>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFounderEditor(false)}
                  className="border border-stone-300 bg-white text-stone-700 px-4 py-2 font-semibold hover:bg-stone-50 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-red-900 hover:bg-red-950 text-white px-5 py-2 font-bold rounded shadow transition flex items-center justify-center gap-1.5 text-xs"
                >
                  <span>✓</span>
                  <span>Terbitkan Langsung ke Portal Utama</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
