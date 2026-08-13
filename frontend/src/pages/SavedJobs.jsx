import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function SavedJobs() {
  const navigate = useNavigate();

  const [savedJobs, setSavedJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. Debounce only
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // 2. API call
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchSavedJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "http://localhost:5000/api/saved-jobs",
          {
            params: {
              search: debouncedSearch.trim(),
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSavedJobs(response.data.savedJobs || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load saved jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [debouncedSearch, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <h1 className="text-3xl font-bold text-slate-900">
          Saved Jobs
        </h1>

        {/* SEARCH MUST ALWAYS BE HERE */}
        <div className="mt-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search saved jobs..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Loading BELOW the input */}
        {loading && (
          <p className="mt-4 text-sm text-slate-500">
            Searching...
          </p>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Results */}
        {!loading && !error && (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {savedJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <h2 className="font-bold text-slate-900">
                  {job.job_title}
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  {job.company_name}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {job.job_location}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
   export default SavedJobs;