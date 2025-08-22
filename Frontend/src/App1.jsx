import SignUpPage2 from "./Pages/SignUpPage2.jsx";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import {HomePage} from "./Pages/HomePage.jsx";
import {LoginPage} from "./Pages/LoginPage.jsx";
import {SettingsPage} from "./Pages/SettingsPage.jsx";
import {ProfilePage} from "./Pages/ProfilePage.jsx";
import {Navbar} from "./Components/Navbar.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import { useThemeStore } from "./store/useThemeStore.js";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

 const App1 = () => {
  const { theme } = useThemeStore();
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage2 /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </div>
  );
};


export default App1;
