import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ToastMessage, ToastContainer } from "../ui/Toast";
import { HelpCircle, ArrowLeft, Mail, ShieldAlert, CheckCircle2 } from "lucide-react";

interface ForgotPasswordViewProps {
  onNavigate: (view: "login" | "signup" | "forgot" | "reset") => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ onNavigate }) => {
  const { sendPasswordResetEmail, isDemoMode } = useAuth();

  // Form states
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

    if (!email.trim() || !email.includes("@")) {
      addToast("Please provide a valid corporate email address.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await sendPasswordResetEmail(email);
      if (result.success) {
        setIsSubmitted(true);
        addToast("A secure recovery link has been dispatched to your mailbox.", "success");
      } else {
        addToast(result.error || "Could not complete recovery request.", "error");
      }
    } catch (err: any) {
      addToast(err.message || "An unexpected error occurred.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#E5E3E7]/40 relative overflow-hidden font-sans">
      
      {/* Background aesthetics */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#8CB9D7]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#4E4E49]/5 blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4E4E49] to-[#60605B] shadow-lg mb-4 text-[#E5E3E7]">
          <HelpCircle size={24} className="text-[#8CB9D7]" />
        </div>
        
        <h2 className="text-3xl font-bold tracking-tight text-[#2F2F2F] font-sans">
          Identity Recovery
        </h2>
        <p className="mt-2 text-xs text-[#666666]">
          Securely recover access to your sales operating credentials.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-[#D8D8D8] shadow-[0_8px_30px_rgb(0,0,0,0.03)] text-left">
          
          {!isSubmitted ? (
            <>
              <button
                onClick={() => onNavigate("login")}
                className="inline-flex items-center gap-1.5 text-xs text-[#60605B] hover:text-[#2F2F2F] font-semibold mb-6 transition-colors group cursor-pointer"
              >
                <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to login
              </button>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#2F2F2F]">Forgot your password?</h3>
                <p className="text-xs text-[#666666] mt-1">
                  Provide your registered email address and we will dispatch a secure validation token.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    label="Registered Email Address"
                    placeholder="david@company.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    id="forgot-email"
                    disabled={isSubmitting}
                  />
                  <Mail size={14} className="absolute right-3.5 top-10.5 text-gray-400" />
                </div>

                <div className="pt-2">
                  <Button variant="primary" size="md" type="submit" className="w-full" isLoading={isSubmitting}>
                    Send Reset Link
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100/60 border border-emerald-200">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#2F2F2F]">Check Your Mailbox</h3>
                <p className="text-xs text-[#666666] max-w-sm mx-auto leading-relaxed">
                  We have dispatched an email to <strong className="text-[#2F2F2F]">{email}</strong> containing a secure password reset link. Please click on the link to update your security settings.
                </p>
              </div>

              {isDemoMode && (
                <div className="p-3 bg-blue-50/45 border border-[#8CB9D7]/30 rounded-xl text-left">
                  <div className="text-[11px] text-gray-500 leading-normal">
                    <strong>Demo Notification:</strong> In live production, a real reset email will be sent. In Demo Sandbox, you can directly access the Reset screen below to try it out.
                  </div>
                  <button
                    onClick={() => onNavigate("reset")}
                    className="mt-2 text-xs font-semibold text-[#4E4E49] hover:underline"
                  >
                    Go to Reset Password screen directly →
                  </button>
                </div>
              )}

              <div className="pt-4 border-t border-[#D8D8D8]/50">
                <Button variant="outline" size="sm" onClick={() => onNavigate("login")}>
                  Return to Sign In
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>

      <div className="mt-8 text-center text-[10px] text-[#666666]/60 font-mono">
        © 2026 SYNITY OS • SECURED IDENTITY PLATFORM
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};
