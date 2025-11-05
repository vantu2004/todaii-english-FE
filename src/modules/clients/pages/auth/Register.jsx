import { useState } from "react";
import RegisterOffice from "../../../../assets/img/register/register-office.jpeg";
import RegisterOfficeDark from "../../../../assets/img/register/register-office-dark.jpeg";
import InputField from "../../../../components/InputField";
import { register } from "../../../../api/clients/authApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    displayName: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { email, password, displayName } = form;
      await register(email, password, displayName);
      toast.success("Register successful!");
      navigate(`/client/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("User already exsits");
      } else if (err.response?.status === 400) {
        toast.error("Wrong format"); // chỗ này nên handle format của input thay vì báo lỗi sau khi request
      } else {
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
            <form className="w-full" onSubmit={handleRegister}>
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Create account
              </h1>

              <InputField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
              />

              <InputField
                label="Display name"
                name="displayName"
                value={form.displayName}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="mt-4"
              />

              <InputField
                label="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                placeholder="******"
                className="mt-4"
              />

              <InputField
                label="Confirm password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                type="password"
                placeholder="******"
                className="mt-4"
              />

              {/* <div className="flex mt-6 text-sm">
                <label className="flex items-center dark:text-gray-400">
                  <input
                    type="checkbox"
                    className="text-purple-600 form-checkbox focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                  />
                  <span className="ml-2">
                    I agree to the&nbsp;
                    <span className="underline">privacy policy</span>
                  </span>
                </label>
              </div> */}

              <button
                type="submit"
                className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Account"}
              </button>

              <div className="flex items-center my-4">
                <hr className="flex-grow border-gray-300" />
                <span className="mx-4 text-gray-500">or</span>
                <hr className="flex-grow border-gray-300" />
              </div>

              <button className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium leading-5 cursor-pointer transition-colors duration-150 border border-gray-300 rounded-lg dark:text-gray-400 active:bg-transparent hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:outline-none focus:shadow-outline-gray">
                <svg
                  className="w-4 h-4 mr-2"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.9996631,2.00067387 C14.4835037,1.9712793 16.8828349,2.90455669 18.6906006,4.60209273 L18.6906006,4.60209273 L15.8356536,7.45703971 C14.8031696,6.47232184 13.4252994,5.93587105 11.9996631,5.95791698 C9.39089556,5.95791698 7.17528033,7.71791646 6.38530144,10.0878531 C5.96642891,11.3297735 5.96642891,12.6745747 6.38530144,13.916495 L6.38530144,13.916495 C7.18262898,16.2827574 9.39456988,18.0427569 12.0033374,18.0427569 C13.351813,18.0427569 14.5092239,17.6973708 15.4057581,17.0874336 L15.402,17.089 C16.3863118,16.4358541 17.0792723,15.4353938 17.3495215,14.2951678 L17.4009141,14.0487706 L11.9996631,14.0487706 L11.9996631,10.1980828 L21.4316436,10.1980828 C21.5492219,10.8668091 21.6043367,11.5502327 21.6043367,12.229982 C21.6043367,15.2723193 20.5167378,17.8443436 18.6244628,19.5859715 L18.626,19.583 C17.0430672,21.0480315 14.8932217,21.9217835 12.349027,21.9949981 L11.9996631,22 C8.21878734,22 4.76125181,19.8688941 3.06371577,16.4921937 L3.06371577,16.4921937 L2.91718349,16.1875756 C1.64723712,13.4295023 1.69608121,10.2367943 3.06371577,7.51215452 L3.06371577,7.51215452 L3.20922038,7.23336735 C4.95358661,4.01502932 8.32381166,2.00067387 11.9996631,2.00067387 Z" />
                </svg>
                Google
              </button>

              <p className="mt-4">
                <a
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  href="./login"
                >
                  Back to login
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
