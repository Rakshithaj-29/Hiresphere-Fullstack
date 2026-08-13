import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      const { token, user } = response.data;

      login(token, user);

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-blue-600">
            WELCOME BACK
          </p>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
            Sign in to HireSphere
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Find opportunities, manage applications and grow your career.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;