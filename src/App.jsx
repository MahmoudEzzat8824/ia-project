import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BookPost from "./components/BookPost";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/AdminDashboard";
import BookOwnerPage from "./pages/BookOwnerPage";
import Search from "./components/Search";
import HomePageWithoutLogin from "./pages/HomePageWithoutLogin";
import BookDetailsPage from "./pages/BookDetailsPage";
import HomePageWithLogin from "./pages/HomePageWithLogin";
import authService from "./services/auth.service";

function App() {
  useEffect(() => {
    const handleNotification = (event) => {
      const message = event.detail;
      if (message === "Test message: You are connected!") return;
      toast.info(`📢 ${message}`);
    };

    window.addEventListener("notificationReceived", handleNotification);

    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      setTimeout(() => {
        authService.startSignalR();
      }, 0);
    }

    return () => {
      window.removeEventListener("notificationReceived", handleNotification);
      authService.stopSignalR();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toast container for displaying popup notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Application routes */}
      <Router>
        <Routes>
          <Route path="/" element={<HomePageWithoutLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/bookpost" element={<BookPost />} />
          <Route path="/ProfilePage" element={<ProfilePage />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/BookOwnerPage" element={<BookOwnerPage />} />
          <Route path="/Search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/book/:id" element={<BookDetailsPage />} />
          <Route path="/HomePageWithLogin" element={<HomePageWithLogin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
