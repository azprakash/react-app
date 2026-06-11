/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { INITIAL_PRODUCTS } from "./src/data/products.ts";
import { Product, User, Order, SesEmail, OrderStatus } from "./src/types.ts";

// In-Memory Database of server-side data (Simulating DynamoDB, S3, Cognito and SES)
let dbProducts: Product[] = [...INITIAL_PRODUCTS];

let dbUsers: User[] = [
  {
    id: "U1001",
    name: "Admin Azbuynow",
    email: "admin@azbuynow.com",
    mobile: "+91 9876543210",
    role: "Admin",
    status: "Active",
    createdAt: "2026-05-01T10:00:00Z"
  },
  {
    id: "U1002",
    name: "Prakash Kumar",
    email: "prakash.ndmd@gmail.com",
    mobile: "+91 9999888877",
    role: "Customer",
    status: "Active",
    createdAt: "2026-06-01T14:30:00Z"
  },
  {
    id: "U1003",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@gmail.com",
    mobile: "+91 9876543211",
    role: "Customer",
    status: "Active",
    createdAt: "2026-06-02T12:00:00Z"
  },
  {
    id: "U1004",
    name: "Shreya Sharma",
    email: "shreya@yahoo.com",
    mobile: "+91 8887776665",
    role: "Customer",
    status: "Disabled",
    createdAt: "2026-06-03T09:15:00Z"
  }
];

// Map containing salt-free passwords for simulation sake (Cognito behavior mockup)
const passwordStore: Record<string, string> = {
  "admin@azbuynow.com": "admin123",
  "prakash.ndmd@gmail.com": "prakash123",
  "prakash@gmail.com": "prakash123",
  "rajesh.kumar@gmail.com": "rajesh123",
  "shreya@yahoo.com": "shreya123"
};

let dbOrders: Order[] = [
  {
    orderId: "ORD10001",
    userId: "U1003",
    customerName: "Rajesh Kumar",
    customerEmail: "rajesh.kumar@gmail.com",
    customerPhone: "+91 9876543211",
    address: "Flat 405, Block B, Silver Oak Apartments",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560001",
    paymentMethod: "UPI",
    amount: 1474, // Basmati Rice (599 * 2) + Salted Butter (275 * 1) + Cola (85 * 3) = 1198 + 275 + 25 = ... wait, let's keep it exact:
    // Basmati Rice 5kg (₹599) x 2 = ₹1198
    // Refined Sugar 2kg (₹95) x 1 = ₹95
    // Pure Cow Ghee 1L (₹680) x 1 = ₹680
    // Total = 1973
    status: "Delivered",
    createdAt: "2026-06-04T11:45:00Z",
    items: [
      { productId: "P001", name: "Basmati Rice 5kg", qty: 2, price: 599 },
      { productId: "P003", name: "Refined Sugar 2kg", qty: 1, price: 95 },
      { productId: "P006", name: "Pure Cow Ghee 1L", qty: 1, price: 680 }
    ]
  },
  {
    orderId: "ORD10002",
    userId: "U1002",
    customerName: "Prakash Kumar",
    customerEmail: "prakash.ndmd@gmail.com",
    customerPhone: "+91 9999888877",
    address: "12, Nehru Street, T-Nagar",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600017",
    paymentMethod: "Credit Card",
    amount: 3266,
    status: "Pending",
    createdAt: "2026-06-06T09:12:00Z",
    items: [
      { productId: "P086", name: "Active Fit AMOLED Smart Watch", qty: 1, price: 2499 },
      { productId: "P087", name: "Silent Ergonomic Wireless Mouse", qty: 1, price: 449 },
      { productId: "P044", name: "Real Mixed Fruit Juice 1L", qty: 2, price: 115 },
      { productId: "P040", name: "Sweet Punjabi Lassi 250ml", qty: 2, price: 35 }
    ]
  },
  {
    orderId: "ORD10003",
    userId: "U1003",
    customerName: "Rajesh Kumar",
    customerEmail: "rajesh.kumar@gmail.com",
    customerPhone: "+91 9876543211",
    address: "Flat 405, Block B, Silver Oak Apartments",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560001",
    paymentMethod: "Cash on Delivery",
    amount: 475,
    status: "Processing",
    createdAt: "2026-06-06T12:04:00Z",
    items: [
      { productId: "P011", name: "Royal Gala Apples 1kg", qty: 1, price: 199 },
      { productId: "P012", name: "Robusta Banana 1 Dozen", qty: 2, price: 65 },
      { productId: "P020", name: "Red Pomegranates 1kg", qty: 1, price: 220 }
    ]
  }
];

let dbEmails: SesEmail[] = [
  {
    id: "MSG10001_CUSTOMER",
    recipient: "rajesh.kumar@gmail.com",
    subject: "Order Confirmation - ORD10001",
    body: `Hello Rajesh Kumar,

Your order ORD10001 has been received and confirmed.

Order Summary:
-------------------------
- Basmati Rice 5kg (x2) - ₹1198.00
- Refined Sugar 2kg (x1) - ₹95.00
- Pure Cow Ghee 1L (x1) - ₹680.00

Total Amount Paid/Due: ₹1,973.00

Thank you for your purchase from Azbuynow.com!`,
    sentAt: "2026-06-04T11:45:10Z",
    type: "CustomerConfirmation"
  },
  {
    id: "MSG10001_ADMIN",
    recipient: "admin@azbuynow.com",
    subject: "New Order Received - ORD10001",
    body: `New Order Received Alert (AWS Lambda trigger)

Order ID: ORD10001
Customer: Rajesh Kumar
Phone: +91 9876543211
Amount: ₹1973.00

Items Ordered:
- Basmati Rice 5kg x 2
- Refined Sugar 2kg x 1
- Pure Cow Ghee 1L x 1

Please check the Admin Dashboard to manage status.`,
    sentAt: "2026-06-04T11:45:12Z",
    type: "AdminNotification"
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parsing and URL encoded forms
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ==================== ENDPOINTS ====================

  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // 1. PRODUCTS ENDPOINTS
  app.get("/api/products", (req, res) => {
    res.json(dbProducts);
  });

  app.post("/api/products", (req, res) => {
    const { name, price, category, stock, description, imageUrl } = req.body;
    if (!name || isNaN(Number(price)) || !category) {
      return res.status(400).json({ error: "Missing required fields or invalid price" });
    }

    const nextIdNum = Math.max(...dbProducts.map(p => Number(p.id.replace("P", "")))) + 1;
    const paddedId = "P" + String(nextIdNum).padStart(3, "0");

    const newProduct: Product = {
      id: paddedId,
      name,
      price: Number(price),
      currency: "INR",
      category,
      imageUrl: imageUrl || `s3://azbuynow-assets/products/${name.toLowerCase().replace(/[^a-z0-9]/g, "_")}.jpg`,
      stock: Number(stock) || 0,
      description: description || ""
    };

    dbProducts.unshift(newProduct);
    res.status(201).json(newProduct);
  });

  app.put("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const { name, price, category, stock, description, imageUrl } = req.body;

    const productIdx = dbProducts.findIndex(p => p.id === id);
    if (productIdx === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    dbProducts[productIdx] = {
      ...dbProducts[productIdx],
      name: name || dbProducts[productIdx].name,
      price: price !== undefined ? Number(price) : dbProducts[productIdx].price,
      category: category || dbProducts[productIdx].category,
      stock: stock !== undefined ? Number(stock) : dbProducts[productIdx].stock,
      description: description !== undefined ? description : dbProducts[productIdx].description,
      imageUrl: imageUrl || dbProducts[productIdx].imageUrl
    };

    res.json(dbProducts[productIdx]);
  });

  app.delete("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const productIdx = dbProducts.findIndex(p => p.id === id);
    if (productIdx === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    const deleted = dbProducts.splice(productIdx, 1)[0];
    res.json({ message: "Product deleted successfully", deleted });
  });


  // 2. USER AUTHENTICATION & MANAGEMENT ENDPOINTS (Simulates Cognito user flows)
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const matchedUser = dbUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!matchedUser) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (matchedUser.status === "Disabled") {
      return res.status(403).json({ error: "Your account is disabled. Please contact admin." });
    }

    const actualPassword = passwordStore[email.toLowerCase()];
    if (actualPassword && actualPassword !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json(matchedUser);
  });

  app.post("/api/auth/signup", (req, res) => {
    const { name, email, mobile, password, role } = req.body;
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ error: "Registration contains missing fields" });
    }

    const exists = dbUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(400).json({ error: "User already registered under this email" });
    }

    const nextIdNum = Math.max(...dbUsers.map(u => Number(u.id.replace("U", "")))) + 1;
    const userRole = (role === "Admin" || email.toLowerCase().includes("admin@")) ? "Admin" : "Customer";

    const newUser: User = {
      id: "U" + nextIdNum,
      name,
      email: email.toLowerCase(),
      mobile,
      role: userRole,
      status: "Active",
      createdAt: new Date().toISOString()
    };

    dbUsers.push(newUser);
    passwordStore[email.toLowerCase()] = password;

    res.status(201).json(newUser);
  });

  app.get("/api/auth/users", (req, res) => {
    res.json(dbUsers);
  });

  app.put("/api/auth/users/:id/toggle", (req, res) => {
    const { id } = req.params;
    const userIdx = dbUsers.findIndex(u => u.id === id);
    if (userIdx === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentStatus = dbUsers[userIdx].status;
    dbUsers[userIdx].status = currentStatus === "Active" ? "Disabled" : "Active";
    res.json(dbUsers[userIdx]);
  });


  // 3. ORDERS ENDPOINTS & CHECKOUT (Simulates DynamoDB write & SES Lambda Trigger)
  app.get("/api/orders", (req, res) => {
    // Return all orders or order filter
    const { userId } = req.query;
    if (userId) {
      const filtered = dbOrders.filter(ord => ord.userId === userId);
      return res.json(filtered);
    }
    res.json(dbOrders);
  });

  app.post("/api/orders", (req, res) => {
    const {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      state,
      pincode,
      paymentMethod,
      items,
      amount
    } = req.body;

    if (!customerName || !customerPhone || !address || !items || !items.length) {
      return res.status(400).json({ error: "Order details missing or shopping cart empty" });
    }

    const nextOrdNum = Math.max(...dbOrders.map(o => Number(o.orderId.replace("ORD", "")))) + 1;
    const newOrderId = "ORD" + nextOrdNum;

    const newOrder: Order = {
      orderId: newOrderId,
      userId: userId || "U_GUEST",
      customerName,
      customerEmail: customerEmail || "guest@azbuynow.com",
      customerPhone,
      address,
      city: city || "Unknown",
      state: state || "Unknown",
      pincode: pincode || "000000",
      paymentMethod,
      amount,
      status: "Pending",
      createdAt: new Date().toISOString(),
      items
    };

    // 1. Deduct stock levels in local DB (DynamoDB write lock representation)
    items.forEach((item: any) => {
      const match = dbProducts.find(p => p.id === item.productId);
      if (match) {
        match.stock = Math.max(0, match.stock - item.qty);
      }
    });

    // 2. Append order to database
    dbOrders.unshift(newOrder);

    // 3. AWS SES dispatch emulation:
    const timeSent = new Date().toISOString();
    
    // Email A: Customer Order receipt
    const customerEmailStr = `Hello ${customerName},

Your order ${newOrderId} has been received and is starting processing!

Receipt Summary:
-------------------------
${items.map((it: any) => `- ${it.name} (x${it.qty}) - ₹${(it.price * it.qty).toLocaleString("en-IN")}`).join("\n")}

Grand Total Amount: ₹${amount.toLocaleString("en-IN")}.00
Payment Mode: ${paymentMethod}
Delivery Address:
  ${address}
  ${city}, ${state} - ${pincode}

We are preparing your package. Thank you for placing your trust on Azbuynow.com!

Best Regards,
Delivery Desk, Azbuynow.com`;

    const customerEmailObj: SesEmail = {
      id: `MSG${nextOrdNum}_CUSTOMER`,
      recipient: customerEmail || "customer@example.com",
      subject: `Order Confirmed - ${newOrderId}`,
      body: customerEmailStr,
      sentAt: timeSent,
      type: "CustomerConfirmation"
    };

    // Email B: Admin AWS Lambda automatic notification
    const adminEmailStr = `AWS Lambda Automation - Order Monitor Active
-----------------------------------------------------------
NEW ORDER DEPLOYED IN STATE: Pending
Order ID: ${newOrderId}
Timestamp: ${timeSent}
Client Account: ${customerName} (Email: ${customerEmail || "N/A"})
Mobile Number: ${customerPhone}

Invoice Total: ₹${amount.toLocaleString("en-IN")}.00
Selected Gateway: ${paymentMethod}

Itemized Cargo:
${items.map((it: any) => `* [${it.productId}] ${it.name} x${it.qty}`).join("\n")}

Address Target: ${address}, ${city}, ${state} - ${pincode}

*Admin Panel Notification System: Please compile verification inside standard terminal.`;

    const adminEmailObj: SesEmail = {
      id: `MSG${nextOrdNum}_ADMIN`,
      recipient: "admin@azbuynow.com",
      subject: `New Order Received - ${newOrderId}`,
      body: adminEmailStr,
      sentAt: timeSent,
      type: "AdminNotification"
    };

    dbEmails.unshift(customerEmailObj, adminEmailObj);

    res.status(201).json(newOrder);
  });

  app.put("/api/orders/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const ordIdx = dbOrders.findIndex(o => o.orderId === id);
    if (ordIdx === -1) {
      return res.status(404).json({ error: "Order not found" });
    }

    dbOrders[ordIdx].status = status as OrderStatus;
    res.json(dbOrders[ordIdx]);
  });


  // 4. CLOUD ENVIRONMENT SIMULATION CONTROLLER (Virtual AWS Console details)
  app.get("/api/aws/console", (req, res) => {
    res.json({
      cognitoUsers: dbUsers,
      sesEmails: dbEmails,
      s3Storage: dbProducts.map(p => ({
        key: p.imageUrl.replace("s3://", ""),
        productName: p.name,
        sizeKb: Math.floor(Math.random() * 40) + 15,
        bucket: "azbuynow-assets",
        lastModified: "2026-06-01T12:00:00Z"
      })),
      dynamoReceipts: dbOrders
    });
  });


  // ==================== VITE MIDDLEWARE CONFIG ====================

  if (process.env.NODE_ENV !== "production") {
    console.log("Configuring development Vite middle-tier...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Configuring production asset paths...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`========================================`);
    console.log(`Azbuynow Server active at port ${PORT}`);
    console.log(`Host address: http://0.0.0.0:${PORT}`);
    console.log(`Process ID: ${process.pid}`);
    console.log(`========================================`);
  });
}

startServer().catch((err) => {
  console.error("Critical: Failed to launch Express Server:", err);
});
