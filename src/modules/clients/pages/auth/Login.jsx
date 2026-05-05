import { useState } from "react";
import { login } from "../../../../api/clients/authApi";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import InputField from "../../../../components/clients/InputField";
import { useClientAuthContext } from "../../../../hooks/clients/useClientAuthContext";
import { fetchProfile } from "../../../../api/clients/userApi";
import { motion } from "framer-motion";
import { fadeIn } from "../../../../animations/fadeIn";

const LoginPage = () => {
  const { setAuthUser, setIsLoggedIn } = useClientAuthContext();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(form.email, form.password);

      const myProfile = await fetchProfile();

      setAuthUser(myProfile);
      setIsLoggedIn(true);

      toast.success("Login successfully!");

      navigate("/client");
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Invalid email or password");
      } else if (err.response?.status === 400) {
        toast.error("Wrong email format");
      } else {
        toast.error("Internal server error");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
          {/* Decorative Orbs */}
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
              Welcome back to your learning journey.
            </h2>
            <p className="text-white/80 text-lg leading-relaxed max-w-md">
              Log in to continue exploring articles, watching videos, and expanding your vocabulary with our premium tools.
            </p>
          </div>

          <div className="relative z-10 text-sm font-medium text-white/60">
            © {new Date().getFullYear()} Todaii English
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex flex-col justify-center w-full lg:w-[55%] p-8 sm:p-12 md:p-16">
          <form className="w-full max-w-sm mx-auto" onSubmit={handleLogin}>
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-2">
                Log in
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Enter your credentials to access your account.
              </p>
            </div>

            <InputField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="name@example.com"
            />

            <InputField
              className="mt-5"
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between mt-4">
              <Link
                className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
                to="/client/forgot-password"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-none hover:-translate-y-0.5"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>

            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-neutral-200 dark:bg-neutral-800" />
              <span className="mx-4 text-xs font-medium text-neutral-400 uppercase tracking-widest">or</span>
              <div className="flex-grow h-px bg-neutral-200 dark:bg-neutral-800" />
            </div>

            <button
              type="button"
              className="flex items-center justify-center w-full px-5 py-3 text-sm font-medium transition-colors duration-200 bg-transparent border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <svg className="w-5 h-5 mr-3" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.9996631,2.00067387 C14.4835037,1.9712793 16.8828349,2.90455669 18.6906006,4.60209273 L18.6906006,4.60209273 L15.8356536,7.45703971 C14.8031696,6.47232184 13.4252994,5.93587105 11.9996631,5.95791698 C9.39089556,5.95791698 7.17528033,7.71791646 6.38530144,10.0878531 C5.96642891,11.3297735 5.96642891,12.6745747 6.38530144,13.916495 L6.38530144,13.916495 C7.18262898,16.2827574 9.39456988,18.0427569 12.0033374,18.0427569 C13.351813,18.0427569 14.5092239,17.6973708 15.4057581,17.0874336 L15.402,17.089 C16.3863118,16.4358541 17.0792723,15.4353938 17.3495215,14.2951678 L17.4009141,14.0487706 L11.9996631,14.0487706 L11.9996631,10.1980828 L21.4316436,10.1980828 C21.5492219,10.8668091 21.6043367,11.5502327 21.6043367,12.229982 C21.6043367,15.2723193 20.5167378,17.8443436 18.6244628,19.5859715 L18.626,19.583 C17.0430672,21.0480315 14.8932217,21.9217835 12.349027,21.9949981 L11.9996631,22 C8.21878734,22 4.76125181,19.8688941 3.06371577,16.4921937 L3.06371577,16.4921937 L2.91718349,16.1875756 C1.64723712,13.4295023 1.69608121,10.2367943 3.06371577,7.51215452 L3.06371577,7.51215452 L3.20922038,7.23336735 C4.95358661,4.01502932 8.32381166,2.00067387 11.9996631,2.00067387 Z" />
              </svg>
              Continue with Google
            </button>

            <p className="mt-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
              Don't have an account?{" "}
              <Link
                className="font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
                to="/client/register"
              >
                Create account
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
