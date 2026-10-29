import React, { useState, useEffect, useRef } from 'react';
import Masthead from './components/Masthead';
import LivingAssistanceBar from './components/LivingAssistanceBar';
import LeadStory from './components/LeadStory';
import SidebarDispatch from './components/SidebarDispatch';
import NewsGrid from './components/NewsGrid';
import ContributorDashboard from './components/ContributorDashboard';
import ArticleEditor from './components/ArticleEditor';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import LegalPedomanModal from './components/LegalPedomanModal';
import { initialArticles, pendingArticles as initialPending } from './data/mockArticles';
import { supabase } from './lib/supabaseClient';

const STORAGE_KEY_ARTICLES = 'mediakita_portal_articles_v7';
const STORAGE_KEY_PENDING = 'mediakita_portal_pending_v7';

export default function App() {
  // ROLE PENGGUNA:
  // 'reader'      -> Pembaca Publik biasa (Tampilan bersih tanpa tab)
  // 'contributor' -> Jurnalis / Penulis Warga (Punya Dashboard & Meja Tulis)
  // 'admin'       -> Pemilik Platform / Super Admin (Punya Panel Redaksi, Takedown, & Hapus Berita)
  const [userRole, setUserRole] = useState('reader');
  const [currentAuthor, setCurrentAuthor] = useState(null);

  // VIEW AKTIF:
  const [currentView, setCurrentView] = useState('portal'); // 'portal' | 'dashboard' | 'editor' | 'admin' | 'article-detail'
  
  // SINKRONISASI DATA ARTIKEL & PERSISTENSI LOCAL STORAGE
  const [articles, setArticles] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ARTICLES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Storage read error", e);
    }
    return initialArticles;
  });

  const [pendingList, setPendingList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PENDING);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn("Pending storage read error", e);
    }
    return initialPending;
  });

  // Simpan perubahan ke LocalStorage secara otomatis
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(articles));
    } catch (e) {
      console.warn("Storage write error", e);
    }
  }, [articles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PENDING, JSON.stringify(pendingList));
    } catch (e) {
      console.warn("Pending storage write error", e);
    }
  }, [pendingList]);

  // SINKRONISASI DATABASE CLOUD SUPABASE
  useEffect(() => {
    async function fetchCloudArticles() {
      try {
        const { data: remoteArticles, error: errArt } = await supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false });

        if (remoteArticles && remoteArticles.length > 0 && !errArt) {
          setArticles(remoteArticles);
          try {
            localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(remoteArticles));
          } catch (e) {}
        }

        const { data: remotePending, error: errPend } = await supabase
          .from('pending_articles')
          .select('*')
          .order('created_at', { ascending: false });

        if (remotePending && !errPend) {
          setPendingList(remotePending);
          try {
            localStorage.setItem(STORAGE_KEY_PENDING, JSON.stringify(remotePending));
          } catch (e) {}
        }
      } catch (err) {
        console.warn('Supabase initial fetch fallback:', err);
      }
    }

    fetchCloudArticles();
  }, []);

  const [activeCategory, setActiveCategory] = useState('Semua');
  const [selectedArticle, setSelectedArticle] = useState(null);

  // MODAL LOGIN & LEGAL PEDOMAN
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginTargetRole, setLoginTargetRole] = useState('contributor');
  const [pedomanModalOpen, setPedomanModalOpen] = useState(false);

  // CATATAN REDAKSI UNTUK BERITA YANG DITARIK (TAKEDOWN NOTICES)
  const [takedownNotices, setTakedownNotices] = useState([]);

  // STATE VERIFIKASI IDENTITAS KTP (KYC ANTI-HOAX & STANDAR KOMPASIANA)
  const [ktpRequests, setKtpRequests] = useState([
    {
      id: 'KTP-REQ-101',
      authorId: 'MK-2026-084',
      authorName: 'Budi Setiawan, M.Sc.',
      nik: '3171022904880003',
      ktpImage: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80',
      submittedAt: '28 Oktober 2026',
      status: 'pending'
    }
  ]);

  // REF AGAR ROUTING TAUTAN HANYA DIPERIKSA SEKALI SAAT BUKA HALAMAN (MENCEGAH LOOP SCROLL)
  const initialUrlCheckedRef = useRef(false);

  // FUNGSI NAVIGASI KEMBALI KE BERANDA (DIGUNAKAN UNIVERSAL DI SEMUA TOMBOL BACK)
  const handleBackToHome = () => {
    setSelectedArticle(null);
    setCurrentView('portal');
    try {
      window.history.pushState(null, '', window.location.pathname);
    } catch (e) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. DUKUNGAN TOMBOL BACK BROWSER & HP ANDROID/IPHONE (POPSTATE EVENT LISTENER)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const bacaId = params.get('baca');
      if (bacaId) {
        const target = articles.find(a => 
          String(a.id) === String(bacaId) || 
          a.slug === String(bacaId) ||
          (bacaId === 'founder-dewan-01' && a.id === 'dilema-warisan')
        );
        if (target) {
          setSelectedArticle(target);
          setCurrentView('article-detail');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
      // Jika URL tidak memuat ?baca (user menekan tombol Back HP/Browser untuk ke beranda)
      setSelectedArticle(null);
      setCurrentView('portal');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [articles]);

  // 2. DETEKSI SHORTCUT RAHASIA & HASH URL (#admin, #penulis)
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin') {
        setLoginTargetRole('admin');
        setLoginModalOpen(true);
      } else if (hash === '#penulis' || hash === '#kontributor') {
        setLoginTargetRole('contributor');
        setLoginModalOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setLoginTargetRole('admin');
        setLoginModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 3. DETEKSI DIRECT LINK ARTIKEL (?baca=ID) — HANYA SEKALI SAAT HALAMAN PERTAMA DIBUKA
  useEffect(() => {
    if (initialUrlCheckedRef.current) return;
    initialUrlCheckedRef.current = true;

    try {
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash.toLowerCase();
      const bacaId = params.get('baca') || (hash.startsWith('#baca-') ? window.location.hash.replace('#baca-', '') : null);
      if (bacaId) {
        const target = articles.find(a => 
          String(a.id) === String(bacaId) || 
          a.slug === String(bacaId) ||
          (bacaId === 'founder-dewan-01' && a.id === 'dilema-warisan')
        );
        if (target) {
          handleSelectArticle(target);
        }
      }
    } catch (e) {
      console.warn("Direct article url parse error", e);
    }
  }, []);

  // 4. INTEGRASI GOOGLE ANALYTICS 4 (PELACAKAN PENGUNJUNG REALTIME)
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      if (currentView === 'article-detail' && selectedArticle) {
        window.gtag('event', 'page_view', {
          page_title: selectedArticle.title,
          page_location: window.location.href,
          page_path: `/baca/${selectedArticle.slug || selectedArticle.id}`
        });
      } else if (currentView === 'portal') {
        window.gtag('event', 'page_view', {
          page_title: 'MediaKita — Jurnalisme Warga & Informasi Publik',
          page_location: window.location.href,
          page_path: '/'
        });
      }
    }
  }, [currentView, selectedArticle?.id]);

  const handleOpenLogin = (role) => {
    setLoginTargetRole(role);
    setLoginModalOpen(true);
  };

  const handleLoginSuccess = (role, profile) => {
    setUserRole(role);
    if (profile) setCurrentAuthor(profile);
    if (role === 'admin') {
      setCurrentView('admin');
    } else if (role === 'contributor') {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setUserRole('reader');
    setCurrentAuthor(null);
    setCurrentView('portal');
    window.location.hash = '';
    alert('Anda telah keluar. Sekarang kembali ke tampilan Pembaca Publik biasa.');
  };

  // =========================================================================
  // FUNGSI KHUSUS FOUNDER / ADMIN: HAPUS & TAKEDOWN ARTIKEL
  // =========================================================================
  const handleDeleteArticle = async (articleId) => {
    setArticles(prevArticles => prevArticles.filter(a => String(a.id) !== String(articleId)));
    if (selectedArticle && String(selectedArticle.id) === String(articleId)) {
      setSelectedArticle(null);
      setCurrentView('portal');
    }
    try {
      await supabase.from('articles').delete().eq('id', String(articleId));
    } catch (e) {
      console.warn("Delete article cloud error:", e);
    }
    alert("✓ Artikel berhasil dihapus permanen dari portal berita!");
  };

  const handleTakedownArticle = async (articleId) => {
    const target = articles.find(a => String(a.id) === String(articleId));
    if (!target) return;

    // Hapus dari daftar terbit publik
    setArticles(prevArticles => prevArticles.filter(a => String(a.id) !== String(articleId)));
    
    // Masukkan kembali ke antrean naskah/revisi dengan status unlisted
    const unlisted = {
      ...target,
      status: 'pending',
      submittedAt: 'Ditarik dari publik oleh Redaksi'
    };
    setPendingList(prev => [unlisted, ...prev]);

    // Hapus dari articles di Supabase, masukkan ke pending_articles di Supabase
    try {
      await supabase.from('articles').delete().eq('id', String(articleId));
      await supabase.from('pending_articles').upsert([{
        id: String(target.id),
        title: target.title,
        category: target.category,
        author: typeof target.author === 'string' ? target.author : (target.author?.name || 'Kontributor Warga'),
        submittedAt: 'Ditarik dari publik oleh Redaksi',
        status: 'pending',
        originalityScore: 90,
        excerpt: target.excerpt,
        content: target.content,
        coverImage: target.coverImage
      }]);
    } catch (e) {
      console.warn("Takedown cloud error:", e);
    }

    // Buat catatan redaksi resmi transparan untuk publik
    const formattedDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const noticeText = `Artikel "${target.title}" telah ditarik dari peredaran oleh Redaksi pada ${formattedDate} karena sedang dalam proses verifikasi faktual / evaluasi kepatuhan pedoman komunitas.`;
    setTakedownNotices(prev => [{ id: target.id, title: target.title, date: formattedDate, notice: noticeText }, ...prev]);

    if (selectedArticle && String(selectedArticle.id) === String(articleId)) {
      setSelectedArticle(null);
      setCurrentView('portal');
    }
    alert(`✓ Artikel "${target.title}" berhasil ditarik!\nCatatan Redaksi resmi telah diterbitkan secara transparan.`);
  };

  // Filter artikel berdasarkan rubrik aktif
  const filteredArticles = activeCategory === 'Semua'
    ? articles
    : articles.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase());

  const leadArticle = filteredArticles.find(a => a.isLead) || filteredArticles[0];

  const handleSelectArticle = (article) => {
    if (!article) return;

    // Jika artikel ini sedang dibuka, jangan scroll paksa atau reset posisi baca
    if (selectedArticle && String(selectedArticle.id) === String(article.id) && currentView === 'article-detail') {
      return;
    }

    // 1. CEK SESI PEMBACA (ANTI-SPAM & ANTI-PEMBENGKAKAN ROYALTI PALSU)
    // Hanya hitung +1 tayangan jika pembaca ini belum pernah membaca artikel ini dalam sesi browser aktifnya.
    const sessionKey = `mediakita_viewed_${article.id}`;
    let isNewRead = false;
    try {
      if (typeof window !== 'undefined' && !sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, '1');
        isNewRead = true;
      }
    } catch (e) {
      isNewRead = false;
    }

    const nextViews = isNewRead ? (article.views || 0) + 1 : (article.views || 0);
    const nextRoyalty = Math.round(nextViews * 25); // Royalti transparan berbasis pembaca murni

    if (isNewRead) {
      setArticles(prevArticles => prevArticles.map(a => {
        if (String(a.id) === String(article.id)) {
          return {
            ...a,
            views: nextViews,
            royaltyAmount: nextRoyalty
          };
        }
        return a;
      }));

      // Simpan pembaruan pembaca & royalti ke Supabase Cloud
      try {
        supabase
          .from('articles')
          .update({ views: nextViews, royaltyAmount: nextRoyalty })
          .eq('id', String(article.id))
          .then();
      } catch (e) {
        console.warn("Update views cloud error:", e);
      }
    }

    setSelectedArticle({
      ...article,
      views: nextViews,
      royaltyAmount: nextRoyalty
    });

    setCurrentView('article-detail');
    try {
      const slugOrId = article.slug || article.id;
      window.history.pushState({ articleId: article.id }, '', `?baca=${encodeURIComponent(slugOrId)}`);
    } catch (e) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePublishNewArticle = async (newArt) => {
    setPendingList([newArt, ...pendingList]);
    setCurrentView('dashboard');
    try {
      await supabase.from('pending_articles').insert([{
        id: String(newArt.id),
        title: newArt.title,
        category: newArt.category,
        author: typeof newArt.author === 'string' ? newArt.author : (newArt.author?.name || "Kontributor Warga"),
        submittedAt: newArt.publishedAt || "Baru saja",
        status: "pending",
        originalityScore: 95,
        excerpt: newArt.excerpt,
        content: newArt.content,
        coverImage: newArt.coverImage
      }]);
    } catch (e) {
      console.warn("Gagal simpan pending article ke Supabase:", e);
    }
  };

  // =========================================================================
  // FUNGSI KHUSUS FOUNDER: TERBITKAN ARTIKEL LANGSUNG TAYANG (TANPA ANTRE)
  // =========================================================================
  const handlePublishFounderArticle = async (articleData) => {
    const wordsCount = articleData.content ? articleData.content.split(/\s+/).length : 200;
    const readMinutes = Math.max(2, Math.round(wordsCount / 160));

    const newArt = {
      id: `founder-${Date.now()}`,
      title: articleData.title,
      category: articleData.category || 'Tajuk Rencana',
      slug: (articleData.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      excerpt: articleData.excerpt || (articleData.content ? articleData.content.substring(0, 160) + '...' : 'Catatan resmi Redaksi MediaKita.'),
      content: articleData.content,
      coverImage: articleData.coverImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80",
      readingTime: `${readMinutes} min baca`,
      publishedAt: 'Baru saja',
      views: 0, // Murni 0 pembaca awal (bertambah otomatis saat dibaca pengunjung)
      likes: 0,
      isLead: Boolean(articleData.isLead),
      royaltyAmount: 0,
      author: {
        name: articleData.authorName || "Dewan Mochamad Pratama",
        role: "Founder & Pemimpin Redaksi",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        verified: true,
        isKtpVerified: true
      },
      status: 'published'
    };

    setArticles(prevArticles => {
      let updated = prevArticles;
      if (newArt.isLead) {
        updated = updated.map(a => ({ ...a, isLead: false }));
      }
      return [newArt, ...updated];
    });

    try {
      if (newArt.isLead) {
        await supabase.from('articles').update({ isLead: false }).neq('id', newArt.id);
      }
      await supabase.from('articles').insert([newArt]);
    } catch (e) {
      console.warn("Founder article cloud save error:", e);
    }

    alert(`✓ SELAMAT! Artikel Founder:\n"${newArt.title}"\nresmi TAYANG LANGSUNG di halaman utama Portal MediaKita!\n(Jumlah pembaca dimulai dari 0 dan terupdate real-time).`);
  };

  const handleApproveArticle = async (item) => {
    const approved = {
      ...item,
      id: String(item.id),
      status: 'published',
      publishedAt: 'Baru saja',
      readingTime: '4 min baca',
      views: 0, // Dimulai dari 0 pembaca murni
      likes: 0,
      coverImage: item.coverImage || "https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?w=800&auto=format&fit=crop&q=80",
      author: typeof item.author === 'string'
        ? { name: item.author, role: "Kontributor Warga", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", verified: true }
        : item.author,
      royaltyAmount: 0
    };
    setArticles([approved, ...articles]);
    setPendingList(pendingList.filter(p => String(p.id) !== String(item.id)));

    try {
      await supabase.from('articles').upsert([approved]);
      await supabase.from('pending_articles').delete().eq('id', String(item.id));
    } catch (e) {
      console.warn("Approve cloud error:", e);
    }

    alert(`Artikel "${item.title}" resmi disetujui & tayang di portal utama!`);
  };

  // =========================================================================
  // FUNGSI KHUSUS FOUNDER: KOREKSI / RESET ANGKA PEMBACA REAL-TIME
  // =========================================================================
  const handleUpdateArticleViews = async (articleId, newViews) => {
    const safeViews = Math.max(0, parseInt(newViews, 10) || 0);
    const safeRoyalty = Math.round(safeViews * 25);
    setArticles(prevArticles => prevArticles.map(a => {
      if (String(a.id) === String(articleId)) {
        return { ...a, views: safeViews, royaltyAmount: safeRoyalty };
      }
      return a;
    }));
    if (selectedArticle && String(selectedArticle.id) === String(articleId)) {
      setSelectedArticle(prev => ({
        ...prev,
        views: safeViews,
        royaltyAmount: safeRoyalty
      }));
    }
    try {
      await supabase.from('articles').update({ views: safeViews, royaltyAmount: safeRoyalty }).eq('id', String(articleId));
    } catch (e) {
      console.warn("Update views cloud error:", e);
    }
    alert(`✓ Jumlah pembaca artikel berhasil diperbarui menjadi ${safeViews.toLocaleString('id-ID')} pembaca!`);
  };

  const handleRejectArticle = async (id) => {
    setPendingList(pendingList.filter(p => String(p.id) !== String(id)));
    try {
      await supabase.from('pending_articles').delete().eq('id', String(id));
    } catch (e) {
      console.warn("Reject cloud error:", e);
    }
    alert("Catatan revisi telah dikirimkan ke surel penulis.");
  };

  // =========================================================================
  // FUNGSI VERIFIKASI KTP (KYC KONTRIBUTOR)
  // =========================================================================
  const handleRequestKtpVerification = (payload) => {
    const newReq = {
      ...payload,
      id: payload.id || `KTP-REQ-${Date.now()}`,
      status: 'pending'
    };
    setKtpRequests(prev => [newReq, ...prev]);
  };

  const handleApproveKtp = (requestId) => {
    const target = ktpRequests.find(r => r.id === requestId);
    if (!target) return;

    setKtpRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'approved' } : r));

    // Jika kontributor yang sedang login cocok namanya, aktifkan centang hijau
    if (currentAuthor && (currentAuthor.name === target.authorName || currentAuthor.idNumber === target.authorId)) {
      setCurrentAuthor(prev => ({
        ...prev,
        isKtpVerified: true,
        verified: true
      }));
    }

    alert(`✓ Verifikasi KTP untuk "${target.authorName}" (NIK: ${target.nik}) BERHASIL DISETUJUI!\nAkun penulis resmi mendapatkan lencana Centang Hijau dan hak pencairan royalti 70%.`);
  };

  const handleRejectKtp = (requestId) => {
    const target = ktpRequests.find(r => r.id === requestId);
    if (!target) return;

    const reason = prompt(`Masukkan alasan penolakan verifikasi KTP untuk "${target.authorName}":`, "Foto fisik KTP buram / nomor NIK tidak terbaca jelas");
    if (reason === null) return;

    setKtpRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected', rejectReason: reason } : r));
    alert(`Permohonan verifikasi KTP ditolak dengan catatan: "${reason}". Penulis diminta mengunggah ulang.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1917]">
      {/* 1. Authentic Newspaper Masthead */}
      <Masthead
        userRole={userRole}
        currentAuthor={currentAuthor}
        currentView={currentView}
        setCurrentView={(view) => {
          if (view === 'portal') {
            handleBackToHome();
          } else {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onOpenLogin={handleOpenLogin}
        onLogout={handleLogout}
      />

      {/* 2. Living Assistance Bar (Hanya tampil di portal dan artikel) */}
      {(currentView === 'portal' || currentView === 'article-detail') && (
        <LivingAssistanceBar />
      )}

      {/* 3. Main Views Switching */}
      <main className="flex-1">
        {/* VIEW A: PORTAL UTAMA (PUBLIK) */}
        {currentView === 'portal' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Box Catatan Redaksi Resmi Jika Ada Berita yang Ditarik/Takedown */}
            {takedownNotices.length > 0 && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded text-xs text-amber-950">
                <div className="font-bold uppercase tracking-wider text-[10px] text-amber-900 mb-1 flex items-center gap-1.5">
                  <span>📢</span> <span>Catatan Redaksi MediaKita (Pemberitahuan Penarikan Berita)</span>
                </div>
                <ul className="space-y-1.5 mt-2 divide-y divide-amber-200/60">
                  {takedownNotices.map((t) => (
                    <li key={t.id} className="pt-1.5 text-[11px] leading-relaxed">
                      <span className="font-bold text-amber-900">[{t.title}]: </span>
                      <span className="italic">{t.notice}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 border-b border-stone-300">
              <div className="lg:col-span-8">
                <LeadStory
                  article={leadArticle}
                  onSelectArticle={handleSelectArticle}
                  userRole={userRole}
                  onDeleteArticle={handleDeleteArticle}
                />
              </div>
              <div className="lg:col-span-4">
                <SidebarDispatch
                  articles={filteredArticles}
                  onWriteArticle={() => {
                    if (userRole === 'reader') {
                      handleOpenLogin('contributor');
                    } else {
                      setCurrentView('editor');
                    }
                  }}
                  onSelectArticle={handleSelectArticle}
                />
              </div>
            </div>

            <NewsGrid
              articles={filteredArticles}
              onSelectArticle={handleSelectArticle}
              userRole={userRole}
              onDeleteArticle={handleDeleteArticle}
            />
          </div>
        )}

        {/* VIEW B: BACA ARTIKEL PENUH */}
        {currentView === 'article-detail' && selectedArticle && (
          <div className="max-w-4xl mx-auto px-4 py-10">
            {/* Action Bar Khusus Founder / Admin Jika Sedang Membaca Artikel Ini */}
            {userRole === 'admin' && (
              <div className="mb-6 p-3 bg-red-50 border border-red-300 rounded flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-red-950 font-bold">
                  <span>🛡️ KONTROL FOUNDER:</span>
                  <span className="font-normal text-stone-700">Artikel ini sedang tayang di publik</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (confirm(`Tarik artikel "${selectedArticle.title}" dari peredaran publik?`)) {
                        handleTakedownArticle(selectedArticle.id);
                      }
                    }}
                    className="border border-stone-400 bg-white text-stone-800 px-3 py-1 font-semibold hover:bg-stone-100"
                  >
                    ⏸️ Tarik (Takedown)
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`PERINGATAN: Hapus permanen artikel "${selectedArticle.title}"?`)) {
                        handleDeleteArticle(selectedArticle.id);
                      }
                    }}
                    className="bg-red-800 hover:bg-red-900 text-white px-3 py-1 font-bold transition"
                  >
                    🗑️ Hapus Artikel
                  </button>
                </div>
              </div>
            )}

            {/* Tombol Kembali ke Beranda Utama (Mendukung Desktop & Mobile) */}
            <div className="mb-4">
              <button
                type="button"
                onClick={handleBackToHome}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-stone-100 text-stone-800 font-bold text-xs rounded border border-stone-300 transition shadow-sm cursor-pointer"
              >
                <span className="text-sm font-black">&larr;</span>
                <span>Kembali ke Beranda Utama</span>
              </button>
            </div>

            <span className="text-[10px] font-bold text-red-900 uppercase tracking-widest block mb-1">
              {selectedArticle.category}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-black text-stone-950 leading-tight">
              {selectedArticle.title}
            </h1>
            
            <div className="mt-4 pt-3 pb-3 border-y border-stone-300 flex flex-wrap items-center justify-between text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-900">{selectedArticle.author.name}</span>
                <span>&bull;</span>
                <span>{selectedArticle.author.role}</span>
                <span>&bull;</span>
                <span>{selectedArticle.publishedAt}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="flex items-center gap-1.5 text-stone-800 font-medium bg-stone-100 px-2.5 py-1 rounded border border-stone-200">
                  <svg className="w-3.5 h-3.5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{(selectedArticle.views || 0).toLocaleString('id-ID')} Pembaca</span>
                </span>
                <span>&bull;</span>
                <span className="text-stone-500 text-[11px] font-medium">
                  {selectedArticle.readingTime || '3 min baca'}
                </span>
                <span>&bull;</span>
                <span className="text-emerald-800 text-[11px] font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded">
                  ✓ Liputan Terverifikasi
                </span>
              </div>
            </div>

            <div className="my-6">
              <img
                src={selectedArticle.coverImage}
                alt={selectedArticle.title}
                className="w-full h-96 object-cover rounded border border-stone-300"
              />
              <p className="text-[11px] text-stone-500 mt-1 italic">
                Dokumentasi liputan terverifikasi Redaksi MediaKita.
              </p>
            </div>

            <div className="font-serif text-lg text-stone-800 leading-relaxed space-y-5 whitespace-pre-line">
              {selectedArticle.content}
            </div>

            <div className="mt-10 p-5 bg-[#F5F2EB] border border-stone-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                  <span>📰</span>
                  <span>Jurnalisme Warga Independen &amp; Terbuka</span>
                </h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Liputan ini telah dibaca <strong className="text-stone-900">{(selectedArticle.views || 0).toLocaleString('id-ID')} kali</strong> oleh pembaca publik. Dukung jurnalisme warga dengan memberikan apresiasi atau menyebarkan informasi ini ke komunitas Anda.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => {
                    const nextLikes = (selectedArticle.likes || 0) + 1;
                    setSelectedArticle(prev => ({ ...prev, likes: nextLikes }));
                    setArticles(prevArticles => prevArticles.map(a => a.id === selectedArticle.id ? { ...a, likes: nextLikes } : a));
                    alert("❤️ Terima kasih! Apresiasi pembaca berhasil ditambahkan.");
                  }}
                  className="bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 transition"
                >
                  <span>❤️ Apresiasi</span>
                  <span className="font-bold">({selectedArticle.likes || 0})</span>
                </button>

                {/* Tombol Bagikan Langsung ke WhatsApp dengan Link Preview Foto Berita Ringkas */}
                <button
                  onClick={() => {
                    const articleSlug = selectedArticle.slug || selectedArticle.id;
                    const shareUrl = `https://www.portalmediakita.com/baca/${articleSlug}`;
                    const waText = `*${selectedArticle.title}*\n\nBaca liputan selengkapnya di MediaKita:\n${shareUrl}`;
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`, '_blank');
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-1.5 rounded flex items-center gap-1.5 transition shadow-sm"
                  title="Bagikan artikel ini ke WhatsApp (dengan pratinjau foto sampul)"
                >
                  <span>📲</span>
                  <span>Kirim ke WhatsApp</span>
                </button>

                {/* Tombol Salin Tautan Berita Ringkas & Bersih */}
                <button
                  onClick={() => {
                    const articleSlug = selectedArticle.slug || selectedArticle.id;
                    const shareUrl = `https://www.portalmediakita.com/baca/${articleSlug}`;
                    navigator.clipboard?.writeText(shareUrl);
                    alert(`✓ Tautan Berita Ringkas Berhasil Disalin!\n\n${shareUrl}\n\nSaat Anda menempelkan tautan ini di WhatsApp Status atau Chat, foto sampul berita akan langsung muncul otomatis!`);
                  }}
                  className="bg-stone-900 hover:bg-stone-800 text-[#FAF8F5] text-xs font-semibold px-3.5 py-1.5 rounded transition flex items-center gap-1.5"
                >
                  <span>📋</span>
                  <span>Salin Tautan</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW C: DASHBOARD PENULIS (Hanya jika login) */}
        {currentView === 'dashboard' && userRole !== 'reader' && (
          <ContributorDashboard
            author={currentAuthor}
            articles={[...articles, ...pendingList]}
            onWriteArticle={() => setCurrentView('editor')}
            onSubmitKtp={handleRequestKtpVerification}
          />
        )}

        {/* VIEW D: MEJA TULIS EDITOR (Hanya jika login) */}
        {currentView === 'editor' && userRole !== 'reader' && (
          <ArticleEditor
            author={currentAuthor}
            onBack={() => setCurrentView(userRole === 'admin' ? 'admin' : 'dashboard')}
            onPublish={handlePublishNewArticle}
            onOpenPedoman={() => setPedomanModalOpen(true)}
          />
        )}

        {/* VIEW E: PANEL ADMIN REDAKSI (Hanya Anda / Super Admin) */}
        {currentView === 'admin' && userRole === 'admin' && (
          <AdminPanel
            pendingList={pendingList}
            publishedArticles={articles}
            ktpRequests={ktpRequests}
            onApprove={handleApproveArticle}
            onReject={handleRejectArticle}
            onDeleteArticle={handleDeleteArticle}
            onTakedownArticle={handleTakedownArticle}
            onApproveKtp={handleApproveKtp}
            onRejectKtp={handleRejectKtp}
            onPublishFounderArticle={handlePublishFounderArticle}
            onUpdateArticleViews={handleUpdateArticleViews}
          />
        )}
      </main>

      {/* 4. Editorial Footer */}
      <Footer
        userRole={userRole}
        onNavigate={(view) => {
          if (view === 'portal') {
            handleBackToHome();
          } else {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenLogin={handleOpenLogin}
        onOpenPedoman={() => setPedomanModalOpen(true)}
      />

      {/* 5. Modal Dialog Login Rahasia */}
      <LoginModal
        isOpen={loginModalOpen}
        targetRole={loginTargetRole}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 6. Modal Pedoman Pemberitaan & Kepatuhan Hukum */}
      <LegalPedomanModal
        isOpen={pedomanModalOpen}
        onClose={() => setPedomanModalOpen(false)}
      />
    </div>
  );
}
