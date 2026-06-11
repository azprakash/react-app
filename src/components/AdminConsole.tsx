/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  PlusCircle, Edit, Trash2, ShieldAlert, Check, X, Users, ShoppingBag, 
  IndianRupee, TrendingUp, Package, Clock, Filter, CheckCircle2, Ban, Plus, Slash 
} from "lucide-react";
import { Product, Order, User, OrderStatus } from "../types";

interface AdminConsoleProps {
  products: Product[];
  orders: Order[];
  users: User[];
  onRefreshData: () => void;
}

export default function AdminConsole({
  products,
  orders,
  users,
  onRefreshData
}: AdminConsoleProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "orders" | "users">("dashboard");

  // product form state
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // product fields
  const [pName, setPName] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pCategory, setPCategory] = useState<any>("Groceries");
  const [pStock, setPStock] = useState("");
  const [pDescription, setPDescription] = useState("");
  const [pS3Url, setPS3Url] = useState("");

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // order selection state for filter
  const [orderFilter, setOrderFilter] = useState<string>("All");

  // Refresh stats on load
  useEffect(() => {
    onRefreshData();
  }, [activeTab]);

  // Dashboard Stats Calculations
  const stats = React.useMemo(() => {
    const activeOrders = orders.filter(o => o.status !== "Cancelled");
    const totalRevenue = activeOrders.reduce((sum, o) => sum + o.amount, 0);
    const activeClientNodes = users.filter(u => u.role === "Customer" && u.status === "Active").length;
    
    // Check if created today (mocking current date: 2026-06-06)
    const todayOrders = orders.filter(o => {
      const orderDate = o.createdAt.split("T")[0];
      return orderDate === "2026-06-06";
    });

    return {
      revenue: totalRevenue,
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      activeClients: activeClientNodes
    };
  }, [orders, users]);

  // Handle Add Product opening
  const openNewProductForm = () => {
    setEditingProduct(null);
    setPName("");
    setPPrice("");
    setPCategory("Groceries");
    setPStock("");
    setPDescription("");
    setPS3Url("");
    setFormError(null);
    setFormSuccess(null);
    setProductFormOpen(true);
  };

  // Handle Edit Product opening
  const openEditProductForm = (prod: Product) => {
    setEditingProduct(prod);
    setPName(prod.name);
    setPPrice(String(prod.price));
    setPCategory(prod.category);
    setPStock(String(prod.stock));
    setPDescription(prod.description);
    setPS3Url(prod.imageUrl);
    setFormError(null);
    setFormSuccess(null);
    setProductFormOpen(true);
  };

  // Handle Product creation or update
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!pName || isNaN(Number(pPrice)) || Number(pPrice) <= 0) {
      setFormError("Valid product name and price INR are required.");
      return;
    }

    const payload = {
      name: pName,
      price: Number(pPrice),
      category: pCategory,
      stock: Number(pStock) || 0,
      description: pDescription,
      imageUrl: pS3Url
    };

    try {
      let response;
      if (editingProduct) {
        response = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Execution failed.");
      }

      setFormSuccess(editingProduct ? "Product details updated successfully in AWS catalog!" : "New product appended successfully to S3 & DynamoDB!");
      onRefreshData();
      setTimeout(() => {
        setProductFormOpen(false);
      }, 1200);
    } catch (err: any) {
      setFormError(err.message || "Failed to commit product changes.");
    }
  };

  // Handle Product deletion URL
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Verify: Do you want to delete this product catalog item completely?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        onRefreshData();
      } else {
        alert("Failed to delete the product from backend.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Underpinning Order Status edits
  const handleOrderStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        onRefreshData();
      } else {
        alert("Failed to update status on server.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle client user nodes enable/disable
  const handleToggleUserStatus = async (userId: string) => {
    try {
      const response = await fetch(`/api/auth/users/${userId}/toggle`, {
        method: "PUT"
      });

      if (response.ok) {
        onRefreshData();
      } else {
        alert("Failed to modify node status.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Order List filter
  const filteredOrders = React.useMemo(() => {
    if (orderFilter === "All") return orders;
    return orders.filter(o => o.status === orderFilter);
  }, [orders, orderFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="admin-console-layout">
      
      {/* Upper header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-gray-100 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Administrative Control Center</h1>
          <p className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mt-1">
            <ShieldAlert className="h-4 w-4 text-indigo-500" /> Virtual AWS Environment Management Portal
          </p>
        </div>

        {/* Console Nav Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-auto" id="admin-panel-tabs">
          {[
            { id: "dashboard", label: "Dashboard", count: null },
            { id: "products", label: "Product Inventory", count: products.length },
            { id: "orders", label: "Orders Ledger", count: orders.length },
            { id: "users", label: "User Directory", count: users.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer flex-1 md:flex-initial text-center justify-center ${
                activeTab === tab.id
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="bg-gray-200 text-gray-700 font-mono text-[10px] px-1.5 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* TABS CONTAINER */}

      {/* 1. DASHBOARD VIEW */}
      {activeTab === "dashboard" && (
        <div className="space-y-8" id="admin-dashboard-view">
          
          {/* Bento Stats Metric Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Metric 1 */}
            <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
                <div className="bg-emerald-50 text-emerald-500 p-2 rounded-lg">
                  <IndianRupee className="h-5 w-5" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold font-mono text-gray-900 tracking-tight">
                  ₹{stats.revenue.toLocaleString("en-IN")}
                </h3>
                <p className="text-xs text-gray-400 mt-1">Excludes cancelled transactions</p>
              </div>
              <div className="absolute right-0 bottom-0 translate-x-1 translate-y-1 transform opacity-5">
                <TrendingUp className="h-20 w-20 text-emerald-500" />
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total Orders Book</span>
                <div className="bg-blue-50 text-blue-500 p-2 rounded-lg">
                  <ShoppingBag className="h-5 w-5" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold font-mono text-gray-900 tracking-tight">
                  {stats.totalOrders}
                </h3>
                <p className="text-xs text-gray-400 mt-1">All database records</p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-xs font-bold uppercase tracking-wider">Today's Orders</span>
                <div className="bg-amber-50 text-amber-500 p-2 rounded-lg">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold font-mono text-gray-900 tracking-tight">
                  {stats.todayOrders}
                </h3>
                <p className="text-xs text-gray-400 mt-1">Sourced on 2026-06-06</p>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-xs font-bold uppercase tracking-wider">Active Customers</span>
                <div className="bg-purple-50 text-purple-500 p-2 rounded-lg">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold font-mono text-gray-900 tracking-tight">
                  {stats.activeClients}
                </h3>
                <p className="text-xs text-gray-400 mt-1">Cognito verified nodes</p>
              </div>
            </div>

          </div>

          {/* Quick telemetry logs of AWS lambda signals */}
          <div className="bg-slate-900 border border-slate-900 text-slate-100 rounded-2xl p-6 font-mono text-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="font-extrabold text-indigo-400 flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                AWS Lambda Console Monitoring (Auto-Sourced)
              </span>
              <span className="text-slate-500 text-[10px]">REGION: ASIA-SOUTH1-A</span>
            </div>
            
            <div className="space-y-1.5 overflow-x-auto max-h-48 scrollbar-none">
              <p className="text-slate-500">[2026-06-06T13:58] AWS APIGateway listening for ingress vectors on port 3000...</p>
              <p className="text-emerald-400">[2026-06-06T13:59] Connection successful: mapped S3 bucket bucket_arn="arn:aws:s3:::azbuynow-assets"</p>
              <p className="text-indigo-300">[2026-06-06T14:00] AWS Cognito User Pool pool_id="us-east-1_Azb9Y" sync success.</p>
              {orders.length > 0 ? (
                orders.map((o) => (
                  <p key={o.orderId} className="text-slate-300">
                    <span className="text-amber-400">⚡ AWS SES INVOCATION RECEIVED:</span> Mapped order {o.orderId}, totaling ₹{o.amount.toLocaleString("en-IN")}, Status: {o.status}. Dispatched SES confirmation receipts.
                  </p>
                ))
              ) : (
                <p className="text-slate-500">[2026-06-06T14:02] No recent telemetry cycles recorded.</p>
              )}
            </div>
          </div>

        </div>
      )}


      {/* 2. PRODUCT INVENTORY VIEW */}
      {activeTab === "products" && (
        <div className="space-y-6" id="admin-products-view">
          
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-extrabold text-gray-900">Manage Product Catalog</h2>
            <button
              onClick={openNewProductForm}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              id="btn-add-product-modal"
            >
              <Plus className="h-4 w-4" /> Add New Product
            </button>
          </div>

          {/* Catalog Listing Table */}
          <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono">ID</th>
                    <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Name</th>
                    <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Category</th>
                    <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Price (INR)</th>
                    <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Stock</th>
                    <th className="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-sm">
                  {products.map(prod => (
                    <tr key={prod.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-gray-500">{prod.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-gray-900">{prod.name}</div>
                        <div className="text-xs text-gray-400 max-w-sm truncate" title={prod.description}>{prod.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-gray-100 text-gray-800 border">
                          {prod.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-gray-900">
                        ₹{prod.price.toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono">
                        <span className={prod.stock <= 10 ? "text-red-500 font-bold" : "text-emerald-600 font-bold"}>{prod.stock}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => openEditProductForm(prod)}
                          className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Edit Details"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="bg-red-50 text-red-500 hover:bg-red-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add / Edit Product Sliding Over Panel Modal */}
          {productFormOpen && (
            <div className="fixed inset-0 overflow-hidden z-50 shadow-2xl" id="product-editor-modal">
              <div className="absolute inset-0 bg-gray-500/20 backdrop-blur-xs transition-opacity" onClick={() => setProductFormOpen(false)} />
              
              <div className="fixed inset-y-0 right-0 max-w-full pl-10 flex">
                <div className="w-screen max-w-md bg-white border-l transition-transform flex flex-col justify-between">
                  
                  {/* Header */}
                  <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-extrabold text-gray-900">
                      {editingProduct ? `Edit Details: ${editingProduct.id}` : "Catalogue a new product"}
                    </h3>
                    <button 
                      onClick={() => setProductFormOpen(false)}
                      className="p-1 rounded-md text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Body Form */}
                  <form onSubmit={handleProductSubmit} className="flex-1 overflow-y-auto p-4 space-y-4" id="product-detail-form">
                    
                    {formError && (
                      <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg font-medium border-l-4 border-red-500">
                        {formError}
                      </div>
                    )}
                    {formSuccess && (
                      <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-lg font-medium border-l-4 border-emerald-500">
                        {formSuccess}
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="block text-xs font-bold uppercase text-gray-500">Product Name *</label>
                      <input
                        type="text"
                        required
                        value={pName}
                        onChange={e => setPName(e.target.value)}
                        placeholder="e.g. Premium Basmati Rice"
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase text-gray-500">Price (INR ₹) *</label>
                        <input
                          type="number"
                          required
                          value={pPrice}
                          onChange={e => setPPrice(e.target.value)}
                          placeholder="599"
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase text-gray-500">Stock Inventory *</label>
                        <input
                          type="number"
                          required
                          value={pStock}
                          onChange={e => setPStock(e.target.value)}
                          placeholder="150"
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold uppercase text-gray-500">Sales Category *</label>
                      <select
                        value={pCategory}
                        onChange={e => setPCategory(e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
                      >
                        {["Groceries", "Fruits", "Vegetables", "Dairy", "Beverages", "Snacks", "Household", "Personal Care", "Electronics", "Stationery"].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold uppercase text-gray-500">AWS S3 Image Filename / Path</label>
                      <input
                        type="text"
                        value={pS3Url}
                        onChange={e => setPS3Url(e.target.value)}
                        placeholder="s3://azbuynow-assets/products/custom_rice.jpg"
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold uppercase text-gray-500">Product Description</label>
                      <textarea
                        rows={3}
                        value={pDescription}
                        onChange={e => setPDescription(e.target.value)}
                        placeholder="Detailed specifications or features..."
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                    >
                      {editingProduct ? "Save Changes" : "Commit Product to Inventory"}
                    </button>
                  </form>

                </div>
              </div>
            </div>
          )}

        </div>
      )}


      {/* 3. ORDERS LEDGER VIEW */}
      {activeTab === "orders" && (
        <div className="space-y-6" id="admin-orders-view">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-extrabold text-gray-900">Orders Audit Ledger</h2>
            
            {/* Status Select Filter */}
            <div className="flex bg-gray-100 p-1 rounded-lg text-xs" id="orders-status-filters">
              {["All", "Pending", "Processing", "Delivered", "Cancelled"].map(st => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                    orderFilter === st
                      ? "bg-white text-gray-800 shadow-xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono">Order ID</th>
                    <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Customer Details</th>
                    <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Invoice Sum</th>
                    <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Timestamp</th>
                    <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Status Node</th>
                    <th className="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-gray-400">Set Transmit State</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-sm">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map(ord => (
                      <tr key={ord.orderId} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 whitespace-nowrap font-mono font-black text-gray-950">{ord.orderId}</td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{ord.customerName}</div>
                          <div className="text-xs text-gray-500">{ord.customerPhone} | {ord.customerEmail}</div>
                          <div className="text-xs text-gray-400 max-w-xs truncate italic">{ord.address}, {ord.city}</div>
                          
                          {/* Sourced Items list */}
                          <div className="mt-2 space-y-0.5">
                            {ord.items.map((it, i) => (
                              <span key={i} className="inline-block bg-slate-100 text-slate-800 text-[9px] font-bold px-1.5 py-0.5 rounded mr-1">
                                {it.name} (x{it.qty})
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-gray-900 text-sm">
                          ₹{ord.amount.toLocaleString("en-IN")}
                          <span className="text-[10px] text-gray-400 block font-normal tracking-wide">{ord.paymentMethod}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                          {ord.createdAt.replace("T", " ").substring(0, 19)} UTC
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 text-[10px] rounded-full font-bold uppercase border ${
                            ord.status === "Delivered" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                            ord.status === "Processing" ? "bg-amber-50 text-amber-700 border-amber-100" :
                            ord.status === "Cancelled" ? "bg-red-50 text-red-700 border-red-100" :
                            "bg-blue-50 text-blue-700 border-blue-100"
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                          <select
                            value={ord.status}
                            onChange={e => handleOrderStatusChange(ord.orderId, e.target.value as OrderStatus)}
                            className="bg-gray-50 border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-400">
                        No orders recorded matching this status criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}


      {/* 4. USER DIRECTORY VIEW */}
      {activeTab === "users" && (
        <div className="space-y-6" id="admin-users-view">
          
          <h2 className="text-lg font-extrabold text-gray-900 border-b pb-2">Registered client accounts (simulated S3 / Cognito User Pool)</h2>

          <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono">User ID</th>
                    <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono">Identity Type</th>
                    <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Customer Name</th>
                    <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Registered Email Address</th>
                    <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Mobile Contact</th>
                    <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Active status</th>
                    <th className="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-gray-400">Authorization Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-sm">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-gray-500">{u.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded ${
                          u.role === "Admin" ? "bg-indigo-50 text-indigo-700 border border-indigo-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{u.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-mono text-xs">{u.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-mono text-xs">{u.mobile}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full font-bold ${
                          u.status === "Active" 
                            ? "bg-emerald-50 text-emerald-700 font-bold" 
                            : "bg-red-50 text-red-650"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {u.role !== "Admin" ? (
                          <button
                            onClick={() => handleToggleUserStatus(u.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                              u.status === "Active"
                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            }`}
                          >
                            {u.status === "Active" ? "Disable User" : "Enable User"}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Admin Protected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
