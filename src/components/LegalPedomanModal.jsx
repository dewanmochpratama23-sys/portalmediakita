import React from 'react';

export default function LegalPedomanModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] border border-stone-400 max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] flex flex-col">
        
        {/* Header Modal */}
        <div className="flex justify-between items-start border-b border-stone-300 pb-3 mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-900">
              Kepatuhan Hukum &amp; Etika Pers
            </span>
            <h3 className="font-serif text-2xl font-bold text-stone-950 mt-0.5">
              Pedoman Pemberitaan &amp; Syarat Ketentuan
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-950 text-base font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>

        {/* Content Area (Scrollable) */}
        <div className="overflow-y-auto space-y-5 text-xs text-stone-700 font-sans leading-relaxed pr-2">
          
          {/* Bagian 1 */}
          <section className="bg-stone-100 p-3.5 border-l-4 border-stone-900 rounded-r">
            <h4 className="font-bold text-stone-950 uppercase text-[11px] mb-1">
              1. Hak Redaksi &amp; Perlindungan Pengelola (Klausul Safe Harbor)
            </h4>
            <p className="italic text-stone-800">
              "Redaksi MediaKita berhak sewaktu-waktu menyunting, menolak, menonaktifkan, menarik dari peredaran (*takedown*), atau menghapus artikel yang dinilai melanggar hukum, etika pers, hak cipta, menyebarkan fitnah, ujaran kebencian, atau merugikan pihak lain tanpa memerlukan persetujuan sebelumnya dari penulis."
            </p>
          </section>

          {/* Bagian 2 */}
          <section>
            <h4 className="font-bold text-stone-950 uppercase text-[11px] mb-1">
              2. Tanggung Jawab Kontributor &amp; Jurnalis Warga
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-stone-600">
              <li>Setiap penulis bertanggung jawab penuh atas kebenaran faktual naskah yang diajukan.</li>
              <li>Dilarang keras melakukan plagiarisme atau fabrikasi kutipan narasumber.</li>
              <li>Naskah yang memuat tuduhan negatif wajib menyertakan verifikasi atau asas keberimbangan (*cover both sides*).</li>
              <li>Foto sampul (*cover image*) wajib merupakan karya pribadi atau berlisensi terbuka dengan atribusi kredit yang sah.</li>
            </ul>
          </section>

          {/* Bagian 3 */}
          <section>
            <h4 className="font-bold text-stone-950 uppercase text-[11px] mb-1">
              3. Mekanisme Hak Jawab &amp; Hak Koreksi (Gratis 100%)
            </h4>
            <p className="text-stone-600">
              Sesuai UU Pers No. 40 Tahun 1999 dan Pedoman Media Siber, pihak yang merasa dirugikan oleh pemberitaan di MediaKita berhak menyampaikan <strong>Hak Jawab</strong> atau <strong>Hak Koreksi</strong> secara cuma-cuma (tanpa dipungut biaya apa pun) melalui surel resmi: <a href="mailto:redaksi@portalmediakita.com" className="font-mono font-bold text-stone-900 underline hover:text-red-900">redaksi@portalmediakita.com</a>. Redaksi wajib melayani dan mempublikasikan hak jawab tersebut sesegera mungkin.
            </p>
          </section>

          {/* Bagian 4 */}
          <section>
            <h4 className="font-bold text-stone-950 uppercase text-[11px] mb-1">
              4. Prosedur Pencabutan Naskah (Takedown Policy)
            </h4>
            <p className="text-stone-600">
              Pencabutan berita hanya dilakukan atas dasar:
            </p>
            <ol className="list-decimal pl-4 space-y-1 text-stone-600 mt-1">
              <li>Perlindungan masa depan anak di bawah umur / korban kekerasan seksual.</li>
              <li>Pelanggaran berat hak cipta atau plagiarisme yang terbukti secara sah.</li>
              <li>Putusan mediasi Dewan Pers atau perintah pengadilan yang berkekuatan hukum tetap.</li>
            </ol>
            <p className="text-stone-600 mt-2">
              Setiap pencabutan berita akan disertai <strong>Catatan Redaksi resmi</strong> yang menerangkan alasan penarikan secara transparan kepada publik pembaca.
            </p>
          </section>

          {/* Bagian 5 */}
          <section className="border-t border-stone-200 pt-3 text-[11px] text-stone-500">
            Platform MediaKita menganut prinsip jurnalisme warga independen berlandaskan Pasal 28F UUD 1945 tentang hak berkomunikasi dan memperoleh informasi, serta Surat Edaran Menkominfo No. 5 Tahun 2016 mengenai batasan tanggung jawab penyelenggara platform konten buatan pengguna (*UGC Safe Harbor*).
          </section>

        </div>

        {/* Footer Modal */}
        <div className="border-t border-stone-300 pt-3 mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-stone-900 text-[#FAF8F5] px-5 py-2 font-bold text-xs hover:bg-stone-800 transition"
          >
            Saya Memahami &amp; Menyetujui
          </button>
        </div>

      </div>
    </div>
  );
}
