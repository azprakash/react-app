/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ShieldCheck, UserPlus, Lock, Mail, Phone, User as UserIcon, AlertCircle, ShoppingBag } from "lucide-react";
import { User } from "../types";

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
}

export default function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  
  // Login States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Signup States
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpMobile, setSignUpMobile] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Quick Account Autofill
  const handleAutofill = (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    setTab("login");
    setErrorMsg(null);
  };

  // Handle Login Action
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMsg("Please fill in both email and password fields.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      onLoginSuccess(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign-Up Action
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName || !signUpEmail || !signUpMobile || !signUpPassword) {
      setErrorMsg("All registration fields are mandatory.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signUpName,
          email: signUpEmail,
          mobile: signUpMobile,
          password: signUpPassword,
          role: "Customer"
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Sign up failed.");
      }

      setSuccessMsg("Account successfully provisioned in AWS Cognito! Log in below.");
      // Auto switch to login with email filled
      setLoginEmail(signUpEmail);
      setLoginPassword(signUpPassword);
      setTab("login");
      
      // Reset signup fields
      setSignUpName("");
      setSignUpEmail("");
      setSignUpMobile("");
      setSignUpPassword("");
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" id="auth-container">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-md border border-gray-100">
        
        {/* Title Block */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-md">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight">
            Azbuynow<span className="text-amber-500">.com</span>
          </h2>
          <p className="mt-2 text-xs font-mono text-gray-400 uppercase tracking-widest flex items-center justify-center gap-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500 inline" /> AWS Cognito Protected Ingress
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200" id="auth-tabs">
          <button
            onClick={() => { setTab("login"); setErrorMsg(null); }}
            className={`w-1/2 pb-4 text-center text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              tab === "login"
                ? "border-amber-500 text-amber-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => { setTab("signup"); setErrorMsg(null); }}
            className={`w-1/2 pb-4 text-center text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              tab === "signup"
                ? "border-amber-500 text-amber-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start space-x-3 text-red-700" id="auth-error">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div className="text-sm font-medium">{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-lg flex items-start space-x-3 text-emerald-800" id="auth-success">
            <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-sm font-medium">{successMsg}</div>
          </div>
        )}

        {/* Forms */}
        {tab === "login" ? (
          <form className="space-y-5" onSubmit={handleLoginSubmit} id="login-form">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="pl-10 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="submit-login"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Authenticating S3/Cognito..." : "Verify & Connect"}
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleSignUpSubmit} id="signup-form">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="Rajesh Kumar"
                    className="pl-10 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="rajesh.kumar@gmail.com"
                    className="pl-10 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={signUpMobile}
                    onChange={(e) => setSignUpMobile(e.target.value)}
                    placeholder="+91 9876543210"
                    className="pl-10 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="submit-signup"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Registering in Cognito..." : "Register Account"}
            </button>
          </form>
        )}

        {/* Demo Fast Sandbox logins */}
        <div className="border-t border-gray-100 pt-6 mt-4">
          <div className="text-center text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">
            Sandbox Developer Access Pool
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleAutofill("prakash.ndmd@gmail.com", "prakash123")}
              className="bg-amber-50 hover:bg-amber-100 text-amber-700 p-2 text-left rounded-lg transition-colors border border-amber-100 font-medium"
              id="autofill-customer"
              type="button"
            >
              <div className="font-bold">🧑‍💼 Customer Role</div>
              <div className="text-[10px] font-mono text-gray-500 overflow-hidden text-ellipsis">prakash.ndmd@gmail.com / prakash123</div>
            </button>
            <button
              onClick={() => handleAutofill("admin@azbuynow.com", "admin123")}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-2 text-left rounded-lg transition-colors border border-indigo-100 font-medium"
              id="autofill-admin"
              type="button"
            >
              <div className="font-bold">🛡️ Administrator Role</div>
              <div className="text-[10px] font-mono text-gray-500 overflow-hidden text-ellipsis">admin@azbuynow.com / admin123</div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
