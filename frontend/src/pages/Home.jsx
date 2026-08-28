import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
const API_URL = import.meta.env.VITE_API_URL;


const categories = [
  { icon: "ti-code", title: "Technology", desc: "Software, web & IT" },
  { icon: "ti-chart-bar", title: "Finance", desc: "Banking & accounting" },
  { icon: "ti-palette", title: "Design", desc: "UI/UX & creative" },
  { icon: "ti-speakerphone", title: "Marketing", desc: "Digital & sales" },
];

const steps = [
  {
    number: "01",
    title: "Find a job",
    desc: "Search opportunities based on your skills, experience and preferred location.",
  },
  {
    number: "02",
    title: "Build your profile",
    desc: "Add your qualifications, skills, experience and professional information.",
  },
  {
    number: "03",
    title: "Apply",
    desc: "Submit applications and track their progress from your HireSphere account.",
  },
];

function HomeLoginCard() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        formData
      );

      const { token, user } = response.data;
      login(token, user);
      navigate("/jobs");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100";

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-7">
      <p className="text-xs font-bold tracking-[0.15em] text-teal-700">
        WELCOME BACK
      </p>
      <h2 className="mt-2 text-xl font-bold tracking-tight text-stone-900">
        Sign in to HireSphere
      </h2>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-stone-600">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-stone-600">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-teal-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-stone-500">
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold text-teal-700">
          Create account
        </Link>
      </p>
    </div>
  );
}

function HomeWelcomeCard() {
  const { user } = useAuth();

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-7 shadow-sm">
      <p className="text-xs font-bold tracking-[0.15em] text-teal-700">
        WELCOME BACK
      </p>
      <h2 className="mt-2 text-xl font-bold tracking-tight text-stone-900">
        Hi, {user?.name?.split(" ")[0] || "there"} 👋
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-stone-500">
        Pick up where you left off — check your saved jobs or see how your
        applications are progressing.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <Link
          to="/jobs"
          className="rounded-lg bg-teal-700 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-teal-800"
        >
          Browse jobs
        </Link>
        <Link
          to="/applications"
          className="rounded-lg border border-stone-300 px-4 py-3 text-center text-sm font-semibold text-stone-700 transition hover:border-stone-400"
        >
          My applications
        </Link>
        <Link
          to="/saved-jobs"
          className="rounded-lg border border-stone-300 px-4 py-3 text-center text-sm font-semibold text-stone-700 transition hover:border-stone-400"
        >
          Saved jobs
        </Link>
      </div>
    </div>
  );
}

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="bg-teal-50 px-5 py-16 sm:px-8 lg:px-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-bold tracking-[0.22em] text-teal-700 sm:text-sm">
              YOUR CAREER STARTS HERE
            </p>

            <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] tracking-tight text-stone-900 sm:text-6xl">
              Find a job that
              <span className="block text-teal-700">fits your future.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-stone-600 sm:text-lg">
              Discover opportunities from leading companies and take the
              next step in your career with HireSphere.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/jobs"
                className="rounded-xl bg-teal-700 px-6 py-3.5 text-center text-sm font-bold text-white shadow-sm transition hover:bg-teal-800"
              >
                Explore jobs
              </Link>

              <Link
                to="/register"
                className="rounded-xl border border-stone-300 bg-white px-6 py-3.5 text-center text-sm font-bold text-stone-700 transition hover:border-teal-300 hover:text-teal-700"
              >
                Create account
              </Link>
            </div>
          </div>

          {isAuthenticated ? <HomeWelcomeCard /> : <HomeLoginCard />}
        </div>
      </section>

      {/* Categories */}
      <section className="px-5 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="text-xs font-bold tracking-[0.2em] text-teal-700">
              EXPLORE OPPORTUNITIES
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Popular job categories
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <div
                key={category.title}
                className="rounded-2xl border border-stone-200 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-teal-200 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-xl text-teal-700">
                  <i className={`ti ${category.icon}`}></i>
                </div>
                <h3 className="mt-5 text-lg font-bold text-stone-900">
                  {category.title}
                </h3>
                <p className="mt-2 text-sm text-stone-500">{category.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white px-5 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="text-xs font-bold tracking-[0.2em] text-teal-700">
              SIMPLE PROCESS
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              How HireSphere works
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-stone-200 bg-stone-50 p-7"
              >
                <div className="text-sm font-extrabold text-teal-700">
                  {step.number}
                </div>
                <h3 className="mt-5 text-xl font-bold text-stone-900">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-teal-900 px-6 py-14 text-center sm:px-10">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to find your next opportunity?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-teal-100 sm:text-base">
              Create your HireSphere account and start exploring
              opportunities that match your career goals.
            </p>

            <Link
              to="/register"
              className="mt-8 inline-block rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-teal-900 transition hover:bg-teal-50"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
