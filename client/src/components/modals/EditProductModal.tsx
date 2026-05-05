import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Category {
  id: number;
  categoryName: string;
}

interface Product {
  id: number;
  name: string;
  price: string | number;
  image: string;
  categoryId?: number;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: () => void;
  product: Product;
}

export default function EditProductModal({
  isOpen,
  onClose,
  onProductUpdated,
  product,
}: EditProductModalProps) {
  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price.toString(),
    image: product.image,
    categoryId: product.categoryId?.toString() || "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      setFormData({
        name: product.name,
        price: product.price.toString(),
        image: product.image,
        categoryId: product.categoryId?.toString() || "",
      });
    }
  }, [isOpen, product]);

  const fetchCategories = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.price) {
      setError("Name and Price are required");
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      setError("Price must be a valid positive number");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to update products");
      return;
    }

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          price,
          image: formData.image.trim(),
          categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update product");
      }

      onProductUpdated();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update product"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-stone-400 hover:text-stone-600 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="mb-2 text-2xl font-extrabold text-stone-900" style={{ fontFamily: "'Syne', sans-serif" }}>
          Edit Product
        </h2>
        <p className="mb-6 text-sm text-stone-500">
          Update the details of your product below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-widest mb-1.5 ml-1">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Fuji Apples"
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-stone-300 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-widest mb-1.5 ml-1">
                Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 pl-8 pr-4 py-3 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-stone-300 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-widest mb-1.5 ml-1">
                Category
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-stone-300 transition appearance-none"
              >
                <option value="">Uncategorized</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg px-4 py-2 mt-2">
              {error}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 text-lime-300 font-bold py-3.5 rounded-xl transition-all duration-200 hover:bg-stone-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-lime-900/10"
            >
              {loading ? "Saving Changes..." : "Update Product"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full mt-2 bg-transparent text-stone-400 font-semibold py-2 rounded-xl text-sm hover:text-stone-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
