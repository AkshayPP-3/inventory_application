import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

// ─── Category colours ─────────────────────────────────────────────────────────
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

// ─── Product Detail Page ──────────────────────────────────────────────────────
export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product ID is missing");
        setLoading(false);
        return;
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const res = await fetch(`${apiUrl}/api/products/${id}`, {
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!res.ok) throw new Error(`Product not found`);
        const data = await res.json();
        setProduct(data);
      } catch (err: any) {
        if (err.name === "AbortError") {
          setError("Request timeout - server took too long");
        } else {
          setError(err.message || "Could not load product. Check your connection.");
        }
        console.error(`[Product Detail Error]`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">⚙️</div>
          <p className="text-stone-600">Loading product details...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-cyan-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-stone-600 mb-6">{error || "Product not found"}</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-stone-900 text-lime-300 font-semibold px-6 py-3 rounded-full hover:bg-stone-700 transition"
          >
            Back to Products
          </button>
        </div>
      </main>
    );
  }

  const price = typeof product.price === "string"
    ? parseFloat(product.price.replace("$", ""))
    : product.price;

  const colorClass = CATEGORY_COLORS[product.category] ?? "bg-stone-100 text-stone-500";

  return (
    <main className="min-h-screen bg-cyan-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Back button */}
        <button
          onClick={() => navigate("/products")}
          className="mb-6 flex items-center gap-2 text-stone-600 hover:text-stone-900 transition font-medium"
        >
          ← Back to Products
        </button>

        {/* Product card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Image section */}
          <div className="relative h-80 bg-gradient-to-b from-stone-50 to-stone-100 flex items-center justify-center">
            {product.image ? (
              <img
                src={product.image.startsWith("http") ? product.image : `https://inventory-app-jbjm.onrender.com${product.image}`}
                alt={product.name}
                className="h-64 w-64 object-contain"
              />
            ) : (
              <div className="text-9xl">📦</div>
            )}
          </div>

          {/* Details section */}
          <div className="p-8 space-y-6">
            {/* Name */}
            <div>
              <h1 className="font-extrabold text-stone-900 text-4xl mb-2">{product.name}</h1>
              {product.brand && <p className="text-sm text-stone-500">{product.brand}</p>}
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-lime-50 to-green-50 rounded-2xl p-6 border border-lime-200">
              <p className="text-xs text-stone-500 uppercase font-semibold tracking-wider mb-2">Price</p>
              <p className="text-4xl font-extrabold text-stone-900">${price.toFixed(2)}</p>
            </div>

            {/* Category */}
            <div>
              <p className="text-xs text-stone-500 uppercase font-semibold tracking-wider mb-3">Category</p>
              <span className={`inline-block text-sm font-semibold uppercase tracking-wider px-6 py-3 rounded-full ${colorClass}`}>
                {product.category}
              </span>
            </div>

            {/* Quantity if available */}
            {product.quantity !== undefined && (
              <div className="bg-stone-50 rounded-2xl p-6">
                <p className="text-xs text-stone-500 uppercase font-semibold tracking-wider mb-2">In Stock</p>
                <p className="text-2xl font-bold text-stone-900">{product.quantity} units</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => navigate("/products")}
                className="flex-1 bg-stone-900 text-lime-300 font-semibold py-3 rounded-xl hover:bg-stone-700 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
