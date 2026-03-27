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

  return <div>Verifying...</div>;
};

export default Verify;
