import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
const API_URL = import.meta.env.VITE_API_URL;


function Apply() {
  const location = useLocation();
  const navigate = useNavigate();
  const {user}=useAuth();

  const job = location.state?.job;

  const [formData, setFormData] = useState({
    candidate_name: user?.name || "",
  candidate_email: user?.email || "",
    qualification: "",
    specialization: "",
    university: "",
    graduation_year: "",
    work_status: "",
    experience_years: "0",
    current_job_title: "",
    current_company: "",
    skills: "",
    expected_salary: "",
    notice_period: "",
    work_preference: "",
    cover_letter: "",
  });

  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!job) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-900">
            Job information is not available
          </h2>

          <Link
            to="/jobs"
            className="mt-4 inline-block font-medium text-teal-600 hover:text-teal-700"
          >
            ← Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setResume(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF, DOC and DOCX files are allowed.");
      setResume(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume must be smaller than 5 MB.");
      setResume(null);
      return;
    }

    setError("");
    setResume(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!resume) {
      setError("Please upload your resume.");
      return;
    }

    if (
      !formData.qualification ||
      !formData.work_status ||
      !formData.skills
    ) {
      setError(
        "Qualification, work status and skills are required."
      );
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("external_job_id", job.id);
      data.append("job_title", job.title);
      data.append(
        "company_name",
        job.company?.display_name || ""
      );
      data.append(
        "job_location",
        job.location?.display_name || ""
      );
      data.append("Name",formData.candidate_name);
      data.append("email",formData.candidate_email);
      data.append("qualification", formData.qualification);
      data.append("specialization", formData.specialization);
      data.append("university", formData.university);
      data.append("graduation_year", formData.graduation_year);
      data.append("work_status", formData.work_status);
      data.append("experience_years", formData.experience_years);
      data.append("current_job_title", formData.current_job_title);
      data.append("current_company", formData.current_company);
      data.append("skills", formData.skills);
      data.append("expected_salary", formData.expected_salary);
      data.append("notice_period", formData.notice_period);
      data.append("work_preference", formData.work_preference);
      data.append("cover_letter", formData.cover_letter);

      data.append("resume", resume);

      const response = await axios.post(
        `${API_URL}/api/applications`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(response.data.message);

      setFormData({
        qualification: "",
        specialization: "",
        university: "",
        graduation_year: "",
        work_status: "",
        experience_years: "0",
        current_job_title: "",
        current_company: "",
        skills: "",
        expected_salary: "",
        notice_period: "",
        work_preference: "",
        cover_letter: "",
      });

      setResume(null);

      const resumeInput = document.getElementById("resume");
      if (resumeInput) {
        resumeInput.value = "";
      }
    } catch (err) {
      console.error("Application submission error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to submit application."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

  const readOnlyClass =
    "w-full rounded-lg border border-stone-200 bg-stone-100 px-4 py-3 text-sm text-stone-500 outline-none";

  const labelClass =
    "mb-2 block text-sm font-semibold text-stone-700";

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">

        {/* Back */}
        <Link
          to={`/jobs/${job.id}`}
          state={{ job }}
          className="text-sm font-medium text-stone-500 transition hover:text-teal-600"
        >
          ← Back to Job
        </Link>

        {/* Header */}
        <div className="mt-8 mb-8">
          <p className="text-xs font-bold tracking-[0.2em] text-teal-600">
            APPLICATION
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Apply for {job.title}
          </h1>

          <p className="mt-3 text-stone-500">
            {job.company?.display_name || "Company not disclosed"}
            <span className="mx-2">•</span>
            {job.location?.display_name || "Location not disclosed"}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        <form
  onSubmit={handleSubmit}
  className="max-h-[75vh] overflow-y-auto overflow-x-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
>
          {/* Job Information */}
          <section className="border-b border-stone-200 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-stone-900">
                Job Information
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                These details come from the selected job listing.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">

              <div>
                <label className={labelClass}>Job Title</label>
                <input
                  value={job.title}
                  readOnly
                  className={readOnlyClass}
                />
              </div>

              <div>
                <label className={labelClass}>Company</label>
                <input
                  value={job.company?.display_name || ""}
                  readOnly
                  className={readOnlyClass}
                />
              </div>

              <div>
                <label className={labelClass}>Location</label>
                <input
                  value={job.location?.display_name || ""}
                  readOnly
                  className={readOnlyClass}
                />
              </div>

              <div>
                <label className={labelClass}>Job Source</label>
                <input
                  value="Adzuna"
                  readOnly
                  className={readOnlyClass}
                />
              </div>
            </div>
          </section>

          <section className="border-b border-stone-200 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-stone-900">
                Personal Details
              </h2>
            </div>
     <div className="grid gap-5 md:grid-cols-2">

  {/* Full Name */}
  <div>
    <label
      htmlFor="candidate_name"
      className={labelClass}
    >
      Full Name
    </label>

    <input
      id="candidate_name"
      type="text"
      name="candidate_name"
      value={formData.candidate_name}
      onChange={handleChange}
      placeholder="Enter your name"
      className={inputClass}/>
  </div>

  {/* Email */}
  <div>
    <label
      htmlFor="candidate_email"
      className={labelClass}
    >
      Email
    </label>

    <input
      id="candidate_email"
      type="email"
      name="candidate_email"
      value={formData.candidate_email}
      onChange={handleChange}
      placeholder="Enter your email"
      className={inputClass}/>
  </div>

</div>
</section>

          {/* Education */}
          <section className="border-b border-stone-200 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-stone-900">
                Education
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className={labelClass}>
                  Qualification *
                </label>
                <input
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  placeholder="MCA"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Specialization
                </label>
                <input
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="Computer Applications,Cyber Security"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  University / College
                </label>
                <input
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  placeholder="University name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Graduation Year
                </label>
                <input
                  type="number"
                  name="graduation_year"
                  value={formData.graduation_year}
                  onChange={handleChange}
                  placeholder="2026"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Professional Information */}
          <section className="border-b border-stone-200 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-stone-900">
                Professional Information
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className={labelClass}>
                  Work Status *
                </label>

                <select
                  name="work_status"
                  value={formData.work_status}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">Select status</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Experienced">Experienced</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Years of Experience
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.5"
                  name="experience_years"
                  value={formData.experience_years}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* <div>
                <label className={labelClass}>
                  Current Job Title
                </label>

                <input
                  name="current_job_title"
                  value={formData.current_job_title}
                  onChange={handleChange}
                  placeholder="Optional for freshers"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Current Company
                </label>

                <input
                  name="current_company"
                  value={formData.current_company}
                  onChange={handleChange}
                  placeholder="Optional for freshers"
                  className={inputClass}
                />
              </div> */}
            </div>
          </section>

          {/* Skills */}
          <section className="border-b border-stone-200 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-stone-900">
                Skills & Preferences
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div className="md:col-span-2">
                <label className={labelClass}>Skills *</label>

                <input
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, PostgreSQL"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Expected Salary
                </label>

                <input
                  type="number"
                  name="expected_salary"
                  value={formData.expected_salary}
                  onChange={handleChange}
                  placeholder="500000"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Notice Period
                </label>

                <input
                  name="notice_period"
                  value={formData.notice_period}
                  onChange={handleChange}
                  placeholder="Immediate / 30 days"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Work Preference
                </label>

                <select
                  name="work_preference"
                  value={formData.work_preference}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select preference</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
            </div>
          </section>

          {/* Resume */}
          <section className="border-b border-stone-200 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-stone-900">
                Resume
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Upload your latest resume.
              </p>
            </div>

            <div>
              <label className={labelClass}>
                Resume *
              </label>

              <input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
                className="block w-full cursor-pointer rounded-lg border border-stone-300 bg-white text-sm text-stone-600 file:mr-4 file:border-0 file:bg-teal-50 file:px-4 file:py-3 file:font-semibold file:text-teal-700 hover:file:bg-teal-100"
              />

              {resume && (
                <p className="mt-3 text-sm font-medium text-teal-600">
                  Selected: {resume.name}
                </p>
              )}

              <p className="mt-2 text-xs text-stone-400">
                PDF, DOC or DOCX • Maximum 5 MB
              </p>
            </div>
          </section>

          {/* Cover Letter */}
          <section className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-stone-900">
                Cover Letter
              </h2>
            </div>

            <textarea
              name="cover_letter"
              rows="4"
              value={formData.cover_letter}
              onChange={handleChange}
              placeholder="Tell the employer why you are interested in this opportunity..."
              className={`${inputClass} resize-none`}
            />
          </section>

          {/* Submit */}
          <div className="bg-stone-50 px-6 py-5 sm:px-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-teal-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Submitting Application..."
                : "Submit Application"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Apply;