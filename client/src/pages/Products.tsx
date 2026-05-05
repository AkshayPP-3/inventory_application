import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

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

// ─── Category colours (matches Categories.tsx badge colors) ──────────────────
const CATEGORY_COLORS: Record<string, string> = {
  Fruits: "bg-lime-300 text-lime-900",
  Fruit: "bg-lime-300 text-lime-900",
  Vegetables: "bg-green-200 text-green-900",
  Vegetable: "bg-green-200 text-green-900",
  "Herbs & Salads": "bg-emerald-100 text-emerald-900",
  "Organic Produce": "bg-lime-100 text-lime-900",
  Dairy: "bg-blue-200 text-blue-900",
  "Milk & Cream": "bg-sky-100 text-sky-900",
  Cheese: "bg-yellow-200 text-yellow-900",
  "Eggs & Butter": "bg-amber-100 text-amber-900",
  "Meat & Poultry": "bg-rose-200 text-rose-900",
  Seafood: "bg-teal-200 text-teal-900",
  "Deli Meats": "bg-red-100 text-red-900",
  Bakery: "bg-orange-200 text-orange-900",
  Bread: "bg-amber-200 text-amber-900",
  Pastries: "bg-pink-100 text-pink-900",
  Beverages: "bg-sky-200 text-sky-900",
  "Coffee & Tea": "bg-amber-200 text-amber-900",
  Juices: "bg-orange-100 text-orange-900",
  "Soft Drinks": "bg-pink-100 text-pink-900",
  "Alcoholic Beverages": "bg-purple-100 text-purple-900",
  Pantry: "bg-stone-200 text-stone-700",
  "Grains & Cereals": "bg-amber-100 text-amber-900",
  Grains: "bg-amber-100 text-amber-900",
  "Pasta & Rice": "bg-yellow-100 text-yellow-900",
  "Flour & Baking": "bg-stone-100 text-stone-700",
  "Canned Goods": "bg-slate-200 text-slate-800",
  Snacks: "bg-pink-200 text-pink-900",
  Condiments: "bg-yellow-200 text-yellow-900",
  "Sauces & Dressings": "bg-red-100 text-red-900",
  "Oils & Vinegars": "bg-yellow-200 text-yellow-900",
  "Spices & Seasonings": "bg-orange-200 text-orange-900",
  Frozen: "bg-cyan-200 text-cyan-900",
  "Frozen Foods": "bg-cyan-200 text-cyan-900",
  "Frozen Vegetables": "bg-teal-100 text-teal-900",
  "Ice Cream": "bg-pink-100 text-pink-900",
  "Health & Supplements": "bg-green-100 text-green-900",
  "Personal Care": "bg-violet-100 text-violet-900",
  "Household Essentials": "bg-slate-100 text-slate-800",
  "Cleaning Supplies": "bg-sky-100 text-sky-900",
  Uncategorized: "bg-stone-100 text-stone-500",
};

const CATEGORY_DOT: Record<string, string> = {
  Fruits: "bg-lime-400",
  Fruit: "bg-lime-400",
  Vegetables: "bg-green-500",
  Vegetable: "bg-green-500",
  "Herbs & Salads": "bg-emerald-400",
  "Organic Produce": "bg-lime-300",
  Dairy: "bg-blue-400",
  "Milk & Cream": "bg-sky-300",
  Cheese: "bg-yellow-400",
  "Eggs & Butter": "bg-amber-300",
  "Meat & Poultry": "bg-rose-400",
  Seafood: "bg-teal-400",
  "Deli Meats": "bg-red-400",
  Bakery: "bg-orange-400",
  Bread: "bg-amber-400",
  Pastries: "bg-pink-300",
  Beverages: "bg-sky-400",
  "Coffee & Tea": "bg-amber-500",
  Juices: "bg-orange-400",
  "Soft Drinks": "bg-pink-400",
  "Alcoholic Beverages": "bg-purple-400",
  Pantry: "bg-stone-400",
  "Grains & Cereals": "bg-amber-400",
  Grains: "bg-amber-400",
  "Pasta & Rice": "bg-yellow-400",
  "Flour & Baking": "bg-stone-300",
  "Canned Goods": "bg-slate-400",
  Snacks: "bg-pink-400",
  Condiments: "bg-yellow-400",
  "Sauces & Dressings": "bg-red-400",
  "Oils & Vinegars": "bg-yellow-500",
  "Spices & Seasonings": "bg-orange-500",
  Frozen: "bg-cyan-400",
  "Frozen Foods": "bg-cyan-400",
  "Frozen Vegetables": "bg-teal-300",
  "Ice Cream": "bg-pink-300",
  "Health & Supplements": "bg-green-400",
  "Personal Care": "bg-violet-400",
  "Household Essentials": "bg-slate-400",
  "Cleaning Supplies": "bg-sky-400",
  Uncategorized: "bg-stone-300",
};

// ─── Add Product Modal ────────────────────────────────────────────────────────
function AddProductModal({ onClose, onAdded, categories }: { onClose: () => void; onAdded: () => void; categories: string[] }) {
  const defaultCategory = categories.length > 0 ? categories[0] : "Uncategorized";
  const [form, setForm] = useState({ name: "", price: "", image: "", category: defaultCategory });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categoryMap, setCategoryMap] = useState<Record<string, number>>({});

  // Fetch categories to map names to IDs
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const res = await fetch(`${apiUrl}/api/categories`);
        if (!res.ok) return;
        const data = await res.json();
        const map: Record<string, number> = {};
        data.forEach((cat: any) => {
          map[cat.categoryName] = cat.id;
        });
        setCategoryMap(map);
      } catch {
        // silently fail
      }
    };
    fetchCategories();
  }, []);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function submit() {
    if (!form.name.trim() || !form.price) { setError("Name and price are required."); return; }
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to add products");
        setLoading(false);
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const categoryId = categoryMap[form.category] || null;
      
      const res = await fetch(`${apiUrl}/api/products`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          price: parseFloat(form.price),
          image: form.image || undefined,
          categoryId: categoryId,
        }),
      });
      if (!res.ok) throw new Error("Server error");
      
      // Update product count tied to user email
      const userEmail = localStorage.getItem("userEmail") ?? "";
      const productCountKey = userEmail ? `productCount_${userEmail}` : "productCount";
      const currentCount = parseInt(localStorage.getItem(productCountKey) ?? "0", 10);
      localStorage.setItem(productCountKey, (currentCount + 1).toString());
      window.dispatchEvent(new CustomEvent("productAdded"));
      
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
              {categories.map((c) => (
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
function ProductCard({ product, index, onClick }: { product: Product; index: number; onClick: () => void }) {
  const price = typeof product.price === "string"
    ? parseFloat(product.price.replace("$", ""))
    : product.price;

  const colorClass = CATEGORY_COLORS[product.category] ?? "bg-stone-100 text-stone-500";
  const dotClass = CATEGORY_DOT[product.category] ?? "bg-stone-300";

  // Local UI state
  const [imageError, setImageError] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete "${product.name}"?`)) return;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please sign in to delete products");
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/api/products/${product.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) window.location.reload();
      else alert("Could not delete product");
    } catch (err) {
      console.error(err);
      alert("Could not delete product");
    }
  };

  return (
    <div
      onClick={() => setShowActions((s) => !s)}
      className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Image area */}
      <div className="relative h-40 flex items-center justify-center bg-stone-50 overflow-hidden">
        {!imageError && product.image ? (
          <img
            src={product.image.startsWith("http") ? product.image : `https://inventory-app-jbjm.onrender.com${product.image}`}
            alt={product.name}
            className="h-28 w-28 object-contain transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
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

        {/* Actions: visible when card is clicked */}
        {showActions && (
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onClick(); }}
              className="flex-1 bg-stone-900 text-lime-300 font-semibold py-2 rounded-lg text-sm"
            >
              View
            </button>
            <button
              onClick={handleDelete}
              className="w-24 bg-red-50 text-red-600 font-medium py-2 rounded-lg text-sm"
            >
              🗑️ Delete
            </button>
          </div>
        )}
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
  categories,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  onApply: () => void;
  categories: string[];
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
          {categories.map((cat) => {
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [displayed, setDisplayed] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [categories, setCategories] = useState<string[]>([]);

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
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      
      // Fetch products from API with 10s timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const res = await fetch(`${apiUrl}/api/products`, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Server error: ${res.status} - ${errorData.message || res.statusText}`);
      }
      
      const productsData = await res.json();

      // Map API response to Product format
      const parsed: Product[] = productsData.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image || "",
        category: p.category?.categoryName || "Uncategorized",
      }));

      setProducts(parsed);
      applyFilters(parsed, appliedFilters, search);
    } catch (err: any) {
      let errorMsg = "Could not load products. Check your connection.";
      if (err.name === "AbortError") {
        errorMsg = "Request timeout - server took too long to respond.";
      } else if (err.message?.includes("Failed to fetch")) {
        errorMsg = "Network error - is the server running on http://localhost:3000?";
      }
      setError(errorMsg);
      console.error("[Products Fetch Error]", err);
    } finally {
      setLoading(false);
    }
  }

  // ── Fetch categories ───────────────────────────────────────────────────────
  async function fetchCategories() {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const res = await fetch(`${apiUrl}/api/categories`, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        console.warn(`[Categories Fetch] Server responded with ${res.status}`);
        return;
      }
      const catData = await res.json();
      const catNames = catData.map((c: any) => c.categoryName);
      setCategories(catNames);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.warn("[Categories Fetch Error]", err.message);
      }
      // silently fail, use empty categories
    }
  }

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
    fetchCategories();
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
        <AddProductModal onClose={() => setShowModal(false)} onAdded={fetchProducts} categories={categories} />
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
                categories={categories}
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
                    <ProductCard 
                      key={p.id} 
                      product={p} 
                      index={i}
                      onClick={() => navigate(`/product/${p.id}`)}
                    />
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