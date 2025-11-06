import { ShieldCheck, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { login } from "../../../../api/servers/authApi";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(form.email, form.password);
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Invalid email or password");
      } else if (err.response?.status === 400) {
        toast.error("Wrong format");
      } else {
        toast.error("Internal server error");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md sm:max-w-lg bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-700/80"
      >
        {/* Header */}
        <div className="flex flex-col items-center space-y-3 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center space-x-2 text-indigo-400"
          >
            <ShieldCheck size={30} className="drop-shadow-lg" />
            <h1 className="text-3xl font-bold tracking-wide">Admin Portal</h1>
          </motion.div>
          <p className="text-gray-400 text-sm sm:text-base">
            Authorized access for administrators only
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div className="space-y-6">
            <div className="relative border-b border-gray-600 focus-within:border-indigo-500 transition-all">
              <input
                type="text"
                placeholder="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-transparent outline-none py-3 px-1 text-sm sm:text-base placeholder-gray-400 focus:placeholder-gray-300"
              />
            </div>

            <div className="relative border-b border-gray-600 focus-within:border-indigo-500 transition-all">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-transparent outline-none py-3 px-1 text-sm sm:text-base placeholder-gray-400 focus:placeholder-gray-300"
              />
              <Lock
                className="absolute right-2 top-3 text-gray-500"
                size={18}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="w-full py-3 font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 transition-colors duration-300 shadow-md hover:shadow-indigo-500/20"
            >
              {loading ? "Logging in..." : "Sign In"}
            </motion.button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center text-xs sm:text-sm text-gray-500">
          <p>
            Haven’t activated your account?{" "}
            <Link
              to="/server/verify-otp"
              className="text-indigo-400 hover:text-indigo-300 hover:underline underline-offset-4 font-medium transition-colors duration-200"
            >
              Verify with OTP
            </Link>
          </p>
          <p>
            Resend new OTP.{" "}
            <Link
              to="/server/resend-otp"
              className="text-indigo-400 hover:text-indigo-300 hover:underline underline-offset-4 font-medium transition-colors duration-200"
            >
              Click here
            </Link>
          </p>
        </div>
      </motion.section>
    </main>
  );
};

export default Login;
