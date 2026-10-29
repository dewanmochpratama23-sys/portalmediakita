import React, { useState, useRef } from 'react';

export default function ArticleEditor({ author, onBack, onPublish, onOpenPedoman }) {
  const [title, setTitle] = useState("Menakar Efektivitas Tilang Uji Emisi di Jalur Protokol Jabodetabek");
  const [category, setCategory] = useState("Kebijakan Publik");
  const [tags, setTags] = useState("Uji Emisi, Polusi Udara, Transportasi");
  const [region, setRegion] = useState("DKI Jakarta & Sekitarnya");
  const [coverImage, setCoverImage] = useState("https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?w=800&auto=format&fit=crop&q=80");
  const [content, setContent] = useState(`Penerapan razia dan sanksi tilang uji emisi di ruas-ruas jalan utama ibukota kembali memicu diskursus hangat di kalangan pengendara bermotor. Di satu sisi, langkah ini dinilai urgen mengingat tingkat Indeks Kualitas Udara (AQI) di Jakarta kerap berada di zona merah pada jam sibuk pagi dan sore hari.

Namun, pertanyaannya adalah: sejauh mana ketersediaan bengkel uji emisi resmi yang mudah diakses oleh masyarakat berpenghasilan menengah ke bawah? Dari pantauan kami di lapangan, banyak warga mengeluhkan antrean panjang serta tarif uji mandiri yang variatif di bengkel swasta.

"Penegakan hukum lingkungan harus diimbangi dengan kemudahan fasilitas publik dan bengkel uji emisi gratis, agar tidak terkesan sekadar pembebanan sanksi denda." — Warga Kebayoran Baru`);

  const fileInputRef = useRef(null);

  // Fungsi untuk mengunggah foto dari komputer / HP penulis
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran foto maksimal 5MB!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Judul naskah wajib diisi!");
      return;
    }
    const newArticle = {
      id: Date.now(),
      title,
      category,
      excerpt: content.slice(0, 140) + '...',
      content,
      author: {
        name: author?.name || "Kontributor Warga",
        role: author?.expertise ? `Spesialis ${author.expertise}` : "Kontributor Warga",
        avatar: author?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
        verified: true
      },
      coverImage: coverImage || "https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?w=800&auto=format&fit=crop&q=80",
      publishedAt: "Hari ini",
      readingTime: "4 min baca",
      views: 1,
      likes: 0,
      status: "pending",
      isLead: false,
      royaltyAmount: 0
    };

    if (onPublish) onPublish(newArticle);
    alert("Naskah berhasil diajukan ke meja kurasi redaksi!");
  };

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <button
              onClick={onBack}
              className="text-xs text-stone-600 hover:text-stone-950 font-semibold"
            >
              &larr; Kembali ke Dashboard Penulis
            </button>
            <h2 className="font-serif text-2xl font-bold text-stone-950 mt-1">Meja Penulisan Naskah</h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-stone-500">Tersimpan lokal</span>
            <button
              type="button"
              onClick={() => alert("Draf naskah tersimpan!")}
              className="border border-stone-300 bg-white text-stone-800 text-xs font-semibold px-3 py-1.5 hover:bg-stone-50"
            >
              Simpan Draf
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-stone-900 text-[#FAF8F5] text-xs font-bold px-4 py-1.5 hover:bg-stone-800 transition"
            >
              Ajukan ke Redaksi
            </button>
          </div>
        </div>

        {/* Editor Form Canvas */}
        <div className="bg-white border border-stone-300 p-8 space-y-6">
          
          {/* Title Input */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">
              Judul Berita / Liputan
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tuliskan Judul Naskah yang Tajam &amp; Informatif..."
              className="w-full font-serif text-2xl sm:text-3xl font-bold text-stone-950 border-b border-stone-200 pb-2 focus:outline-none focus:border-stone-900 placeholder:text-stone-300"
            />
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Rubrik / Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-stone-300 bg-stone-50 p-2 text-stone-800 focus:outline-none"
              >
                <option>Kebijakan Publik</option>
                <option>Ekonomi Rakyat</option>
                <option>Liputan Daerah</option>
                <option>Opini &amp; Esai</option>
                <option>Riset &amp; Sains</option>
                <option>Seni &amp; Budaya</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Kata Kunci (Tag)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full border border-stone-300 bg-stone-50 p-2 text-stone-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Wilayah Liputan
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full border border-stone-300 bg-stone-50 p-2 text-stone-800 focus:outline-none"
              />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* UPLOAD FOTO SAMPUL BERITA (INTERAKTIF & JELAS FUNGSINYA)                 */}
          {/* ========================================================================= */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-700">
                Foto Sampul Berita (Featured Image)
              </label>
              <span className="text-[10px] text-stone-500">
                Foto utama yang muncul di atas artikel &amp; beranda web
              </span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />

            {coverImage ? (
              <div className="relative border border-stone-300 rounded overflow-hidden group">
                <img
                  src={coverImage}
                  alt="Pratinjau Sampul"
                  className="w-full h-56 object-cover"
                />
                <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="bg-white text-stone-900 px-3 py-1.5 text-xs font-bold rounded shadow hover:bg-stone-100"
                  >
                    Ganti Foto
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverImage(null)}
                    className="bg-red-800 text-white px-3 py-1.5 text-xs font-bold rounded shadow hover:bg-red-900"
                  >
                    Hapus
                  </button>
                </div>
                <div className="p-2 bg-stone-100 border-t border-stone-200 text-[11px] text-stone-600 flex justify-between items-center">
                  <span>✓ Foto sampul terpasang dan siap ditayangkan.</span>
                  <span className="text-stone-400">Disimpan ke Supabase Storage</span>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-stone-300 hover:border-stone-500 p-6 text-center bg-stone-50 hover:bg-stone-100/60 rounded cursor-pointer transition space-y-1"
              >
                <div className="text-2xl mb-1">📷</div>
                <div className="font-bold text-xs text-stone-900">
                  Klik di sini untuk memilih foto dari komputer atau HP Anda
                </div>
                <div className="text-[11px] text-stone-500">
                  Mendukung format JPG, PNG, atau WebP (Maksimal 5MB).
                </div>
                <div className="pt-2">
                  <span className="inline-block bg-stone-900 text-white text-[10px] font-bold px-3 py-1 rounded">
                    Pilih File Foto
                  </span>
                </div>
              </div>
            )}

            {/* Penjelasan Lisensi Hak Cipta */}
            <div className="mt-1.5 text-[10px] text-stone-500 italic flex items-center gap-1">
              <span>⚠️</span>
              <span>
                <strong>Aturan Hak Cipta:</strong> Pastikan foto merupakan karya jepretan Anda sendiri di lapangan, atau foto gratis bebas royalti (seperti dari Unsplash / Pixabay) agar tidak melanggar hak cipta orang lain.
              </span>
            </div>
          </div>

          {/* Text Formatting Toolbar */}
          <div className="border-y border-stone-200 py-1.5 flex flex-wrap items-center gap-2 text-xs text-stone-700">
            <button type="button" className="px-2 py-1 font-bold hover:bg-stone-100 rounded">B</button>
            <button type="button" className="px-2 py-1 italic hover:bg-stone-100 rounded">I</button>
            <span className="text-stone-300">|</span>
            <button type="button" className="px-2 py-1 font-serif font-bold hover:bg-stone-100 rounded">Subjudul (H2)</button>
            <button type="button" className="px-2 py-1 italic hover:bg-stone-100 rounded">Kutipan (" ")</button>
            <button type="button" className="px-2 py-1 hover:bg-stone-100 rounded">Daftar Poin (&bull;)</button>
            <span className="text-stone-300">|</span>
            <button type="button" className="px-2 py-1 hover:bg-stone-100 rounded">Sisipkan Tautan</button>
          </div>

          {/* Story Body Area */}
          <div>
            <textarea
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full font-serif text-base text-stone-800 leading-relaxed p-2 border-0 focus:outline-none focus:ring-0 placeholder:text-stone-300"
              placeholder="Tuliskan naskah berita, liputan warga, atau esai opini Anda di sini..."
            />
          </div>

          {/* Originality Pakta & Klausul Legalitas Pengelola */}
          <div className="border-t border-stone-200 pt-4 text-xs text-stone-600 bg-stone-50 p-3.5 border border-stone-200 rounded">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-stone-900 uppercase text-[10px] tracking-wider">
                🛡️ Pakta Integritas Penulis &amp; Hak Redaksi
              </span>
              <button
                type="button"
                onClick={onOpenPedoman}
                className="text-red-900 font-bold hover:underline text-[11px]"
              >
                Baca Pedoman Lengkap &rarr;
              </button>
            </div>
            <p className="text-[11px] leading-relaxed text-stone-600 italic">
              "Redaksi MediaKita berhak sewaktu-waktu menyunting, menolak, menonaktifkan, atau menghapus artikel yang dinilai melanggar hukum, etika, hak cipta, menyebarkan fitnah, atau merugikan pihak lain tanpa persetujuan penulis."
            </p>
            <p className="text-[10px] text-stone-500 mt-1">
              Dengan mengajukan naskah ini, penulis menyatakan naskah merupakan karya orisinil dan tunduk pada Pedoman Media Siber MediaKita.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
