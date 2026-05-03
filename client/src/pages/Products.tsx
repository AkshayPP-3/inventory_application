import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  price: string | number;
  image: string;
  category: string;
  brand?: string;
  quantity?: number;
}

// ─── Category colour map (matches home page pill palette) ─────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  Bakery: "bg-orange-400 text-orange-900",
  Beverages: "bg-sky-200 text-sky-900",
  Condiments: "bg-yellow-300 text-yellow-900",
  Dairy: "bg-blue-200 text-blue-900",
  Frozen: "bg-cyan-200 text-cyan-900",
  Fruit: "bg-lime-300 text-lime-900",
  Grains: "bg-amber-300 text-amber-900",
  Pantry: "bg-stone-200 text-stone-700",
  Seafood: "bg-teal-200 text-teal-900",
  Snacks: "bg-pink-200 text-pink-900",
  Vegetable: "bg-green-300 text-green-900",
  Uncategorized: "bg-stone-100 text-stone-500",
};

const CATEGORY_DOT: Record<string, string> = {
  Bakery: "bg-orange-400",
  Beverages: "bg-sky-400",
  Condiments: "bg-yellow-400",
  Dairy: "bg-blue-400",
  Frozen: "bg-cyan-400",
  Fruit: "bg-lime-400",
  Grains: "bg-amber-400",
  Pantry: "bg-stone-400",
  Seafood: "bg-teal-400",
  Snacks: "bg-pink-400",
  Vegetable: "bg-green-500",
  Uncategorized: "bg-stone-300",
};

const ALL_CATEGORIES = [
  "Bakery","Beverages","Condiments","Dairy","Frozen","Fruit",
  "Grains","Pantry","Seafood","Snacks","Uncategorized","Vegetable",
];

// ─── Add Product Modal ────────────────────────────────────────────────────────
function AddProductModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [form, setForm] = useState({ name: "", price: "", image: "", category: ALL_CATEGORIES[0] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function submit() {
    if (!form.name.trim() || !form.price) { setError("Name and price are required."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("https://inventory-app-jbjm.onrender.com/products/new", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(form as Record<string, string>).toString(),
      });
      if (!res.ok) throw new Error("Server error");
      onAdded();
      onClose();
    } catch {
      setError("Could not add product. Please try again.");
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
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-[slideUp_0.25s_ease-out]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors"
        >
          ✕
        </button>

        <h2 className="font-extrabold text-stone-900 text-2xl mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
          Add Product
        </h2>
        <p className="text-stone-400 text-sm mb-7">Fill in the details below to add a new item.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2.5 mb-5">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
              Product Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handle}
              placeholder="e.g. Mango"
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-400 transition"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
              Price ($)
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={handle}
              placeholder="e.g. 1.99"
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-400 transition"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
              Image URL <span className="font-normal text-stone-300">(optional)</span>
            </label>
            <input
              name="image"
              value={form.image}
              onChange={handle}
              placeholder="https://..."
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-400 transition"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handle}
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-400 transition bg-white"
            >
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="mt-7 w-full bg-stone-900 text-lime-300 font-semibold py-3 rounded-full text-sm transition-all duration-200 hover:bg-stone-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding…" : "Add Product"}
        </button>
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, index }: { product: Product; index: number }) {
  const price = typeof product.price === "string"
    ? parseFloat(product.price.replace("$", ""))
    : product.price;

  const colorClass = CATEGORY_COLORS[product.category] ?? "bg-stone-100 text-stone-500";
  const dotClass = CATEGORY_DOT[product.category] ?? "bg-stone-300";

  return (
    <div
      className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Image area */}
      <div className="relative h-40 flex items-center justify-center bg-stone-50 overflow-hidden">
        {product.image ? (
          <img
            src={product.image.startsWith("http") ? product.image : `https://inventory-app-jbjm.onrender.com${product.image}`}
            alt={product.name}
            className="h-28 w-28 object-contain transition-transform duration-300 group-hover:scale-110"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="text-4xl">📦</div>
        )}
        {/* Category badge */}
        <span className={`absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${colorClass}`}>
          {product.category}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-bold text-stone-900 text-sm leading-snug">{product.name}</p>
          <p className="font-extrabold text-stone-900 text-base shrink-0">${price.toFixed(2)}</p>
        </div>
        {product.brand && (
          <p className="text-xs text-stone-400 mt-0.5">{product.brand}</p>
        )}
        <div className="flex items-center gap-2 mt-3">
          <span className={`w-2.5 h-2.5 rounded-full ${dotClass}`} />
          {product.quantity !== undefined && (
            <span className="text-xs text-stone-400">Qty: {product.quantity}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Filter Panel ─────────────────────────────────────────────────────────────
interface Filters {
  priceSort: "" | "asc" | "desc";
  nameSort: "" | "asc" | "desc";
  categories: string[];
}

function FilterPanel({
  filters,
  onChange,
  onApply,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  onApply: () => void;
}) {
  const toggleCat = (cat: string) => {
    const has = filters.categories.includes(cat);
    onChange({
      ...filters,
      categories: has ? filters.categories.filter((c) => c !== cat) : [...filters.categories, cat],
    });
  };

  return (
    <aside className="bg-white rounded-2xl shadow-md p-6 h-fit sticky top-6">
      <p className="font-extrabold text-stone-900 text-base mb-5" style={{ fontFamily: "'Syne', sans-serif" }}>
        Filters
      </p>

      {/* Sort by price */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2.5">Sort by Price</p>
        <div className="space-y-1.5">
          {[["asc", "Low → High"], ["desc", "High → Low"]].map(([val, label]) => (
            <label key={val} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => onChange({ ...filters, priceSort: filters.priceSort === val ? "" : val as "asc" | "desc" })}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                  filters.priceSort === val
                    ? "bg-stone-900 border-stone-900"
                    : "border-stone-300 group-hover:border-stone-500"
                }`}
              >
                {filters.priceSort === val && <span className="text-lime-300 text-[9px] font-bold">✓</span>}
              </div>
              <span className="text-sm text-stone-600">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort by name */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2.5">Sort by Name</p>
        <div className="space-y-1.5">
          {[["asc", "A → Z"], ["desc", "Z → A"]].map(([val, label]) => (
            <label key={val} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => onChange({ ...filters, nameSort: filters.nameSort === val ? "" : val as "asc" | "desc" })}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                  filters.nameSort === val
                    ? "bg-stone-900 border-stone-900"
                    : "border-stone-300 group-hover:border-stone-500"
                }`}
              >
                {filters.nameSort === val && <span className="text-lime-300 text-[9px] font-bold">✓</span>}
              </div>
              <span className="text-sm text-stone-600">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filter by category */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2.5">Filter by Category</p>
        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
          {ALL_CATEGORIES.map((cat) => {
            const checked = filters.categories.includes(cat);
            const dot = CATEGORY_DOT[cat] ?? "bg-stone-300";
            return (
              <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  onClick={() => toggleCat(cat)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    checked ? "bg-stone-900 border-stone-900" : "border-stone-300 group-hover:border-stone-500"
                  }`}
                >
                  {checked && <span className="text-lime-300 text-[9px] font-bold">✓</span>}
                </div>
                <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                <span className="text-sm text-stone-600">{cat}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Apply */}
      <button
        onClick={onApply}
        className="w-full bg-stone-900 text-lime-300 font-semibold py-2.5 rounded-full text-sm transition-all duration-200 hover:bg-stone-700 active:scale-95"
      >
        Apply Filters
      </button>

      {/* Reset */}
      {(filters.priceSort || filters.nameSort || filters.categories.length > 0) && (
        <button
          onClick={() => { onChange({ priceSort: "", nameSort: "", categories: [] }); onApply(); }}
          className="w-full mt-2 text-stone-400 text-xs hover:text-stone-600 transition-colors py-1"
        >
          Clear all filters
        </button>
      )}
    </aside>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [displayed, setDisplayed] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");

  const [pendingFilters, setPendingFilters] = useState<Filters>({
    priceSort: "",
    nameSort: "",
    categories: [],
  });
  const [appliedFilters, setAppliedFilters] = useState<Filters>({
    priceSort: "",
    nameSort: "",
    categories: [],
  });

  // ── Fetch products ───────────────────────────────────────────────────────────
  async function fetchProducts() {
    setLoading(true); setError("");
    try {
      // We scrape the HTML page and parse product data from it
      const res = await fetch("https://inventory-app-jbjm.onrender.com/products");
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const links = doc.querySelectorAll('a[href*="/products/"]');
      const parsed: Product[] = [];
      let id = 1;

      links.forEach((link) => {
        const href = link.getAttribute("href") ?? "";
        if (!/\/products\/\d+$/.test(href)) return;
        const img = link.querySelector("img");
        const paragraphs = Array.from(link.querySelectorAll("p"));

        const name = paragraphs[0]?.textContent?.trim() ?? "";
        const priceText = paragraphs[1]?.textContent?.trim() ?? "";
        const brandText = paragraphs[2]?.textContent?.replace("Brand:", "").trim() ?? "";
        const qtyText = paragraphs[3]?.textContent?.replace("Quantity:", "").trim() ?? "";
        const categoryText = paragraphs[4]?.textContent?.trim() ?? "Uncategorized";
        const price = parseFloat(priceText.replace("$", "")) || 0;
        const imgSrc = img?.getAttribute("src") ?? "";

        if (name) {
          parsed.push({
            id: id++,
            name,
            price,
            image: imgSrc,
            category: categoryText,
            brand: brandText || undefined,
            quantity: qtyText ? parseInt(qtyText) : undefined,
          });
        }
      });

      setProducts(parsed);
      applyFilters(parsed, appliedFilters, search);
    } catch {
      setError("Could not load products. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
    fetchProducts();
  }, []);

  // ── Apply filters + search ───────────────────────────────────────────────────
  function applyFilters(source: Product[], f: Filters, q: string) {
    let list = [...source];

    // search
    if (q.trim()) {
      const lower = q.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(lower) || p.category.toLowerCase().includes(lower));
    }

    // category filter
    if (f.categories.length > 0) {
      list = list.filter((p) => f.categories.includes(p.category));
    }

    // price sort takes precedence over name sort
    if (f.priceSort === "asc") list.sort((a, b) => +a.price - +b.price);
    else if (f.priceSort === "desc") list.sort((a, b) => +b.price - +a.price);
    else if (f.nameSort === "asc") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (f.nameSort === "desc") list.sort((a, b) => b.name.localeCompare(a.name));

    setDisplayed(list);
  }

  function handleApply() {
    setAppliedFilters(pendingFilters);
    applyFilters(products, pendingFilters, search);
  }

  useEffect(() => {
    applyFilters(products, appliedFilters, search);
  }, [search]);

  return (
    <>
      {showModal && (
        <AddProductModal onClose={() => setShowModal(false)} onAdded={fetchProducts} />
      )}

      <main className="relative min-h-screen overflow-hidden bg-amber-50">
        {/* Background blobs — same as home */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute -top-20 -left-28 w-96 h-96 rounded-full bg-lime-300 opacity-40 blur-3xl animate-[drift1_8s_ease-in-out_infinite_alternate]" />
          <div className="absolute -bottom-16 -right-20 w-72 h-72 rounded-full bg-orange-400 opacity-35 blur-3xl animate-[drift2_10s_ease-in-out_infinite_alternate]" />
          <div className="absolute top-1/2 left-2/3 w-56 h-56 rounded-full bg-violet-300 opacity-30 blur-3xl animate-[drift1_12s_ease-in-out_infinite_alternate-reverse]" />
          <div className="absolute top-1/4 right-10 w-44 h-44 rounded-full bg-sky-300 opacity-35 blur-3xl animate-[drift2_9s_ease-in-out_infinite_alternate]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

          {/* Header row */}
          <div
            className={`flex flex-wrap items-center justify-between gap-4 mb-10 transition-all duration-700 ${
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
                Products
                <span className="inline-block bg-lime-300 text-stone-900 px-3 pb-1 rounded-lg ml-3 text-2xl align-middle">
                  {displayed.length}
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products…"
                  className="bg-white border border-stone-200 rounded-full pl-10 pr-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-400 w-52 transition"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>

              {/* Add product button */}
              <button
                onClick={() => setShowModal(true)}
                className="group inline-flex items-center gap-2 bg-stone-900 text-lime-300 border-2 border-stone-900 font-medium text-sm px-6 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:shadow-xl active:scale-95"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Add Product
              </button>
            </div>
          </div>

          {/* Body: filter sidebar + product grid */}
          <div className="flex gap-8 items-start">

            {/* ── Filter sidebar ────────────────────────────────────────────── */}
            <div
              className={`w-56 shrink-0 transition-all duration-700 delay-100 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <FilterPanel
                filters={pendingFilters}
                onChange={setPendingFilters}
                onApply={handleApply}
              />
            </div>

            {/* ── Product grid ──────────────────────────────────────────────── */}
            <div className="flex-1 min-w-0">
              {loading && (
                <div className="flex flex-wrap gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-white/60 rounded-2xl h-56 w-44 animate-pulse" />
                  ))}
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-6 py-5 text-sm">
                  {error}
                </div>
              )}

              {!loading && !error && displayed.length === 0 && (
                <div className="text-center py-20 text-stone-400">
                  <p className="text-4xl mb-4">🔍</p>
                  <p className="font-medium">No products match your filters.</p>
                  <p className="text-sm mt-1">Try adjusting or clearing your filters.</p>
                </div>
              )}

              {!loading && !error && displayed.length > 0 && (
                <div
                  className={`grid gap-5 transition-all duration-700 delay-200 ${
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                  style={{ gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))" }}
                >
                  {displayed.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}