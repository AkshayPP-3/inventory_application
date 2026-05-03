import { useState, useEffect } from "react";
import { CircleFadingArrowUpIcon, Trash2 } from "lucide-react";
import AddCategoryModal from "../components/modals/AddCategoryModal";

interface Category {
  id: number;
  categoryName: string;
  labelColour: string;
  createdAt: string;
  products?: Array<{ id: number; name: string }>;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/api/categories`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to delete categories");
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete category");
      
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-amber-50 flex flex-col items-center px-6 py-24">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-20 -left-28 w-96 h-96 rounded-full bg-lime-300 opacity-40 blur-3xl animate-[drift1_8s_ease-in-out_infinite_alternate]" />
        <div className="absolute -bottom-16 -right-20 w-72 h-72 rounded-full bg-orange-400 opacity-35 blur-3xl animate-[drift2_10s_ease-in-out_infinite_alternate]" />
        <div className="absolute top-1/2 left-2/3 w-56 h-56 rounded-full bg-violet-300 opacity-30 blur-3xl animate-[drift1_12s_ease-in-out_infinite_alternate-reverse]" />
        <div className="absolute top-1/4 right-10 w-44 h-44 rounded-full bg-sky-300 opacity-35 blur-3xl animate-[drift2_9s_ease-in-out_infinite_alternate]" />
      </div>

      <section className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-2 py-4 text-center sm:px-0 sm:py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black">
          categories
        </p>

        <h1 className="mt-3 text-3xl font-extrabold leading-tight text-black sm:text-4xl lg:text-5xl">
          Categories
        </h1>

        <button
          onClick={() => setIsModalOpen(true)}
          type="button"
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-black px-5 py-3 text-sm font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-md"
        >
          <CircleFadingArrowUpIcon className="h-4 w-4" />
          Add Category
        </button>

        <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-black sm:text-base">
          Manage your product categories in one place. Create a new category
          with the button above to keep your inventory well organized.
        </p>

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 w-full max-w-3xl">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8 text-gray-600">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="mt-8 text-gray-600">
            No categories yet. Create one to get started!
          </div>
        ) : (
          <div className="mt-8 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className="h-12 rounded-lg mb-3"
                  style={{ backgroundColor: category.labelColour }}
                />
                <h3 className="font-semibold text-gray-900 truncate">
                  {category.categoryName}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {category.products?.length || 0} products
                </p>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="mt-3 inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCategoryAdded={() => {
          setIsModalOpen(false);
          fetchCategories();
        }}
      />
    </main>
  );
}

