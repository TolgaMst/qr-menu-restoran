"use client";

import { useState, useEffect } from "react";
import { checkAdminPassword } from "@/lib/auth";
import MaliyetApp from "@/components/maliyet/MaliyetApp";

export default function MaliyetPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sessionAuth = sessionStorage.getItem("maliyetAuthenticated");
      if (sessionAuth === "true") {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkAdminPassword(loginPassword)) {
      setIsAuthenticated(true);
      sessionStorage.setItem("maliyetAuthenticated", "true");
      setPasswordError("");
    } else {
      setPasswordError("Şifre yanlış!");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("maliyetAuthenticated");
    setIsAuthenticated(false);
    setLoginPassword("");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
            </div>
            <h1 className="text-xl font-bold text-white text-center mb-1">Mezecim Maliyet</h1>
            <p className="text-sm text-gray-400 text-center mb-6">Maliyet takip paneline giriş yapın</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Şifre"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  autoFocus
                />
              </div>
              {passwordError && (
                <p className="text-red-400 text-sm text-center">{passwordError}</p>
              )}
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
              >
                Giriş Yap
              </button>
            </form>

            <div className="mt-6 text-center">
              <a href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                ← Ana Sayfaya Dön
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <MaliyetApp onLogout={handleLogout} />;
}
