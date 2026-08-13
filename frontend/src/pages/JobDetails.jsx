import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function JobDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const job = location.state?.job;

  const [isSaved, setIsSaved] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  useEffect(() => {
    const checkSavedJob = async () => {
      const token = localStorage.getItem("token");

      if (!token || !job?.id) return;

      try {
        const response = await axios.get(
          "http://localhost:5000/api/saved-jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const exists = response.data.savedJobs.some(
          (savedJob) =>
            String(savedJob.external_job_id) === String(job.id)
        );

        setIsSaved(exists);
      } catch (error) {
        console.error("Check saved job error:", error);
      }
    };

    checkSavedJob();
  }, [job]);

  if (!job) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Job details not available
          </h2>

          <Link
            to="/jobs"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const companyName =
    job.company?.display_name || "Company not disclosed";

  const jobLocation =
    job.location?.display_name || "Location not disclosed";

  const salary =
    job.salary_min || job.salary_max
      ? `₹${
          job.salary_min
            ? Math.round(job.salary_min).toLocaleString()
            : "—"
        } - ₹${
          job.salary_max
            ? Math.round(job.salary_max).toLocaleString()
            : "—"
        }`
      : "Salary not disclosed";

  const toggleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setLoadingSave(true);

    try {
      if (isSaved) {
        await axios.delete(
          `http://localhost:5000/api/saved-jobs/${job.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsSaved(false);
      } else {
        await axios.post(
          "http://localhost:5000/api/saved-jobs",
          {
            external_job_id: String(job.id),
            job_title: job.title,
            company_name: companyName,
            job_location: jobLocation,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsSaved(true);
      }
    } catch (error) {
      console.error("Toggle saved job error:", error);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          {/* Back */}
          <Link
            to="/jobs"
            className="inline-flex items-center text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >
            ← Back to Jobs
          </Link>

          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* Main job info */}
            <div className="flex gap-5">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-2xl font-extrabold text-blue-600">
                {companyName.charAt(0)}
              </div>

              <div>
                {/* <span className="inline-flex rounded-md bg-blue-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-700">
                  Adzuna Listing
                </span> */}

                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  {job.title}
                </h1>

                <p className="mt-2 text-base font-semibold text-slate-700">
                  {companyName}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  📍 {jobLocation}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">

              <button
                onClick={toggleSave}
                disabled={loadingSave}
                className={`rounded-xl border px-5 py-3 text-sm font-bold transition ${
                  isSaved
                    ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {loadingSave
                  ? "Saving..."
                  : isSaved
                    ? "♥ Saved"
                    : "♡ Save Job"}
              </button>

              <Link
                to="/apply"
                state={{ job }}
                className="rounded-xl bg-blue-600 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Apply Now
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_320px]">

          {/* Description */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <h2 className="text-xl font-bold text-slate-900">
              Job Description
            </h2>

            <div
              className="prose prose-slate mt-6 max-w-none text-sm leading-7 text-slate-600"
              dangerouslySetInnerHTML={{
                __html:
                  job.description ||
                  "<p>No job description available.</p>",
              }}
            />

          </section>

          {/* Summary */}
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-slate-900">
              Job Summary
            </h2>

            <div className="mt-5 divide-y divide-slate-100">

              <div className="py-4">
                <p className="text-xs font-medium text-slate-400">
                  Salary
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {salary}
                </p>
              </div>

              <div className="py-4">
                <p className="text-xs font-medium text-slate-400">
                  Location
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {jobLocation}
                </p>
              </div>

              <div className="py-4">
                <p className="text-xs font-medium text-slate-400">
                  Company
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {companyName}
                </p>
              </div>

              {/* <div className="py-4">
                <p className="text-xs font-medium text-slate-400">
                  Source
                </p>

                <p className="mt-1 text-sm font-semibold text-blue-600">
                  Adzuna
                </p>
              </div> */}

            </div>

            <Link
              to="/apply"
              state={{ job }}
              className="mt-5 block rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Apply Now
            </Link>

          </aside>
        </div>
      </main>
    </div>
  );
}

export default JobDetails;