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
        <Route path="/apply"element={<Apply/>}/>
        <Route path="/applications/my"element={<Applications/>}/>
        <Route path="/saved-jobs" element={<SavedJobs/>}/>
      </Routes>

    </BrowserRouter>
  );
}

export default App;