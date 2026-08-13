import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="text-xl font-bold tracking-tight text-stone-900">
              Hire<span className="text-teal-700">Sphere</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-500">
              Connecting candidates with roles that fit their skills and
              companies with the people they need to grow.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.15em] text-stone-400">
              PLATFORM
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <Link to="/jobs" className="text-sm font-medium text-stone-600 hover:text-teal-700">
                Browse jobs
              </Link>
              <Link to="/companies" className="text-sm font-medium text-stone-600 hover:text-teal-700">
                Companies
              </Link>
              <Link to="/saved-jobs" className="text-sm font-medium text-stone-600 hover:text-teal-700">
                Saved jobs
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.15em] text-stone-400">
              ACCOUNT
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <Link to="/applications/my" className="text-sm font-medium text-stone-600 hover:text-teal-700">
                My applications
              </Link>
              <Link to="/login" className="text-sm font-medium text-stone-600 hover:text-teal-700">
                Sign in
              </Link>
              <Link to="/register" className="text-sm font-medium text-stone-600 hover:text-teal-700">
                Create account
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.15em] text-stone-400">
              COMPANY
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <span className="text-sm font-medium text-stone-600">About</span>
              <span className="text-sm font-medium text-stone-600">Contact</span>
              <span className="text-sm font-medium text-stone-600">Privacy policy</span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-stone-200 pt-6 sm:flex-row">
          <p className="text-xs text-stone-400">
            © {new Date().getFullYear()} HireSphere. All rights reserved.
          </p>
          <div className="flex gap-4 text-stone-400">
            <i className="ti ti-brand-linkedin text-lg"></i>
            <i className="ti ti-brand-x text-lg"></i>
            <i className="ti ti-mail text-lg"></i>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
