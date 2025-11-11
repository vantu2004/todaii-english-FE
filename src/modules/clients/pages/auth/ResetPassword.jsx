import { useState } from "react";
import RegisterOffice from "../../../../assets/img/register/register-office.jpeg";
import RegisterOfficeDark from "../../../../assets/img/register/register-office-dark.jpeg";
import InputField from "../../../../components/clients/InputField";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../../../api/clients/authApi";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [touched, setTouched] = useState(false);

  const [error, setError] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    setShowPassword: false,
  });
  const navigate = useNavigate();

  const handleFocus = (e) => {
    const { name } = e.target;
    if (name === "confirmNewPassword") {
      setTouched(true);
    }
  };

  const handleTogglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    setError((prev) => {
      const updated = { ...prev, [name]: "" };

      const { newPassword, confirmNewPassword } = {
        ...form,
        [name]: value,
      };

      // Validate new password length
      if (name === "newPassword" || name === "confirmNewPassword") {
        if (!newPassword) {
          updated.newPassword = "Please enter a password";
        } else if (newPassword.length < 6) {
          updated.newPassword = "Password must be at least 6 characters";
        } else {
          updated.newPassword = "";
        }

        // Validate confirm password after that field has been touched
        if (!confirmNewPassword && touched) {
          updated.confirmNewPassword = "Please confirm password";
        } else if (
          newPassword &&
          confirmNewPassword &&
          newPassword !== confirmNewPassword
        ) {
          updated.confirmNewPassword = "Passwords don't match";
        } else {
          updated.confirmNewPassword = "";
        }
      }

      return updated;
    });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await resetPassword(token, form.newPassword);
      toast.success("Password reset successfully");
      navigate("/client/login");
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Token has been expired");
      } else if (err.response?.status === 404) {
        toast.error("Token not found");
      } else if (err.response?.status === 400) {
        toast.error("Invalid password format");
      } else {
        toast.error("Internal server error");
      }
      console.error("Register error:", err);
    } finally {
      setLoading(false);
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
              src={RegisterOffice}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={RegisterOfficeDark}
              alt="Office"
            />
          </div>
          <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <form className="w-full" onSubmit={handleResetPassword}>
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Reset password
              </h1>

              <div className="relative">
                <InputField
                  label="New password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  type={showPassword.newPassword ? "text" : "password"}
                  placeholder="******"
                  className="mt-4"
                />

                <span
                  className="absolute top-[38px] right-3 cursor-pointer"
                  onClick={() => handleTogglePassword("newPassword")}
                >
                  {showPassword.newPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </span>
              </div>

              {error.newPassword && (
                <span className="text-xs text-red-500">
                  {error.newPassword}
                </span>
              )}

              <div className="relative">
                <InputField
                  label="Confirm new password"
                  name="confirmNewPassword"
                  value={form.confirmNewPassword}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  type={showPassword.confirmNewPassword ? "text" : "password"}
                  placeholder="******"
                  className="mt-4"
                />
                <span
                  className="absolute top-[38px] right-3 cursor-pointer"
                  onClick={() => handleTogglePassword("confirmNewPassword")}
                >
                  {showPassword.confirmNewPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </span>
              </div>

              {error.confirmNewPassword && (
                <span className="text-xs text-red-500">
                  {error.confirmNewPassword}
                </span>
              )}

              <button
                type="submit"
                className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-purple"
                disabled={loading}
              >
                {loading ? "Requesting..." : "Confirm"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
