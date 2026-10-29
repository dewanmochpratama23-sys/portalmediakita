import React, { useState } from 'react';

export default function RadarMapModal({ isOpen, onClose, initialRegion = "Karawang" }) {
  const [selectedFilter, setSelectedFilter] = useState(initialRegion); // 'Semua' | 'Karawang' | 'Jakarta'
  const [activeReportId, setActiveReportId] = useState("KRW-01");
  const [showAddForm, setShowAddForm] = useState(false);

  // State laporan komunitas lokal
  const [reports, setReports] = useState([
    {
      id: "KRW-01",
      region: "Karawang",
      title: "Perbaikan Gorong-gorong Simpang Klari",
      location: "Simpang Klari arah Tol Karawang Timur",
      impact: "Jalur lambat padat merayap, antrean kendaraan 500m",
      category: "Lalu Lintas",
      severity: "Perhatian",
      time: "15 menit lalu",
      reporter: "Kang Asep (Warga Klari)",
      lat: -6.3458,
      lon: 107.3592
    },
    {
      id: "KRW-02",
      region: "Karawang",
      title: "Pasar Kuliner Sore Depan Pemda Karawang",
      location: "Jl. Ahmad Yani, Nagasari",
      impact: "Parkir bahu jalan ramai lancar, aktivitas pedagang kuliner",
      category: "Aktivitas Warga",
      severity: "Info Publik",
      time: "35 menit lalu",
      reporter: "Rina (Komunitas Kuliner)",
      lat: -6.3045,
      lon: 107.3032
    },
    {
      id: "KRW-03",
      region: "Karawang",
      title: "Lalu Lintas Kawasan Industri KIIC",
      location: "Akses Gerbang Tol Karawang Barat",
      impact: "Arus kendaraan logistik & bubaran pabrik lancar aman",
      category: "Lalu Lintas",
      severity: "Lancar",
      time: "1 jam lalu",
      reporter: "Patroli Komunitas",
      lat: -6.3533,
      lon: 107.2789
    },
    {
      id: "JKT-01",
      region: "Jakarta",
      title: "Perbaikan Pipa di Kuningan Timur",
      location: "Jl. Gatot Subroto Kav. 38, Jakarta Selatan",
      impact: "Penyempitan 1 lajur cepat, kecepatan rata-rata 15 km/j",
      category: "Infrastruktur",
      severity: "Perhatian",
      time: "25 menit lalu",
      reporter: "Budi (Pengguna Busway)",
      lat: -6.2301,
      lon: 106.8291
    },
    {
      id: "JKT-02",
      region: "Jakarta",
      title: "Rekayasa Arus Sore Simpang Semanggi",
      location: "Jembatan Semanggi arah Blok M",
      impact: "Pemberlakuan buka-tutup lajur sore, padat terkendali",
      category: "Lalu Lintas",
      severity: "Info Publik",
      time: "50 menit lalu",
      reporter: "Relawan Lalin",
      lat: -6.2195,
      lon: 106.8124
    }
  ]);

  // Form input laporan baru
  const [newTitle, setNewTitle] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newRegion, setNewRegion] = useState("Karawang");
  const [newImpact, setNewImpact] = useState("");

  if (!isOpen) return null;

  const filteredReports = selectedFilter === "Semua"
    ? reports
    : reports.filter(r => r.region.toLowerCase() === selectedFilter.toLowerCase());

  const activeReport = reports.find(r => r.id === activeReportId) || filteredReports[0] || reports[0];

  const handleAddReport = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLocation.trim()) return;

    const newEntry = {
      id: `USR-${Date.now()}`,
      region: newRegion,
      title: newTitle.trim(),
      location: newLocation.trim(),
      impact: newImpact.trim() || "Lalu lintas terpantau padat",
      category: "Laporan Warga",
      severity: "Perhatian",
      time: "Baru saja",
      reporter: "Warga Kontributor (Terverifikasi)",
      lat: newRegion === "Karawang" ? -6.3073 : -6.2088,
      lon: newRegion === "Karawang" ? 107.3069 : 106.8456
    };

    setReports([newEntry, ...reports]);
    setActiveReportId(newEntry.id);
    setSelectedFilter(newRegion);
    setNewTitle("");
    setNewLocation("");
    setNewImpact("");
    setShowAddForm(false);
    alert("✓ Laporan peristiwa warga Anda berhasil ditambahkan ke Radar Komunitas secara live!");
  };

  // URL peta OpenStreetMap interaktif dinamis berdasarkan titik koordinat yang dipilih
  const mapIframeUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${activeReport.lon - 0.04}%2C${activeReport.lat - 0.03}%2C${activeReport.lon + 0.04}%2C${activeReport.lat + 0.03}&layer=mapnik&marker=${activeReport.lat}%2C${activeReport.lon}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/75 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#FAF8F5] border border-stone-400 max-w-5xl w-full shadow-2xl relative flex flex-col max-h-[90vh] my-auto">
        
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-stone-300 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <span className="text-xl">📍</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-900">
                  Radar Peristiwa &amp; Lalu Lintas Komunitas Warga
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 rounded font-bold">
                  ● LIVE REAL-TIME
                </span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-950">
                Peta Pantauan Wilayah: Karawang &amp; Jakarta
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-950 text-base font-bold px-2 py-1"
          >
            ✕ Tutup
          </button>
        </div>

        {/* Filter Wilayah & Tombol Tambah Laporan */}
        <div className="p-3 bg-stone-100 border-b border-stone-300 flex flex-wrap justify-between items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-stone-600 mr-1">Filter Wilayah:</span>
            {["Semua", "Karawang", "Jakarta"].map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedFilter(reg)}
                className={`px-3 py-1 font-semibold rounded transition text-xs ${
                  selectedFilter.toLowerCase() === reg.toLowerCase()
                    ? 'bg-stone-900 text-[#FAF8F5]'
                    : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-50'
                }`}
              >
                {reg} {reg === "Karawang" && "📍"} {reg === "Jakarta" && "🏛️"}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-red-900 hover:bg-red-950 text-white px-3 py-1.5 rounded font-bold transition flex items-center gap-1"
          >
            <span>{showAddForm ? "✕ Tutup Formulir" : "+ Laporkan Kejadian Warga"}</span>
          </button>
        </div>

        {/* Form Tambah Laporan Warga Baru (Collapsible) */}
        {showAddForm && (
          <form onSubmit={handleAddReport} className="p-4 bg-amber-50 border-b border-amber-200 text-xs">
            <div className="font-bold text-amber-950 mb-2 flex items-center gap-1.5">
              <span>✍️</span>
              <span>Kirimkan Pantauan Kondisi Jalan / Fasilitas Warga Terkini</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-stone-600 mb-1">Wilayah</label>
                <select
                  value={newRegion}
                  onChange={(e) => setNewRegion(e.target.value)}
                  className="w-full border border-stone-300 bg-white p-2 rounded text-stone-900 font-semibold"
                >
                  <option value="Karawang">Karawang</option>
                  <option value="Jakarta">Jakarta</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase text-stone-600 mb-1">Judul Peristiwa</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Genangan air 20cm di bawah jembatan layang"
                  className="w-full border border-stone-300 bg-white p-2 rounded text-stone-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-stone-600 mb-1">Lokasi Persis</label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Contoh: Simpang Kosambi arah Telagasari"
                  className="w-full border border-stone-300 bg-white p-2 rounded text-stone-900"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase text-stone-600 mb-1">Dampak Lalu Lintas / Catatan</label>
                <input
                  type="text"
                  value={newImpact}
                  onChange={(e) => setNewImpact(e.target.value)}
                  placeholder="Contoh: Jalur motor dialihkan, mobil tersendat"
                  className="w-full border border-stone-300 bg-white p-2 rounded text-stone-900"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 border border-stone-300 bg-white text-stone-700 font-semibold rounded"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-stone-900 text-[#FAF8F5] font-bold rounded hover:bg-stone-800"
              >
                Terbitkan Pantauan ke Peta &rarr;
              </button>
            </div>
          </form>
        )}

        {/* Konten Utama: Split View Peta & Daftar Laporan */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Kolom Kiri: Peta Interaktif OpenStreetMap */}
          <div className="lg:col-span-7 bg-stone-200 border-b lg:border-b-0 lg:border-r border-stone-300 relative min-h-[280px] lg:min-h-full flex flex-col">
            <iframe
              title="Peta Interaktif Radar Warga"
              src={mapIframeUrl}
              className="w-full flex-1 border-0"
              loading="lazy"
            />
            {/* Overlay Status Titik Aktif */}
            <div className="p-2.5 bg-stone-900/90 text-white text-[11px] flex justify-between items-center">
              <div>
                <span className="text-amber-400 font-bold">📍 Titik Terpilih: </span>
                <span>{activeReport.title} ({activeReport.location})</span>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${activeReport.lat},${activeReport.lon}`}
                target="_blank"
                rel="noreferrer"
                className="text-stone-300 hover:text-white underline text-[10px]"
              >
                Buka di Google Maps ↗
              </a>
            </div>
          </div>

          {/* Kolom Kanan: Daftar Laporan Pantauan Komunitas */}
          <div className="lg:col-span-5 p-4 overflow-y-auto divide-y divide-stone-200 bg-white text-xs">
            <div className="pb-3 flex justify-between items-center text-[11px] text-stone-500 font-bold uppercase tracking-wider">
              <span>Laporan Terverifikasi ({filteredReports.length})</span>
              <span>Diperbarui Otomatis</span>
            </div>

            <div className="space-y-3 pt-3">
              {filteredReports.map((item) => {
                const isSelected = item.id === activeReport.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveReportId(item.id)}
                    className={`p-3 rounded border cursor-pointer transition ${
                      isSelected
                        ? 'border-stone-900 bg-[#F5F2EB] shadow-sm ring-1 ring-stone-900/10'
                        : 'border-stone-200 hover:border-stone-400 bg-stone-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-stone-200 text-stone-800">
                          {item.region}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          item.severity === 'Perhatian' ? 'bg-amber-100 text-amber-900' :
                          item.severity === 'Lancar' ? 'bg-emerald-100 text-emerald-900' :
                          'bg-blue-100 text-blue-900'
                        }`}>
                          {item.severity}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-500 font-mono">{item.time}</span>
                    </div>

                    <h4 className="font-bold text-stone-950 text-xs mt-1">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-stone-600 mt-0.5">
                      📍 {item.location}
                    </p>
                    <p className="text-[11px] font-medium text-stone-800 mt-1 italic">
                      &bull; {item.impact}
                    </p>

                    <div className="mt-2 pt-2 border-t border-stone-200/80 flex justify-between items-center text-[10px] text-stone-500">
                      <span>Pelapor: {item.reporter}</span>
                      <span className="font-bold text-red-900">
                        {isSelected ? '✓ Sedang Tampil di Peta' : 'Fokuskan Peta &rarr;'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Modal */}
        <div className="p-3 bg-stone-50 border-t border-stone-300 text-center text-[11px] text-stone-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>
            Data radar dihimpun dari laporan jurnalis warga &amp; pemantauan lalu lintas publik secara real-time.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1 bg-stone-900 text-[#FAF8F5] text-xs font-semibold rounded hover:bg-stone-800"
          >
            Selesai / Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
