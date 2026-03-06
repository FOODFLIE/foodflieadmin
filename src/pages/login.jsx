import { useState } from "react";
import { adminLogin } from "../services/adminServices";
import { riderLogin } from "../services/riderServices";

const Login = () => {
  // Common state
  const [role, setRole] = useState("admin"); // 'admin' | 'rider'
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Role-specific state
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (role === "admin") {
        const data = await adminLogin(email, password);
        localStorage.setItem("adminToken", data.adminToken);
        localStorage.setItem("email", data.email);
        localStorage.setItem("role", "admin");
        window.location.href = "/dashboard";
      } else {
        const data = await riderLogin(username, password);
        // data.riderToken and data.rider
        localStorage.setItem("riderToken", data.riderToken);
        localStorage.setItem("riderData", JSON.stringify(data.rider));
        localStorage.setItem("role", "rider");
        // Redirect riders to their dashboard
        window.location.href = "/rider-dashboard";
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden transition-colors duration-700 ${
        role === "admin"
          ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500"
          : "bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-500"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 bg-white/10 rounded-full -top-16 -left-16 sm:-top-20 sm:-left-20 md:-top-24 md:-left-24 animate-pulse"></div>
        <div className="absolute w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-white/10 rounded-full -bottom-8 -right-8 sm:-bottom-10 sm:-right-10 md:-bottom-12 md:-right-12 animate-pulse delay-1000"></div>
        <div className="absolute w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 bg-white/10 rounded-full top-1/2 right-[5%] sm:right-[10%] animate-pulse delay-2000"></div>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 md:p-10 lg:p-12 relative z-10 animate-fadeIn transition-all duration-500">
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <div
            className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6 shadow-lg transition-colors duration-500 ${
              role === "admin"
                ? "bg-gradient-to-br from-indigo-600 to-purple-600"
                : "bg-gradient-to-br from-emerald-500 to-teal-500"
            }`}
          >
            {role === "admin" ? (
              <svg
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            ) : (
              <svg
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2">
            {role === "admin" ? "Admin Login" : "Rider Login"}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Welcome back! Please login to your account
          </p>
        </div>

        {/* Role Toggle Switch */}
        <div className="mb-8 flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => {
              setRole("admin");
              setError("");
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
              role === "admin"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700 cursor-pointer"
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => {
              setRole("rider");
              setError("");
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
              role === "rider"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700 cursor-pointer"
            }`}
          >
            Rider
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-5 md:space-y-6"
        >
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-2.5 sm:p-3 rounded-lg text-xs sm:text-sm animate-shake">
              {error}
            </div>
          )}

          {/* Dynamic input field based on role */}
          {role === "admin" ? (
            <div className="animate-fadeIn">
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-3.5 border-2 border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition bg-gray-50 focus:bg-white"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="animate-fadeIn">
              <label
                htmlFor="username"
                className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
              >
                Username
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ENTER USERNAME"
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-3.5 border-2 border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 outline-none transition bg-gray-50 focus:bg-white"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="password"
              className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
            >
              Password
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 md:py-3.5 border-2 border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base outline-none transition bg-gray-50 focus:bg-white ${
                  role === "admin"
                    ? "focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                    : "focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 transition p-1 cursor-pointer ${
                  role === "admin"
                    ? "text-gray-400 hover:text-indigo-600"
                    : "text-gray-400 hover:text-emerald-600"
                }`}
              >
                {showPassword ? (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition disabled:opacity-70 disabled:cursor-not-allowed mt-2 cursor-pointer ${
              role === "admin"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                : "bg-gradient-to-r from-emerald-500 to-teal-500"
            }`}
          >
            {loading ? (
              <span className="inline-block w-4 h-4 sm:w-5 sm:h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 sm:mt-7 md:mt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-400">
            © 2024 FoodFlie {role === "admin" ? "Admin" : "Riders"}. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
