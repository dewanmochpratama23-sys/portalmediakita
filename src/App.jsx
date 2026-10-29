import React, { useState, useEffect } from 'react';
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

const STORAGE_KEY_ARTICLES = 'mediakita_portal_articles_v3';
const STORAGE_KEY_PENDING = 'mediakita_portal_pending_v3';

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
          // Koreksi otomatis jika ada artikel founder lama yang nilainya masih 24 (bug template awal)
          return parsed.map(a => {
            if (a.id && String(a.id).startsWith('founder-') && a.views === 24 && a.likes === 5) {
              return { ...a, views: 0, likes: 0, royaltyAmount: 0 };
            }
            return a;
          });
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

  // DETEKSI SHORTCUT RAHASIA & HASH URL
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
  const handleDeleteArticle = (articleId) => {
    setArticles(prevArticles => prevArticles.filter(a => a.id !== articleId));
    if (selectedArticle && selectedArticle.id === articleId) {
      setSelectedArticle(null);
      setCurrentView('portal');
    }
    alert("✓ Artikel berhasil dihapus permanen dari portal berita!");
  };

  const handleTakedownArticle = (articleId) => {
    const target = articles.find(a => a.id === articleId);
    if (!target) return;

    // Hapus dari daftar terbit publik
    setArticles(prevArticles => prevArticles.filter(a => a.id !== articleId));
    
    // Masukkan kembali ke antrean naskah/revisi dengan status unlisted
    const unlisted = {
      ...target,
      status: 'pending',
      submittedAt: 'Ditarik dari publik oleh Redaksi'
    };
    setPendingList(prev => [unlisted, ...prev]);

    // Buat catatan redaksi resmi transparan untuk publik
    const formattedDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const noticeText = `Artikel "${target.title}" telah ditarik dari peredaran oleh Redaksi pada ${formattedDate} karena sedang dalam proses verifikasi faktual / evaluasi kepatuhan pedoman komunitas.`;
    setTakedownNotices(prev => [{ id: target.id, title: target.title, date: formattedDate, notice: noticeText }, ...prev]);

    if (selectedArticle && selectedArticle.id === articleId) {
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
    // 1. Tambah jumlah pembaca artikel secara real-time (+1 pembaca)
    const nextViews = (article.views || 0) + 1;
    const nextRoyalty = Math.round(nextViews * 25); // Royalti transparan

    setArticles(prevArticles => prevArticles.map(a => {
      if (a.id === article.id) {
        return {
          ...a,
          views: nextViews,
          royaltyAmount: nextRoyalty
        };
      }
      return a;
    }));

    setSelectedArticle({
      ...article,
      views: nextViews,
      royaltyAmount: nextRoyalty
    });

    setCurrentView('article-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePublishNewArticle = (newArt) => {
    setPendingList([newArt, ...pendingList]);
    setCurrentView('dashboard');
  };

  // =========================================================================
  // FUNGSI KHUSUS FOUNDER: TERBITKAN ARTIKEL LANGSUNG TAYANG (TANPA ANTRE)
  // =========================================================================
  const handlePublishFounderArticle = (articleData) => {
    const wordsCount = articleData.content ? articleData.content.split(/\s+/).length : 200;
    const readMinutes = Math.max(2, Math.round(wordsCount / 160));

    const newArt = {
      id: `founder-${Date.now()}`,
      title: articleData.title,
      category: articleData.category || 'Tajuk Rencana',
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

    alert(`✓ SELAMAT! Artikel Founder:\n"${newArt.title}"\nresmi TAYANG LANGSUNG di halaman utama Portal MediaKita!\n(Jumlah pembaca dimulai dari 0 dan terupdate real-time).`);
  };

  const handleApproveArticle = (item) => {
    const approved = {
      ...item,
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
    setPendingList(pendingList.filter(p => p.id !== item.id));
    alert(`Artikel "${item.title}" resmi disetujui & tayang di portal utama!`);
  };

  // =========================================================================
  // FUNGSI KHUSUS FOUNDER: KOREKSI / RESET ANGKA PEMBACA REAL-TIME
  // =========================================================================
  const handleUpdateArticleViews = (articleId, newViews) => {
    const safeViews = Math.max(0, parseInt(newViews, 10) || 0);
    const safeRoyalty = Math.round(safeViews * 25);
    setArticles(prevArticles => prevArticles.map(a => {
      if (a.id === articleId) {
        return { ...a, views: safeViews, royaltyAmount: safeRoyalty };
      }
      return a;
    }));
    if (selectedArticle && selectedArticle.id === articleId) {
      setSelectedArticle(prev => ({
        ...prev,
        views: safeViews,
        royaltyAmount: safeRoyalty
      }));
    }
    alert(`✓ Jumlah pembaca artikel berhasil diperbarui menjadi ${safeViews.toLocaleString('id-ID')} pembaca!`);
  };

  const handleRejectArticle = (id) => {
    setPendingList(pendingList.filter(p => p.id !== id));
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
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
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

            <button
              onClick={() => setCurrentView('portal')}
              className="text-xs font-semibold text-stone-600 hover:text-stone-950 mb-4 inline-block"
            >
              &larr; Kembali ke Beranda Utama
            </button>

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
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-stone-800 font-semibold bg-stone-100 px-2.5 py-1 rounded border border-stone-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                  <span>{(selectedArticle.views || 0).toLocaleString('id-ID')} Pembaca (Real-Time)</span>
                </span>
                <span>&bull;</span>
                <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-300 rounded">
                  Royalti: Rp {(selectedArticle.royaltyAmount || 0).toLocaleString('id-ID')}
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
                  <span>⚡</span>
                  <span>Dukungan Pembaca &amp; Bagi Hasil Royalti</span>
                </h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Artikel ini telah dibaca <strong className="text-stone-900">{(selectedArticle.views || 0).toLocaleString('id-ID')} kali</strong> secara real-time dan terakumulasi royalti <strong className="text-emerald-800">Rp {(selectedArticle.royaltyAmount || 0).toLocaleString('id-ID')}</strong> (skema bagi hasil 70% penulis).
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
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
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert("✓ Tautan artikel berhasil disalin! Bagikan ke WhatsApp atau media sosial.");
                  }}
                  className="bg-stone-900 hover:bg-stone-800 text-[#FAF8F5] text-xs font-semibold px-3 py-1.5 rounded transition"
                >
                  Bagikan Naskah
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
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
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
