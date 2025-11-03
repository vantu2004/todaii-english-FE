import React, { useState } from "react";

import ForgotPasswordOffice from "../../assets/img/forgot_password/forgot-password-office.jpeg";
import ForgotPasswordOfficeDark from "../../assets/img/forgot_password/forgot-password-office-dark.jpeg";
import InputField from "../../components/common/InputField";
import { forgotPassword } from "../../api/client/authApi";
import toast from "react-hot-toast";

const ForgotPassword2 = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      toast.success("Password reset link has been sent to your email", {
        style: {
          maxWidth: 600,
        },
      });
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error("User not found");
      } else if (err.response?.status === 403) {
        toast.error("User has not been enabled!");
      } else if (err.response?.status === 400) {
        toast.error("Wrong email format"); // chỗ này nên handle format của input thay vì báo lỗi sau khi request
      } else {
        toast.error("Internal server error");
      }
      console.error("Forgot password error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
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
                Forgot password
              </h1>

              <InputField
                label="Email"
                name="email"
                type="email"
                onChange={handleChange}
                value={email}
                placeholder="example@gmail.com"
              />

              <button
                onClick={handleForgot}
                disabled={loading}
                className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
              >
                {loading ? "Requesting...": "Recover Password"}
              </button>

          
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword2;
