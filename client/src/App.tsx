import { useState } from "react";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Categories from "./pages/Categories";

type Page = "home" | "products" | "categories";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  return (
    <div className="min-h-screen bg-cyan-50">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      {currentPage === "home" ? (
        <Home
          onViewProducts={() => setCurrentPage("products")}
          onViewCategories={() => setCurrentPage("categories")}
        />
      ) : currentPage === "products" ? (
        <Products />
      ) : (
        <Categories />
      )}
    </div>
  );
}