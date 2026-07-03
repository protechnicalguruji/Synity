import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ToastMessage, ToastContainer } from "../ui/Toast";
import { UserPlus, ArrowLeft, Mail, Lock, User, ShieldAlert, Chrome } from "lucide-react";

interface SignupViewProps {
  onNavigate: (view: "login" | "signup" | "forgot" | "reset") => void;
}

export const SignupView: React.FC<SignupViewProps> = ({ onNavigate }) => {
  const { signup, isDemoMode } = useAuth();

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    // Validations
    if (!fullName.trim()) {
      addToast("Please provide your full professional name.", "error");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      addToast("Please enter a valid business email address.", "error");
      return;
    }
    if (password.length < 6) {
      addToast("Password is too short. It must contain at least 6 characters.", "error");
      return;
    }
    if (password !== confirmPassword) {
      addToast("Your passwords do not match. Please verify them.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signup(email, password, fullName);
      if (result.success) {
        addToast(
          isDemoMode
            ? "Account successfully provisioned in Demo Mode! Accessing CRM workspace..."
            : "Access registration sent! Please check your mailbox for verification link.",
          "success"
        );
        
        // Let's delay transition to allow user to read toast
        if (!isDemoMode) {
          setTimeout(() => {
            onNavigate("login");
          }, 2000);
        }
      } else {
        addToast(result.error || "Could not register account.", "error");
      }
    } catch (err: any) {
      addToast(err.message || "An unexpected error occurred during signup.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    addToast(
      isDemoMode
        ? "Google Registration is running in Demo Sandbox. Connect Supabase keys under Settings."
        : "Redirecting to Google Account Sign-up...",
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
      // Simulate OAuth signup
      setIsSubmitting(true);
      setTimeout(() => {
        signup("google.partner@synity.io", "google_oauth_bypass_token_123", "Google Partner");
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
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4E4E49] to-[#60605B] shadow-lg mb-4 text-[#E5E3E7]">
          <UserPlus size={24} className="text-[#8CB9D7]" />
        </div>
        
        <h2 className="text-3xl font-bold tracking-tight text-[#2F2F2F] font-sans">
          Request CRM Access
        </h2>
        <p className="mt-2 text-xs text-[#666666]">
          Register a secure corporate user identity on Synity Operating System.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-[#D8D8D8] shadow-[0_8px_30px_rgb(0,0,0,0.03)] text-left">
          
          <button
            onClick={() => onNavigate("login")}
            className="inline-flex items-center gap-1.5 text-xs text-[#60605B] hover:text-[#2F2F2F] font-semibold mb-6 transition-colors group cursor-pointer"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to login
          </button>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                label="Full Professional Name"
                placeholder="e.g. David Hassel"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                id="signup-name"
                disabled={isSubmitting}
              />
              <User size={14} className="absolute right-3.5 top-10.5 text-gray-400" />
            </div>

            <div className="relative">
              <Input
                label="Corporate Email Address"
                placeholder="david@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                id="signup-email"
                disabled={isSubmitting}
              />
              <Mail size={14} className="absolute right-3.5 top-10.5 text-gray-400" />
            </div>

            <div className="relative">
              <Input
                label="Create Account Password"
                placeholder="Minimum 6 characters"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                id="signup-password"
                disabled={isSubmitting}
              />
              <Lock size={14} className="absolute right-3.5 top-10.5 text-gray-400" />
            </div>

            <div className="relative">
              <Input
                label="Confirm Security Password"
                placeholder="Confirm password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                id="signup-confirm"
                disabled={isSubmitting}
              />
              <Lock size={14} className="absolute right-3.5 top-10.5 text-gray-400" />
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                type="submit"
                className="w-full flex items-center justify-center gap-2"
                isLoading={isSubmitting}
              >
                Create Sales Identity
              </Button>
            </div>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-[#D8D8D8]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3.5 text-[#666666] font-medium">Or create with</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={handleGoogleSignup}
              className="flex items-center justify-center gap-2.5 px-4 py-2.5 border border-[#D8D8D8] rounded-lg bg-white text-xs font-semibold text-[#2F2F2F] hover:bg-[#E5E3E7]/40 transition-colors cursor-pointer"
            >
              <Chrome size={15} className="text-[#60605B]" />
              Register with Google ID
            </button>
          </div>

          <div className="mt-6 text-center text-xs pt-1 border-t border-[#D8D8D8]/65">
            <span className="text-[#666666]">Already have an active workspace?</span>{" "}
            <button
              onClick={() => onNavigate("login")}
              className="font-semibold text-[#4E4E49] hover:text-[#2F2F2F] transition-colors"
            >
              Sign In here
            </button>
          </div>

        </div>
      </div>

      <div className="mt-8 text-center text-[10px] text-[#666666]/60 font-mono">
        © 2026 SYNITY OS • PROVISIONED VIA CLOUD AUTH
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};
