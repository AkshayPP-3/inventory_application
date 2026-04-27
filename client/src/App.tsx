import { useState } from "react";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";

type Page = "home" | "products";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  return (
    <div className="min-h-screen bg-cyan-50">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      {currentPage === "home" ? (
        <Home />
      ) : (
        <main className="px-4 py-12 sm:px-6 lg:px-8">
          <section className="mx-auto w-full max-w-5xl rounded-3xl border border-orange-200 bg-white/90 p-10 text-center shadow-lg">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
              Products Page
            </p>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900">
              Product area is coming next
            </h2>
            <p className="mt-3 text-slate-600">
              For now, use the Home button in navbar to return to the welcome page.
            </p>
          </section>
        </main>
      )}
    </div>
  );
}