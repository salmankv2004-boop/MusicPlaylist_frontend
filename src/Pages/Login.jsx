import { useState } from "react";
import API from "../API/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const showMessage = (msg, error = false) => {
    setMessage(msg);
    setIsError(error);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignup) {
        await API.post("/loginUser", { name, email });
        showMessage("Signup successful. Please login.");
        setIsSignup(false);
        setUsername("");
      } else {
        const res = await API.post("/loginUser", { email });
        localStorage.setItem("token", res.data.token);
        showMessage("Login successful");
        setTimeout(() => navigate("/home"), 1000);
      }
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Something went wrong",
        true
      );
    }
  };
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 backdrop-blur-2xl bg-white/5 p-10 rounded-3xl w-96 shadow-2xl border border-white/10 animate-fade-in"
      >
        {/* Logo / Title */}
        <h1 className="text-5xl font-extrabold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 drop-shadow-md">
          🎵 supra
        </h1>
        <p className="text-md text-center text-gray-300 mb-8 font-light">
          {isSignup ? "Create your vibrant music space" : "Welcome back to your tunes!"}
        </p>

        {/* Username */}
        {isSignup && (
          <input
            type="text"
            placeholder="Username"
            required
            value={name}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 mb-4 rounded-xl bg-white/5 text-white border border-white/10
                     outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400 transition duration-300 hover:bg-white/10"
          />
        )}

        {/* Email */}
        <input
          type="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-6 rounded-xl bg-white/5 text-white border border-white/10
                   outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400 transition duration-300 hover:bg-white/10"
        />

        {/* Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600
                   text-white shadow-lg shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] transform transition-all duration-300"
        >
          {isSignup ? "Create Account" : "Login"}
        </button>

        {/* Message */}
        {message && (
          <p
            className={`text-sm text-center mt-4 font-medium ${isError ? "text-red-400" : "text-emerald-400"
              }`}
          >
            {message}
          </p>
        )}

        {/* Toggle */}
        <p
          className="text-gray-400 text-center mt-6 cursor-pointer hover:text-white transition duration-300 text-sm"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup
            ? "Already have an account? Login"
            : "Don’t have an account? Signup"}
        </p>
      </form>
    </div>
  );

}