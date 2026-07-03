import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ToastMessage, ToastContainer } from "../ui/Toast";
import { LogIn, HelpCircle, Mail, Lock, ShieldCheck, Chrome } from "lucide-react";

interface LoginViewProps {
  onNavigate: (view: "login" | "signup" | "forgot" | "reset") => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onNavigate }) => {
  const { login, isDemoMode } = useAuth();
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: "success" | "error" | "info") => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple frontend validations
    if (!email) {
      addToast("Please enter your email address.", "error");
      return;
    }
    if (!password) {
      addToast("Please enter your password.", "error");
      return;
    }
    if (password.length < 6) {
      addToast("Passwords must contain at least 6 characters.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        addToast("Authentication successful! Welcome to Synity.", "success");
      } else {
        addToast(result.error || "Invalid username or password.", "error");
      }
    } catch (error: any) {
      addToast(error.message || "An unexpected auth error occurred.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    addToast(
      isDemoMode
        ? "Google Login is running in Demo Mode. Setting up environment variables enables real integration."
        : "Redirecting to Google Account Portal...",
      "info"
    );
    // In real mode, call Supabase oauth sign in
    if (!isDemoMode) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
        
        await supabaseInstance.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: window.location.origin,
          },
        });
      } catch (err: any) {
        addToast(err.message || "Could not launch Google Sign In.", "error");
      }
    } else {
      // Simulate OAuth redirect login
      setIsSubmitting(true);
      setTimeout(() => {
        login("google.partner@synity.io", "google_oauth_bypass_token_123");
        setIsSubmitting(false);
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#E5E3E7]/40 relative overflow-hidden font-sans">
      
      {/* Background aesthetics */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#8CB9D7]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#4E4E49]/5 blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        {/* Logo Icon */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4E4E49] to-[#60605B] shadow-lg mb-4 text-[#E5E3E7]">
          <ShieldCheck size={26} className="text-[#8CB9D7]" />
        </div>
        
        <h2 className="text-3xl font-bold tracking-tight text-[#2F2F2F] font-sans">
          Synity <span className="font-light text-[#666666]">Sales OS</span>
        </h2>
        <p className="mt-2 text-xs text-[#666666]">
          The professional sales operating engine for closure precision.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-[#D8D8D8] shadow-[0_8px_30px_rgb(0,0,0,0.03)] text-left">
          
          {isDemoMode && (
            <div className="mb-6 p-3 bg-[#4E4E49]/5 border border-[#4E4E49]/15 rounded-xl flex items-start gap-2.5">
              <span className="flex h-2 w-2 translate-y-1.5 rounded-full bg-amber-500 shrink-0" />
              <div className="text-[11px] text-gray-500 leading-normal">
                <strong>Demo Sandbox Active:</strong> Supabase client is unconfigured. Use any credentials to explore (e.g. <code>alex.rivers@synity.io</code> with password <code>123456</code>).
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#2F2F2F]">Welcome back</h3>
            <p className="text-xs text-[#666666] mt-1">Please enter your sales credentials to access your pipeline.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                label="Corporate Email Address"
                placeholder="you@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                id="login-email"
                disabled={isSubmitting}
              />
              <Mail size={14} className="absolute right-3.5 top-10.5 text-gray-400" />
            </div>

            <div className="relative">
              <Input
                label="Account Security Password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                id="login-password"
                disabled={isSubmitting}
              />
              <Lock size={14} className="absolute right-3.5 top-10.5 text-gray-400" />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-[#2F2F2F] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#D8D8D8] text-[#4E4E49] focus:ring-[#4E4E49] h-3.5 w-3.5"
                />
                Remember Me
              </label>
              
              <button
                type="button"
                onClick={() => onNavigate("forgot")}
                className="text-xs text-[#60605B] hover:text-[#2F2F2F] font-medium transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                type="submit"
                className="w-full flex items-center justify-center gap-2"
                isLoading={isSubmitting}
              >
                <LogIn size={15} />
                Access Dashboard
              </Button>
            </div>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-[#D8D8D8]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3.5 text-[#666666] font-medium">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2.5 px-4 py-2.5 border border-[#D8D8D8] rounded-lg bg-white text-xs font-semibold text-[#2F2F2F] hover:bg-[#E5E3E7]/40 transition-colors cursor-pointer"
            >
              <Chrome size={15} className="text-[#60605B]" />
              Continue with Google Account
            </button>
          </div>

          <div className="mt-6 text-center text-xs">
            <span className="text-[#666666]">New to Synity OS?</span>{" "}
            <button
              onClick={() => onNavigate("signup")}
              className="font-semibold text-[#4E4E49] hover:text-[#2F2F2F] transition-colors"
            >
              Request Access / Sign Up
            </button>
          </div>

        </div>
      </div>

      <div className="mt-8 text-center text-[10px] text-[#666666]/60 font-mono">
        SECURED BY SUPABASE END-TO-END CRYPTOGRAPHY • © 2026 SYNITY OS
      </div>

      {/* Global notifications container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};
