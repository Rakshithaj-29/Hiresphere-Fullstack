import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Jobs() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState(new Set());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSavedJobs = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const response = await axios.get(
          "http://localhost:5000/api/saved-jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const ids = response.data.savedJobs.map((job) =>
          String(job.external_job_id)
        );

        setSavedJobs(new Set(ids));
      } catch (error) {
        console.error("Failed to load saved jobs:", error);
      }
    };

    fetchSavedJobs();
  }, []);

  const searchJobs = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        "http://localhost:5000/api/jobs",
        {
          params: {
            keyword: keyword.trim() || "developer",
            location: location.trim() || "india",
          },
        }
      );

      setJobs(response.data.results || []);
    } catch (err) {
      console.error("Job search error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load jobs. Please try again."
      );

      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveJob = async (job) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const jobId = String(job.id);
    const isSaved = savedJobs.has(jobId);

    try {
      if (isSaved) {
        await axios.delete(
          `http://localhost:5000/api/saved-jobs/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSavedJobs((previous) => {
          const updated = new Set(previous);
          updated.delete(jobId);
          return updated;
        });
      } else {
        await axios.post(
          "http://localhost:5000/api/saved-jobs",
          {
            external_job_id: jobId,
            job_title: job.title,
            company_name: job.company?.display_name || "",
            job_location: job.location?.display_name || "",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSavedJobs((previous) => {
          const updated = new Set(previous);
          updated.add(jobId);
          return updated;
        });
      }
    } catch (error) {
      console.error("Save job error:", error);

      if (error.response?.status === 409) {
        setSavedJobs((previous) => {
          const updated = new Set(previous);
          updated.add(jobId);
          return updated;
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Search Header */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-slate-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          <p className="text-xs font-bold tracking-[0.2em] text-blue-600">
            EXPLORE OPPORTUNITIES
          </p>

          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Find your next job
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Search job opportunities by title, skills and location.
          </p>

          <form
            onSubmit={searchJobs}
            className="mt-8 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
          >
            <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_auto]">

              <input
                type="text"
                placeholder="Job title, skills or keywords"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Searching..." : "Search Jobs"}
              </button>

            </div>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {jobs.length > 0
                  ? `${jobs.length} Jobs Found`
                  : "Job Results"}
              </h2>

              {jobs.length > 0 && (
                <p className="mt-1 text-sm text-slate-500">
                  Showing opportunities.
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
              <p className="mt-4 text-sm text-slate-500">
                Loading jobs...
              </p>
            </div>
          )}

          {!loading && !error && jobs.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <h3 className="text-lg font-semibold text-slate-900">
                Search for jobs
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Enter a keyword and location to find opportunities.
              </p>
            </div>
          )}

          {!loading && !error && jobs.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {jobs.map((job) => {
                const jobId = String(job.id);
                const isSaved = savedJobs.has(jobId);

                return (
                  <div
                    key={job.id}
                    className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                  >

                    {/* Top */}
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg font-extrabold text-blue-600">
                        {job.company?.display_name?.charAt(0) || "J"}
                      </div>

                      {/* <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                        Adzuna
                      </span> */}
                    </div>

                    {/* Job info */}
                    <div className="mt-5 flex-1">

                      <h3 className="text-lg font-bold leading-6 text-slate-900">
                        {job.title}
                      </h3>

                      <p className="mt-2 text-sm font-semibold text-slate-700">
                        {job.company?.display_name ||
                          "Company not disclosed"}
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        📍{" "}
                        {job.location?.display_name ||
                          "Location not disclosed"}
                      </p>

                      <p className="mt-3 font-bold text-blue-600">
                        {job.salary_min
                          ? `₹${Math.round(
                              job.salary_min
                            ).toLocaleString()}`
                          : "Salary not disclosed"}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex gap-3">

                      <button
                        onClick={() => toggleSaveJob(job)}
                        className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                          isSaved
                            ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {isSaved ? "♥ Saved" : "♡ Save"}
                      </button>

                      <Link
                        to={`/jobs/${job.id}`}
                        state={{ job }}
                        className="flex-1 rounded-lg bg-blue-600 px-3 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        View Details
                      </Link>

                    </div>

                  </div>
                );
              })}

            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Jobs;