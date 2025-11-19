import { ShieldCheck, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { login } from "../../../api/servers/authApi";
import { useServerAuthContext } from "../../../hooks/servers/useServerAuthContext";
import { fetchProfile } from "../../../api/servers/adminApi";
import { logError } from "../../../utils/LogError";

const Login = () => {
  const { setAuthUser, setIsLoggedIn } = useServerAuthContext();

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

      const myProfile = await fetchProfile();
      setAuthUser(myProfile);
      setIsLoggedIn(true);

      toast.success("Login successfully!");

      navigate("/server");
    } catch (err) {
      logError(err);
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

            <button
              disabled={!form.email || !form.password || loading}
              className="w-full py-2.5 font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 disabled:opacity-50 flex items-center justify-center shadow-md hover:shadow-indigo-500/20"
            >
              {loading ? "Logging in..." : "Sign In"}
            </button>
          </div>
        </form>
      </motion.section>
    </main>
  );
};

export default Login;
