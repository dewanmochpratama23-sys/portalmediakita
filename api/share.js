import { initialArticles } from '../src/data/mockArticles.js';

export default function handler(req, res) {
  const { id, t, img, desc } = req.query;

  let title = t || '';
  let coverImage = img || '';
  let excerpt = desc || '';

  // Jika parameter judul atau gambar belum ada, cari di database naskah awal
  if (!title || !coverImage) {
    const article = (initialArticles || []).find(a => 
      String(a.id) === String(id) || 
      a.slug === String(id) ||
      (id === 'founder-dewan-01' && a.id === 'dilema-warisan')
    );
    if (article) {
      title = title || article.title;
      coverImage = coverImage || article.coverImage;
      excerpt = excerpt || article.excerpt;
    }
  }

  // Fallback standar MediaKita jika tidak spesifik
  title = title || 'MediaKita — Jurnalisme Warga & Informasi Publik';
  excerpt = excerpt || 'Portal Berita Independen & Jurnalisme Warga. Membuka ruang publik bagi suara warga dengan skema bagi hasil royalti 70%, radar keamanan daerah, dan warta terverifikasi.';
  coverImage = coverImage || '/images/dilema-warisan.jpg';

  // Pastikan URL gambar absolut (HTTPS) agar bot WhatsApp / Telegram dapat mengunduh gambar
  if (coverImage.startsWith('/')) {
    coverImage = `https://www.portalmediakita.com${coverImage}`;
  }

  const destinationUrl = id
    ? `https://www.portalmediakita.com/?baca=${encodeURIComponent(id)}`
    : 'https://www.portalmediakita.com/';

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(excerpt)}">

  <!-- Open Graph / WhatsApp / Facebook / Telegram Link Preview -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${destinationUrl}">
  <meta property="og:site_name" content="Portal MediaKita">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(excerpt)}">
  <meta property="og:image" content="${escapeHtml(coverImage)}">
  <meta property="og:image:secure_url" content="${escapeHtml(coverImage)}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escapeHtml(title)}">

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@portalmediakita">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(excerpt)}">
  <meta name="twitter:image" content="${escapeHtml(coverImage)}">

  <!-- Redirect otomatis untuk pembaca manusia -->
  <meta http-equiv="refresh" content="0;url=${destinationUrl}">
  <script>
    window.location.replace("${destinationUrl}");
  </script>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 2rem; text-align: center; background: #FAF8F5; color: #1C1917;">
  <p style="font-size: 14px; color: #666;">Sedang membuka artikel di Portal MediaKita...</p>
  <h2 style="font-size: 18px; margin-top: 10px;">${escapeHtml(title)}</h2>
  <p style="margin-top: 20px;"><a href="${destinationUrl}" style="display: inline-block; padding: 8px 16px; background: #1C1917; color: #FAF8F5; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 13px;">Klik di sini jika tidak otomatis beralih</a></p>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  return res.status(200).send(html);
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
