
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useEffect } from "react";

const queryClient = new QueryClient();

function useGlobalDarkMode() {
  useEffect(() => {
    // Always enable dark mode unless user specified
    const html = document.documentElement;
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    // You could use localStorage for user-selected mode (not yet implemented here)
    if (!html.classList.contains("dark")) {
      html.classList.add("dark");
    }
    // If you want to respect system preference, uncomment below:
    // if (prefersDark) {
    //   html.classList.add("dark");
    // } else {
    //   html.classList.remove("dark");
    // }
  }, []);
}

const App = () => {
  useGlobalDarkMode();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {navItems.map(({ to, page }) => (
                  <Route key={to} path={to} element={page} />
                ))}
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
