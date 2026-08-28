import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;


function Jobs() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  // const[searchKeyword,setSearchKeyword]=useState("");
  // const[searchLocation,setSearchLoaction]=useState("");

  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState(new Set());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page,setPage]=useState(1);
  const[totalPages,setTotalPages]=useState(1);
  const [totalJobs,setTotalJobs]=useState(0);
  const JOBS_PER_PAGE=15;

  const searchJobs = async (e, selectedPage = 1) => {
  e.preventDefault();

  setLoading(true);
  setError("");

  try {
    const response = await axios.get(
      `${API_URL}/api/jobs`,
      {
        params: {
          keyword: keyword.trim(),
          location: location.trim(),
          page: selectedPage,
          limit: JOBS_PER_PAGE,
        },
      }
    );

    setJobs(response.data.results || []);
    setTotalJobs(response.data.count || 0);
    setTotalPages(response.data.totalPages || 1);
    setPage(selectedPage);

  } catch (err) {
    console.error("Job search error:", err);

    setError(
      err.response?.data?.message ||
        "Unable to load jobs. Please try again."
    );

    setJobs([]);
    setTotalJobs(0);
    setTotalPages(1);
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
          `${API_URL}/api/saved-jobs/${jobId}`,
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
          `${API_URL}/api/saved-jobs`,
          {
            external_job_id: jobId,
            job_title: job.title,
            company_name: job.company?.display_name || "",
            job_location: job.location?.display_name || "",
            job_description: job.description || "",
            
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
    <div className="min-h-screen bg-stone-50">

      {/* Search Header */}
      <section className="bg-gradient-to-br from-teal-50 via-white to-stone-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          <p className="text-xs font-bold tracking-[0.2em] text-teal-600">
            EXPLORE OPPORTUNITIES
          </p>

          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl">
            Find your next job
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500 sm:text-base">
            Search job opportunities by title, skills and location.
          </p>

         <form
  onSubmit={searchJobs}
  className="mt-8 rounded-2xl border border-stone-200 bg-white p-2.5 shadow-md transition-all duration-200 focus-within:border-teal-300 focus-within:shadow-lg"
>
  <div className="flex flex-col gap-2 md:flex-row md:items-center">

    {/* Keyword */}
    <div className="flex flex-1 items-center rounded-xl bg-stone-50 px-4 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-100">
      <svg
        className="mr-3 h-5 w-5 shrink-0 text-stone-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        />
      </svg>

      <input
        type="text"
        placeholder="Job title, skills or keywords"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="w-full bg-transparent py-3.5 text-sm text-stone-800 outline-none placeholder:text-stone-400"
      />
    </div>

    {/* Location */}
    <div className="flex flex-1 items-center rounded-xl bg-stone-50 px-4 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-100">
      <svg
        className="mr-3 h-5 w-5 shrink-0 text-stone-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"
        />
        <circle cx="12" cy="9" r="2.5" />
      </svg>

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full bg-transparent py-3.5 text-sm text-stone-800 outline-none placeholder:text-stone-400"
      />
    </div>

    {/* Search Button */}
    <button
      type="submit"
      disabled={loading}
      className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-7 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          Searching...
        </>
      ) : (
        <>
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
            />
          </svg>

          Search Jobs
        </>
      )}
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
              <h2 className="text-2xl font-bold text-stone-900">
                {jobs.length > 0
                  ? `${jobs.length} Jobs Found`
                  : "Job Results"}
              </h2>

              {jobs.length > 0 && (
                <p className="mt-1 text-sm text-stone-500">
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
            <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-teal-600" />
              <p className="mt-4 text-sm text-stone-500">
                Loading jobs...
              </p>
            </div>
          )}

          {!loading && !error && jobs.length === 0 && (
            <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center">
              <h3 className="text-lg font-semibold text-stone-900">
                Search for jobs
              </h3>

              <p className="mt-2 text-sm text-stone-500">
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
                    className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition duration-200 hover:-transtone-y-1 hover:border-teal-200 hover:shadow-md"
                  >

                    {/* Top */}
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-lg font-extrabold text-teal-600">
                        {job.company?.display_name?.charAt(0) || "J"}
                      </div>

                      {/* <span className="rounded-md bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-500">
                        Adzuna
                      </span> */}
                    </div>

                    {/* Job info */}
                    <div className="mt-5 flex-1">

                      <h3 className="text-lg font-bold leading-6 text-stone-900">
                        {job.title}
                      </h3>

                      <p className="mt-2 text-sm font-semibold text-stone-700">
                        {job.company?.display_name ||
                          "Company not disclosed"}
                      </p>

                      <p className="mt-2 text-sm text-stone-500">
                        📍{" "}
                        {job.location?.display_name ||
                          "Location not disclosed"}
                      </p>

                      <p className="mt-3 font-bold text-teal-600">
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
                            ? "border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100"
                            : "border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        {isSaved ? "♥ Saved" : "♡ Save"}
                      </button>

                      <Link
                        to={`/jobs/${job.id}`}
                        state={{ job }}
                        className="flex-1 rounded-lg bg-teal-600 px-3 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-teal-700"
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
      {!loading && !error && jobs.length > 0 && (
  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
    {jobs.map((job) => {
      // existing job card
    })}
  </div>
)}

{!loading && !error && totalJobs > 0 && (
  <div className="mt-10 flex flex-col gap-4 border-t border-stone-200 pt-6 sm:flex-row sm:items-center sm:justify-between">

    <p className="text-sm text-stone-500">
      Showing{" "}
      <span className="font-semibold text-stone-700">
        {(page - 1) * JOBS_PER_PAGE + 1}
      </span>
      {" - "}
      <span className="font-semibold text-stone-700">
        {Math.min(page * JOBS_PER_PAGE, totalJobs)}
      </span>
      {" of "}
      <span className="font-semibold text-stone-700">
        {totalJobs}
      </span>{" "}
      jobs
    </p>

    <div className="flex gap-2">
    <button
  onClick={(e) => searchJobs(e, page - 1)}
  disabled={page === 1 || loading}
  className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 disabled:opacity-40"
>
  ← Previous
</button>
      

      <span className="flex items-center rounded-lg bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-700">
        Page {page} of {totalPages}
      </span>

      <button
  onClick={(e) => searchJobs(e, page + 1)}
  disabled={page === totalPages || loading}
  className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
>
  Next →
</button>

    </div>
  </div>
)}

      </section>
    </div>
  );
}


export default Jobs;