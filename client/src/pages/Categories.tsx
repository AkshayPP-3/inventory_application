import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── Category metadata ────────────────────────────────────────────────────────
const CATEGORY_META: Record<
  string,
  { gradient: string; dot: string; badge: string; emoji: string; desc: string }
> = {
  Bakery:       { gradient: "from-orange-300 to-orange-500",  dot: "bg-orange-400",  badge: "bg-orange-400 text-orange-900",  emoji: "🍞", desc: "Breads, pastries & baked goods" },
  Beverages:    { gradient: "from-sky-300 to-sky-500",        dot: "bg-sky-400",     badge: "bg-sky-200 text-sky-900",        emoji: "🥤", desc: "Juices, coffee, tea & drinks" },
  Condiments:   { gradient: "from-yellow-300 to-yellow-500",  dot: "bg-yellow-400",  badge: "bg-yellow-300 text-yellow-900",  emoji: "🧴", desc: "Sauces, spreads & seasonings" },
  Dairy:        { gradient: "from-blue-200 to-blue-400",      dot: "bg-blue-400",    badge: "bg-blue-200 text-blue-900",      emoji: "🥛", desc: "Milk, cheese, eggs & butter" },
  Frozen:       { gradient: "from-cyan-300 to-cyan-500",      dot: "bg-cyan-400",    badge: "bg-cyan-200 text-cyan-900",      emoji: "🧊", desc: "Frozen meals, ice cream & more" },
  Fruit:        { gradient: "from-lime-300 to-lime-500",      dot: "bg-lime-400",    badge: "bg-lime-300 text-lime-900",      emoji: "🍎", desc: "Fresh fruits & berries" },
  Grains:       { gradient: "from-amber-300 to-amber-500",    dot: "bg-amber-400",   badge: "bg-amber-300 text-amber-900",    emoji: "🌾", desc: "Pasta, rice & whole grains" },
  Pantry:       { gradient: "from-stone-300 to-stone-500",    dot: "bg-stone-400",   badge: "bg-stone-200 text-stone-700",    emoji: "🫙", desc: "Oils, sugar, salt & staples" },
  Seafood:      { gradient: "from-teal-300 to-teal-500",      dot: "bg-teal-400",    badge: "bg-teal-200 text-teal-900",      emoji: "🐟", desc: "Fish, shrimp & ocean catches" },
  Snacks:       { gradient: "from-pink-300 to-pink-500",      dot: "bg-pink-400",    badge: "bg-pink-200 text-pink-900",      emoji: "🍪", desc: "Cookies, chips & treats" },
  Uncategorized:{ gradient: "from-stone-200 to-stone-400",    dot: "bg-stone-300",   badge: "bg-stone-100 text-stone-500",    emoji: "📦", desc: "Miscellaneous items" },
  Vegetable:    { gradient: "from-green-300 to-green-500",    dot: "bg-green-500",   badge: "bg-green-300 text-green-900",    emoji: "🥦", desc: "Fresh vegetables & greens" },
};

const DEFAULT_META = { gradient: "from-stone-200 to-stone-400", dot: "bg-stone-300", badge: "bg-stone-100 text-stone-500", emoji: "📦", desc: "Products in this category" };

// ─── Add Category Modal ───────────────────────────────────────────────────────
function AddCategoryModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!name.trim()) { setError("Category name is required."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("https://inventory-app-jbjm.onrender.com/categories/new", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ name: name.trim() }).toString(),
      });
      if (!res.ok) throw new Error("Server error");
      onAdded();
      onClose();
    } catch {
      setError("Could not add category. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(28,24,20,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 relative" style={{ animation: "slideUp 0.25s ease-out" }}>
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors"
        >✕</button>

        <h2 className="font-extrabold text-stone-900 text-2xl mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
          Add Category
        </h2>
        <p className="text-stone-400 text-sm mb-7">Give your new category a name.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2.5 mb-5">{error}</div>
        )}

        <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
          Category Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="e.g. Organic"
          className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-400 transition mb-7"
        />

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-stone-900 text-lime-300 font-semibold py-3 rounded-full text-sm transition-all duration-200 hover:bg-stone-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding…" : "Add Category"}
        </button>
      </div>
    </div>
  );
}

// ─── Category Card ────────────────────────────────────────────────────────────
function CategoryCard({
  name,
  count,
  index,
  onClick,
}: {
  name: string;
  count: number;
  index: number;
  onClick: () => void;
}) {
  const meta = CATEGORY_META[name] ?? DEFAULT_META;
  const offset = index % 3 === 1;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 shadow-md cursor-pointer group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
        offset ? "mt-4" : ""
      } ${index % 2 === 0 ? "hover:-rotate-1" : "hover:rotate-1"}`}
    >
      {/* Gradient bar */}
      <div className={`h-2 rounded-full bg-gradient-to-r ${meta.gradient} mb-4`} />

      {/* Emoji */}
      <div className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-110 origin-left">
        {meta.emoji}
      </div>

      {/* Name */}
      <p
        className="font-extrabold text-stone-900 text-base leading-snug mb-1"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {name}
      </p>

      {/* Description */}
      <p className="text-xs text-stone-400 leading-snug mb-4">{meta.desc}</p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {[meta.dot, "bg-stone-200", "bg-stone-100"].map((dot, i) => (
            <span key={i} className={`w-2 h-2 rounded-full ${dot}`} />
          ))}
        </div>
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${meta.badge}`}>
          {count} item{count !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");

  // ── Fetch categories + product counts ──────────────────────────────────────
  async function fetchData() {
    setLoading(true); setError("");
    try {
      // Fetch categories page
      const catRes = await fetch("https://inventory-app-jbjm.onrender.com/categories");
      const catHtml = await catRes.text();
      const catDoc = new DOMParser().parseFromString(catHtml, "text/html");

      const parsed: string[] = [];
      catDoc.querySelectorAll("a[href*='?category=']").forEach((a) => {
        const h2 = a.querySelector("h2");
        if (h2?.textContent?.trim()) parsed.push(h2.textContent.trim());
      });
      setCategories(parsed);

      // Fetch products page to count per category
      const prodRes = await fetch("https://inventory-app-jbjm.onrender.com/products");
      const prodHtml = await prodRes.text();
      const prodDoc = new DOMParser().parseFromString(prodHtml, "text/html");

      const counts: Record<string, number> = {};
      prodDoc.querySelectorAll("a[href*='/products/']").forEach((link) => {
        const href = link.getAttribute("href") ?? "";
        if (!/\/products\/\d+$/.test(href)) return;
        const paragraphs = Array.from(link.querySelectorAll("p"));
        const cat = paragraphs[4]?.textContent?.trim();
        if (cat) counts[cat] = (counts[cat] ?? 0) + 1;
      });
      setProductCounts(counts);
    } catch {
      setError("Could not load categories. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
    fetchData();
  }, []);

  const filtered = categories.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {showModal && (
        <AddCategoryModal onClose={() => setShowModal(false)} onAdded={fetchData} />
      )}

      <main className="relative min-h-screen overflow-hidden bg-amber-50">
        {/* Background blobs — identical to home & products */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute -top-20 -left-28 w-96 h-96 rounded-full bg-lime-300 opacity-40 blur-3xl animate-[drift1_8s_ease-in-out_infinite_alternate]" />
          <div className="absolute -bottom-16 -right-20 w-72 h-72 rounded-full bg-orange-400 opacity-35 blur-3xl animate-[drift2_10s_ease-in-out_infinite_alternate]" />
          <div className="absolute top-1/2 left-2/3 w-56 h-56 rounded-full bg-violet-300 opacity-30 blur-3xl animate-[drift1_12s_ease-in-out_infinite_alternate-reverse]" />
          <div className="absolute top-1/4 right-10 w-44 h-44 rounded-full bg-sky-300 opacity-35 blur-3xl animate-[drift2_9s_ease-in-out_infinite_alternate]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">

          {/* ── Header ──────────────────────────────────────────────────────── */}
          <div
            className={`flex flex-wrap items-center justify-between gap-4 mb-12 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-stone-900 text-lime-300 text-xs font-medium uppercase tracking-widest px-4 py-2 rounded-full mb-3">
                <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                Inventory
              </div>
              <h1
                className="font-extrabold text-stone-900 leading-tight"
                style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem,5vw,3.5rem)" }}
              >
                Categories
                <span className="inline-block bg-lime-300 text-stone-900 px-3 pb-1 rounded-lg ml-3 text-2xl align-middle">
                  {filtered.length}
                </span>
              </h1>
              <p className="text-stone-400 text-base mt-2 font-light">
                Organise your inventory by category.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search categories…"
                  className="bg-white border border-stone-200 rounded-full pl-10 pr-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-400 w-52 transition"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>

              {/* Add Category */}
              <button
                onClick={() => setShowModal(true)}
                className="group inline-flex items-center gap-2 bg-stone-900 text-lime-300 border-2 border-stone-900 font-medium text-sm px-6 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:shadow-xl active:scale-95"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Add Category
              </button>
            </div>
          </div>

          {/* ── Stats row ───────────────────────────────────────────────────── */}
          {!loading && categories.length > 0 && (
            <div
              className={`flex flex-wrap gap-3 mb-10 transition-all duration-700 delay-100 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              {[
                { label: "Total categories", value: categories.length, color: "bg-lime-300" },
                { label: "Total products", value: Object.values(productCounts).reduce((a, b) => a + b, 0), color: "bg-violet-300" },
                { label: "Largest category", value: (() => { const top = Object.entries(productCounts).sort((a,b)=>b[1]-a[1])[0]; return top ? `${top[0]} (${top[1]})` : "—"; })(), color: "bg-orange-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
                  <span className={`w-3 h-3 rounded-sm ${color} shrink-0`} />
                  <span className="text-xs text-stone-500">{label}:</span>
                  <span className="text-xs font-semibold text-stone-800">{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* ── Loading skeletons ────────────────────────────────────────────── */}
          {loading && (
            <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))" }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-white/60 rounded-2xl h-52 animate-pulse" />
              ))}
            </div>
          )}

          {/* ── Error ────────────────────────────────────────────────────────── */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-6 py-5 text-sm">
              {error}
            </div>
          )}

          {/* ── Empty state ──────────────────────────────────────────────────── */}
          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-24 text-stone-400">
              <p className="text-5xl mb-4">🗂️</p>
              <p className="font-medium text-lg">No categories found.</p>
              <p className="text-sm mt-1">Try a different search or add a new category.</p>
            </div>
          )}

          {/* ── Category grid ─────────────────────────────────────────────────── */}
          {!loading && !error && filtered.length > 0 && (
            <div
              className={`grid gap-5 transition-all duration-700 delay-200 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))" }}
            >
              {filtered.map((cat, i) => (
                <CategoryCard
                  key={cat}
                  name={cat}
                  count={productCounts[cat] ?? 0}
                  index={i}
                  onClick={() => navigate(`/products?category=${encodeURIComponent(cat)}`)}
                />
              ))}
            </div>
          )}

          {/* ── Footer nudge ─────────────────────────────────────────────────── */}
          {!loading && filtered.length > 0 && (
            <p
              className={`mt-14 text-center text-sm text-stone-400 transition-all duration-700 delay-500 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <span className="text-yellow-400 tracking-wide">★★★★★</span>
              &nbsp; Click any category to browse its products!
            </p>
          )}
        </div>
      </main>
    </>
  );
}