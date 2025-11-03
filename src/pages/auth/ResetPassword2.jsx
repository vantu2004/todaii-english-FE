import React, { useState } from "react";
import RegisterOffice from "../../assets/img/register/register-office.jpeg";
import RegisterOfficeDark from "../../assets/img/register/register-office-dark.jpeg";
import InputField from "../../components/common/InputField";
import { register } from "../../api/client/authApi";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../api/client/authApi";
import toast from "react-hot-toast";


const ResetPassword2 = () => {

  const {token} = useParams();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await resetPassword(token, form.newPassword);
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Token has been expired");
      } 
      else if (err.response?.status === 404) {
        toast.error("Token not found");
      } 
      else if (err.response?.status === 400) {
        toast.error("Wrong format"); // chỗ này nên handle format của input thay vì báo lỗi sau khi request
      }
      else {
        toast.error("Internal server error");
      }
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

              <InputField
                label="New password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                type="password"
                placeholder="***************"
                className="mt-4"
              />

              <InputField
                label="Confirm new password"
                name="confirmNewPassword"
                value={form.confirmNewPassword}
                onChange={handleChange}
                type="password"
                placeholder="***************"
                className="mt-4"
              />

              <button
                type="submit"
                className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
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

export default ResetPassword2;
