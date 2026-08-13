import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Apply from "./pages/Apply";
import Applications from "./pages/Applications";
import SavedJobs from "./pages/SavedJobs";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/login"element={<Login/>}/>
        <Route path="/jobs"element={<Jobs/>}/>
        <Route path="/jobs/:id"element={<JobDetails/>}/>
        <Route path="/apply"element={<ProtectedRoute><Apply/></ProtectedRoute>}/>
       <Route path="/applications"element={<ProtectedRoute><Applications /></ProtectedRoute>}/>

        <Route path="/saved-jobs" element={<ProtectedRoute><SavedJobs/></ProtectedRoute>}/>
        <Route path="/admin"element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>}/>
        

      </Routes>

    </BrowserRouter>
  );
}

export default App;