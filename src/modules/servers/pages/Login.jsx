import { ShieldCheck, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { login } from "@/api/servers/authApi";
import { useServerAuthContext } from "@/hooks/servers/useServerAuthContext";
import { fetchProfile } from "@/api/servers/adminApi";
import { logError } from "@/utils/LogError";

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
    <main className="font-jarkata-sans min-h-screen grid place-items-center bg-neutral-950 text-white p-4 sm:p-6 py-8 sm:py-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-neutral-900/80 backdrop-blur-2xl rounded-3xl shadow-[0_8px_40px_rgb(0,0,0,0.4)] p-8 sm:p-10 border border-neutral-800"
      >
        {/* Header */}
        <div className="flex flex-col items-center space-y-4 text-center mb-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center space-x-3 text-brand-500"
          >
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
              <ShieldCheck size={28} />
            </div>
          </motion.div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">Admin Portal</h1>
            <p className="text-neutral-400 text-sm">
              Authorized personnel only
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-brand-500 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="text"
                placeholder="Email Address"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl outline-none py-3 pl-11 pr-4 text-sm sm:text-base text-white placeholder-neutral-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all duration-200"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-brand-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl outline-none py-3 pl-11 pr-4 text-sm sm:text-base text-white placeholder-neutral-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all duration-200"
              />
            </div>
          </div>

          <button
            disabled={!form.email || !form.password || loading}
            className="w-full mt-8 py-3.5 text-sm font-semibold rounded-xl bg-brand-500 hover:bg-brand-600 text-white transition-all duration-300 disabled:opacity-50 flex items-center justify-center shadow-[0_0_20px_rgba(var(--color-brand-500),0.3)] hover:shadow-[0_0_25px_rgba(var(--color-brand-500),0.5)] hover:-translate-y-0.5"
          >
            {loading ? "Authenticating..." : "Sign In to Dashboard"}
          </button>
        </form>
      </motion.section>
    </main>
  );
};

export default Login;
