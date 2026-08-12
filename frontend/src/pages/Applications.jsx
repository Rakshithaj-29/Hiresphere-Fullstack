import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please log in to view your applications.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/applications/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setApplications(response.data.applications || []);

      } catch (err) {
        console.error("Fetch applications error:", err);

        setError(
          err.response?.data?.message ||
          "Failed to load applications."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-50 text-blue-700";
      case "Under Review":
        return "bg-yellow-50 text-yellow-700";
      case "Shortlisted":
        return "bg-purple-50 text-purple-700";
      case "Selected":
        return "bg-green-50 text-green-700";
      case "Rejected":
        return "bg-red-50 text-red-700";
      default:
        return "bg-slate-50 text-slate-700";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-slate-500">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <p className="text-xs font-bold tracking-[0.2em] text-blue-600">
            CANDIDATE DASHBOARD
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            My Applications
          </h1>

          <p className="mt-2 text-slate-500">
            Track the jobs you have applied for and monitor their status.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!error && applications.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <h2 className="text-xl font-semibold text-slate-900">
              No applications yet
            </h2>

            <p className="mt-2 text-slate-500">
              Start exploring jobs and submit your first application.
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
          {applications.map((application) => (
            <div
              key={application.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {application.job_title}
                  </h2>

                  <p className="mt-1 font-medium text-slate-700">
                    {application.company_name || "Company not disclosed"}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    📍 {application.job_location || "Location not disclosed"}
                  </p>
                </div>

                <span
                  className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                    application.status
                  )}`}
                >
                  {application.status}
                </span>
              </div>

              <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">

                <div>
                  <p className="text-xs text-slate-400">Qualification</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {application.qualification}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Experience</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {application.experience_years || 0} years
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Resume</p>
                  <p className="mt-1 truncate text-sm font-semibold text-slate-700">
                    {application.resume_filename}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Applied On</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {new Date(application.applied_at).toLocaleDateString()}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Applications;