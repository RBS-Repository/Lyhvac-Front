"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import Swal from 'sweetalert2';
import { API_ENDPOINTS } from '@/lib/api';

type AuthContextValue = {
  isLoggedIn: boolean;
  isAdmin: boolean;
  authReady: boolean;
  login: (email: string) => void;
  logout: () => void;
  userEmail?: string | null;
  userName?: string | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // Hydrate from localStorage for non-Firebase fallback (keeps existing behavior if Firebase not configured)
    try {
      const stored = typeof window !== "undefined" ? window.localStorage.getItem("auth") : null;
      if (stored) {
        const parsed = JSON.parse(stored);
        setIsLoggedIn(!!parsed?.isLoggedIn);
        setUserEmail(parsed?.userEmail ?? null);
      }
    } catch {}

    // Attach Firebase auth listener if Firebase is configured
    try {
      const auth = firebaseAuth;
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log("Auth state changed. User:", user);
        if (user) {
          const email = user.email ?? null;
          
          // Check if user is disabled in MongoDB
          if (email) {
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 3000);
              
              const userRes = await fetch(API_ENDPOINTS.userByUid(user.uid), {
                signal: controller.signal
              });
              
              clearTimeout(timeoutId);
              
              if (userRes.ok) {
                const userData = await userRes.json();
                if (userData.isDisabled) {
                  console.log("User is disabled. Logging out...");
                  await signOut(auth);
                  
                  // Show SweetAlert for disabled account
                  await Swal.fire({
                    icon: 'warning',
                    title: 'Account Disabled',
                    html: `
                      <p style="margin: 20px 0;">Your account has been disabled and you cannot access the system.</p>
                      ${userData.reason ? `<p style="margin: 20px 0; padding: 15px; background-color: #fef2f2; border-radius: 8px; color: #991b1b;"><strong>Reason:</strong><br/>${userData.reason}</p>` : ''}
                      <p style="margin: 20px 0; color: #666;">Please contact our support team for assistance.</p>
                    `,
                    confirmButtonColor: '#dc2626',
                    confirmButtonText: 'OK',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                  });
                  
                  setIsLoggedIn(false);
                  setUserEmail(null);
                  setUserName(null);
                  setIsAdmin(false);
                  return;
                }
                // Store user name from database
                setUserName(userData.displayName || null);
              }
            } catch (error) {
              console.error("Error checking user status:", error);
              // Continue with login if check fails (backend might be down)
            }
          }
          
          setIsLoggedIn(true);
          setUserEmail(email);
          // Admin by email list from env: NEXT_PUBLIC_ADMIN_EMAILS=admin@a.com,admin@b.com
          const adminCsv = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
          const isAdminUser = email ? adminCsv.includes(email.toLowerCase()) : false;
          setIsAdmin(isAdminUser);
          console.log(`User logged in. Email: ${email}, Is Admin: ${isAdminUser}`);
        } else {
          setIsLoggedIn(false);
          setUserEmail(null);
          setUserName(null);
          setIsAdmin(false);
          console.log("User logged out.");
        }
        setAuthReady(true);
      });
      return () => unsubscribe();
    } catch(e) {
      console.error("Firebase auth listener failed:", e);
      // Firebase not configured; keep local state behavior
      setAuthReady(true);
    }
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("auth", JSON.stringify({ isLoggedIn, userEmail }));
      }
    } catch {}
  }, [isLoggedIn, userEmail]);

  const value = useMemo<AuthContextValue>(() => ({
    isLoggedIn,
    isAdmin,
    authReady,
    userEmail,
    userName,
    // Keep signature to avoid changing existing pages; this is a placeholder.
    // Real login flows should be implemented in the login page using Firebase SDK methods.
    login: (email: string) => {
      setIsLoggedIn(true);
      setUserEmail(email);
      const adminCsv = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
      setIsAdmin(email ? adminCsv.includes(email.toLowerCase()) : false);
    },
    logout: () => {
      try {
        const auth = firebaseAuth;
        // Attempt Firebase signOut if Firebase user exists
        signOut(auth).catch(() => {});
      } catch {}
      setIsLoggedIn(false);
      setUserEmail(null);
      setUserName(null);
      setIsAdmin(false);
    },
  }), [isLoggedIn, isAdmin, authReady, userEmail, userName]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};


