import React, { useState } from 'react';
import KtpVerificationModal from './KtpVerificationModal';

export default function ContributorDashboard({ author, articles, onWriteArticle, onSubmitKtp }) {
  const [ktpModalOpen, setKtpModalOpen] = useState(false);

  // Profil default
  const currentAuthor = author || {
    name: "Budi Setiawan, M.Sc.",
    role: "Kontributor Warga",
    expertise: "Bidang Kebijakan Publik & Transportasi Perkotaan",
    idNumber: "MK-2026-084",
    verified: false,
    isKtpVerified: false
  };

  const isKtpVerified = Boolean(currentAuthor.isKtpVerified);

  // Filter artikel yang ditulis khusus oleh penulis ini
  const myArticles = (articles || []).filter(a =>
    a.author && (a.author.name === currentAuthor.name || a.author === currentAuthor.name)
  );

  const totalViews = myArticles.reduce((sum, a) => sum + (a.views || 0), 0);
  const totalRoyalty = myArticles.reduce((sum, a) => sum + (a.royaltyAmount || 0), 0);
  const publishedCount = myArticles.filter(a => a.status === 'published').length;
  const pendingCount = myArticles.filter(a => a.status === 'pending').length;
  const draftCount = myArticles.filter(a => a.status === 'draft').length;

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Contributor Header */}
        <div className="bg-white border border-stone-300 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl font-bold text-stone-950">
                {currentAuthor.name}
              </h2>
              {isKtpVerified ? (
                <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-50 text-emerald-800 px-2 py-0.5 border border-emerald-300 rounded flex items-center gap-1">
                  ✓ Terverifikasi e-KTP
                </span>
              ) : (
                <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-50 text-amber-900 px-2 py-0.5 border border-amber-300 rounded flex items-center gap-1">
                  ⏳ Belum Verifikasi KTP
                </span>
              )}
            </div>
            <p className="text-xs text-stone-600 mt-1">
              {currentAuthor.expertise || "Kontributor Berita Komunitas"} &bull; Terdaftar ID: {currentAuthor.idNumber || "MK-2026-NEW"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onWriteArticle}
              className="bg-stone-900 text-[#FAF8F5] text-xs font-bold px-4 py-2 hover:bg-stone-800 transition"
            >
              + Tulis Naskah Baru
            </button>
            <button
              onClick={() => {
                if (!isKtpVerified) {
                  alert("PERHATIAN:\nSesuai standar Kompasiana, Anda wajib memverifikasi e-KTP terlebih dahulu sebelum dapat mencairkan bagi hasil royalti.");
                  setKtpModalOpen(true);
                  return;
                }
                if (totalRoyalty > 0) {
                  alert(`Permintaan pencairan royalti Rp ${totalRoyalty.toLocaleString('id-ID')} berhasil diajukan ke bendahara redaksi!`);
                } else {
                  alert("Belum ada saldo royalti yang dapat dicairkan. Terbitkan artikel dan kumpulkan pembaca untuk menghasilkan royalti!");
                }
              }}
              className="border border-stone-300 text-stone-700 text-xs font-semibold px-3 py-2 hover:bg-stone-50"
            >
              Klaim Bagi Hasil
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BANNER AJAKAN VERIFIKASI KTP (JIKA BELUM VERIFIKASI)                      */}
        {/* ========================================================================= */}
        {!isKtpVerified && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-300 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                <span>🪪</span>
                <span>Verifikasi Identitas e-KTP Anda (Standar Keamanan Kompasiana)</span>
              </div>
              <p className="text-stone-700 text-[11px] mt-0.5">
                Unggah foto KTP Anda agar naskah Anda mendapatkan prioritas kurasi redaksi, perlindungan hak cipta, dan membuka akses pencairan royalti 70%.
              </p>
            </div>
            <button
              onClick={() => setKtpModalOpen(true)}
              className="bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold px-4 py-2 rounded shadow transition whitespace-nowrap"
            >
              Unggah KTP Sekarang &rarr;
            </button>
          </div>
        )}

        {/* 4 KPI Metrics Dinamis */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-white border border-stone-300 p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Total Naskah Saya</div>
            <div className="font-serif text-3xl font-bold text-stone-950 mt-1">
              {myArticles.length}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              {publishedCount} Terbit &bull; {pendingCount} Kurasi &bull; {draftCount} Draf
            </div>
          </div>

          <div className="bg-white border border-stone-300 p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Total Pembaca (Views)</div>
            <div className="font-serif text-3xl font-bold text-stone-950 mt-1">
              {totalViews.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-emerald-800 font-semibold mt-1">
              Akumulasi pembaca naskah Anda
            </div>
          </div>

          <div className="bg-white border border-stone-300 p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Bagi Hasil Penulis (70%)</div>
            <div className="font-serif text-3xl font-bold text-stone-950 mt-1">
              Rp {totalRoyalty.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-stone-600 mt-1">
              {totalRoyalty > 0 ? "Tersedia untuk pencairan" : "Kumpulkan views untuk royalti"}
            </div>
          </div>

          <div className="bg-white border border-stone-300 p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Status Akun Penulis</div>
            <div className="font-serif text-2xl font-bold text-stone-950 mt-1">
              {isKtpVerified ? "Gold Tier" : "Reguler"}
            </div>
            <div className="text-[11px] text-emerald-800 font-semibold mt-1">
              {isKtpVerified ? "✓ Identitas Legal Tervalidasi" : "Belum Unggah KTP"}
            </div>
          </div>
        </div>

        {/* Article Status Table */}
        <div className="bg-white border border-stone-300 mt-6 overflow-hidden">
          <div className="p-4 border-b border-stone-200 flex justify-between items-center">
            <h3 className="font-serif text-base font-bold text-stone-950">
              Arsip &amp; Riwayat Naskah Karya {currentAuthor.name}
            </h3>
            <span className="text-xs text-stone-500">
              {myArticles.length} naskah tercatat
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold uppercase tracking-wider text-stone-600">
                <tr>
                  <th className="p-3.5">Judul Naskah</th>
                  <th className="p-3.5">Rubrik</th>
                  <th className="p-3.5">Status Redaksi</th>
                  <th className="p-3.5 text-right">Pembaca</th>
                  <th className="p-3.5 text-right">Estimasi Royalti (70%)</th>
                  <th className="p-3.5 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-medium">
                {myArticles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-stone-500">
                      Anda belum memiliki artikel. Klik <strong>"+ Tulis Naskah Baru"</strong> untuk mengirim karya liputan atau opini pertama Anda!
                    </td>
                  </tr>
                ) : (
                  myArticles.map((art) => (
                    <tr key={art.id} className="hover:bg-stone-50 transition">
                      <td className="p-3.5 max-w-sm">
                        <div className="font-bold text-stone-900 text-xs">
                          {art.title}
                        </div>
                        <div className="text-[10px] text-stone-500 mt-0.5">
                          {art.publishedAt} &bull; {art.readingTime}
                        </div>
                      </td>
                      <td className="p-3.5 text-stone-700">
                        {art.category}
                      </td>
                      <td className="p-3.5">
                        {art.status === 'published' ? (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-300 rounded">
                            ● Terbit (Tayang)
                          </span>
                        ) : art.status === 'pending' ? (
                          <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 border border-amber-300 rounded">
                            ⏳ Sedang Dikurasi
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-stone-700 bg-stone-100 px-2 py-0.5 border border-stone-300 rounded">
                            ✎ Draf Pribadi
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right font-bold text-stone-900">
                        {(art.views || 0).toLocaleString('id-ID')}
                      </td>
                      <td className="p-3.5 text-right font-bold text-emerald-700">
                        Rp {(art.royaltyAmount || 0).toLocaleString('id-ID')}
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={onWriteArticle}
                          className="text-stone-700 hover:text-red-900 underline font-semibold"
                        >
                          Kelola
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modal Dialog Unggah KTP */}
      <KtpVerificationModal
        isOpen={ktpModalOpen}
        onClose={() => setKtpModalOpen(false)}
        author={currentAuthor}
        onSubmitKtp={onSubmitKtp}
      />
    </div>
  );
}
