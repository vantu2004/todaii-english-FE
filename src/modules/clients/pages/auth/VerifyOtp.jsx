import { useState } from "react";
import InputField from "@/components/clients/InputField";
import { verifyOtp, resendOtp } from "@/api/clients/authApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn } from "@/animations/fadeIn";

const VerifyOtp = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    // simple validation before request
    if (!otp) {
      toast.error("OTP cannot be empty");
      return;
    } else if (error) {
      toast.error("Please fix the OTP format before continuing", {
        style: { maxWidth: 600 },
      });
      return;
    }

    setLoading(true);

    try {
      await verifyOtp(email, otp);
      toast.success("Verify successfully!");
      navigate("/client/login");
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error("User not found");
      } else if (err.response?.status === 400) {
        toast.error("Wrong OTP or OTP has expired");
      } else if (err.response?.status === 409) {
        toast.error("User has been already verified");
      } else {
        toast.error("Internal server error");
      }
      console.error("Verify email error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    try {
      toast.success("Otp has been resent to your email");
      await resendOtp(email, otp);
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error("User not found");
      } else if (err.response?.status === 400) {
        toast.error("Wrong email format");
      } else {
        toast.error("Internal server error");
      }
      console.error("Resend otp error:", err);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setOtp(value);

    // OTP validation logic (just length check for 6 chars here)
    if (!value) {
      setError("Please enter your OTP");
    } else if (value.length !== 6) {
      setError("OTP must be 6 characters long");
    } else {
      setError("");
    }
  };

  return (
    <div className="font-jarkata-sans grid place-items-center min-h-screen p-4 sm:p-6 py-8 sm:py-12 bg-surface-primary dark:bg-neutral-950 transition-colors duration-300">
      <motion.div
        variants={fadeIn(0.1)}
        initial="hidden"
        animate="show"
        className="flex w-full max-w-5xl mx-auto overflow-hidden bg-white dark:bg-neutral-900/60 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-neutral-100 dark:border-neutral-800/80 backdrop-blur-xl"
      >
        {/* Left Branded Panel */}
        <div className="hidden lg:flex lg:w-[45%] p-12 flex-col justify-between relative overflow-hidden landing-gradient text-white">
          <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-brand-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <Link
              to="/"
              className="text-2xl font-extrabold tracking-tight select-none flex items-center"
            >
              <span className="text-white">Todaii</span>
              <span className="ml-1 text-white/80">English</span>
            </Link>
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl xl:text-5xl font-semibold leading-tight tracking-tight">
              Enter verification code.
            </h2>
            <p className="text-white/80 text-lg leading-relaxed max-w-md">
              We've sent a 6-digit code to your email. Please enter it below to
              confirm your identity.
            </p>
          </div>

          <div className="relative z-10 text-sm font-medium text-white/60">
            © {new Date().getFullYear()} Todaii English
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex flex-col justify-center w-full lg:w-[55%] p-8 sm:p-12 md:p-16">
          <div className="w-full max-w-sm mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-2">
                Verify OTP
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Please enter the OTP sent to{" "}
                <span className="font-medium text-neutral-900 dark:text-neutral-200">
                  {email}
                </span>
                .
              </p>
            </div>

            <InputField
              label="OTP Code"
              name="otp"
              type="text"
              onChange={handleChange}
              value={otp}
              placeholder="123456"
              error={error}
            />

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full mt-8 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-none hover:-translate-y-0.5"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>

            <p className="mt-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResendOtp}
                className="font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
              >
                Resend OTP
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;
