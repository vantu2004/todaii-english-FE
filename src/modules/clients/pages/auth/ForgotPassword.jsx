import { useState } from "react";
import InputField from "../../../../components/clients/InputField";
import { forgotPassword } from "../../../../api/clients/authApi";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn } from "../../../../animations/fadeIn";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();

    // simple validation before request
    if (!email) {
      toast.error("Email cannot be empty");
      return;
    } else if (error) {
      // prevent request if format invalid
      toast.error("Please fix the email format before continuing", {
        style: { maxWidth: 600 },
      });
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      toast.success("Password reset link has been sent to your email", {
        style: { maxWidth: 600 },
      });
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error("User not found");
      } else if (err.response?.status === 403) {
        toast.error("User has not been enabled!");
      } else if (err.response?.status === 400) {
        toast.error("Wrong email format");
      } else {
        toast.error("Internal server error");
      }
      console.error("Forgot password error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;

    if (!value) {
      setError("Please enter your email");
    } else if (!emailRegex.test(value)) {
      setError("Please enter a valid email address");
    } else {
      setError("");
    }
  };

  return (
    <div className="font-jarkata-sans flex items-center justify-center min-h-screen p-4 sm:p-6 bg-surface-primary dark:bg-neutral-950 transition-colors duration-300">
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
            <Link to="/" className="text-2xl font-extrabold tracking-tight select-none flex items-center">
              <span className="text-white">Todaii</span>
              <span className="ml-1 text-white/80">English</span>
            </Link>
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl xl:text-5xl font-semibold leading-tight tracking-tight">
              Reset your password.
            </h2>
            <p className="text-white/80 text-lg leading-relaxed max-w-md">
              Don't worry, we'll help you get back to your account. Enter your email to receive a password reset link.
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
                Forgot password
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Please enter the email address you used to register.
              </p>
            </div>

            <InputField
              label="Email"
              name="email"
              type="email"
              onChange={handleChange}
              value={email}
              placeholder="name@example.com"
              error={error}
            />

            <button
              onClick={handleForgot}
              disabled={loading}
              className="w-full mt-8 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-none hover:-translate-y-0.5"
            >
              {loading ? "Requesting..." : "Recover Password"}
            </button>

            <p className="mt-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
              Remember your password?{" "}
              <Link
                className="font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
                to="/client/login"
              >
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
