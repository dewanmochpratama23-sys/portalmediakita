/**
 * Service untuk mengambil data real-time Living Assistance Widgets.
 * Dapat dihubungkan langsung ke API publik (OpenWeather, BMKG, Logam Mulia, dsb.)
 */

export async function fetchGoldPrice() {
  // Simulasi sinkronisasi data harga emas Antam (Logam Mulia)
  return {
    source: "PT Antam Tbk (UBPP Logam Mulia)",
    pricePerGram: 1450000,
    formattedPrice: "Rp 1.450.000",
    buybackPrice: "Rp 1.332.000",
    changePercent: "+0.41%",
    changeNominal: "+Rp 6.000",
    isPositive: true,
    lastUpdated: "Hari ini, 08:30 WIB"
  };
}

export async function fetchWeatherInfo(city = "Jakarta") {
  // Dapat dihubungkan ke BMKG open data atau OpenWeatherMap API
  return {
    location: city,
    provider: "BMKG Terbuka",
    temperature: 31,
    condition: "Cerah Berawan",
    humidity: "68%",
    windSpeed: "12 km/j",
    icon: "partly-cloudy"
  };
}

export async function fetchAQIInfo(region = "Jabodetabek") {
  // Dapat dihubungkan ke OpenAQ atau AirVisual API
  return {
    region: region,
    aqi: 124,
    statusText: "Sedang / Rentan",
    statusColor: "text-amber-800 bg-amber-100",
    advice: "Disarankan memakai masker di luar ruangan"
  };
}

export async function fetchLiveScore() {
  // Dapat dihubungkan ke Football-data.org atau RapidAPI Sports
  return {
    league: "BRI Liga 1 Indonesia",
    matchStatus: "FT", // Full Time
    homeTeam: "Persib Bandung",
    awayTeam: "Persija Jakarta",
    homeScore: 2,
    awayScore: 1,
    stadium: "Stadion Gelora Bandung Lautan Api"
  };
}

export async function fetchLocalRadar() {
  // Data peristiwa berbasis komunitas / GIS
  return {
    title: "Perbaikan Pipa di Jl. Gatot Subroto",
    impact: "Jalur lambat padat merayap",
    reportsCount: 14,
    mapLink: "#"
  };
}
