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

        <div className="space-y-5">
          {savedJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {job.job_title}
                  </h2>

                  <p className="mt-1 font-medium text-slate-700">
                    {job.company_name || "Company not disclosed"}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    📍 {job.job_location || "Location not disclosed"}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Saved on{" "}
                    {new Date(job.saved_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      removeSavedJob(job.external_job_id)
                    }
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>

                  <Link
                    to="/jobs"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    View Jobs
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default SavedJobs;