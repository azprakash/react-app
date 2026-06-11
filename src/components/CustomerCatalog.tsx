/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { 
  Search, Filter, ShoppingCart, Plus, Minus, Trash2, IndianRupee, 
  MapPin, Phone, User as UserIcon, CreditCard, ChevronRight, CheckCircle2, 
  Package, ShoppingBag, X, ArrowLeft, ArrowRight, Truck, Info 
} from "lucide-react";
import { Product, CartItem, User, Order } from "../types";

interface CustomerCatalogProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product, qty: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onUpdateCartQty: (productId: string, qty: number) => void;
  onClearCart: () => void;
  user: User;
  onPlaceOrder: (orderData: any) => Promise<Order | null>;
}

const CATEGORIES = [
  "All", "Groceries", "Fruits", "Vegetables", "Dairy", "Beverages", 
  "Snacks", "Household", "Personal Care", "Electronics", "Stationery"
] as const;

export default function CustomerCatalog({
  products,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onUpdateCartQty,
  onClearCart,
  user,
  onPlaceOrder,
}: CustomerCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"shopping" | "checkout" | "confirmed">("shopping");
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Form Fields
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.mobile);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<any>("Cash on Delivery");

  // Error State
  const [formError, setFormError] = useState<string | null>(null);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Pagination for catalog grid (100 products might clog DOM, let's paginated 12 products per page nicely with search)
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // Filtered Products
  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== "All") {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query)
      );
    }

    return result;
  }, [products, selectedCategory, searchQuery]);

  // Page Calculations
  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, page]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Reset page when category or search changes
  React.useEffect(() => {
    setPage(1);
  }, [selectedCategory, searchQuery]);

  // Pricing calculation
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const gst = Math.round(subtotal * 0.05); // 5% GST
  const deliveryFee = subtotal > 500 ? 0 : 50; 
  const grandTotal = subtotal + gst + deliveryFee;

  // Category Icon & Color Mapping
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Groceries": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Fruits": return "bg-orange-50 text-orange-700 border-orange-100";
      case "Vegetables": return "bg-green-50 text-green-700 border-green-100";
      case "Dairy": return "bg-sky-50 text-sky-700 border-sky-100";
      case "Beverages": return "bg-cyan-50 text-cyan-700 border-cyan-100";
      case "Snacks": return "bg-amber-50 text-amber-700 border-amber-100";
      case "Household": return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "Personal Care": return "bg-pink-50 text-pink-700 border-pink-100";
      case "Electronics": return "bg-purple-50 text-purple-700 border-purple-100";
      case "Stationery": return "bg-teal-50 text-teal-700 border-teal-100";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) return setFormError("Customer name is required.");
    if (!phone.trim()) return setFormError("Mobile number is required.");
    if (!address.trim()) return setFormError("Detailed delivery address is required.");
    if (!city.trim()) return setFormError("City is required.");
    if (!state.trim()) return setFormError("State is required.");
    if (!pincode.trim() || pincode.length !== 6) return setFormError("6-digit pincode is required.");

    setSubmittingOrder(true);

    const orderPayload = {
      userId: user.id,
      customerName: name,
      customerEmail: user.email,
      customerPhone: phone,
      address,
      city,
      state,
      pincode,
      paymentMethod,
      items: cart.map(item => ({
        productId: item.productId,
        name: item.name,
        qty: item.qty,
        price: item.price
      })),
      amount: grandTotal
    };

    try {
      const createdOrder = await onPlaceOrder(orderPayload);
      if (createdOrder) {
        setPlacedOrder(createdOrder);
        setCheckoutStep("confirmed");
        onClearCart();
      } else {
        setFormError("The ordering server rejected our checkout request. Please retry.");
      }
    } catch (err: any) {
      setFormError("Failed to lock secure checkout: " + err.message);
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="customer-catalog">
      
      {checkoutStep === "shopping" && (
        <div className="space-y-8" id="view-shopping">
          
          {/* Banner Hero Card */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-6 md:p-10 text-white relative overflow-hidden shadow-md">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
              <ShoppingBag className="h-96 w-96" />
            </div>
            
            <div className="relative z-10 max-w-xl space-y-3">
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase">
                Secure SSL Delivery Portal
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                Fresh Groceries &amp; Daily Essentials
              </h1>
              <p className="text-amber-50 text-sm md:text-base leading-relaxed">
                Choose from 100+ premium products across 10 categories, catalogued with absolute precision and live Indian Rupee (INR) pricing. Sourced fresh, stored on AWS, and dispatched directly from Azbuynow.com.
              </p>
              <div className="flex items-center space-x-6 text-xs text-amber-100 font-medium pt-2">
                <span className="flex items-center gap-1"><Truck className="h-4 w-4" /> Free Delivery over ₹500</span>
                <span>•</span>
                <span>⚡ Hyper Express Dispatch</span>
              </div>
            </div>
          </div>

          {/* Filtering and Search Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch justify-between" id="filter-bar">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search across 100 products (e.g. Rice, Apples, Soap, USB...)"
                className="pl-10 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm placeholder-gray-400 shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                id="search-input"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Float cart stats button on mobile */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCartOpen(true)}
                className="bg-gray-900 text-white font-bold py-3 px-5 rounded-xl text-sm flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-sm"
                id="mobile-cart-toggle"
              >
                <ShoppingCart className="h-4 w-4" />
                Cart: <span className="text-amber-400">{cart.reduce((s, o) => s + o.qty, 0)} items</span>
              </button>
            </div>
          </div>

          {/* Category Pills (10 plus "All") */}
          <div className="overflow-x-auto pb-2 scrollbar-none" id="category-scroller">
            <div className="flex space-x-2" style={{ minWidth: "max-content" }}>
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border cursor-pointer ${
                    selectedCategory === category
                      ? "bg-amber-500 text-white border-amber-600 shadow-sm transform scale-105"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                  id={`cat-pill-${category.replace(/[^a-zA-Z]/g, "")}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="products-grid">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map(product => {
                const cartMatch = cart.find(item => item.productId === product.id);
                const quantityInCart = cartMatch ? cartMatch.qty : 0;

                return (
                  <div 
                    key={product.id} 
                    className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col justify-between hover:shadow-lg transition-shadow relative"
                    id={`product-card-${product.id}`}
                  >
                    {/* Badge of Category */}
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[11px] font-bold px-2 py-1 rounded-md border font-mono uppercase ${getCategoryColor(product.category)}`}>
                        {product.category}
                      </span>
                      <span className="text-xs text-gray-400 font-mono font-bold">
                        {product.id}
                      </span>
                    </div>

                    {/* Styled Mock Image Container with Lucide Background */}
                    <div className="w-full h-44 bg-slate-50 border border-gray-100 rounded-xl mb-4 flex flex-col items-center justify-center p-3 text-center relative overflow-hidden group">
                      <div className="absolute top-2 left-2 bg-slate-900/10 text-slate-800 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded text-[8px]">
                        AWS S3 ASSET
                      </div>
                      
                      <div className="relative text-amber-500 p-4 bg-amber-50 rounded-full mb-2">
                        <ShoppingBag className="h-8 w-8 stroke-[1.5]" />
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase px-2 line-clamp-1">{product.name}</h4>
                      <p className="text-[10px] text-gray-400 font-mono truncate max-w-full italic px-2">{product.imageUrl.replace("s3://azbuynow-assets/", "")}</p>
                    </div>

                    {/* Body */}
                    <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base leading-tight hover:text-amber-500 transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed min-h-[2rem]">
                          {product.description}
                        </p>
                      </div>

                      {/* Stock Check */}
                      <div className="flex justify-between items-center bg-gray-50 p-2 rounded-xl text-xs font-medium">
                        <span className="text-gray-500">In Stock:</span>
                        {product.stock > 0 ? (
                          <span className="text-emerald-600 font-bold font-mono">{product.stock} units</span>
                        ) : (
                          <span className="text-red-500 font-bold">Out of stock</span>
                        )}
                      </div>

                      {/* Price & Cart Actions */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center text-gray-900">
                          <IndianRupee className="h-5.5 w-5.5 stroke-[2] text-gray-900 -mr-0.5 mt-0.5" />
                          <span className="text-xl font-bold tracking-tight">{product.price.toLocaleString("en-IN")}</span>
                        </div>

                        {quantityInCart > 0 ? (
                          <div className="flex items-center space-x-1.5 bg-amber-50 border border-amber-200 rounded-lg p-1">
                            <button
                              onClick={() => onUpdateCartQty(product.id, quantityInCart - 1)}
                              className="bg-white text-amber-600 hover:bg-amber-100 p-1.5 rounded-md transition-colors border border-amber-200 font-bold cursor-pointer"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm font-bold text-gray-800 font-mono px-1.5 min-w-[1rem] text-center">
                              {quantityInCart}
                            </span>
                            <button
                              onClick={() => {
                                if (quantityInCart < product.stock) {
                                  onUpdateCartQty(product.id, quantityInCart + 1);
                                }
                              }}
                              disabled={quantityInCart >= product.stock}
                              className="bg-white text-amber-600 hover:bg-amber-100 p-1.5 rounded-md transition-colors border border-amber-200 font-bold cursor-pointer disabled:opacity-40"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => onAddToCart(product, 1)}
                            disabled={product.stock <= 0}
                            className="bg-amber-500 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center gap-1.5 hover:bg-amber-600 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                            id={`add-btn-${product.id}`}
                          >
                            <Plus className="h-4 w-4" />
                            Add Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center text-gray-400 bg-white border border-dashed rounded-3xl">
                <p className="text-lg">No products match your search or filter.</p>
                <button 
                  onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }} 
                  className="mt-2 text-sm text-amber-500 font-bold underline"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center bg-white border rounded-xl p-4">
              <span className="text-xs text-gray-500 font-mono font-semibold">
                Page {page} of {totalPages} (Matching: {filteredProducts.length} items)
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="bg-gray-100 border hover:bg-gray-200 p-2 rounded-lg text-gray-600 cursor-pointer disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="bg-gray-100 border hover:bg-gray-200 p-2 rounded-lg text-gray-600 cursor-pointer disabled:opacity-40"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Checkout Selection Screen Form */}
      {checkoutStep === "checkout" && (
        <div className="max-w-3xl mx-auto bg-white border rounded-3xl p-6 md:p-8 shadow-sm space-y-6" id="view-checkout">
          <button 
            onClick={() => setCheckoutStep("shopping")}
            className="flex items-center text-sm font-semibold text-gray-500 hover:text-amber-500 transition-colors gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" /> Back to shopping catalog
          </button>

          <div className="border-b pb-4">
            <h2 className="text-2xl font-black text-gray-950 tracking-tight">🔒 Secure checkout details</h2>
            <p className="text-xs font-mono text-gray-400">AWS DYNAMODB WRITER SCHEMATIC ACTIVE</p>
          </div>

          {formError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-sm font-medium rounded-r-lg">
              {formError}
            </div>
          )}

          <form onSubmit={handleCheckoutSubmit} className="space-y-6" id="checkout-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Customer Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter name"
                    className="pl-10 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Mobile Contact Phone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="pl-10 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Detailed Delivery Address</label>
              <div className="relative">
                <div className="absolute top-2.5 left-3 pointer-events-none">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
                <textarea
                  required
                  rows={3}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Enter house number, apartment, street, nearby landmark etc."
                  className="pl-10 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Bengaluru"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={e => setState(e.target.value)}
                  placeholder="Karnataka"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Pincode</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={e => setPincode(e.target.value.replace(/\D/g, ""))}
                  placeholder="560001"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Payment Options (UPI, Credit, Debit, Net Banking, CoD) */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-3">Select Payment Method</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  "UPI", "Credit Card", "Debit Card", "Net Banking", "Cash on Delivery"
                ].map(mode => (
                  <label 
                    key={mode} 
                    className={`flex items-center space-x-3 bg-white p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === mode
                        ? "border-amber-500 ring-2 ring-amber-500/20 shadow-sm font-bold"
                        : "border-gray-200 hover:border-amber-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_gateway"
                      value={mode}
                      checked={paymentMethod === mode}
                      onChange={() => setPaymentMethod(mode)}
                      className="text-amber-500 focus:ring-amber-500 h-4 w-4"
                    />
                    <span className="text-xs text-gray-700">{mode}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Checkout Pricing Recap Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col justify-between text-sm text-gray-700 space-y-2">
              <h4 className="font-bold text-gray-900 border-b pb-2 flex items-center justify-between">
                <span>Grand Summary</span>
                <span>(₹ Indian Rupees)</span>
              </h4>
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} unique products):</span>
                <span className="font-mono font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5% SGST + CGST):</span>
                <span className="font-mono font-bold">₹{gst.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges:</span>
                <span className="font-mono font-bold text-emerald-600">
                  {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2 text-base text-gray-900 font-extrabold">
                <span>Grand Total to Pay:</span>
                <span className="font-mono">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setCheckoutStep("shopping")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl text-sm font-bold transition-all cursor-pointer"
              >
                Go Back
              </button>

              <button
                type="submit"
                disabled={submittingOrder}
                className="bg-amber-500 hover:bg-amber-600 text-white font-black py-3 px-8 rounded-xl text-sm transition-all cursor-pointer shadow-md disabled:bg-gray-300"
              >
                {submittingOrder ? "Writing to DynamoDB..." : `Place Order (₹${grandTotal.toLocaleString("en-IN")})`}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirmed Order State */}
      {checkoutStep === "confirmed" && placedOrder && (
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-lg text-center space-y-6" id="view-confirmed">
          <div className="flex justify-center">
            <div className="bg-emerald-50 text-emerald-500 p-4 rounded-full border border-emerald-100 animate-pulse">
              <CheckCircle2 className="h-16 w-16 stroke-[1.5]" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black text-gray-950 tracking-tight">Order Confirmed! 🎉</h1>
            <p className="text-sm font-semibold text-emerald-600">AWS DynamoDB and Lambda Process Succeeded</p>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              Your order packet is catalogued. Separate confirmation receipts are dispatched instantly.
            </p>
          </div>

          {/* Receipt Info Card */}
          <div className="bg-gray-50 rounded-2xl border p-6 text-left space-y-4">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <span className="text-xs text-gray-400 block font-mono">ORDER ID</span>
                <span className="font-mono font-extrabold text-lg text-gray-800">{placedOrder.orderId}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block font-mono">GRAND TOTAL</span>
                <span className="font-mono font-extrabold text-lg text-gray-900">₹{placedOrder.amount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <div>
                <span className="text-gray-400 block">Deliver To:</span>
                <span className="font-bold text-gray-700">{placedOrder.customerName}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Phone Mobile:</span>
                <span className="font-mono font-bold text-gray-700">{placedOrder.customerPhone}</span>
              </div>
              <div className="col-span-full">
                <span className="text-gray-400 block">Target Address:</span>
                <span className="font-semibold text-gray-700">
                  {placedOrder.address}, {placedOrder.city}, {placedOrder.state} - {placedOrder.pincode}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block">Payment Mode:</span>
                <span className="font-bold text-amber-600">{placedOrder.paymentMethod}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Status:</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase text-[10px]">
                  {placedOrder.status}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 text-left p-4 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
            <Info className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Behind the scenes (AWS Simulator):</span>
              AWS Lambda successfully triggered and used AWS SES to dispatch two emails:
              <ul className="list-disc pl-4 mt-1 space-y-0.5">
                <li>Receipt sent to <span className="font-mono underline">{placedOrder.customerEmail}</span></li>
                <li>Administrative notification sent separately to <span className="font-mono underline">admin@azbuynow.com</span></li>
              </ul>
              You can click the <strong>AWS Console</strong> tab in the header (when logged in as admin) to read the full sent SES emails and inspect DynamoDB data rows!
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <button
              onClick={() => {
                setCheckoutStep("shopping");
                setPlacedOrder(null);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-xl text-sm transition-all cursor-pointer shadow-sm"
            >
              Continue shopping
            </button>
          </div>
        </div>
      )}

      {/* Cart Sliding Sidebar Component Panel / Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 overflow-hidden z-50 shadow-2xl" id="cart-drawer-panel">
          <div className="absolute inset-0 bg-gray-500/20 backdrop-blur-xs transition-opacity" onClick={() => setCartOpen(false)} />
          
          <div className="fixed inset-y-0 right-0 max-w-full pl-10 flex">
            <div className="w-screen max-w-md bg-white border-l transition-transform flex flex-col justify-between">
              
              {/* Drawer Header */}
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-amber-500" />
                  <h3 className="text-lg font-extrabold text-gray-900">Your shopping cart</h3>
                </div>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Body - Items list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.length > 0 ? (
                  cart.map(item => (
                    <div key={item.productId} className="flex gap-3 justify-between items-center border border-gray-100 p-2.5 rounded-xl bg-slate-50/50">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-gray-800 truncate">{item.name}</h4>
                        <p className="text-xs text-gray-400 truncate">S3: {item.imageUrl.replace("s3://azbuynow-assets/", "")}</p>
                        <div className="flex items-center text-xs text-gray-600 font-bold font-mono mt-1">
                          <IndianRupee className="h-3 w-3" /> {item.price} each
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <div className="flex items-center space-x-1.5 bg-white border rounded">
                          <button
                            onClick={() => onUpdateCartQty(item.productId, item.qty - 1)}
                            className="p-1 hover:bg-gray-50 text-gray-600 cursor-pointer"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-extrabold text-gray-850 font-mono w-4 text-center">{item.qty}</span>
                          <button
                            onClick={() => onUpdateCartQty(item.productId, item.qty + 1)}
                            className="p-1 hover:bg-gray-50 text-gray-600 cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => onRemoveFromCart(item.productId)}
                          className="text-xs text-red-500 hover:text-red-700 flex items-center gap-0.5 cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" /> Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center text-gray-400 space-y-3">
                    <ShoppingCart className="h-12 w-12 text-gray-200 mx-auto" />
                    <p className="text-sm">Your cart is currently empty.</p>
                    <button 
                      onClick={() => setCartOpen(false)}
                      className="text-xs text-amber-500 font-bold underline"
                    >
                      Start adding items
                    </button>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              {cart.length > 0 && (
                <div className="p-4 border-t bg-gray-50 space-y-4">
                  <div className="space-y-1.5 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Items count:</span>
                      <span className="font-bold font-mono">{cart.reduce((s, o) => s + o.qty, 0)} units</span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-gray-900 border-t pt-1.5">
                      <span>Est. Subtotal:</span>
                      <span className="font-mono text-base">₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 italic">Excluded estimation of 5% tax and delivery fee, applied during checkout step.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={onClearCart}
                      className="bg-white border text-gray-600 hover:bg-gray-100 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Empty Cart
                    </button>
                    <button
                      onClick={() => {
                        setCartOpen(false);
                        setCheckoutStep("checkout");
                      }}
                      className="bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm text-center"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
