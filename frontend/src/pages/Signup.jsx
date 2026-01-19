import React,{ useState } from "react";
import api from "@/api/api";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const signup = async () => {
    try {
      const res = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white">

      <div className="flex items-center justify-center pt-20">
        <div className="bg-[#181818] p-8 rounded-lg w-[400px]">

          <h2 className="text-2xl font-bold mb-6 text-center">
            Create Account
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">
              {error}
            </p>
          )}

          <input
            className="w-full bg-[#121212] border border-[#303030] p-3 mb-4 rounded outline-none"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="w-full bg-[#121212] border border-[#303030] p-3 mb-4 rounded outline-none"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full bg-[#121212] border border-[#303030] p-3 mb-4 rounded outline-none"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={signup}
            className="w-full bg-red-600 hover:bg-red-700 py-3 rounded font-semibold"
          >
            Sign Up
          </button>

          <p className="text-sm text-gray-400 mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;