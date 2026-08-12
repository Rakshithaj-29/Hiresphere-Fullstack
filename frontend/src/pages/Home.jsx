import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-label">YOUR CAREER STARTS HERE</p>

          <h1>
            Find a job that
            <span> fits your future.</span>
          </h1>

          <p className="hero-description">
            Discover opportunities from leading companies and take
            the next step in your career with HireSphere.
          </p>

          <div className="hero-actions">
            <Link to="/jobs" className="primary-btn">
              Explore Jobs
            </Link>

            <Link to="/register" className="secondary-btn">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <div className="section-heading">
          <p>EXPLORE OPPORTUNITIES</p>
          <h2>Popular Job Categories</h2>
        </div>

        <div className="category-grid">
          <div className="category-card">
            <span>💻</span>
            <h3>Technology</h3>
            <p>Software, Web & IT</p>
          </div>

          <div className="category-card">
            <span>📊</span>
            <h3>Finance</h3>
            <p>Banking & Accounting</p>
          </div>

          <div className="category-card">
            <span>🎨</span>
            <h3>Design</h3>
            <p>UI/UX & Creative</p>
          </div>

          <div className="category-card">
            <span>📣</span>
            <h3>Marketing</h3>
            <p>Digital & Sales</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <div className="section-heading">
          <p>SIMPLE PROCESS</p>
          <h2>How HireSphere Works</h2>
        </div>

        <div className="steps">

          <div className="step">
            <div className="step-number">01</div>
            <h3>Find a Job</h3>
            <p>
              Search thousands of opportunities based on your
              skills and preferred location.
            </p>
          </div>

          <div className="step">
            <div className="step-number">02</div>
            <h3>Build Your Profile</h3>
            <p>
              Add your qualifications, skills, experience and
              professional information.
            </p>
          </div>

          <div className="step">
            <div className="step-number">03</div>
            <h3>Apply</h3>
            <p>
              Submit your application and track its progress
              directly from your dashboard.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Ready to find your next opportunity?</h2>

        <p>
          Create your HireSphere account and start exploring jobs.
        </p>

        <Link to="/register" className="primary-btn">
          Get Started
        </Link>
      </section>

    </div>
  );
}

export default Home;