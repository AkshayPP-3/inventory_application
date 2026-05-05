import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import EditProductModal from "../components/modals/EditProductModal";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  price: string | number;
  image: string;
  category: string;
  categoryId?: number;
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productCount, setProductCount] = useState(0);

  // Gamification helpers (synced with Navbar)
  const LEVEL_THRESHOLDS = [0, 3, 7, 13, 21, 31];
  function getLevelInfo(count: number) {
    let level = 0;
    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
      if (count >= LEVEL_THRESHOLDS[i]) level = i + 1;
    }
    const currentFloor = LEVEL_THRESHOLDS[level - 1] ?? 0;
    const nextFloor = LEVEL_THRESHOLDS[level] ?? currentFloor + 1;
    const progress = Math.min(100, Math.round(((count - currentFloor) / (nextFloor - currentFloor)) * 100));
    return { level, progress, nextFloor, currentFloor };
  }

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
      // Normalize backend shape: category may be an object { categoryName }
      const normalized = {
        ...data,
        category: data?.category?.categoryName || data?.category || "Uncategorized",
        categoryId: data?.categoryId || data?.category?.id,
        image: data?.image || "",
      } as Product & any;
      setProduct(normalized);
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

  useEffect(() => {
    fetchProduct();
    
    // Load local count for progress bar
    const email = localStorage.getItem("userEmail") ?? "";
    const key = email ? `productCount_${email}` : "productCount";
    setProductCount(parseInt(localStorage.getItem(key) ?? "0", 10));
  }, [id]);

  const { level, progress, nextFloor, currentFloor } = getLevelInfo(productCount);

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

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please sign in to delete products");
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/products/${product.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Update product count tied to user email
        const userEmail = localStorage.getItem("userEmail") ?? "";
        const productCountKey = userEmail ? `productCount_${userEmail}` : "productCount";
        const currentCount = parseInt(localStorage.getItem(productCountKey) ?? "0", 10);
        localStorage.setItem(productCountKey, Math.max(0, currentCount - 1).toString());
        window.dispatchEvent(new CustomEvent("productAdded")); // Notify Navbar to refresh count

        navigate("/products");
      } else {
        alert("Failed to delete product. " + (res.status === 401 ? "Unauthorized." : ""));
      }
    } catch (err) {
      console.error("[Delete Error]", err);
      alert("An error occurred while deleting.");
    }
  };

  return (
    <main className="min-h-screen bg-cyan-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Back button */}
        <button
          onClick={() => navigate("/products")}
          className="group mb-8 flex items-center gap-2.5 text-stone-500 hover:text-stone-900 transition-all duration-200"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-sm border border-stone-200 group-hover:border-stone-300 group-hover:shadow-md transition-all">
            <ArrowLeft size={18} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-sm uppercase tracking-widest">Back to Products</span>
        </button>

        {/* Product card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Image section */}
          <div className="relative h-80 bg-linear-to-b from-stone-50 to-stone-100 flex items-center justify-center">
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
            <div className="bg-linear-to-r from-lime-50 to-green-50 rounded-2xl p-6 border border-lime-200">
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
            <div className="flex justify-end items-center gap-3 pt-4">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="bg-stone-900 text-lime-300 font-bold px-8 py-3 rounded-xl hover:bg-stone-700 transition-all duration-200 active:scale-95 shadow-lg shadow-lime-900/10"
              >
                ✏️ Edit Product
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-red-700 transition-all duration-200 active:scale-95 shadow-lg shadow-red-200"
              >
                🗑️ Delete Product
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 px-6 py-4 flex flex-col items-center min-w-75">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Inventory Level Progress</span>
          <div className="flex items-center gap-3 w-full">
            <span className="text-sm font-black text-stone-900">Lv.{level}</span>
            <div className="flex-1 h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
              <div 
                className="h-full bg-linear-to-r from-lime-400 to-emerald-500 transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-black text-stone-900">Lv.{level + 1}</span>
          </div>
          <p className="text-[10px] text-stone-400 mt-2 font-medium">
            {productCount - currentFloor} / {nextFloor - currentFloor} products for next level
          </p>
        </div>
      </div>

      {product && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onProductUpdated={fetchProduct}
          product={product}
        />
      )}
    </main>
  );
}
