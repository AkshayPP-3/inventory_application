import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  price: string | number;
  image: string;
  category?: { categoryName: string };
}

interface CategoryMeta {
  gradient: string;       // Tailwind gradient classes for the colour bar
  dot: string;            // Tailwind bg class for the small dot indicator
  badge: string;          // Tailwind bg + text classes for the category badge pill
  badgeDark: string;      // Darker variant used in ProductCard
  emoji: string;          // Representative emoji
  desc: string;           // Short one-liner description
  group: string;          // Parent group label (for grouping in UI if needed)
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  // ── Produce & Fresh ─────────────────────────────────────────────────────────
  "Fruits": {
    gradient: "from-lime-300 to-green-400",
    dot: "bg-lime-400",
    badge: "bg-lime-300 text-lime-900",
    badgeDark: "bg-lime-400 text-lime-900",
    emoji: "🍎",
    desc: "Fresh fruits & berries",
    group: "Produce & Fresh",
  },
  "Fruit": {
    gradient: "from-lime-300 to-green-400",
    dot: "bg-lime-400",
    badge: "bg-lime-300 text-lime-900",
    badgeDark: "bg-lime-400 text-lime-900",
    emoji: "🍎",
    desc: "Fresh fruits & berries",
    group: "Produce & Fresh",
  },
  "Vegetables": {
    gradient: "from-green-300 to-emerald-500",
    dot: "bg-green-500",
    badge: "bg-green-200 text-green-900",
    badgeDark: "bg-green-400 text-green-900",
    emoji: "🥦",
    desc: "Fresh vegetables & greens",
    group: "Produce & Fresh",
  },
  "Vegetable": {
    gradient: "from-green-300 to-emerald-500",
    dot: "bg-green-500",
    badge: "bg-green-200 text-green-900",
    badgeDark: "bg-green-400 text-green-900",
    emoji: "🥦",
    desc: "Fresh vegetables & greens",
    group: "Produce & Fresh",
  },
  "Herbs & Salads": {
    gradient: "from-emerald-200 to-teal-400",
    dot: "bg-emerald-400",
    badge: "bg-emerald-100 text-emerald-900",
    badgeDark: "bg-emerald-300 text-emerald-900",
    emoji: "🌿",
    desc: "Fresh herbs, salad leaves & microgreens",
    group: "Produce & Fresh",
  },
  "Organic Produce": {
    gradient: "from-lime-200 to-lime-400",
    dot: "bg-lime-300",
    badge: "bg-lime-100 text-lime-900",
    badgeDark: "bg-lime-300 text-lime-900",
    emoji: "🌱",
    desc: "Certified organic fruits & vegetables",
    group: "Produce & Fresh",
  },

  // ── Dairy & Eggs ────────────────────────────────────────────────────────────
  "Dairy": {
    gradient: "from-blue-200 to-blue-400",
    dot: "bg-blue-400",
    badge: "bg-blue-200 text-blue-900",
    badgeDark: "bg-blue-300 text-blue-900",
    emoji: "🥛",
    desc: "Milk, cheese, yoghurt & more",
    group: "Dairy & Eggs",
  },
  "Milk & Cream": {
    gradient: "from-sky-100 to-blue-300",
    dot: "bg-sky-300",
    badge: "bg-sky-100 text-sky-900",
    badgeDark: "bg-sky-200 text-sky-900",
    emoji: "🍼",
    desc: "Whole, semi-skimmed & plant milks",
    group: "Dairy & Eggs",
  },
  "Cheese": {
    gradient: "from-yellow-200 to-amber-400",
    dot: "bg-yellow-400",
    badge: "bg-yellow-200 text-yellow-900",
    badgeDark: "bg-yellow-300 text-yellow-900",
    emoji: "🧀",
    desc: "Hard, soft & specialty cheeses",
    group: "Dairy & Eggs",
  },
  "Eggs & Butter": {
    gradient: "from-amber-200 to-orange-300",
    dot: "bg-amber-300",
    badge: "bg-amber-100 text-amber-900",
    badgeDark: "bg-amber-300 text-amber-900",
    emoji: "🥚",
    desc: "Fresh eggs, butter & spreads",
    group: "Dairy & Eggs",
  },

  // ── Meat & Seafood ──────────────────────────────────────────────────────────
  "Meat & Poultry": {
    gradient: "from-rose-300 to-red-500",
    dot: "bg-rose-400",
    badge: "bg-rose-200 text-rose-900",
    badgeDark: "bg-rose-400 text-rose-900",
    emoji: "🥩",
    desc: "Beef, chicken, pork & lamb",
    group: "Meat & Seafood",
  },
  "Seafood": {
    gradient: "from-teal-300 to-teal-500",
    dot: "bg-teal-400",
    badge: "bg-teal-200 text-teal-900",
    badgeDark: "bg-teal-400 text-teal-900",
    emoji: "🐟",
    desc: "Fish, shrimp & ocean catches",
    group: "Meat & Seafood",
  },
  "Deli Meats": {
    gradient: "from-red-200 to-rose-400",
    dot: "bg-red-400",
    badge: "bg-red-100 text-red-900",
    badgeDark: "bg-red-300 text-red-900",
    emoji: "🥓",
    desc: "Sliced meats, sausages & cold cuts",
    group: "Meat & Seafood",
  },

  // ── Bakery ──────────────────────────────────────────────────────────────────
  "Bakery": {
    gradient: "from-orange-300 to-orange-500",
    dot: "bg-orange-400",
    badge: "bg-orange-200 text-orange-900",
    badgeDark: "bg-orange-400 text-orange-900",
    emoji: "🍞",
    desc: "Breads, pastries & baked goods",
    group: "Bakery",
  },
  "Bread": {
    gradient: "from-amber-300 to-orange-400",
    dot: "bg-amber-400",
    badge: "bg-amber-200 text-amber-900",
    badgeDark: "bg-amber-300 text-amber-900",
    emoji: "🥖",
    desc: "Sourdough, wholegrain & specialty breads",
    group: "Bakery",
  },
  "Pastries": {
    gradient: "from-pink-200 to-orange-300",
    dot: "bg-pink-300",
    badge: "bg-pink-100 text-pink-900",
    badgeDark: "bg-pink-300 text-pink-900",
    emoji: "🥐",
    desc: "Croissants, muffins & sweet pastries",
    group: "Bakery",
  },

  // ── Beverages ───────────────────────────────────────────────────────────────
  "Beverages": {
    gradient: "from-sky-300 to-sky-500",
    dot: "bg-sky-400",
    badge: "bg-sky-200 text-sky-900",
    badgeDark: "bg-sky-300 text-sky-900",
    emoji: "🥤",
    desc: "Juices, coffee, tea & drinks",
    group: "Beverages",
  },
  "Coffee & Tea": {
    gradient: "from-amber-400 to-stone-500",
    dot: "bg-amber-500",
    badge: "bg-amber-200 text-amber-900",
    badgeDark: "bg-amber-400 text-amber-900",
    emoji: "☕",
    desc: "Ground coffee, beans, loose leaf & tea bags",
    group: "Beverages",
  },
  "Juices": {
    gradient: "from-orange-300 to-yellow-400",
    dot: "bg-orange-400",
    badge: "bg-orange-100 text-orange-900",
    badgeDark: "bg-orange-300 text-orange-900",
    emoji: "🍊",
    desc: "Freshly squeezed & bottled juices",
    group: "Beverages",
  },
  "Soft Drinks": {
    gradient: "from-pink-300 to-fuchsia-400",
    dot: "bg-pink-400",
    badge: "bg-pink-100 text-pink-900",
    badgeDark: "bg-pink-300 text-pink-900",
    emoji: "🫧",
    desc: "Sodas, sparkling water & energy drinks",
    group: "Beverages",
  },
  "Alcoholic Beverages": {
    gradient: "from-purple-300 to-violet-500",
    dot: "bg-purple-400",
    badge: "bg-purple-100 text-purple-900",
    badgeDark: "bg-purple-300 text-purple-900",
    emoji: "🍷",
    desc: "Wine, beer, spirits & mixers",
    group: "Beverages",
  },

  // ── Pantry & Dry Goods ──────────
  "Pantry": {
    gradient: "from-stone-300 to-stone-500",
    dot: "bg-stone-400",
    badge: "bg-stone-200 text-stone-700",
    badgeDark: "bg-stone-400 text-stone-100",
    emoji: "🫙",
    desc: "Oils, sugar, salt & everyday staples",
    group: "Pantry & Dry Goods",
  },
  "Grains & Cereals": {
    gradient: "from-amber-200 to-yellow-400",
    dot: "bg-amber-400",
    badge: "bg-amber-100 text-amber-900",
    badgeDark: "bg-amber-300 text-amber-900",
    emoji: "🌾",
    desc: "Oats, cereals, muesli & granola",
    group: "Pantry & Dry Goods",
  },
  "Grains": {
    gradient: "from-amber-200 to-yellow-400",
    dot: "bg-amber-400",
    badge: "bg-amber-100 text-amber-900",
    badgeDark: "bg-amber-300 text-amber-900",
    emoji: "🌾",
    desc: "Rice, quinoa, barley & whole grains",
    group: "Pantry & Dry Goods",
  },
  "Pasta & Rice": {
    gradient: "from-yellow-200 to-amber-300",
    dot: "bg-yellow-400",
    badge: "bg-yellow-100 text-yellow-900",
    badgeDark: "bg-yellow-300 text-yellow-900",
    emoji: "🍝",
    desc: "Pasta, noodles, rice & couscous",
    group: "Pantry & Dry Goods",
  },
  "Flour & Baking": {
    gradient: "from-stone-200 to-amber-200",
    dot: "bg-stone-300",
    badge: "bg-stone-100 text-stone-700",
    badgeDark: "bg-stone-300 text-stone-800",
    emoji: "🧁",
    desc: "Flour, sugar, yeast & baking essentials",
    group: "Pantry & Dry Goods",
  },
  "Canned Goods": {
    gradient: "from-slate-300 to-slate-500",
    dot: "bg-slate-400",
    badge: "bg-slate-200 text-slate-800",
    badgeDark: "bg-slate-400 text-slate-100",
    emoji: "🥫",
    desc: "Tinned vegetables, beans, soups & fish",
    group: "Pantry & Dry Goods",
  },
  "Snacks": {
    gradient: "from-pink-300 to-pink-500",
    dot: "bg-pink-400",
    badge: "bg-pink-200 text-pink-900",
    badgeDark: "bg-pink-400 text-pink-900",
    emoji: "🍪",
    desc: "Cookies, chips, nuts & treats",
    group: "Pantry & Dry Goods",
  },

  // ── Condiments & Sauces ────
  "Condiments": {
    gradient: "from-yellow-300 to-yellow-500",
    dot: "bg-yellow-400",
    badge: "bg-yellow-200 text-yellow-900",
    badgeDark: "bg-yellow-300 text-yellow-900",
    emoji: "🧴",
    desc: "Ketchup, mustard, mayo & relishes",
    group: "Condiments & Sauces",
  },
  "Sauces & Dressings": {
    gradient: "from-red-300 to-orange-400",
    dot: "bg-red-400",
    badge: "bg-red-100 text-red-900",
    badgeDark: "bg-red-300 text-red-900",
    emoji: "🍅",
    desc: "Pasta sauces, salad dressings & marinades",
    group: "Condiments & Sauces",
  },
  "Oils & Vinegars": {
    gradient: "from-yellow-400 to-amber-500",
    dot: "bg-yellow-500",
    badge: "bg-yellow-200 text-yellow-900",
    badgeDark: "bg-yellow-400 text-yellow-900",
    emoji: "🫒",
    desc: "Olive oil, vegetable oil & vinegars",
    group: "Condiments & Sauces",
  },
  "Spices & Seasonings": {
    gradient: "from-orange-400 to-red-500",
    dot: "bg-orange-500",
    badge: "bg-orange-200 text-orange-900",
    badgeDark: "bg-orange-400 text-orange-900",
    emoji: "🌶️",
    desc: "Herbs, spices, salt & pepper blends",
    group: "Condiments & Sauces",
  },

  // ── Frozen ──────────
  "Frozen": {
    gradient: "from-cyan-300 to-cyan-500",
    dot: "bg-cyan-400",
    badge: "bg-cyan-200 text-cyan-900",
    badgeDark: "bg-cyan-400 text-cyan-900",
    emoji: "🧊",
    desc: "Frozen meals, snacks & ready-to-cook",
    group: "Frozen",
  },
  "Frozen Foods": {
    gradient: "from-cyan-300 to-cyan-500",
    dot: "bg-cyan-400",
    badge: "bg-cyan-200 text-cyan-900",
    badgeDark: "bg-cyan-400 text-cyan-900",
    emoji: "❄️",
    desc: "Ready meals, pizzas & frozen snacks",
    group: "Frozen",
  },
  "Frozen Vegetables": {
    gradient: "from-teal-200 to-cyan-400",
    dot: "bg-teal-300",
    badge: "bg-teal-100 text-teal-900",
    badgeDark: "bg-teal-300 text-teal-900",
    emoji: "🥬",
    desc: "Peas, sweetcorn, spinach & stir-fry mixes",
    group: "Frozen",
  },
  "Ice Cream": {
    gradient: "from-pink-200 to-purple-300",
    dot: "bg-pink-300",
    badge: "bg-pink-100 text-pink-900",
    badgeDark: "bg-pink-300 text-pink-900",
    emoji: "🍦",
    desc: "Ice cream, sorbet & frozen desserts",
    group: "Frozen",
  },

  // ── Health & Beauty ────────
  "Health & Supplements": {
    gradient: "from-green-200 to-teal-400",
    dot: "bg-green-400",
    badge: "bg-green-100 text-green-900",
    badgeDark: "bg-green-300 text-green-900",
    emoji: "💊",
    desc: "Vitamins, supplements & health foods",
    group: "Health & Beauty",
  },
  "Personal Care": {
    gradient: "from-violet-200 to-purple-400",
    dot: "bg-violet-400",
    badge: "bg-violet-100 text-violet-900",
    badgeDark: "bg-violet-300 text-violet-900",
    emoji: "🧴",
    desc: "Skincare, haircare & hygiene products",
    group: "Health & Beauty",
  },

  // ── Household ───────────
  "Household Essentials": {
    gradient: "from-slate-200 to-slate-400",
    dot: "bg-slate-400",
    badge: "bg-slate-100 text-slate-800",
    badgeDark: "bg-slate-300 text-slate-800",
    emoji: "🏠",
    desc: "Paper goods, batteries & home essentials",
    group: "Household",
  },
  "Cleaning Supplies": {
    gradient: "from-sky-200 to-blue-400",
    dot: "bg-sky-400",
    badge: "bg-sky-100 text-sky-900",
    badgeDark: "bg-sky-300 text-sky-900",
    emoji: "🧹",
    desc: "Detergents, disinfectants & cleaning tools",
    group: "Household",
  },

  // ── Fallback ───────
  "Uncategorized": {
    gradient: "from-stone-200 to-stone-400",
    dot: "bg-stone-300",
    badge: "bg-stone-100 text-stone-500",
    badgeDark: "bg-stone-300 text-stone-700",
    emoji: "📦",
    desc: "Miscellaneous items",
    group: "Other",
  },
};

// ─── Category Details Modal ──────────────────────────────────────────────────
function CategoryDetailsModal({
  categoryName,
  products,
  onClose,
}: {
  categoryName: string | null;
  products: Product[];
  onClose: () => void;
}) {
  if (!categoryName) return null;

  const meta = getCategoryMeta(categoryName);
  const categoryProducts = products.filter(
    (p) => (p.category?.categoryName || "Uncategorized") === categoryName
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto"
      style={{ background: "rgba(28,24,20,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden animate-[slideUp_0.25s_ease-out]">
        {/* Header */}
        <div className={`bg-linear-to-r ${meta.gradient} p-8 relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-stone-600 hover:bg-stone-100 transition"
          >
            ✕
          </button>

          <div className="flex items-start gap-4">
            <div className="text-5xl">{meta.emoji}</div>
            <div>
              <h2 className="font-extrabold text-stone-900 text-3xl mb-2">{categoryName}</h2>
              <p className="text-stone-700 text-sm">{meta.desc}</p>
            </div>
          </div>
        </div>

        {/* Products list */}
        <div className="p-6">
          {categoryProducts.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <p className="text-4xl mb-3">📭</p>
              <p className="font-medium">No products in this category yet.</p>
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4">
                {categoryProducts.length} Product{categoryProducts.length !== 1 ? "s" : ""}
              </p>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {categoryProducts.map((product) => {
                  const price =
                    typeof product.price === "string"
                      ? parseFloat(product.price.replace("$", ""))
                      : product.price;
                  return (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition"
                    >
                      {product.image ? (
                        <img
                          src={
                            product.image.startsWith("http")
                              ? product.image
                              : `https://inventory-app-jbjm.onrender.com${product.image}`
                          }
                          alt={product.name}
                          className="w-12 h-12 object-contain rounded-lg bg-white"
                        />
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg text-xl">
                          📦
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-stone-900 truncate">{product.name}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-extrabold text-stone-900">${price.toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          <button
            onClick={onClose}
            className="w-full bg-lime-400 text-stone-900 font-semibold py-3 rounded-xl hover:bg-lime-300 transition mt-6"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Convenience helpers ────

/** Returns the meta for a category name, falling back gracefully. */
function getCategoryMeta(name: string): CategoryMeta {
  return (
    CATEGORY_META[name] ??
    Object.entries(CATEGORY_META).find(
      ([k]) => k.toLowerCase() === name.toLowerCase()
    )?.[1] ??
    CATEGORY_META["Uncategorized"]
  );
}

// ─── Add Category Modal ─────
function AddCategoryModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!name.trim()) { setError("Category name is required."); return; }
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to add categories");
        setLoading(false);
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/categories`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ categoryName: name.trim(), labelColour: "#FF6B6B" }),
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

// ─── Edit Category Modal ────
function EditCategoryModal({ 
  category, 
  onClose, 
  onUpdated 
}: { 
  category: { id: number; categoryName: string }; 
  onClose: () => void; 
  onUpdated: () => void; 
}) {
  const [name, setName] = useState(category.categoryName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!name.trim()) { setError("Category name is required."); return; }
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/categories/${category.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ categoryName: name.trim() }),
      });
      if (!res.ok) throw new Error("Server error");
      onUpdated();
      onClose();
    } catch {
      setError("Could not update category.");
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
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 relative animate-[slideUp_0.25s_ease-out]">
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition">✕</button>
        <h2 className="font-extrabold text-stone-900 text-2xl mb-1">Edit Name</h2>
        <p className="text-stone-400 text-sm mb-7">Update the category name.</p>
        
        {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-2.5 mb-5">{error}</div>}

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-stone-900 text-sm focus:ring-2 focus:ring-lime-300 outline-none transition mb-7"
        />

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-stone-900 text-lime-300 font-semibold py-3 rounded-full text-sm hover:bg-stone-700 active:scale-95 transition disabled:opacity-50"
        >
          {loading ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

// ─── Category Card ──────
function CategoryCard({
  id,
  name,
  count,
  index,
  onClick,
  onDelete,
  onEdit,
}: {
  id: number;
  name: string;
  count: number;
  index: number;
  onClick: () => void;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const meta = getCategoryMeta(name);
  const offset = index % 3 === 1;

  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-2xl p-5 shadow-md cursor-pointer group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
        offset ? "mt-4" : ""
      } ${index % 2 === 0 ? "hover:-rotate-1" : "hover:rotate-1"}`}
    >
      {/* Action Buttons (Hover) */}
      <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="w-8 h-8 rounded-full bg-stone-50 text-stone-600 flex items-center justify-center hover:bg-stone-900 hover:text-white transition active:scale-90"
          title="Edit Category"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition active:scale-90"
          title="Delete Category"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
          </svg>
        </button>
      </div>

      {/* Gradient bar */}
      <div className={`h-2 rounded-full bg-lnear-to-r ${meta.gradient} mb-4`} />

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

// ─── Main Page ──────
export default function CategoriesPage() {
  const [categories, setCategories] = useState<{id: number, categoryName: string}[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<{id: number, categoryName: string} | null>(null);

  // ── Fetch categories + product counts ────────
  async function fetchData() {
    setLoading(true); setError("");
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      // Fetch categories from API
      const catRes = await fetch(`${apiUrl}/api/categories`, { signal: controller.signal });
      if (!catRes.ok) {
        const errorData = await catRes.json().catch(() => ({}));
        throw new Error(`Categories failed: ${catRes.status} - ${errorData.message || catRes.statusText}`);
      }
      const categoriesData = await catRes.json();
      
      setCategories(categoriesData);

      // Fetch products to count per category
      const prodRes = await fetch(`${apiUrl}/api/products`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!prodRes.ok) {
        const errorData = await prodRes.json().catch(() => ({}));
        throw new Error(`Products failed: ${prodRes.status} - ${errorData.message || prodRes.statusText}`);
      }
      const productsData = await prodRes.json();

      // Count products per category
      const counts: Record<string, number> = {};
      productsData.forEach((product: any) => {
        const catName = product.category?.categoryName || "Uncategorized";
        counts[catName] = (counts[catName] ?? 0) + 1;
      });
      setProductCounts(counts);
      setAllProducts(productsData);
    } catch (err: any) {
      let errorMsg = "Could not load categories. Check your connection.";
      if (err.name === "AbortError") {
        errorMsg = "Request timeout - server took too long to respond.";
      } else if (err.message?.includes("Failed to fetch")) {
        errorMsg = "Network error - is the server running on http://localhost:3000?";
      }
      setError(errorMsg);
      console.error("[Categories Fetch Error]", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
    fetchData();
  }, []);

  const filtered = categories.filter((c) =>
    c.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteCategory = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? Products in this category will become Uncategorized.`)) return;
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please sign in to delete categories");
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to delete category");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting category");
    }
  };

  return (
    <>
      {showModal && (
        <AddCategoryModal onClose={() => setShowModal(false)} onAdded={fetchData} />
      )}
      {editingCategory && (
        <EditCategoryModal 
          category={editingCategory} 
          onClose={() => setEditingCategory(null)} 
          onUpdated={fetchData} 
        />
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

          {/* ── Header ───── */}
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

          {/* ── Stats row ────────*/}
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

          {/* ── Category grid ───────*/}
          {!loading && !error && filtered.length > 0 && (
            <div
              className={`grid gap-5 transition-all duration-700 delay-200 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))" }}
            >
              {filtered.map((cat, i) => (
                <CategoryCard
                  key={cat.id}
                  id={cat.id}
                  name={cat.categoryName}
                  count={productCounts[cat.categoryName] ?? 0}
                  index={i}
                  onClick={() => setSelectedCategory(cat.categoryName)}
                  onDelete={() => handleDeleteCategory(cat.id, cat.categoryName)}
                  onEdit={() => setEditingCategory(cat)}
                />
              ))}
            </div>
          )}

          {/* ── Footer nudge ────── */}
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

      <CategoryDetailsModal
        categoryName={selectedCategory}
        products={allProducts}
        onClose={() => setSelectedCategory(null)}
      />
    </>
  );
}