"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";
import axiosClient from "@/lib/axiosClient";

type Step = "email" | "otp" | "reset";

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    setLoading(true);
    try {
      const response = await axiosClient.post("/auth/forgot-password", {
        email: email.trim(),
      });
      if (response.data?.status) {
        toast.success("OTP sent to your email!");
        setStep("otp");
      } else {
        toast.error(response.data?.message || "Failed to send OTP");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error("OTP is required");
      return;
    }
    setLoading(true);
    try {
      const response = await axiosClient.post("/auth/verify-otp", {
        email: email.trim(),
        code: otp.trim(),
      });
      if (response.data?.status) {
        toast.success("OTP verified!");
        setStep("reset");
      } else {
        toast.error(response.data?.message || "Invalid OTP");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !passwordConfirmation) {
      toast.error("All fields are required");
      return;
    }
    if (password !== passwordConfirmation) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const response = await axiosClient.post("/auth/reset-password", {
        email: email.trim(),
        code: otp.trim(),
        password,
        password_confirmation: passwordConfirmation,
      });
      if (response.data?.status) {
        toast.success("Password reset successfully!");
        router.push("/");
      } else {
        toast.error(response.data?.message || "Failed to reset password");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await axiosClient.post("/auth/forgot-password", { email: email.trim() });
      toast.success("OTP resent!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#0e121b" }}
    >
      <div className="w-full max-w-md">
        <div className="rounded-2xl p-8 shadow-2xl border border-gray-800 bg-gray-900 backdrop-blur-sm bg-opacity-90">
          {/* Back button */}
          {step !== "email" && (
            <button
              onClick={() => setStep(step === "otp" ? "email" : "otp")}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
            >
              <FiArrowLeft />
              Back
            </button>
          )}

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              {step === "email" && "Forgot Password"}
              {step === "otp" && "Verify OTP"}
              {step === "reset" && "Reset Password"}
            </h1>
            <p className="text-gray-400">
              {step === "email" && "Enter your email to receive an OTP"}
              {step === "otp" && `Enter the 6-digit code sent to ${email}`}
              {step === "reset" && "Create your new password"}
            </p>
          </div>

          {/* Step 1: Email */}
          {step === "email" && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-lg font-semibold text-gray-900 transition-all duration-300 disabled:opacity-50"
                style={{
                  background:
                    "linear-gradient(135deg, #2ef474 0%, #22c55e 100%)",
                }}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
              <p className="text-center">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="text-sm text-green-400 hover:text-green-300"
                >
                  Back to Login
                </button>
              </p>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="block w-full px-3 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white text-center text-2xl tracking-widest placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="000000"
                  maxLength={6}
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-3.5 px-4 rounded-lg font-semibold text-gray-900 transition-all duration-300 disabled:opacity-50"
                style={{
                  background:
                    "linear-gradient(135deg, #2ef474 0%, #22c55e 100%)",
                }}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <p className="text-center text-sm text-gray-400">
                Didn't receive code?{" "}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-green-400 hover:text-green-300"
                >
                  Resend
                </button>
              </p>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter new password"
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Confirm new password"
                    disabled={loading}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-lg font-semibold text-gray-900 transition-all duration-300 disabled:opacity-50"
                style={{
                  background:
                    "linear-gradient(135deg, #2ef474 0%, #22c55e 100%)",
                }}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
