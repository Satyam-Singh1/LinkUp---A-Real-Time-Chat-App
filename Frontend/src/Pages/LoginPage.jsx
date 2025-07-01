import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, Bird } from "lucide-react";


export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
     email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  //This handlesubmit is collecting the login data from the user and sending it to the login() function defined in our useAuthStore.

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };  

  return (
<div className="h-screen w-full grid lg:grid-cols-2 bg-gradient-to-br from-[var(--p)] via-[var(--a)] to-[var(--s)] text-base-content">
      {/* Left: Form Section */}
      <div className="flex items-center justify-center p-8">
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl w-full max-w-md p-8 space-y-6">
          <div className="text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <Bird className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-bold">Welcome Back</h2>
              <p className="text-sm text-white/80">Log in to continue</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-white/50" />
                <input
                  type="email"
                  className="w-full pl-10 py-2 rounded-md bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-white/50" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-2 rounded-md bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-white/60"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-md bg-white text-primary font-semibold hover:bg-white/90 transition"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <span className="flex justify-center items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" /> Loading...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-white/70">
            Don’t have an account?{" "}
            <Link to="/signup" className="underline font-medium text-white">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Image/Info Panel */}
      {/* <AuthImagePattern
        title="Hello again!"
        subtitle="Welcome to LinkUp — a place to stay connected and chat freely."
      /> */}
    </div>
  );
};


