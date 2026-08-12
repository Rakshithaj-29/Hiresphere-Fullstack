import { Link } from "react-router-dom";
import {useAuth} from "../context/AuthContext";

function Navbar() {
    const {user,isAuthenticated,logout}=useAuth();
  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        Hire<span>Sphere</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/jobs">Jobs</Link>
        <Link to="/companies">Companies</Link>
        <Link to="/saved-jobs">Saved Jobs</Link>
        <Link to="/applications">My Applications</Link>
      </div>

      <div className="nav-actions">

  {isAuthenticated ? (
    <>
      <span className="nav-user">
        Hi, {user.name}
      </span>

      <button
        className="logout-btn"
        onClick={logout}
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <Link to="/login" className="login-btn">
        Login
      </Link>

      <Link to="/register" className="register-btn">
        Register
      </Link>
    </>
  )}

</div>

    </nav>
  );
}

export default Navbar;