import { useState } from "react";
import { X } from "lucide-react";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryAdded: () => void;
}

export default function AddCategoryModal({
  isOpen,
  onClose,
  onCategoryAdded,
}: AddCategoryModalProps) {
  const [formData, setFormData] = useState({
    categoryName: "",
    labelColour: "#FF6B6B",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
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

    if (!formData.categoryName.trim() || !formData.labelColour.trim()) {
      setError("Category name and color are required");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to add categories");
      return;
    }

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          categoryName: formData.categoryName.trim(),
          labelColour: formData.labelColour.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to add category");
      }

      setFormData({ categoryName: "", labelColour: "#FF6B6B" });
      onCategoryAdded();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add category"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded-2xl bg-linear-to-br from-white to-gray-50 p-8 shadow-2xl dark:from-gray-800 dark:to-gray-900">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <X size={20} />
        </button>

        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Add New Category
        </h2>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Create a new product category with a custom color label
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category Name
            </label>
            <input
              type="text"
              name="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              placeholder="e.g., Electronics"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Label Color
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                name="labelColour"
                value={formData.labelColour}
                onChange={handleChange}
                className="h-12 w-20 rounded-lg border border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                name="labelColour"
                value={formData.labelColour}
                onChange={handleChange}
                placeholder="#FF6B6B"
                className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900 dark:bg-opacity-20 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Category"}
          </button>
        </form>
      </div>
    </div>
  );
}
