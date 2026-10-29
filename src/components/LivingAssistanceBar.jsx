import React, { useState, useEffect } from 'react';
import {
  fetchGoldPrice,
  fetchWeatherInfo,
  fetchAQIInfo,
  fetchLiveScore,
  fetchLocalRadar
} from '../services/apiWidgets';

export default function LivingAssistanceBar() {
  const [gold, setGold] = useState(null);
  const [weather, setWeather] = useState(null);
  const [aqi, setAqi] = useState(null);
  const [score, setScore] = useState(null);
  const [radar, setRadar] = useState(null);

  useEffect(() => {
    async function loadWidgets() {
      const [goldData, weatherData, aqiData, scoreData, radarData] = await Promise.all([
        fetchGoldPrice(),
        fetchWeatherInfo("Jakarta"),
        fetchAQIInfo("Jabodetabek"),
        fetchLiveScore(),
        fetchLocalRadar()
      ]);
      setGold(goldData);
      setWeather(weatherData);
      setAqi(aqiData);
      setScore(scoreData);
      setRadar(radarData);
    }
    loadWidgets();
  }, []);

  return (
    <section className="border-b border-stone-300 bg-[#F5F2EB]">
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-stone-300 text-xs">
          
          {/* 1. Antam Gold Price */}
          <div className="px-3 py-1 flex flex-col justify-center">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-500">
              <span>Emas Antam (1g)</span>
              <span className="text-emerald-700 font-bold">{gold ? gold.changePercent : '...'}</span>
            </div>
            <div className="font-bold text-stone-900 text-sm mt-0.5">
              {gold ? gold.formattedPrice : 'Rp 1.450.000'}
            </div>
            <div className="text-[10px] text-stone-500">
              Buyback: {gold ? gold.buybackPrice : 'Rp 1.332.000'}
            </div>
          </div>

          {/* 2. BMKG Weather */}
          <div className="px-3 py-1 flex flex-col justify-center">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-500">
              <span>Cuaca {weather ? weather.location : 'Jakarta'}</span>
              <span className="text-stone-700 font-semibold">{weather ? weather.provider : 'BMKG'}</span>
            </div>
            <div className="font-bold text-stone-900 text-sm mt-0.5">
              {weather ? `${weather.temperature}°C • ${weather.condition}` : '31°C • Cerah'}
            </div>
            <div className="text-[10px] text-stone-500">
              Kelembapan {weather ? weather.humidity : '68%'} • Angin {weather ? weather.windSpeed : '12 km/j'}
            </div>
          </div>

          {/* 3. AQI Index */}
          <div className="px-3 py-1 flex flex-col justify-center">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-500">
              <span>Kualitas Udara (AQI)</span>
              <span className="text-amber-800 font-bold bg-amber-100 px-1 rounded">
                {aqi ? `${aqi.aqi} Sedang` : '124 Sedang'}
              </span>
            </div>
            <div className="font-bold text-stone-900 text-sm mt-0.5">
              {aqi ? aqi.region : 'Jabodetabek'}
            </div>
            <div className="text-[10px] text-stone-500 truncate">
              {aqi ? aqi.advice : 'Saran: Masker untuk kelompok rentan'}
            </div>
          </div>

          {/* 4. Live Score */}
          <div className="px-3 py-1 flex flex-col justify-center">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-500">
              <span>{score ? score.league : 'BRI Liga 1'}</span>
              <span className="text-red-700 font-bold">{score ? score.matchStatus : 'FT'}</span>
            </div>
            <div className="font-bold text-stone-900 text-sm mt-0.5">
              {score ? `${score.homeTeam.replace(' Bandung', '')} ${score.homeScore} — ${score.awayScore} ${score.awayTeam.replace(' Jakarta', '')}` : 'Persib 2 — 1 Persija'}
            </div>
            <div className="text-[10px] text-stone-500 truncate">
              {score ? score.stadium : 'Stadion GBLA'}
            </div>
          </div>

          {/* 5. Local Community Radar */}
          <div className="px-3 py-1 flex flex-col justify-center col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-500">
              <span>Radar Komunitas</span>
              <span className="text-stone-700 font-semibold">Lalu Lintas</span>
            </div>
            <div className="font-bold text-stone-900 text-xs mt-0.5 truncate">
              {radar ? radar.title : 'Perbaikan Pipa di Gatot Subroto'}
            </div>
            <div className="text-[10px] text-stone-500 flex justify-between items-center">
              <span>{radar ? radar.impact : 'Jalur lambat padat'}</span>
              <span className="text-red-900 font-bold">Peta &rarr;</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
