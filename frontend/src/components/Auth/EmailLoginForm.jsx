import { useState } from "react";
import { Mail, LogIn } from "lucide-react";
import api from "../../services/api.js";
import { useToast } from "../../contexts/ToastContext.jsx";

const EmailLoginForm = ({ onSuccess }) => {
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email"); // 'email' or 'otp'
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/send-otp", { email });
      addToast("OTP sent to your email!", "success");
      setStep("otp");
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.message || "Failed to send OTP";
      addToast(errorMsg, "error");
      console.error("OTP send error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-otp", { email, otp });
      localStorage.setItem("authToken", data.token);
      addToast("Login successful!", "success");
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.reload();
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.message || "Invalid OTP";
      addToast(errorMsg, "error");
      console.error("OTP verify error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (step === "otp") {
    return (
      <form onSubmit={handleVerifyOTP} className="grid gap-3">
        <p className="text-sm text-slate-600 dark:text-slate-400">Enter OTP sent to {email}</p>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          className="rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-3 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
          maxLength={6}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full hover:from-indigo-500 hover:to-indigo-600 transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
        <button
          type="button"
          onClick={() => setStep("email")}
          className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          ← Back to email
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSendOTP} className="grid gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-3 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full hover:from-indigo-500 hover:to-indigo-600 transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Mail size={16} />
        {loading ? "Sending..." : "Send OTP"}
      </button>
    </form>
  );
};

export default EmailLoginForm;
