import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { ShoppingCart, Menu, X, Zap, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  // Sync cart from localStorage
  useEffect(() => {
    const updateCart = () => {
      const stored = localStorage.getItem("motormoura_cart");
      setCart(stored ? JSON.parse(stored) : []);
    };
    updateCart();
    window.addEventListener("storage", updateCart);
    window.addEventListener("cartUpdated", updateCart);
    return () => {
      window.removeEventListener("storage", updateCart);
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantidade, 0);

  const navLinks = [
    { label: "Início", page: "Home" },
    { label: "Catálogo", page: "Catalogo" },
    { label: "Minha Conta", page: "MinhaConta" },
  ];

  if (user?.role === "admin") {
    navLinks.push({ label: "Admin", page: "Admin" });
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        :root {
          --primary: 220 90% 20%;
          --primary-foreground: 0 0% 98%;
        }
        .bg-brand { background-color: #0a2540; }
        .text-brand { color: #0a2540; }
        .border-brand { border-color: #0a2540; }
        .bg-brand-accent { background-color: #e8b84b; }
        .text-brand-accent { color: #e8b84b; }
        .hover-brand:hover { background-color: #0d3060; }
      `}</style>

      {/* Header */}
      <header className="bg-brand shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-2">
              <div className="bg-brand-accent rounded-lg p-1.5">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-white font-bold text-lg leading-none">Motor</span>
                <span className="text-brand-accent font-bold text-lg leading-none">Moura</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  className={`text-sm font-medium transition-colors ${
                    currentPageName === link.page
                      ? "text-brand-accent"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Cart */}
              <Link to={createPageUrl("Orcamento")} className="relative">
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/10">
                  <ShoppingCart className="w-5 h-5" />
                </Button>
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-brand-accent text-white text-xs min-w-5 h-5 flex items-center justify-center rounded-full px-1">
                    {totalItems}
                  </Badge>
                )}
              </Link>

              {/* Auth */}
              {user ? (
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-gray-300 text-sm">{user.full_name?.split(" ")[0]}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => base44.auth.logout()}
                    className="text-gray-400 hover:text-white text-xs"
                  >
                    Sair
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={() => base44.auth.redirectToLogin()}
                  className="hidden md:flex bg-brand-accent hover:bg-yellow-400 text-white font-medium"
                >
                  Entrar
                </Button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden text-gray-300 hover:text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-700 px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.page}
                to={createPageUrl(link.page)}
                className="block text-gray-300 hover:text-white py-2 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <Button
                size="sm"
                onClick={() => base44.auth.redirectToLogin()}
                className="w-full bg-brand-accent hover:bg-yellow-400 text-white mt-2"
              >
                Entrar / Registar
              </Button>
            )}
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-brand text-gray-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-brand-accent rounded-lg p-1">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold">MotorMoura</span>
            </div>
            <p className="text-sm leading-relaxed">
              Distribuidora especialista em peças de reposição para motores estacionários, geradores e motobombas.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Categorias</h4>
            <ul className="space-y-1 text-sm">
              <li>Motores a Gasolina</li>
              <li>Motores a Diesel</li>
              <li>Geradores 4 Tempos</li>
              <li>Motobombas 4 Tempos</li>
              <li>Bombas de Pulverização</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contacto B2B</h4>
            <p className="text-sm">Plataforma exclusiva para lojistas e revendedores.</p>
            <p className="text-sm mt-2">Para se tornar revendedor, registe-se e aguarde aprovação.</p>
          </div>
        </div>
        <div className="border-t border-gray-800 text-center py-4 text-xs">
          © 2026 MotorMoura. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}