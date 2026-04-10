

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      navigate("/monitor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1220] text-[#E5E7EB]">

      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-[#9CA3AF] hover:text-white transition"
      >
        <ArrowLeft size={18} /> Back to Home
      </button>

      <div className="bg-gradient-to-br from-[#111827] to-[#1F2937] p-8 rounded-2xl shadow-xl w-[360px] space-y-5">

        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-[#A855F7] to-[#EC4899] bg-clip-text text-transparent">
          Login 🔐
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full bg-[#0B1220] border border-white/10 p-3 rounded-xl text-[#E5E7EB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full bg-[#0B1220] border border-white/10 p-3 rounded-xl text-[#E5E7EB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white shadow-lg hover:brightness-110 hover:scale-[1.02] transition"
        >
          Login
        </button>

        <p className="text-sm text-center text-[#9CA3AF]">
          New user?{" "}
          <span
            className="bg-gradient-to-r from-[#A855F7] to-[#EC4899] bg-clip-text text-transparent cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;
// export default Login;
