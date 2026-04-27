import { useState, useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Categories from "./pages/Categories";

type Page = "home" | "products" | "categories";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  useEffect(() => {
    // Check for token in URL query parameters (OAuth callback)
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const email = params.get("email");
    
    if (token) {
      // Store token and email in localStorage
      localStorage.setItem("token", token);
      if (email) {
        localStorage.setItem("email", email);
      }
      // Remove params from URL to clean it up
      window.history.replaceState({}, document.title, window.location.pathname);
      // Refresh navbar by triggering a state update if needed
      setCurrentPage("home");
    }
  }, []);

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