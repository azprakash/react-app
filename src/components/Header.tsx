/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ShoppingCart, LogOut, ShieldAlert, ShoppingBag, Terminal, User as UserIcon } from "lucide-react";
import { User, CartItem } from "../types";

interface HeaderProps {
  user: User | null;
  cart: CartItem[];
  currentView: "catalog" | "admin" | "aws";
  setView: (view: "catalog" | "admin" | "aws") => void;
  onLogout: () => void;
  openCart: () => void;
}

export default function Header({
  user,
  cart,
  currentView,
  setView,
  onLogout,
  openCart
}: HeaderProps) {
  const cartCount = cart.reduce((total, item) => total + item.qty, 0);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm" id="main-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView("catalog")}>
            <div className="bg-amber-500 text-white p-2 rounded-lg flex items-center justify-center shadow-sm">
              <ShoppingBag className="h-6 w-6 stroke-[2]" id="logo-icon" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900">
                Azbuy<span className="text-amber-500">now</span>
              </span>
              <span className="text-xs block font-mono text-gray-400 -mt-1 font-semibold">.com</span>
            </div>
          </div>

          {/* Navigation and Actions */}
          <div className="flex items-center space-x-4">
            
            {user && (
              <nav className="flex items-center space-x-1 sm:space-x-2 mr-2">
                {/* Catalog View Link */}
                <button
                  id="tab-nav-catalog"
                  onClick={() => setView("catalog")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === "catalog"
                      ? "bg-amber-50 text-amber-600 font-semibold"
                      : "text-gray-600 hover:text-amber-500 hover:bg-gray-50"
                  }`}
                >
                  Products
                </button>

                {/* Conditional Admin Board Link */}
                {user.role === "Admin" && (
                  <>
                    <button
                      id="tab-nav-admin"
                      onClick={() => setView("admin")}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                        currentView === "admin"
                          ? "bg-indigo-50 text-indigo-600 font-semibold"
                          : "text-gray-600 hover:text-indigo-500 hover:bg-gray-50"
                      }`}
                    >
                      <ShieldAlert className="h-4 w-4" />
                      Admin Panel
                    </button>

                    <button
                      id="tab-nav-aws"
                      onClick={() => setView("aws")}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                        currentView === "aws"
                          ? "bg-slate-100 text-slate-800 font-bold"
                          : "text-gray-500 hover:text-slate-800 hover:bg-gray-50"
                      }`}
                    >
                      <Terminal className="h-4 w-4 text-emerald-500" />
                      AWS Console
                    </button>
                  </>
                )}
              </nav>
            )}

            {/* Shopping Cart button - Active mainly in Catalog mode */}
            {user && user.role === "Customer" && (
              <button
                id="header-cart-btn"
                onClick={openCart}
                className="relative p-2.5 rounded-full text-gray-600 hover:text-amber-500 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <ShoppingCart className="h-6 w-6 stroke-[1.75]" />
                {cartCount > 0 && (
                  <span
                    id="cart-badge-count"
                    className="absolute top-0 right-0 bg-red-500 text-white font-semibold text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-white animate-bounce"
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Profile Menu & Sign Out */}
            {user ? (
              <div className="flex items-center pl-2 border-l border-gray-100 space-x-3">
                <div className="hidden md:block text-right">
                  <div className="text-sm font-semibold text-gray-800">{user.name}</div>
                  <div className="text-xs font-mono text-gray-400 capitalize flex items-center justify-end gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${user.role === 'Admin' ? 'bg-indigo-500' : 'bg-amber-500'}`} />
                    {user.role} Account
                  </div>
                </div>
                <div className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-600 flex items-center justify-center">
                  <UserIcon className="h-4 w-4" />
                </div>
                
                <button
                  id="btn-signout"
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="text-sm font-mono text-gray-400">
                Secure SSL Enabled
              </div>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}
