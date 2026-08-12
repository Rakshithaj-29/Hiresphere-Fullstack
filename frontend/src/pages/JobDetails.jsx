import { Link, useLocation } from "react-router-dom";

function JobDetails() {
  const location = useLocation();

  const job = location.state?.job;

  if (!job) {
    return (
      <div className="job-details-empty">
        <h2>Job details not available</h2>
        <Link to="/jobs">Back to Jobs</Link>
      </div>
    );
  }

  const salary =
    job.salary_min || job.salary_max
      ? `₹${job.salary_min ? Math.round(job.salary_min).toLocaleString() : "—"} 
         - 
         ₹${job.salary_max ? Math.round(job.salary_max).toLocaleString() : "—"}`
      : "Salary not disclosed";

  return (
    <div className="job-details-page">

      {/* Job Header */}
      <section className="job-details-header">
        <div className="job-details-header-content">

          <Link to="/jobs" className="back-link">
            ← Back to Jobs
          </Link>

          <div className="details-main">

            <div className="details-company-logo">
              {job.company?.display_name?.charAt(0) || "J"}
            </div>

            <div>
              <span className="details-source">
                Adzuna Listing
              </span>

              <h1>{job.title}</h1>

              <p className="details-company">
                {job.company?.display_name || "Company not disclosed"}
              </p>

              <p className="details-location">
                📍 {job.location?.display_name || "Location not disclosed"}
              </p>
            </div>

          </div>

          <div className="details-actions">

            <button className="save-details-btn">
              ♡ Save Job
            </button>

            <Link
              to="/apply"
              state={{ job }}
              className="apply-btn"
            >
              Apply Now
            </Link>

          </div>

        </div>
      </section>

      {/* Job Content */}
      <main className="job-details-content">

        <div className="job-description-section">

          <section>
            <h2>Job Description</h2>

            <div
              className="job-description"
              dangerouslySetInnerHTML={{
                __html:
                  job.description ||
                  "No job description available.",
              }}
            />
          </section>

        </div>

        {/* Job Summary */}
        <aside className="job-summary">

          <h2>Job Summary</h2>

          <div className="summary-item">
            <span>Salary</span>
            <strong>{salary}</strong>
          </div>

          <div className="summary-item">
            <span>Location</span>
            <strong>
              {job.location?.display_name || "Not disclosed"}
            </strong>
          </div>

          <div className="summary-item">
            <span>Company</span>
            <strong>
              {job.company?.display_name || "Not disclosed"}
            </strong>
          </div>

          <div className="summary-item">
            <span>Source</span>
            <strong>Adzuna</strong>
          </div>

          <Link
            to="/apply"
            state={{ job }}
            className="summary-apply-btn"
          >
            Apply Now
          </Link>

        </aside>

      </main>

    </div>
  );
}

export default JobDetails;