/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string; // e.g. "P001"
  name: string;
  price: number;
  currency: "INR";
  category: "Groceries" | "Fruits" | "Vegetables" | "Dairy" | "Beverages" | "Snacks" | "Household" | "Personal Care" | "Electronics" | "Stationery";
  imageUrl: string; // simulated s3 url
  stock: number;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: "Admin" | "Customer";
  status: "Active" | "Disabled";
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
  category: string;
  imageUrl: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

export type OrderStatus = "Pending" | "Processing" | "Delivered" | "Cancelled";

export interface Order {
  orderId: string; // e.g. "ORD10001"
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: "UPI" | "Credit Card" | "Debit Card" | "Net Banking" | "Cash on Delivery";
  amount: number;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
}

export interface SesEmail {
  id: string;
  recipient: string;
  subject: string;
  body: string;
  sentAt: string;
  type: "AdminNotification" | "CustomerConfirmation";
}
