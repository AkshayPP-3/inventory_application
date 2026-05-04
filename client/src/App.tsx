import { useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  useEffect(() => {
    // Check for token in URL query parameters (OAuth callback)
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const email = params.get("email");
    
    if (token) {
      // Store token and email in localStorage
      localStorage.setItem("token", token);
      if (email) {
        localStorage.setItem("userEmail", email);
      }
      // Remove params from URL to clean it up
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div className="min-h-screen bg-cyan-50">
      <Navbar />
      <AppRoutes />
    </div>
  );
}