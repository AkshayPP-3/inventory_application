import { type FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SignInModal from "../modals/SignInModal";
import SignUpModal from "../modals/SignUpModal";

// ─── Gamification config ───────────────────────────────────────────────────────
const LEVEL_THRESHOLDS = [0, 3, 7, 13, 21, 31]; // products needed per level
const LEVEL_TITLES = ["Stockling", "Tracker", "Keeper", "Manager", "Director", "Legend"];

function getLevelInfo(productCount: number) {
  let level = 0;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (productCount >= LEVEL_THRESHOLDS[i]) level = i + 1;
  }
  level = Math.min(level, LEVEL_TITLES.length);
  const currentFloor = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const nextFloor = LEVEL_THRESHOLDS[level] ?? currentFloor + 1;
  const progress = Math.min(
    100,
    Math.round(((productCount - currentFloor) / (nextFloor - currentFloor)) * 100)
  );
  return { level, title: LEVEL_TITLES[level - 1], progress, nextFloor, currentFloor };
}

// ─── Level-up toast ────────────────────────────────────────────────────────────
function LevelUpToast({ level, onDone }: { level: number; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce rounded-xl bg-lime-400 px-5 py-3 shadow-xl text-black font-bold text-sm">
      🎉 Level up! You're now <span className="text-emerald-800">Lv.{level}</span>
    </div>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialEmail = localStorage.getItem("userEmail") ?? "";
  const initialToken = localStorage.getItem("token");
  const initialProductCountKey = initialEmail ? `productCount_${initialEmail}` : "productCount";
  const initialProductCount = parseInt(localStorage.getItem(initialProductCountKey) ?? "0", 10);

  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(initialToken));
  const [userEmail, setUserEmail] = useState(initialEmail);
  const [searchTerm, setSearchTerm] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Gamification
  const [productCount, setProductCount] = useState(initialProductCount);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState({ level: 1 });
  const prevLevelRef = useRef(getLevelInfo(initialProductCount).level);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  // ── Listen for product additions across the app ──────────────────────────────
  // Dispatch a "productAdded" CustomEvent from wherever you add a product
  useEffect(() => {
    const handleProductAdded = () => {
      const email = localStorage.getItem("userEmail") ?? "";
      const productCountKey = email ? `productCount_${email}` : "productCount";
      const newCount = parseInt(localStorage.getItem(productCountKey) ?? "0", 10);
      setProductCount(newCount);

      const prevLevel = prevLevelRef.current;
      const { level: newLevel } = getLevelInfo(newCount);
      if (newLevel > prevLevel) {
        setLevelUpInfo({ level: newLevel });
        setShowLevelUp(true);
        prevLevelRef.current = newLevel;
      }
    };

    window.addEventListener("productAdded", handleProductAdded);
    return () => window.removeEventListener("productAdded", handleProductAdded);
  }, []);

  // ── Outside-click closes profile menu ──────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node))
        setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to products page with search query for products only
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(""); // Clear search after submit
    }
  };

  const handleAuthSuccess = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(Boolean(token));
    const email = localStorage.getItem("userEmail") ?? "";
    setUserEmail(email);
    setIsSignInOpen(false);
    setIsSignUpOpen(false);
  };



  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setUserEmail("");
    setIsProfileOpen(false);
    navigate("/");
  };

  const isCurrentPath = (path: string) => location.pathname === path;
  const navLinkClass = (path: string) =>
    `px-2 py-1 text-sm font-medium transition ${
      isCurrentPath(path) ? "text-black" : "text-stone-500 hover:text-black"
    }`;

  const { level, progress, nextFloor } = getLevelInfo(productCount);
  const avatarLetter = userEmail ? userEmail[0].toUpperCase() : "U";

  // ── Sync level info when productCount changes ──
  useEffect(() => {
    prevLevelRef.current = level;
  }, [productCount, level]);

  return (
    <>
      <header className="sticky top-0 z-20 bg-[#93ff96] text-black shadow-md">
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <button type="button" onClick={() => navigate("/")} className="text-black font-extrabold tracking-wide text-lg mr-8 shrink-0">
            Fresh<span className="text-emerald-700">Stock</span>
          </button>

          {/* Desktop Nav links */}
          <ul className="hidden items-center gap-6 lg:flex">
            {["/", "/products", "/categories"].map((path, i) => (
              <li key={path}>
                <button type="button" onClick={() => navigate(path)} className={navLinkClass(path)}>
                  {["Home", "Products", "Categories"][i]}
                </button>
              </li>
            ))}
          </ul>

          {/* Desktop Search & Levels (Pushed to center-right) */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-6 px-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md w-full">
              <div className="relative flex-1 group">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search"
                  className="h-9 w-full rounded-full bg-white/50 border border-emerald-200 pl-4 pr-10 text-sm text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-400 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full text-emerald-700 hover:bg-emerald-100 transition-colors"
                  title="Search"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                  </svg>
                </button>
              </div>
            </form>

            {/* Gamification progress */}
            {isLoggedIn && (
              <div className="flex flex-col items-center leading-none min-w-30">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-black text-emerald-900 uppercase">Lv.{level}</span>
                  <div className="h-1.5 w-16 rounded-full bg-black/10 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 transition-all duration-700 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-emerald-900 uppercase">Lv.{level + 1}</span>
                </div>
                <span className="text-[9px] font-medium text-emerald-800/60 uppercase tracking-tighter">
                  {nextFloor - productCount} more until upgrade
                </span>
              </div>
            )}
          </div>

          {/* ── Right side stuff (Profile / Auth / Hamburger) ── */}
          <div className="flex items-center gap-3 ml-auto">
            {isLoggedIn ? (
              <div ref={profileMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((o) => !o)}
                  aria-label="Open user menu"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 ring-2 ring-white/20 text-sm font-bold text-white hover:ring-emerald-400 transition-all shadow-md active:scale-90"
                >
                  {avatarLetter}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full z-30 mt-3 w-64 rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden animate-[slideUp_0.2s_ease-out]">
                    <div className="flex items-center gap-3 px-4 py-4 bg-lime-50 border-b border-emerald-100">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white font-bold text-sm shrink-0 shadow-sm">
                        {avatarLetter}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{userEmail || "Member"}</p>
                        <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">{getLevelInfo(productCount).title}</p>
                      </div>
                    </div>

                    <div className="px-4 py-3 border-b border-slate-50">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-black text-emerald-900 uppercase">Progress</span>
                        <span className="text-[10px] font-bold text-slate-400">{progress}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-emerald-500 to-lime-400 transition-all duration-1000"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="mt-2 text-[10px] text-slate-400 font-medium">
                        Added {productCount} items so far
                      </p>
                    </div>

                    <div className="p-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full rounded-xl px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all text-left flex items-center gap-2"
                      >
                        <span>🚪</span> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <button
                  type="button"
                  onClick={() => setIsSignInOpen(true)}
                  className="h-9 px-4 text-sm font-bold text-emerald-900 hover:bg-white/20 rounded-lg transition"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignUpOpen(true)}
                  className="h-9 px-5 bg-stone-900 text-lime-300 text-sm font-bold rounded-lg shadow-lg hover:bg-stone-800 active:scale-95 transition"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/20 text-emerald-900 hover:bg-white/40 transition"
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-emerald-100 animate-[slideDown_0.2s_ease-out]">
            <div className="px-4 py-5 space-y-4">
              <ul className="space-y-2">
                {["/", "/products", "/categories"].map((path, i) => (
                  <li key={path}>
                    <button
                      onClick={() => { navigate(path); setIsMobileMenuOpen(false); }}
                      className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm ${
                        isCurrentPath(path) ? "bg-[#93ff96] text-emerald-950" : "bg-stone-50 text-stone-600"
                      }`}
                    >
                      {["Home", "Products", "Categories"][i]}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="flex items-center gap-2 px-1">
                <div className="relative flex-1 group">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search"
                    className="h-11 w-full rounded-xl bg-stone-100 pl-4 pr-12 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-500 text-white shadow-sm active:scale-90 transition-all"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                    </svg>
                  </button>
                </div>
              </form>

              {/* Mobile Auth (if not logged in) */}
              {!isLoggedIn && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button onClick={() => setIsSignInOpen(true)} className="py-3 font-bold text-sm border-2 border-stone-100 rounded-xl">Sign In</button>
                  <button onClick={() => setIsSignUpOpen(true)} className="py-3 font-bold text-sm bg-stone-900 text-lime-400 rounded-xl">Sign Up</button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Level-up toast */}

      {/* Level-up toast */}
      {showLevelUp && (
        <LevelUpToast
          level={levelUpInfo.level}
          onDone={() => setShowLevelUp(false)}
        />
      )}

      <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} onSuccess={handleAuthSuccess} />
      <SignUpModal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} onSuccess={handleAuthSuccess} />
    </>
  );
}