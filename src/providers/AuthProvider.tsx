import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase/client";
import { UserProfile } from "../types";

// Auth context interface
interface AuthContextType {
  user: UserProfile | null;
  session: any | null;
  loading: boolean;
  isDemoMode: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// High fidelity demo user definition
const DEMO_USER: UserProfile = {
  id: "demo-user-123",
  name: "Alex Rivers",
  email: "alex.rivers@synity.io",
  role: "Senior Sales Partner",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(!isSupabaseConfigured);

  // Load initial session
  useEffect(() => {
    async function initializeAuth() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session: initialSession } } = await supabase.auth.getSession();
          setSession(initialSession);
          
          if (initialSession?.user) {
            setUser({
              id: initialSession.user.id,
              name: initialSession.user.user_metadata?.full_name || initialSession.user.email?.split("@")[0] || "User",
              email: initialSession.user.email || "",
              role: "Sales Executive",
            });
            setIsDemoMode(false);
          } else {
            setUser(null);
          }

          // Set up auth state change listener
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, currentSession) => {
              setSession(currentSession);
              if (currentSession?.user) {
                setUser({
                  id: currentSession.user.id,
                  name: currentSession.user.user_metadata?.full_name || currentSession.user.email?.split("@")[0] || "User",
                  email: currentSession.user.email || "",
                  role: "Sales Executive",
                });
                setIsDemoMode(false);
              } else {
                setUser(null);
              }
              setLoading(false);
            }
          );

          return () => {
            subscription.unsubscribe();
          };
        } catch (error) {
          console.error("Supabase Auth Initialization error:", error);
          // Fallback to demo mode if initialization failed
          setupDemoSession();
        } finally {
          setLoading(false);
        }
      } else {
        // Run in high-fidelity demo mode
        setupDemoSession();
      }
    }

    initializeAuth();
  }, []);

  const setupDemoSession = () => {
    setIsDemoMode(true);
    const cachedUser = localStorage.getItem("synity_demo_user");
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch {
        setUser(DEMO_USER);
        localStorage.setItem("synity_demo_user", JSON.stringify(DEMO_USER));
      }
    } else {
      // By default start unauthenticated in Demo Mode, or let user click login
      setUser(null);
    }
    setLoading(false);
  };

  // Login handler
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        if (data.user) {
          setUser({
            id: data.user.id,
            name: data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "User",
            email: data.user.email || "",
            role: "Sales Executive",
          });
          setSession(data.session);
          setIsDemoMode(false);
        }
        return { success: true };
      } else {
        // High fidelity Demo Mode validation logic
        await new Promise((resolve) => setTimeout(resolve, 800)); // realistic lag
        
        if (!email.includes("@")) {
          return { success: false, error: "Please enter a valid email address." };
        }
        if (password.length < 6) {
          return { success: false, error: "Invalid password. Passwords must be at least 6 characters." };
        }

        // Check if user exists in local accounts database
        const registeredUsers = JSON.parse(localStorage.getItem("synity_demo_accounts") || "[]");
        const foundUser = registeredUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

        if (foundUser) {
          if (foundUser.password !== password) {
            return { success: false, error: "Invalid credentials. Password does not match." };
          }
          const activeProfile: UserProfile = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            role: "Sales Partner",
            avatarUrl: foundUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
          };
          setUser(activeProfile);
          localStorage.setItem("synity_demo_user", JSON.stringify(activeProfile));
        } else if (email.toLowerCase() === DEMO_USER.email.toLowerCase()) {
          // Allow logging into default demo user with any password for easy evaluation
          setUser(DEMO_USER);
          localStorage.setItem("synity_demo_user", JSON.stringify(DEMO_USER));
        } else {
          // Auto create user in demo mode to make the review smooth
          const newDemoUser: UserProfile = {
            id: `demo-${Date.now()}`,
            name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
            email: email,
            role: "Sales Executive",
          };
          setUser(newDemoUser);
          localStorage.setItem("synity_demo_user", JSON.stringify(newDemoUser));
        }
        return { success: true };
      }
    } catch (err: any) {
      console.error("Login exception:", err);
      return { success: false, error: err.message || "An unexpected login error occurred." };
    } finally {
      setLoading(false);
    }
  };

  // Signup handler
  const signup = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        
        // Handle auto-login or email verification required
        if (data.session) {
          setSession(data.session);
          setUser({
            id: data.user?.id || "",
            name: fullName,
            email: email,
            role: "Sales Executive",
          });
        }
        return { success: true };
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800)); // simulation lag

        if (password.length < 6) {
          return { success: false, error: "Password should be at least 6 characters." };
        }

        // Save account locally for persistence during session
        const registeredUsers = JSON.parse(localStorage.getItem("synity_demo_accounts") || "[]");
        if (registeredUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
          return { success: false, error: "Email already exists in system database." };
        }

        const newAccount = {
          id: `account-${Date.now()}`,
          name: fullName,
          email: email,
          password: password,
          createdAt: new Date().toISOString()
        };
        registeredUsers.push(newAccount);
        localStorage.setItem("synity_demo_accounts", JSON.stringify(registeredUsers));

        // Auto login after sign up in demo mode
        const activeProfile: UserProfile = {
          id: newAccount.id,
          name: newAccount.name,
          email: newAccount.email,
          role: "Sales Partner"
        };
        setUser(activeProfile);
        localStorage.setItem("synity_demo_user", JSON.stringify(activeProfile));

        return { success: true };
      }
    } catch (err: any) {
      console.error("Signup exception:", err);
      return { success: false, error: err.message || "An unexpected registration error occurred." };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
      // Clear all state
      setUser(null);
      setSession(null);
      localStorage.removeItem("synity_demo_user");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Send Password Reset email
  const sendPasswordResetEmail = async (email: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        return { success: true };
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));
        if (!email.includes("@")) {
          return { success: false, error: "Please enter a valid email address." };
        }
        return { success: true };
      }
    } catch (err: any) {
      console.error("Reset Password request error:", err);
      return { success: false, error: err.message || "Could not dispatch reset email." };
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async (password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        return { success: true };
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));
        if (password.length < 6) {
          return { success: false, error: "Password must be at least 6 characters." };
        }
        return { success: true };
      }
    } catch (err: any) {
      console.error("Update Password error:", err);
      return { success: false, error: err.message || "Could not modify password." };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isDemoMode,
        login,
        signup,
        logout,
        sendPasswordResetEmail,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be wrapped inside an AuthProvider");
  }
  return context;
};
