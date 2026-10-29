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

export default function App() {
  // ROLE PENGGUNA:
  // 'reader'      -> Pembaca Publik biasa (Tampilan bersih tanpa tab)
  // 'contributor' -> Jurnalis / Penulis Warga (Punya Dashboard & Meja Tulis)
  // 'admin'       -> Pemilik Platform / Super Admin (Punya Panel Redaksi, Takedown, & Hapus Berita)
  const [userRole, setUserRole] = useState('reader');
  const [currentAuthor, setCurrentAuthor] = useState(null);

  // VIEW AKTIF:
  const [currentView, setCurrentView] = useState('portal'); // 'portal' | 'dashboard' | 'editor' | 'admin' | 'article-detail'
  const [articles, setArticles] = useState(initialArticles);
  const [pendingList, setPendingList] = useState(initialPending);
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
    setSelectedArticle(article);
    setCurrentView('article-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePublishNewArticle = (newArt) => {
    setPendingList([newArt, ...pendingList]);
    setCurrentView('dashboard');
  };

  const handleApproveArticle = (item) => {
    const approved = {
      ...item,
      status: 'published',
      publishedAt: 'Baru saja',
      readingTime: '4 min baca',
      views: 120,
      likes: 12,
      coverImage: item.coverImage || "https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?w=800&auto=format&fit=crop&q=80",
      author: typeof item.author === 'string'
        ? { name: item.author, role: "Kontributor Warga", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", verified: true }
        : item.author,
      royaltyAmount: 32000
    };
    setArticles([approved, ...articles]);
    setPendingList(pendingList.filter(p => p.id !== item.id));
    alert(`Artikel "${item.title}" resmi disetujui & tayang di portal utama!`);
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
                <span>{selectedArticle.views.toLocaleString()} Pembaca</span>
                <span>&bull;</span>
                <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-300 rounded">
                  Royalti Penulis: 70% Aktif
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
                Dokumentasi lapangan kontributor MediaKita.
              </p>
            </div>

            <div className="font-serif text-lg text-stone-800 leading-relaxed space-y-5 whitespace-pre-line">
              {selectedArticle.content}
            </div>

            <div className="mt-10 p-5 bg-[#F5F2EB] border border-stone-300 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900">
                  Dukung Jurnalis Warga
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Tulisan ini telah menghasilkan royalti Rp {selectedArticle.royaltyAmount?.toLocaleString() || '45.000'} dari trafik pembaca.
                </p>
              </div>
              <button
                onClick={() => alert("Tautan artikel berhasil disalin ke clipboard!")}
                className="bg-stone-900 text-[#FAF8F5] text-xs font-semibold px-3 py-1.5 rounded"
              >
                Bagikan Naskah
              </button>
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
