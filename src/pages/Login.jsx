// import { useState } from "react";
// import { supabase } from "../lib/supabase";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async () => {
//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error) {
//       alert(error.message);
//     } else {
//       navigate("/monitor"); // ✅ FIXED
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
//       <div className="bg-white p-8 rounded-xl shadow w-[350px] space-y-4">

//         <h2 className="text-xl font-bold text-center text-purple-600">
//           Login 🔐
//         </h2>

//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full border p-2 rounded"
//           onChange={(e)=>setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full border p-2 rounded"
//           onChange={(e)=>setPassword(e.target.value)}
//         />

//         <button
//           onClick={handleLogin}
//           className="w-full bg-purple-500 text-white py-2 rounded"
//         >
//           Login
//         </button>

//         <p className="text-sm text-center text-gray-500">
//           New user?{" "}
//           <span
//             className="text-purple-600 cursor-pointer"
//             onClick={() => navigate("/signup")}
//           >
//             Sign Up
//           </span>
//         </p>

//       </div>
//     </div>
//   );
// };

// export default Login;
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">

      {/* 🔥 BACK BUTTON */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-black"
      >
        <ArrowLeft size={18} /> Back to Home
      </button>

      <div className="bg-white p-8 rounded-xl shadow w-[350px] space-y-4">

        <h2 className="text-xl font-bold text-center text-purple-600">
          Login 🔐
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-purple-500 text-white py-2 rounded"
        >
          Login
        </button>

        <p className="text-sm text-center text-gray-500">
          New user?{" "}
          <span
            className="text-purple-600 cursor-pointer"
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