import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedApplication, setSelectedApplication] = useState(null);

  // debounce
  useEffect(() => {
    const timer = setTimeout(() => {
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
          "http://localhost:5000/api/admin/applications",
          {
            params: {
              search: debouncedSearch.trim(),
              status: statusFilter,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setApplications(response.data.applications || []);
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
  }, [debouncedSearch, statusFilter, navigate]);

  const countStatus = (status) =>
    applications.filter((app) => app.status === status).length;


 
  // if (loading) {
  //   return (
  //     <div className="flex min-h-[70vh] items-center justify-center">
  //       <p className="text-slate-500">Loading admin dashboard...</p>
  //     </div>
  //   );
  // }
  
  const updateStatus = async (applicationId, newStatus) => {
  const token = localStorage.getItem("token");

  try {
    await axios.patch(
      `http://localhost:5000/api/admin/applications/${applicationId}/status`,
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
      `http://localhost:5000/api/admin/applications/${applicationId}/resume`,
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


  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold tracking-[0.2em] text-blue-600">
            ADMIN PANEL
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Application Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
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

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Total Applications
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {applications.length}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Applied
                </p>

                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {countStatus("Applied")}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Under Review
                </p>

                <p className="mt-2 text-3xl font-bold text-yellow-600">
                  {countStatus("Under Review")}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Shortlisted
                </p>

                <p className="mt-2 text-3xl font-bold text-purple-600">
                  {countStatus("Shortlisted")}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Selected
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  {countStatus("Selected")}
                </p>
              </div>

            </div>

            {/* Applications */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-xl font-bold text-slate-900">
                  Applications
                </h2>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
  <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search candidate, job, company or location..."
    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:flex-1"
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
  >
    <option value="All">All Status</option>
    <option value="Applied">Applied</option>
    <option value="Under Review">Under Review</option>
    <option value="Shortlisted">Shortlisted</option>
    <option value="Selected">Selected</option>
    <option value="Rejected">Rejected</option>
  </select>
</div>

                <p className="mt-1 text-sm text-slate-500">
                  All candidate applications submitted through HireSphere.
                </p>
              </div>

              {applications.length === 0 ? (
                <div className="p-10 text-center text-slate-500">
                  No applications found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">

                    <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-6 py-4">Candidate</th>
                        <th className="px-6 py-4">Job</th>
                        <th className="px-6 py-4">Company</th>
                        <th className="px-6 py-4">Location</th>
                        <th className="px-6 py-4">Qualification</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Applied On</th>
                        <th className="px-6 py-4">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">

                      {applications.map((application) => (
                        <tr
                          key={application.id}
                          className="hover:bg-slate-50"
                        >
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-900">
                              {application.candidate_name}
                            </div>

                            <div className="text-xs text-slate-500">
                              {application.candidate_email}
                            </div>
                          </td>

                          <td className="px-6 py-4 font-medium text-slate-700">
                            {application.job_title}
                          </td>

                          <td className="px-6 py-4 text-slate-600">
                            {application.company_name || "—"}
                          </td>

                          <td className="px-6 py-4 text-slate-600">
                            {application.job_location || "—"}
                          </td>

                          <td className="px-6 py-4 text-slate-600">
                            {application.qualification}
                          </td>

                          <td className="px-6 py-4">
                                                            <select
                                  value={application.status}
                                  onChange={(e) =>
                                    updateStatus(application.id, e.target.value)
                                  }
                                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500"
                                >
                                  <option value="Applied">Applied</option>
                                  <option value="Under Review">Under Review</option>
                                  <option value="Shortlisted">Shortlisted</option>
                                  <option value="Selected">Selected</option>
                                  <option value="Rejected">Rejected</option>
                                </select>
                                                          </td>

                          <td className="px-6 py-4 text-slate-500">
                            {new Date(
                              application.applied_at
                            ).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedApplication(application)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            View
                          </button>
                        </td>

                        </tr>
                      ))}

                      {selectedApplication && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white">

      <div className="flex items-center justify-between border-b p-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Candidate Details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Application #{selectedApplication.id}
          </p>
        </div>

        <button
          onClick={() => setSelectedApplication(null)}
          className="text-xl text-slate-400 hover:text-slate-700"
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
              <p className="text-xs text-slate-400">Name</p>
              <p className="font-semibold">
                {selectedApplication.candidate_name}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Email</p>
              <p className="font-semibold">
                {selectedApplication.candidate_email}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Phone</p>
              <p className="font-semibold">
                {selectedApplication.candidate_phone || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Qualification</p>
              <p className="font-semibold">
                {selectedApplication.qualification}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Specialization</p>
              <p className="font-semibold">
                {selectedApplication.specialization || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">University</p>
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
              <p className="text-xs text-slate-400">Work Status</p>
              <p className="font-semibold">
                {selectedApplication.work_status}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Experience</p>
              <p className="font-semibold">
                {selectedApplication.experience_years || 0} years
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Current Job</p>
              <p className="font-semibold">
                {selectedApplication.current_job_title || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Current Company</p>
              <p className="font-semibold">
                {selectedApplication.current_company || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Skills</p>
              <p className="font-semibold">
                {selectedApplication.skills}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Expected Salary</p>
              <p className="font-semibold">
                {selectedApplication.expected_salary || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Notice Period</p>
              <p className="font-semibold">
                {selectedApplication.notice_period || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Work Preference</p>
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

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="font-semibold">
              {selectedApplication.job_title}
            </p>

            <p className="text-sm text-slate-500">
              {selectedApplication.company_name} •{" "}
              {selectedApplication.job_location}
            </p>
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-lg font-bold">
            Cover Letter
          </h3>

          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
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
  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
>
  View / Download Resume
</button>

          <p className="mt-2 text-xs text-slate-500">
            {selectedApplication.resume_filename}
          </p>
        </section>

      </div>
    </div>
  </div>
)}

                    </tbody>

                  </table>
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