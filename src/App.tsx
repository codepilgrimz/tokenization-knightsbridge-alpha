
import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Knightsbridge from "./pages/Knightsbridge";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancelled from "./pages/PaymentCancelled";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* <Route 
              path="/" 
              element={<Home isDarkMode={isDarkMode} onThemeToggle={handleThemeToggle} />} 
            />
            <Route 
              path="/decentralized" 
              element={<Index isDarkMode={isDarkMode} onThemeToggle={handleThemeToggle} />} 
            /> */}
            <Route 
              path="/" 
              element={<Knightsbridge isDarkMode={isDarkMode} onThemeToggle={handleThemeToggle} />} 
            />
            <Route 
              path="/faq" 
              element={<FAQ isDarkMode={isDarkMode} onThemeToggle={handleThemeToggle} />} 
            />
            <Route 
              path="/contact" 
              element={<Contact isDarkMode={isDarkMode} onThemeToggle={handleThemeToggle} />} 
            />
            {/* <Route 
              path="/admin-dashboard-knightsbridge" 
              element={<AdminDashboard isDarkMode={isDarkMode} onThemeToggle={handleThemeToggle} />} 
            /> */}
            <Route 
              path="/payment-success" 
              element={<PaymentSuccess />} 
            />
            <Route 
              path="/payment-cancelled" 
              element={<PaymentCancelled />} 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
