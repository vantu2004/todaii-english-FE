import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { toast } from "react-hot-toast";
import OTPInput from "../../components/verify_otp/OTPInput";

const VerifyOtp = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(new Array(6).fill(""));
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4">
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700 space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex items-center justify-center space-x-2 text-indigo-400">
            <Mail size={26} />
            <h1 className="text-2xl font-semibold tracking-wide">
              Verify Your Email
            </h1>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">
            Enter your email and 6-digit OTP code below.
          </p>
        </div>

        {/* Email Input */}
        <div className="space-y-6">
          <div className="relative border-b border-gray-600 focus-within:border-indigo-500 transition-all">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent outline-none py-3 px-1 text-sm sm:text-base placeholder-gray-400 focus:placeholder-gray-300"
            />
          </div>

          {/* OTP Input */}
          <div className="flex justify-center">
            <OTPInput code={code} setCode={setCode} />
          </div>

          {/* Submit Button */}
          <button className="w-full py-2.5 font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 disabled:opacity-50 flex items-center justify-center shadow-md hover:shadow-indigo-500/20">
            "Verify Email"
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs sm:text-sm text-gray-500">
          <Link
            to="/server/login"
            className="text-indigo-400 hover:text-indigo-300 hover:underline underline-offset-4 flex items-center justify-center font-medium transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Login
          </Link>
        </div>
      </motion.section>
    </main>
  );
};

export default VerifyOtp;
