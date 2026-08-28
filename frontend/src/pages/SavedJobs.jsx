import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;


function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const SAVED_JOBS_PER_PAGE = 9;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSavedJobs, setTotalSavedJobs] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");
        const response = await axios.get(
          `${API_URL}/api/saved-jobs`,
          {
            params: {
              search: debouncedSearch.trim(),
              page,
              limit: SAVED_JOBS_PER_PAGE,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSavedJobs(response.data.savedJobs || []);
        setTotalSavedJobs(response.data.total || 0);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        console.error("Fetch saved jobs error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load saved jobs."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [debouncedSearch, page, navigate]);

  const removeSavedJob = async (jobId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `${API_URL}/api/saved-jobs/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSavedJobs((previous) =>
        previous.filter(
          (job) => String(job.external_job_id) !== String(jobId)
        )
      );
      setTotalSavedJobs((previous) => Math.max(previous - 1, 0));
    } catch (err) {
      console.error("Remove saved job error:", err);
    }
  };

  if (loading && savedJobs.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-stone-500">Loading saved jobs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-teal-700">
              YOUR JOBS
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
              Saved jobs
            </h1>

            <p className="mt-2 text-stone-500">
              Keep track of opportunities you want to apply for later.
            </p>
          </div>

          <div className="flex w-full items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2.5 sm:w-72">
            <i className="ti ti-search text-stone-400"></i>
            <input
              type="text"
              placeholder="Search saved jobs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-none bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!error && savedJobs.length === 0 && (
          <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center">
            <h2 className="text-xl font-semibold text-stone-900">
              No saved jobs
            </h2>

            <p className="mt-2 text-stone-500">
              {debouncedSearch
                ? "No saved jobs match your search."
                : "Save jobs you're interested in and come back later."}
            </p>

            <Link
              to="/jobs"
              className="mt-6 inline-block rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Explore jobs
            </Link>
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {savedJobs.map((job) => (
            <div
              key={job.id}
              className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-6 transition hover:-transtone-y-0.5 hover:border-teal-300"
            >
              <div>
                <h2 className="text-lg font-bold leading-6 text-stone-900">
                  {job.job_title}
                </h2>

                <p className="mt-2 text-sm font-semibold text-stone-700">
                  {job.company_name || "Company not disclosed"}
                </p>

                <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-500">
                  <i className="ti ti-map-pin text-xs"></i>
                  {job.job_location || "Location not disclosed"}
                </p>

                <p className="mt-3 text-xs text-stone-400">
                  Saved on {new Date(job.saved_at).toLocaleDateString()}
                </p>
              </div>

              <div className="mt-auto flex gap-3 pt-6">
                <button
                  onClick={() => removeSavedJob(job.external_job_id)}
                  className="flex-1 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Remove
                </button>

                <Link
                          to={`/jobs/${job.external_job_id}`}
                          state={{ job }}
                          className="flex-1 rounded-lg bg-teal-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-teal-700"
                        >
                          View Details
                        </Link>
              </div>
            </div>
          ))}
        </div>

        {!error && totalSavedJobs > 0 && (
          <div className="mt-10 flex flex-col items-center gap-4 border-t border-stone-200 pt-6">
            <p className="text-sm text-stone-500">
              Showing{" "}
              <span className="font-semibold text-stone-700">
                {(page - 1) * SAVED_JOBS_PER_PAGE + 1}
              </span>
              {" – "}
              <span className="font-semibold text-stone-700">
                {Math.min(page * SAVED_JOBS_PER_PAGE, totalSavedJobs)}
              </span>
              {" of "}
              <span className="font-semibold text-stone-700">
                {totalSavedJobs}
              </span>{" "}
              saved jobs
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1 || loading}
                className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`h-9 w-9 rounded-lg text-sm font-semibold ${
                      page === pageNumber
                        ? "bg-teal-500 text-white"
                        : "border border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              )}

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages || loading}
                className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedJobs;