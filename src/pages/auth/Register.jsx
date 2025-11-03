import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8081/todaii-english/client-side/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          display_name: username, 
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Registration failed");
      }

      setMessage("Registered successfully! Redirecting...");
      setTimeout(
        () => navigate(`/verify?email=${encodeURIComponent(email)}`),
        1500
      );
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      {/* register container */}
      <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
        {/* image */}
        <div className="md:block hidden w-1/2">
          <img
            className="rounded-2xl"
            src="https://images.unsplash.com/photo-1521790361543-f645cf042ec4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1887&q=80"
            alt="register visual"
          />
        </div>

        {/* form */}
        <div className="md:w-1/2 px-8 md:px-16">
          <h2 className="font-bold text-2xl text-[#002D74]">Register</h2>
          <p className="text-xs mt-4 text-[#002D74]">
            Create your account to get started!
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              className="p-2 mt-8 rounded-xl border border-gray-400"
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              className="p-2 rounded-xl border border-gray-400"
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
   lassNa   />
            <input
              className="p-2 rounded-xl border w-full border-gray-400"
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              className="p-2 rounded-xl border w-full border-gray-400"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 duration-300"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          {message && (
            <p className="text-sm mt-4 text-center text-gray-700">{message}</p>
          )}

          <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
            <hr className="border-gray-400" />
            <p className="text-center text-sm">OR</p>
            <hr className="border-gray-400" />
          </div>

          <button className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#002D74]">
            <svg
              className="mr-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="25px"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8
                   c-6.627,0-12-5.373-12-12c0-6.627,
                   5.373-12,12-12c3.059,0,5.842,1.154,
                   7.961,3.039l5.657-5.657C34.046,6.053,
                   29.268,4,24,4C12.955,4,4,12.955,4,
                   24c0,11.045,8.955,20,20,20c11.045,
                   0,20-8.955,20-20C44,22.659,43.862,
                   21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,
                   18.961,12,24,12c3.059,0,5.842,1.154,
                   7.961,3.039l5.657-5.657C34.046,6.053,
                   29.268,4,24,4C16.318,4,9.656,8.337,
                   6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192
                   l-6.19-5.238C29.211,35.091,26.715,
                   36,24,36c-5.202,0-9.619-3.317-11.283-
                   7.946l-6.522,5.025C9.505,39.556,
                   16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-
                   0.792,2.237-2.231,4.166-4.087,5.571
                   l6.19,5.238C36.971,39.205,44,34,
                   44,24C44,22.659,43.862,21.35,
                   43.611,20.083z"
              />
            </svg>
            Register with Google
          </button>

          <div className="mt-3 text-xs flex justify-between items-center text-[#002D74]">
            <p>Already have an account?</p>
            <Link
              to="/login"
              className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
