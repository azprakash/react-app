/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from "react";
import Header from "./components/Header.tsx";
import AuthPage from "./components/AuthPage.tsx";
import CustomerCatalog from "./components/CustomerCatalog.tsx";
import AdminConsole from "./components/AdminConsole.tsx";
import AwsConsoleView from "./components/AwsConsoleView.tsx";
import { Product, CartItem, User, Order } from "./types.ts";

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("azbuynow_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // Shopping views
  const [currentView, setView] = useState<"catalog" | "admin" | "aws">("catalog");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // A simple counter to trigger AWS console syncs
  const [awsTrigger, setAwsTrigger] = useState(0);

  // Sync session & cart to LocalStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("azbuynow_user", JSON.stringify(user));
      // Sku cart by user of course
      const savedCart = localStorage.getItem(`azbuynow_cart_${user.id}`);
      setCart(savedCart ? JSON.parse(savedCart) : []);
    } else {
      localStorage.removeItem("azbuynow_user");
      setCart([]);
    }
  }, [user]);

  // Sync cart shifts
  useEffect(() => {
    if (user && cart.length >= 0) {
      localStorage.setItem(`azbuynow_cart_${user.id}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  // Unified full-stack resource loader
  const loadWorkspaceResources = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Fetch products
      const pRes = await fetch("/api/products");
      if (pRes.ok) {
        const pData = await pRes.json();
        setProducts(pData);
      }

      // 2. Fetch orders
      const oUrl = user.role === "Admin" ? "/api/orders" : `/api/orders?userId=${user.id}`;
      const oRes = await fetch(oUrl);
      if (oRes.ok) {
        const oData = await oRes.json();
        setOrders(oData);
      }

      // 3. Fetch users if admin
      if (user.role === "Admin") {
        const uRes = await fetch("/api/auth/users");
        if (uRes.ok) {
          const uData = await uRes.json();
          setUsers(uData);
        }
      }
    } catch (err) {
      console.error("Failed to query full-stack resources:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Trigger loading on mount or login
  useEffect(() => {
    loadWorkspaceResources();
  }, [user, loadWorkspaceResources, currentView]);


  // Log out gateway
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("azbuynow_user");
    setView("catalog");
  };

  // Login successful
  const handleLoginSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    // Admins go to catalog but have toggles
    setView("catalog");
    setAwsTrigger(prev => prev + 1);
  };

  // CART STATE MUTATIONS
  const handleAddToCart = (product: Product, quantity: number) => {
    if (!user) return;
    setCart(prevCart => {
      const existing = prevCart.find(item => item.productId === product.id);
      if (existing) {
        const newQty = Math.min(product.stock, existing.qty + quantity);
        return prevCart.map(item => 
          item.productId === product.id ? { ...item, qty: newQty } : item
        );
      }
      return [...prevCart, {
        productId: product.id,
        name: product.name,
        qty: Math.min(product.stock, quantity),
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl
      }];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  const handleUpdateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    const matchedProd = products.find(p => p.id === productId);
    const maxStock = matchedProd ? matchedProd.stock : 999;
    
    setCart(prevCart => prevCart.map(item => 
      item.productId === productId ? { ...item, qty: Math.min(maxStock, quantity) } : item
    ));
  };

  const handleClearCart = () => {
    setCart([]);
    if (user) {
      localStorage.removeItem(`azbuynow_cart_${user.id}`);
    }
  };

  // Order Placement callback
  const handlePlaceOrder = async (orderPayload: any) => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        return null;
      }

      const orderResult: Order = await response.json();
      
      // Update local catalog orders representation
      setOrders(prev => [orderResult, ...prev]);
      
      // Bump AWS console sync metrics
      setAwsTrigger(prev => prev + 1);
      
      return orderResult;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // RENDER SELECTION

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
        <Header 
          user={null} 
          cart={[]} 
          currentView="catalog" 
          setView={() => {}} 
          onLogout={() => {}} 
          openCart={() => {}} 
        />
        <main className="flex-1">
          <AuthPage onLoginSuccess={handleLoginSuccess} />
        </main>
        <footer className="bg-white border-t border-gray-150 py-4 text-center text-xs text-gray-400 font-medium">
          Azbuynow.com &copy; 2220-2026. Protected by Cognito AWS Auth Services.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans" id="application-driver">
      
      {/* Dynamic Navigation Header */}
      <Header 
        user={user} 
        cart={cart}
        currentView={currentView}
        setView={(v) => setView(v)}
        onLogout={handleLogout}
        openCart={() => setIsCartOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 pb-16">
        
        {/* Toggleable Views based on Navigation */}
        
        {currentView === "catalog" && (
          <CustomerCatalog 
            products={products}
            cart={cart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onUpdateCartQty={handleUpdateCartQty}
            onClearCart={handleClearCart}
            user={user}
            onPlaceOrder={handlePlaceOrder}
          />
        )}

        {currentView === "admin" && user.role === "Admin" && (
          <AdminConsole 
            products={products}
            orders={orders}
            users={users}
            onRefreshData={loadWorkspaceResources}
          />
        )}

        {currentView === "aws" && user.role === "Admin" && (
          <AwsConsoleView 
            onRefreshTrigger={awsTrigger}
          />
        )}

      </main>

      {/* Corporate Footprint */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-400 font-mono shadow-inner">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>PORTAL: Azbuynow.com | HOSTED ON AWS AMPLIFY CLOUD</span>
          <span className="font-semibold text-emerald-500">🟢 COMPLIANT SSL GATEWAY ACTIVE</span>
        </div>
      </footer>

    </div>
  );
}
