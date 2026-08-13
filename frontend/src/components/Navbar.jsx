import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-slate-900"
        >
          Hire<span className="text-blue-600">Sphere</span>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-7 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/jobs"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Jobs
          </Link>

          {!isAuthenticated || user?.role !== "admin" ? (
            <>
              <Link
                to="/saved-jobs"
                className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                Saved Jobs
              </Link>

              <Link
                to="/applications"
                className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                My Applications
              </Link>
            </>
          ) : (
            <Link
              to="/admin"
              className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Admin Dashboard
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm font-medium text-slate-600 sm:inline">
                Hi, {user?.name}
              </span>

              <button
                onClick={logout}
                className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;