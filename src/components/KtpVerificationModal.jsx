import React, { useState, useRef } from 'react';

export default function KtpVerificationModal({ isOpen, onClose, author, onSubmitKtp }) {
  const [nik, setNik] = useState('');
  const [ktpImage, setKtpImage] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleImagePick = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran foto maksimal 5MB!');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setKtpImage(reader.result);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nik.trim() || nik.trim().length < 16) {
      setError('NIK wajib 16 digit angka sesuai KTP!');
      return;
    }
    if (!ktpImage) {
      setError('Foto e-KTP fisik wajib diunggah!');
      return;
    }

    const payload = {
      authorId: author?.idNumber || 'MK-2026-X',
      authorName: author?.name || 'Penulis Warga',
      nik: nik.trim(),
      ktpImage: ktpImage,
      submittedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    if (onSubmitKtp) onSubmitKtp(payload);
    alert('Dokumen e-KTP Anda berhasil dikirimkan ke Meja Redaksi! Kurator akan memverifikasi dalam 1x24 jam.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] border border-stone-400 max-w-lg w-full p-6 sm:p-7 shadow-2xl relative my-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-500 hover:text-stone-950 text-sm font-bold"
        >
          ✕
        </button>

        <div className="text-center mb-5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-900 mb-1 block">
            Verifikasi Identitas Penulis (KYC)
          </span>
          <h3 className="font-serif text-2xl font-bold text-stone-950">
            Unggah e-KTP Kontributor
          </h3>
          <p className="text-xs text-stone-600 mt-1">
            Sesuai standar Kompasiana, verifikasi identitas resmi diperlukan untuk mengaktifkan pencairan bagi hasil royalti 70% dan mencegah akun anonim penyebar fitnah.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-700 mb-1">
              Nomor Induk Kependudukan (NIK - 16 Digit)
            </label>
            <input
              type="text"
              required
              maxLength={16}
              value={nik}
              onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
              placeholder="Contoh: 3171012345670001"
              className="w-full border border-stone-300 bg-white p-2.5 text-stone-900 font-mono tracking-widest text-sm focus:outline-none focus:border-stone-900"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-700 mb-1">
              Foto e-KTP Fisik Asli
            </label>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImagePick}
              accept="image/*"
              className="hidden"
            />

            {ktpImage ? (
              <div className="relative border border-stone-300 rounded overflow-hidden">
                <img src={ktpImage} alt="Pratinjau KTP" className="w-full h-44 object-cover" />
                <div className="p-2 bg-stone-100 flex justify-between items-center text-[11px]">
                  <span className="text-emerald-800 font-bold">✓ Foto KTP terpilih</span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="text-stone-700 underline font-semibold"
                  >
                    Ganti Foto
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-stone-300 hover:border-stone-500 p-6 text-center bg-stone-50 hover:bg-stone-100/60 rounded cursor-pointer transition"
              >
                <div className="text-2xl mb-1">🪪</div>
                <div className="font-bold text-xs text-stone-900">
                  Klik untuk mengambil foto KTP dari HP atau komputer
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5">
                  Pastikan tulisan NIK, Nama, dan Foto wajah terbaca jelas (Maksimal 5MB).
                </div>
              </div>
            )}
          </div>

          {error && (
            <p className="text-red-700 text-[11px] font-semibold">{error}</p>
          )}

          {/* Jaminan Privasi Data */}
          <div className="bg-stone-100 p-3 rounded border border-stone-200 text-[10px] text-stone-600 leading-relaxed">
            <span className="font-bold text-stone-800">🔒 Perlindungan Data Pribadi (UU PDP):</span>
            <p className="mt-0.5">
              Data KTP Anda disimpan terenkripsi di Supabase Storage pribadi redaksi dan <strong>TIDAK PERNAH dipublikasikan</strong> ke pembaca umum. Data ini murni digunakan untuk validasi legalitas kepenulisan dan pembayaran royalti.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full bg-red-900 hover:bg-red-950 text-white py-2.5 font-bold transition shadow"
            >
              Kirimkan Dokumen Verifikasi KTP
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full border border-stone-300 text-stone-600 py-1.5 font-semibold hover:bg-stone-100"
            >
              Batal
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
