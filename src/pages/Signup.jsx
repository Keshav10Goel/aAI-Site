// import { useState } from "react";
// import { supabase } from "../lib/supabase";
// import { useNavigate } from "react-router-dom";

// const Signup = () => {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phone: "",
//     age: "",
//     job: ""
//   });

//   const handleSignup = async () => {
//     // 1️⃣ Create Auth User
//     const { data, error } = await supabase.auth.signUp({
//       email: form.email,
//       password: form.password,
//       options: {
//     emailRedirectTo: "http://localhost:5173/verify",},
//     });

//     if (error) {
//       alert(error.message);
//       return;
//     }

//     // 2️⃣ Store extra profile data
//     await supabase.from("profiles").insert([
//       {
//         id: data.user.id,
//         name: form.name,
//         email: form.email,
//         phone: form.phone,
//         age: form.age,
//         job: form.job,
//       },
//     ]);

//     alert("Signup successful 🎉 Check your email to verify your account before logging in.");
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="bg-white p-8 rounded-xl shadow w-[350px] space-y-4">

//         <h2 className="text-xl font-bold text-center">Create Account</h2>

//         {["name","email","password","phone","age","job"].map((field)=>(
//           <input
//             key={field}
//             type={field === "password" ? "password" : "text"}
//             placeholder={field}
//             className="w-full border p-2 rounded"
//             onChange={(e)=>setForm({...form, [field]: e.target.value})}
//           />
//         ))}

//         <button
//           onClick={handleSignup}
//           className="w-full bg-purple-500 text-white py-2 rounded"
//         >
//           Sign Up
//         </button>

//       </div>
//     </div>
//   );
// };

// export default Signup;
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    age: "",
    job: ""
  });

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: "http://localhost:5173/verify",
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    await supabase.from("profiles").insert([
      {
        id: data.user.id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        age: form.age,
        job: form.job,
      },
    ]);

    alert("Signup successful 🎉 Check your email to verify your account before logging in.");
    navigate("/login");
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

        <h2 className="text-xl font-bold text-center">Create Account</h2>

        {["name","email","password","phone","age","job"].map((field)=>(
          <input
            key={field}
            type={field === "password" ? "password" : "text"}
            placeholder={field}
            className="w-full border p-2 rounded"
            onChange={(e)=>setForm({...form, [field]: e.target.value})}
          />
        ))}

        <button
          onClick={handleSignup}
          className="w-full bg-purple-500 text-white py-2 rounded"
        >
          Sign Up
        </button>

      </div>
    </div>
  );
};

export default Signup;