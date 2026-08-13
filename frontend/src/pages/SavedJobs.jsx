import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedJobs = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/saved-jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSavedJobs(response.data.savedJobs || []);
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
  }, [navigate]);

  const removeSavedJob = async (jobId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `http://localhost:5000/api/saved-jobs/${jobId}`,
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
    } catch (err) {
      console.error("Remove saved job error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-slate-500">Loading saved jobs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8">
          <p className="text-xs font-bold tracking-[0.2em] text-blue-600">
            YOUR JOBS
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Saved Jobs
          </h1>

          <p className="mt-2 text-slate-500">
            Keep track of opportunities you want to apply for later.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!error && savedJobs.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <h2 className="text-xl font-semibold text-slate-900">
              No saved jobs
            </h2>

            <p className="mt-2 text-slate-500">
              Save jobs you're interested in and come back later.
            </p>

            <Link
              to="/jobs"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Explore Jobs
            </Link>
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
  {savedJobs.map((job) => (
    <div
      key={job.id}
      className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">
          {job.company_name?.charAt(0) || "J"}
        </div>

        {/* <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
          Adzuna
        </span> */}
      </div>

      <div className="mt-5">
        <h2 className="text-lg font-bold leading-6 text-slate-900">
          {job.job_title}
        </h2>

        <p className="mt-2 text-sm font-semibold text-slate-700">
          {job.company_name || "Company not disclosed"}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          📍 {job.job_location || "Location not disclosed"}
        </p>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-400">
          Saved On
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-700">
          {new Date(job.saved_at).toLocaleDateString()}
        </p>
      </div>

      <div className="mt-auto flex gap-3 pt-6">
        <button
          onClick={() =>
            removeSavedJob(job.external_job_id)
          }
          className="flex-1 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          Remove
        </button>

        <Link
          to="/jobs"
          className="flex-1 rounded-lg bg-blue-600 px-3 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          View Jobs
        </Link>
      </div>
    </div>
  ))}
</div>

      </div>
    </div>
  );
}

export default SavedJobs;