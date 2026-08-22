import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const isAdmin = isAuthenticated && user?.role === "admin";

  const links = isAdmin
    ? [
        { to: "/", label: "Home" },
        { to: "/jobs", label: "Jobs" },
        { to: "/admin", label: "Admin dashboard" },
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/jobs", label: "Jobs" },
        { to: "/saved-jobs", label: "Saved jobs" },
        { to: "/applications", label: "My applications" },
      ];

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-stone-900">
          Hire<span className="text-teal-700">Sphere</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition hover:text-teal-700 ${
                link.to === "/admin" ? "font-semibold text-teal-700" : "text-stone-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <span className="text-sm font-medium text-stone-600">
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
                className="px-3 py-2 text-sm font-semibold text-stone-600 transition hover:text-teal-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-stone-600 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <i className={open ? "ti ti-x text-2xl" : "ti ti-menu-2 text-2xl"}></i>
        </button>
      </div>

      {open && (
        <div className="border-t border-stone-200 bg-white md:hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-stone-50 ${
                  link.to === "/admin" ? "text-teal-700" : "text-stone-600"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-2 flex flex-col gap-2 border-t border-stone-200 pt-4">
              {isAuthenticated ? (
                <>
                  <span className="px-3 text-sm font-medium text-stone-600">
                    Hi, {user?.name}
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="rounded-lg bg-teal-700 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-teal-800"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
