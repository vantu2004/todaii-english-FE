import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email"); // e.g. /verify?email=user@example.com

  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8081/todaii-english/client-side/api/v1/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (!res.ok) {
        throw new Error("OTP verification failed");
      }

      setMessage("Account verified successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`http://localhost:8081/todaii-english/client-side/api/v1/auth/resend-otp?email=${encodeURIComponent(email)}`);
      if (!res.ok) {
        throw new Error("Failed to resend OTP");
      }
      setMessage("📩 OTP resent to your email!");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold text-[#002D74] mb-4">Verify OTP</h2>
        <p className="text-sm text-gray-600 mb-6">
          Enter the OTP sent to <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            maxLength={6}
            className="border p-2 rounded text-center tracking-widest text-lg"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#002D74] text-white py-2 rounded hover:scale-105 duration-300"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <button
          onClick={handleResend}
          disabled={loading}
          className="text-sm text-[#002D74] mt-4 hover:underline"
        >
          {loading ? "Resending..." : "Resend OTP"}
        </button>

        {message && (
          <p className="text-sm mt-4 text-gray-700">{message}</p>
        )}
      </div>
    </section>
  );
};

export default VerifyOtpPage;
