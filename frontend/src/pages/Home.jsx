import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-slate-50 px-5 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">

            <p className="text-xs font-bold tracking-[0.22em] text-blue-600 sm:text-sm">
              YOUR CAREER STARTS HERE
            </p>

            <h1 className="mt-5 text-5xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Find a job that
              <span className="block text-blue-600">
                fits your future.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Discover opportunities from leading companies and take
              the next step in your career with HireSphere.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/jobs"
                className="rounded-xl bg-blue-600 px-6 py-3.5 text-center text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
              >
                Explore Jobs
              </Link>

              <Link
                to="/register"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-center text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
              >
                Create Account
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-5 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10">
            <p className="text-xs font-bold tracking-[0.2em] text-blue-600">
              EXPLORE OPPORTUNITIES
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Popular Job Categories
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
              <div className="text-3xl">💻</div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Technology
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Software, Web & IT
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
              <div className="text-3xl">📊</div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Finance
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Banking & Accounting
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
              <div className="text-3xl">🎨</div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Design
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                UI/UX & Creative
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
              <div className="text-3xl">📣</div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Marketing
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Digital & Sales
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white px-5 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10">
            <p className="text-xs font-bold tracking-[0.2em] text-blue-600">
              SIMPLE PROCESS
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              How HireSphere Works
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7">
              <div className="text-sm font-extrabold text-blue-600">
                01
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Find a Job
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Search opportunities based on your skills, experience
                and preferred location.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7">
              <div className="text-sm font-extrabold text-blue-600">
                02
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Build Your Profile
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Add your qualifications, skills, experience and
                professional information.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7">
              <div className="text-sm font-extrabold text-blue-600">
                03
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Apply
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Submit applications and track their progress from
                your HireSphere account.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">

          <div className="rounded-3xl bg-slate-900 px-6 py-14 text-center sm:px-10">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to find your next opportunity?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Create your HireSphere account and start exploring
              opportunities that match your career goals.
            </p>

            <Link
              to="/register"
              className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}

export default Home;