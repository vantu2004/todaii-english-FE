import { useState } from "react";
import ForgotPasswordOffice from "../../../../assets/img/forgot_password/forgot-password-office.jpeg";
import ForgotPasswordOfficeDark from "../../../../assets/img/forgot_password/forgot-password-office-dark.jpeg";
import InputField from "../../../../components/clients/InputField";
import { resendOtp } from "../../../../api/clients/authApi";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResendOtp = async (e) => {
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
      toast.success("Otp has been sent to your email");
      navigate(`/client/verify-otp?email=${encodeURIComponent(email)}`);
      await resendOtp(email);
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error("User not found");
      } else if (err.response?.status === 400) {
        toast.error("User has been already verified");
      } else {
        toast.error("Internal server error");
      }
      console.error("Verify email error:", err);
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
    <div className="font-inter flex items-center min-h-screen p-6 bg-gray-50 dark:bg-neutral-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-neutral-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ForgotPasswordOffice}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ForgotPasswordOfficeDark}
              alt="Office"
            />
          </div>
          <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Verify your email
              </h1>

              <InputField
                label="Email"
                name="email"
                type="email"
                onChange={handleChange}
                value={email}
                placeholder="example@gmail.com"
              />

              {error && <span className="text-xs text-red-500">{error}</span>}

              <button
                onClick={handleResendOtp}
                disabled={loading}
                className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-purple disabled:opacity-70"
              >
                {loading ? "Requesting..." : "Confirm"}
              </button>

              <p className="mt-4">
                <Link
                  className="text-sm font-medium text-blue-600 dark:text-purple-400 hover:underline"
                  to="../login"
                >
                  Back to login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
