import React, { useState, useEffect } from 'react';
import {
  fetchGoldPrice,
  fetchWeatherInfo,
  fetchAQIInfo,
  fetchLiveScore,
  fetchLocalRadar
} from '../services/apiWidgets';
import RadarMapModal from './RadarMapModal';

export default function LivingAssistanceBar() {
  const [selectedCity, setSelectedCity] = useState('karawang'); // 'karawang' | 'jakarta'
  const [gold, setGold] = useState(null);
  const [weather, setWeather] = useState(null);
  const [aqi, setAqi] = useState(null);
  const [score, setScore] = useState(null);
  const [radar, setRadar] = useState(null);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Ambil data real-time saat mount dan ketika kota berganti
  useEffect(() => {
    let isMounted = true;

    async function loadWidgets(city) {
      setIsUpdating(true);
      try {
        const [goldData, weatherData, aqiData, scoreData, radarData] = await Promise.all([
          fetchGoldPrice(),
          fetchWeatherInfo(city),
          fetchAQIInfo(city),
          fetchLiveScore(),
          fetchLocalRadar(city)
        ]);

        if (isMounted) {
          setGold(goldData);
          setWeather(weatherData);
          setAqi(aqiData);
          setScore(scoreData);
          setRadar(radarData.featured);
          setIsUpdating(false);
        }
      } catch (err) {
        console.error("Widget fetch error:", err);
        if (isMounted) setIsUpdating(false);
      }
    }

    loadWidgets(selectedCity);

    // Polling otomatis setiap 60 detik (Real-time tanpa perlu Anda update manual)
    const interval = setInterval(() => {
      loadWidgets(selectedCity);
    }, 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedCity]);

  return (
    <>
      <section className="border-b border-stone-300 bg-[#F5F2EB]">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-stone-300 text-xs">
            
            {/* 1. Antam Gold Price (Real-Time XAU Live) */}
            <div className="px-3 py-1 flex flex-col justify-center">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-500">
                <span className="flex items-center gap-1">
                  <span>Emas Antam (1g)</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" title="Update Live"></span>
                </span>
                <span className="text-emerald-700 font-bold">{gold ? gold.changePercent : '+0.41%'}</span>
              </div>
              <div className="font-bold text-stone-900 text-sm mt-0.5 font-mono">
                {gold ? gold.formattedPrice : 'Rp 1.535.000'}
              </div>
              <div className="text-[10px] text-stone-500 flex justify-between">
                <span>Buyback: {gold ? gold.buybackPrice : 'Rp 1.398.000'}</span>
                <span className="text-[9px] text-stone-400">{gold?.lastUpdated || 'Live'}</span>
              </div>
            </div>

            {/* 2. BMKG / OpenData Weather (Jakarta & Karawang Live) */}
            <div className="px-3 py-1 flex flex-col justify-center">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-500">
                <span className="flex items-center gap-1">
                  <span>Cuaca</span>
                  {/* Selector Kota Jakarta & Karawang */}
                  <span className="inline-flex items-center bg-stone-200 rounded p-0.5 ml-1">
                    <button
                      onClick={() => setSelectedCity('karawang')}
                      className={`px-1.5 py-0.2 rounded text-[9px] font-bold transition ${
                        selectedCity === 'karawang' ? 'bg-stone-900 text-white' : 'text-stone-700 hover:text-stone-950'
                      }`}
                      title="Klik untuk lihat cuaca Karawang"
                    >
                      Karawang
                    </button>
                    <button
                      onClick={() => setSelectedCity('jakarta')}
                      className={`px-1.5 py-0.2 rounded text-[9px] font-bold transition ${
                        selectedCity === 'jakarta' ? 'bg-stone-900 text-white' : 'text-stone-700 hover:text-stone-950'
                      }`}
                      title="Klik untuk lihat cuaca Jakarta"
                    >
                      Jakarta
                    </button>
                  </span>
                </span>
                <span className="text-[9px] text-stone-500">BMKG / Live</span>
              </div>
              <div className="font-bold text-stone-900 text-sm mt-0.5 flex items-center gap-1.5">
                <span>{weather ? `${weather.temperature}°C` : '32°C'}</span>
                <span className="text-stone-400 font-normal">&bull;</span>
                <span className="text-xs truncate">{weather ? weather.condition : 'Cerah Berawan'}</span>
              </div>
              <div className="text-[10px] text-stone-500 truncate">
                Lembap {weather ? weather.humidity : '65%'} &bull; Angin {weather ? weather.windSpeed : '11 km/j'}
              </div>
            </div>

            {/* 3. Real-Time AQI Index (Jakarta / Karawang) */}
            <div className="px-3 py-1 flex flex-col justify-center">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-500">
                <span>Udara ({weather?.location || 'Karawang'})</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${aqi?.statusColor || 'text-amber-800 bg-amber-100'}`}>
                  {aqi ? `${aqi.aqi} ${aqi.statusText}` : '92 Sedang'}
                </span>
              </div>
              <div className="font-bold text-stone-900 text-xs mt-0.5 truncate">
                Indeks AQI: {aqi?.aqi || 92} US-AQI
              </div>
              <div className="text-[10px] text-stone-500 truncate">
                {aqi ? aqi.advice : 'Kualitas udara cukup sehat'}
              </div>
            </div>

            {/* 4. Live Score BRI Liga 1 */}
            <div className="px-3 py-1 flex flex-col justify-center">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-500">
                <span>{score ? score.league.replace(' Indonesia', '') : 'BRI Liga 1'}</span>
                <span className="text-red-700 font-bold animate-pulse">{score ? score.matchStatus : 'FT'}</span>
              </div>
              <div className="font-bold text-stone-900 text-sm mt-0.5 truncate">
                {score ? `${score.homeTeam} ${score.homeScore} — ${score.awayScore} ${score.awayTeam}` : 'Persib 2 — 1 Persija'}
              </div>
              <div className="text-[10px] text-stone-500 truncate">
                {score ? score.stadium : 'Stadion GBLA'}
              </div>
            </div>

            {/* 5. Local Community Radar (Dengan Tombol Buka Peta Interaktif) */}
            <div
              onClick={() => setMapModalOpen(true)}
              className="px-3 py-1 flex flex-col justify-center col-span-2 md:col-span-1 cursor-pointer hover:bg-stone-200/50 transition group"
              title="Klik untuk membuka Peta Pantauan Warga"
            >
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-500">
                <span className="flex items-center gap-1">
                  <span>Radar Komunitas</span>
                  <span className="text-[9px] text-red-900 font-bold bg-red-100 px-1 rounded">
                    {weather?.location || 'Karawang'}
                  </span>
                </span>
                <span className="text-red-800 font-bold group-hover:underline">Peta &rarr;</span>
              </div>
              <div className="font-bold text-stone-900 text-xs mt-0.5 truncate group-hover:text-red-900 transition">
                {radar ? radar.title : 'Perbaikan Pipa di Simpang Klari'}
              </div>
              <div className="text-[10px] text-stone-500 flex justify-between items-center truncate">
                <span className="truncate">{radar ? radar.impact : 'Jalur lambat padat merayap'}</span>
                <span className="text-[9px] font-bold text-stone-900 underline ml-1 flex-shrink-0">
                  Lihat Peta
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Modal Dialog Peta Interaktif Radar Komunitas */}
      <RadarMapModal
        isOpen={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        initialRegion={weather?.location || "Karawang"}
      />
    </>
  );
}
