

import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const Verify = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        alert("Email verified ✅");
        navigate("/login");
      } else {
        alert("Verification failed ❌");
      }
    };

    check();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1220] text-[#E5E7EB]">
      <div className="bg-gradient-to-br from-[#111827] to-[#1F2937] p-10 rounded-2xl shadow-xl text-center space-y-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#A855F7] to-[#EC4899] bg-clip-text text-transparent">
          Verifying Your Email
        </h2>
        <p className="text-[#9CA3AF] text-sm">
          Please wait while we confirm your account...
        </p>
        <div className="w-12 h-12 border-4 border-[#A855F7] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
};

export default Verify;
