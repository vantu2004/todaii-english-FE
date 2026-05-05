import { useState } from "react";
import InputField from "../../../../components/clients/InputField";
import { resetPassword } from "../../../../api/clients/authApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn } from "../../../../animations/fadeIn";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState(false);

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const handleTogglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    if (name === "confirmPassword") {
      setTouched(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    setError((prev) => {
      const updated = { ...prev, [name]: "" };

      const { password, confirmPassword } = {
        ...form,
        [name]: value,
      };

      if (name === "password" || name === "confirmPassword") {
        if (!password) {
          updated.password = "Please enter a password";
        } else if (password.length < 6) {
          updated.password = "Password must be at least 6 characters";
        } else {
          updated.password = "";
        }

        // Validate confirm password after that field has been touched
        if (!confirmPassword && touched) {
          updated.confirmPassword = "Please confirm password";
        } else if (
          password &&
          confirmPassword &&
          password !== confirmPassword
        ) {
          updated.confirmPassword = "Passwords don't match";
        } else {
          updated.confirmPassword = "";
        }
      }

      return updated;
    });
  };

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const token = searchParams.get("token");

    if (error.password || error.confirmPassword) {
      toast.error("Please fix error above", {
        style: { maxWidth: 600 },
      });
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, form.password);
      toast.success("Reset password successfully!");
      navigate(`/client/login`);
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error("Token is not valid");
      } else {
        toast.error("Internal server error");
      }
      console.error("Reset password error:", err);
    } finally {
      setLoading(false);
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
            <div className="text-2xl font-extrabold tracking-tight select-none flex items-center">
              <span className="text-white">Todaii</span>
              <span className="ml-1 text-white/80">English</span>
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl xl:text-5xl font-semibold leading-tight tracking-tight">
              Create new password.
            </h2>
            <p className="text-white/80 text-lg leading-relaxed max-w-md">
              Secure your account with a strong, unique password.
            </p>
          </div>

          <div className="relative z-10 text-sm font-medium text-white/60">
            © {new Date().getFullYear()} Todaii English
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex flex-col justify-center w-full lg:w-[55%] p-8 sm:p-12 md:p-16">
          <form className="w-full max-w-sm mx-auto" onSubmit={handleResetPassword}>
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-2">
                Reset password
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Please enter and confirm your new password.
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <InputField
                  label="Password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type={showPassword.password ? "text" : "password"}
                  placeholder="••••••••"
                  error={error.password}
                />
                <button
                  type="button"
                  className="absolute right-4 top-[38px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                  onClick={() => handleTogglePassword("password")}
                >
                  {showPassword.password ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <InputField
                  label="Confirm password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  type={showPassword.confirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  error={error.confirmPassword}
                />
                <button
                  type="button"
                  className="absolute right-4 top-[38px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                  onClick={() => handleTogglePassword("confirmPassword")}
                >
                  {showPassword.confirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-none hover:-translate-y-0.5"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
