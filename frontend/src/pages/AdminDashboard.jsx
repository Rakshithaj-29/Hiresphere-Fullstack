import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;


function AdminDashboard() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedApplication, setSelectedApplication] = useState(null);
  
const APPLICATIONS_PER_PAGE = 10;
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [totalApplications, setTotalApplications] = useState(0);
  // debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // server-side search + status filter
  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${API_URL}/api/admin/applications`,
          {
            params: {
              search: debouncedSearch.trim(),
              status: statusFilter,
              page,
              limit:APPLICATIONS_PER_PAGE
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setApplications(response.data.applications || []);
        setTotalApplications(response.data.total || 0);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        console.error("Admin applications error:", err);

        if (err.response?.status === 403) {
          setError("You do not have admin access.");
        } else {
          setError(
            err.response?.data?.message ||
              "Failed to load applications."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [debouncedSearch, statusFilter, page,navigate]);

  const countStatus = (status) =>
    applications.filter((app) => app.status === status).length;


 
  // if (loading) {
  //   return (
  //     <div className="flex min-h-[70vh] items-center justify-center">
  //       <p className="text-stone-500">Loading admin dashboard...</p>
  //     </div>
  //   );
  // }
  
  const updateStatus = async (applicationId, newStatus) => {
  const token = localStorage.getItem("token");

  try {
    await axios.patch(
      `${API_URL}/api/admin/applications/${applicationId}/status`,
      {
        status: newStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setApplications((previous) =>
      previous.map((app) =>
        app.id === applicationId
          ? { ...app, status: newStatus }
          : app
      )
    );
  } catch (error) {
    console.error("Status update error:", error);

    setError(
      error.response?.data?.message ||
        "Failed to update application status."
    );
  }
};

const viewResume = async (applicationId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API_URL}/api/admin/applications/${applicationId}/resume`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    const fileBlob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    const fileUrl = window.URL.createObjectURL(fileBlob);

    window.open(fileUrl, "_blank");

    // Release the object URL after a short delay
    setTimeout(() => {
      window.URL.revokeObjectURL(fileUrl);
    }, 1000);

  } catch (error) {
    console.error("Resume error:", error);

    alert(
      error.response?.data?.message ||
      "Failed to open resume."
    );
  }
};

const removeApplication = async (applicationId) => {
  const token = localStorage.getItem("token");

  const confirmed = window.confirm(
    "Are you sure you want to remove this application?"
  );

  if (!confirmed) return;

  try {
    await axios.delete(
      `${API_URL}/api/admin/applications/${applicationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setApplications((previous) =>
      previous.filter((app) => app.id !== applicationId)
    );

  } catch (error) {
    console.error("Remove application error:", error);

    setError(
      error.response?.data?.message ||
      "Failed to remove application."
    );
  }
};

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold tracking-[0.2em] text-teal-600">
            ADMIN PANEL
          </p>

          <h1 className="mt-2 text-3xl font-bold text-stone-900">
            Application Dashboard
          </h1>

          <p className="mt-2 text-stone-500">
            Review and manage candidate applications.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Statistics */}
        {!error && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

              <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-stone-500">
                  Total Applications
                </p>

                <p className="mt-2 text-3xl font-bold text-stone-900">
                  {applications.length}
                </p>
              </div>

              <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-stone-500">
                  Applied
                </p>

                <p className="mt-2 text-3xl font-bold text-teal-600">
                  {countStatus("Applied")}
                </p>
              </div>

              <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-stone-500">
                  Under Review
                </p>

                <p className="mt-2 text-3xl font-bold text-yellow-600">
                  {countStatus("Under Review")}
                </p>
              </div>

              <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-stone-500">
                  Shortlisted
                </p>

                <p className="mt-2 text-3xl font-bold text-purple-600">
                  {countStatus("Shortlisted")}
                </p>
              </div>

              <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-stone-500">
                  Selected
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  {countStatus("Selected")}
                </p>
              </div>

            </div>

            {/* Applications */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">

              <div className="border-b border-stone-200 px-6 py-5">
                <h2 className="text-xl font-bold text-stone-900">
                  Applications
                </h2>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
  <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search candidate, job, company or location..."
    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 sm:flex-1"
  />

  <select
    value={statusFilter}
    onChange={(e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  }}
    className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
  >
    <option value="All">All Status</option>
    <option value="Applied">Applied</option>
    <option value="Under Review">Under Review</option>
    <option value="Shortlisted">Shortlisted</option>
    <option value="Selected">Selected</option>
    <option value="Rejected">Rejected</option>
  </select>
</div>

                <p className="mt-1 text-sm text-stone-500">
                  All candidate applications submitted through HireSphere.
                </p>
              </div>

              {applications.length === 0 ? (
                <div className="p-10 text-center text-stone-500">
                  No applications found.
                </div>
              ) : (
               <div className="max-h-[500px] overflow-auto rounded-xl border border-stone-200">
  <table className="min-w-full text-left text-sm">
    <thead className="sticky top-0 z-20 bg-stone-100 text-xs uppercase tracking-wider text-stone-500">
      <tr>
        <th className="whitespace-nowrap px-6 py-4">Candidate</th>
        <th className="whitespace-nowrap px-6 py-4">Job</th>
        <th className="whitespace-nowrap px-6 py-4">Company</th>
        <th className="whitespace-nowrap px-6 py-4">Location</th>
        <th className="whitespace-nowrap px-6 py-4">Qualification</th>
        <th className="whitespace-nowrap px-6 py-4">Status</th>
        <th className="whitespace-nowrap px-6 py-4">Applied On</th>
        <th className="whitespace-nowrap px-6 py-4">Action</th>
      </tr>
    </thead>

    <tbody className="divide-y divide-stone-100 bg-white">
      {applications.map((application) => (
        <tr
          key={application.id}
          className="hover:bg-stone-50"
        >
          <td className="px-6 py-4">
            <div className="font-semibold text-stone-900">
              {application.candidate_name}
            </div>
            <div className="text-xs text-stone-500">
              {application.candidate_email}
            </div>
          </td>

          <td className="whitespace-nowrap px-6 py-4 font-medium text-stone-700">
            {application.job_title}
          </td>

          <td className="whitespace-nowrap px-6 py-4 text-stone-600">
            {application.company_name || "—"}
          </td>

          <td className="whitespace-nowrap px-6 py-4 text-stone-600">
            {application.job_location || "—"}
          </td>

          <td className="whitespace-nowrap px-6 py-4 text-stone-600">
            {application.qualification}
          </td>

          <td className="px-6 py-4">
            <select
                                  value={application.status}
                                  onChange={(e) =>
                                    updateStatus(application.id, e.target.value)
                                  }
                                  className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-700 outline-none focus:border-teal-500"
                                >
                                  <option value="Applied">Applied</option>
                                  <option value="Under Review">Under Review</option>
                                  <option value="Shortlisted">Shortlisted</option>
                                  <option value="Selected">Selected</option>
                                  <option value="Rejected">Rejected</option>
                                </select>
                                            
          </td>

          <td className="whitespace-nowrap px-6 py-4 text-stone-500">
            {new Date(application.applied_at).toLocaleDateString()}
          </td>

         <td className="px-6 py-4">
  <div className="flex gap-2">
    <button
      onClick={() => setSelectedApplication(application)}
      className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
    >
      View
    </button>

    <button
      onClick={() => removeApplication(application.id)}
      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
    >
      Remove
    </button>
  </div>
</td>
        </tr>
        

        
      ))}
      {selectedApplication && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white">

      <div className="flex items-center justify-between border-b p-6">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">
            Candidate Details
          </h2>

          <p className="mt-1 text-sm text-stone-500">
            Application #{selectedApplication.id}
          </p>
        </div>

        <button
          onClick={() => setSelectedApplication(null)}
          className="text-xl text-stone-400 hover:text-stone-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6 p-6">

        <section>
          <h3 className="mb-3 text-lg font-bold">
            Personal Information
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-stone-400">Name</p>
              <p className="font-semibold">
                {selectedApplication.candidate_name}
              </p>
            </div>

            <div>
              <p className="text-xs text-stone-400">Email</p>
              <p className="font-semibold">
                {selectedApplication.candidate_email}
              </p>
            </div>

            <div>
              <p className="text-xs text-stone-400">Phone</p>
              <p className="font-semibold">
                {selectedApplication.candidate_phone || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-stone-400">Qualification</p>
              <p className="font-semibold">
                {selectedApplication.qualification}
              </p>
            </div>

            <div>
              <p className="text-xs text-stone-400">Specialization</p>
              <p className="font-semibold">
                {selectedApplication.specialization || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-stone-400">University</p>
              <p className="font-semibold">
                {selectedApplication.university || "—"}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-lg font-bold">
            Professional Information
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-stone-400">Work Status</p>
              <p className="font-semibold">
                {selectedApplication.work_status}
              </p>
            </div>

            <div>
              <p className="text-xs text-stone-400">Experience</p>
              <p className="font-semibold">
                {selectedApplication.experience_years || 0} years
              </p>
            </div>

            <div>
              <p className="text-xs text-stone-400">Current Job</p>
              <p className="font-semibold">
                {selectedApplication.current_job_title || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-stone-400">Current Company</p>
              <p className="font-semibold">
                {selectedApplication.current_company || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-stone-400">Skills</p>
              <p className="font-semibold">
                {selectedApplication.skills}
              </p>
            </div>

            <div>
              <p className="text-xs text-stone-400">Expected Salary</p>
              <p className="font-semibold">
                {selectedApplication.expected_salary || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-stone-400">Notice Period</p>
              <p className="font-semibold">
                {selectedApplication.notice_period || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-stone-400">Work Preference</p>
              <p className="font-semibold">
                {selectedApplication.work_preference || "—"}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-lg font-bold">
            Job Applied For
          </h3>

          <div className="rounded-xl bg-stone-50 p-4">
            <p className="font-semibold">
              {selectedApplication.job_title}
            </p>

            <p className="text-sm text-stone-500">
              {selectedApplication.company_name} •{" "}
              {selectedApplication.job_location}
            </p>
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-lg font-bold">
            Cover Letter
          </h3>

          <p className="whitespace-pre-wrap text-sm leading-6 text-stone-600">
            {selectedApplication.cover_letter || "No cover letter provided."}
          </p>
        </section>

        <section>
          <h3 className="mb-3 text-lg font-bold">
            Resume
          </h3>

          <button
  onClick={() =>
    viewResume(
      selectedApplication.id,
      selectedApplication.resume_filename
    )
  }
  className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
>
  View / Download Resume
</button>

          <p className="mt-2 text-xs text-stone-500">
            {selectedApplication.resume_filename}
          </p>
        </section>

      </div>
    </div>
  </div>
)}

    </tbody>
    
  </table>
  <div className="flex flex-col gap-3 border-t border-stone-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

    <p className="text-sm text-stone-500">
        Showing{" "}
        <span className="font-semibold text-stone-700">
            {totalApplications === 0
                ? 0
                : (page - 1) * APPLICATIONS_PER_PAGE + 1}
        </span>
        {" - "}
        <span className="font-semibold text-stone-700">
            {Math.min(
                page * APPLICATIONS_PER_PAGE,
                totalApplications
            )}
        </span>
        {" of "}
        <span className="font-semibold text-stone-700">
            {totalApplications}
        </span>{" "}
        applications
    </p>

    <div className="flex gap-2">

        <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1 || loading}
            className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
            ← Previous
        </button>

        <span className="flex items-center rounded-lg bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-700">
            Page {page} of {totalPages}
        </span>

        <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages || loading}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
            Next →
        </button>

    </div>
</div>
</div>
              )}

            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;