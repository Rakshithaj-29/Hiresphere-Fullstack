import { useState,useEffect} from "react";
import axios from "axios";
import {Link,useNavigate} from "react-router-dom";

function Jobs() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate=useNavigate();

  const searchJobs = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        "http://localhost:5000/api/jobs",
        {
          params: {
            keyword: keyword || "developer",
            location: location || "india",
          },
        }
      );

      setJobs(response.data.results || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load jobs. Please try again.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };
  
const[savedJobs,setSavedJobs]=useState(new Set());
  const toggleSaveJob = async (job) => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }
  const isSaved = savedJobs.has(String(job.id));

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

      setSavedJobs((previous) => {
        const updated = new Set(previous);
        updated.delete(String(job.id));
        return updated;
      });
    } else {
      await axios.post(
        "http://localhost:5000/api/saved-jobs",
        {
          external_job_id: String(job.id),
          job_title: job.title,
          company_name: job.company?.display_name || "",
          job_location: job.location?.display_name || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSavedJobs((previous) => {
        const updated = new Set(previous);
        updated.add(String(job.id));
        return updated;
      });
    }
  } catch (error) {
    console.error("Save job error:", error);

    if (error.response?.status === 409) {
      setSavedJobs((previous) => {
        const updated = new Set(previous);
        updated.add(String(job.id));
        return updated;
      });
    }
  }
};

useEffect(() => {
  const fetchSavedJobs = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const response = await axios.get(
        "http://localhost:5000/api/saved-jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const ids = response.data.savedJobs.map((job) =>
        String(job.external_job_id)
      );

      setSavedJobs(new Set(ids));
    } catch (error) {
      console.error("Failed to load saved jobs:", error);
    }
  };

  fetchSavedJobs();
}, []);
  return (
    <div className="jobs-page">

      {/* Search Header */}
      <section className="jobs-header">

        <div className="jobs-header-content">
          <p>EXPLORE OPPORTUNITIES</p>

          <h1>Find your next job</h1>

          <span>
            Search opportunities from companies and job platforms.
          </span>

          <form className="job-search" onSubmit={searchJobs}>

            <input
              type="text"
              placeholder="Job title, skills or keywords"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <button type="submit">
              Search Jobs
            </button>

          </form>

        </div>

      </section>

      {/* Results */}
      <section className="job-results">

        <div className="results-header">
          <h2>
            {jobs.length > 0
              ? `${jobs.length} Jobs Found`
              : "Search for jobs"}
          </h2>
        </div>

        {loading && (
          <div className="job-message">
            Loading jobs...
          </div>
        )}

        {error && (
          <div className="job-error">
            {error}
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="job-message">
            Enter a keyword and location to find jobs.
          </div>
        )}

        <div className="jobs-grid">

          {jobs.map((job) => (
            <div className="job-card" key={job.id}>

              <div className="job-card-top">

                <div className="company-logo">
                  {job.company?.display_name?.charAt(0) || "J"}
                </div>

                {/* <span className="job-source">
                  Adzuna
                </span> */}

              </div>

              <h3>{job.title}</h3>

              <p className="company-name">
                {job.company?.display_name || "Company not disclosed"}
              </p>

              <p className="job-location">
                📍 {job.location?.display_name || "Location not disclosed"}
              </p>

              <p className="job-salary">
                {job.salary_min
                  ? `₹${Math.round(job.salary_min).toLocaleString()}`
                  : "Salary not disclosed"}
              </p>

              <div className="job-card-actions">

                <button
                    className="save-btn"
                    onClick={() => toggleSaveJob(job)}
                    >
                    {savedJobs.has(String(job.id)) ? "♥ Saved" : "♡ Save"}
                </button>

               <Link
                    to={`/jobs/${job.id}`}
                    state={{ job }}
                    className="details-btn"
                    >
                    View Details
                    </Link>

              </div>

            </div>
          ))}

        </div>

      </section>

    </div>
  );
}

export default Jobs;