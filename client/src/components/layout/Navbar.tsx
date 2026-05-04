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

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  // Gamification
  const [productCount, setProductCount] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState({ level: 1 });
  const prevLevelRef = useRef(1);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  // ── Bootstrap auth & product count ──────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(Boolean(token));
    const email = localStorage.getItem("userEmail") ?? "";
    setUserEmail(email);

    const count = parseInt(localStorage.getItem("productCount") ?? "0", 10);
    setProductCount(count);
    prevLevelRef.current = getLevelInfo(count).level;
  }, []);

  // ── Listen for product additions across the app ──────────────────────────────
  // Dispatch a "productAdded" CustomEvent from wherever you add a product
  useEffect(() => {
    const handleProductAdded = () => {
      const newCount = parseInt(localStorage.getItem("productCount") ?? "0", 10);
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

  const { level, progress, nextFloor, currentFloor } = getLevelInfo(productCount);
  const avatarLetter = userEmail ? userEmail[0].toUpperCase() : "U";

  return (
    <>
      <header className="sticky top-0 z-20 bg-[#93ff96] text-black shadow-md">
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <button type="button" onClick={() => navigate("/")} className="text-black font-bold tracking-wide">
            FreshStock
          </button>

          {/* Nav links */}
          <ul className="hidden items-center gap-5 md:flex">
            {["/", "/products", "/categories"].map((path, i) => (
              <li key={path}>
                <button type="button" onClick={() => navigate(path)} className={navLinkClass(path)}>
                  {["Home", "Products", "Categories"][i]}
                </button>
              </li>
            ))}
          </ul>

          {/* Search */}
          <form onSubmit={handleSearch} className="ml-auto hidden items-center gap-2 md:flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
              className="h-9 w-64 rounded-md bg-white px-3 text-sm text-slate-800 outline-none"
            />
            <button
              type="submit"
              className="h-9 rounded-md bg-lime-400 px-4 text-sm font-semibold text-emerald-900 transition hover:bg-white/25"
            >
              Search
            </button>
          </form>

          {/* ── Gamification badge ── */}
          {isLoggedIn && (
            <div className="hidden md:flex flex-col items-center leading-none min-w-72">
              <span className="text-[10px] font-semibold text-emerald-900 uppercase tracking-wider">
                Lv.{level}
              </span>
              <div className="mt-1 h-1.5 w-16 rounded-full bg-black/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-700 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[9px] text-emerald-900/70 mt-0.5">
                {productCount - currentFloor}/{nextFloor - currentFloor} to Lv.{level + 1}
              </span>
            </div>
          )}



          {/* ── User profile / auth buttons ── */}
          {isLoggedIn ? (
            <div ref={profileMenuRef} className="relative ml-2">
              <button
                type="button"
                onClick={() => setIsProfileOpen((o) => !o)}
                aria-label="Open user menu"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white hover:ring-2 hover:ring-emerald-400 transition"
              >
                {avatarLetter}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full z-30 mt-2 w-64 rounded-xl bg-white shadow-xl border border-slate-100 overflow-hidden">
                  {/* Profile header */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-lime-50 border-b border-slate-100">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white font-bold text-sm shrink-0">
                      {avatarLetter}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-800 truncate">{userEmail || "User"}</p>
                    </div>
                  </div>

                  {/* Level info inside dropdown */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-emerald-700">
                        Lv.{level}
                      </span>
                      <span className="text-xs text-slate-400">{progress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {productCount} products added · {nextFloor - productCount} more to Lv.{level + 1}
                    </p>
                  </div>

                  {/* Logout */}
                  <div className="px-3 py-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition text-left"
                    >
                      🚪 Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="ml-2 hidden items-center gap-2 md:flex">
              <button
                type="button"
                onClick={() => setIsSignUpOpen(true)}
                className="h-9 rounded-md bg-white px-3 text-sm font-medium text-black transition hover:bg-white/25"
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => setIsSignInOpen(true)}
                className="h-9 rounded-md bg-white px-3 text-sm font-medium text-black transition hover:bg-white/25"
              >
                Sign In
              </button>
            </div>
          )}
        </nav>
      </header>

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