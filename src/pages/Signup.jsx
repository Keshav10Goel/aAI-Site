// // import { useState } from "react";
// // import { supabase } from "../lib/supabase";
// // import { useNavigate } from "react-router-dom";

// // const Signup = () => {
// //   const navigate = useNavigate();

// //   const [form, setForm] = useState({
// //     name: "",
// //     email: "",
// //     password: "",
// //     phone: "",
// //     age: "",
// //     job: ""
// //   });

// //   const handleSignup = async () => {
// //     // 1️⃣ Create Auth User
// //     const { data, error } = await supabase.auth.signUp({
// //       email: form.email,
// //       password: form.password,
// //       options: {
// //     emailRedirectTo: "http://localhost:5173/verify",},
// //     });

// //     if (error) {
// //       alert(error.message);
// //       return;
// //     }

// //     // 2️⃣ Store extra profile data
// //     await supabase.from("profiles").insert([
// //       {
// //         id: data.user.id,
// //         name: form.name,
// //         email: form.email,
// //         phone: form.phone,
// //         age: form.age,
// //         job: form.job,
// //       },
// //     ]);

// //     alert("Signup successful 🎉 Check your email to verify your account before logging in.");
// //     navigate("/login");
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center">
// //       <div className="bg-white p-8 rounded-xl shadow w-[350px] space-y-4">

// //         <h2 className="text-xl font-bold text-center">Create Account</h2>

// //         {["name","email","password","phone","age","job"].map((field)=>(
// //           <input
// //             key={field}
// //             type={field === "password" ? "password" : "text"}
// //             placeholder={field}
// //             className="w-full border p-2 rounded"
// //             onChange={(e)=>setForm({...form, [field]: e.target.value})}
// //           />
// //         ))}

// //         <button
// //           onClick={handleSignup}
// //           className="w-full bg-purple-500 text-white py-2 rounded"
// //         >
// //           Sign Up
// //         </button>

// //       </div>
// //     </div>
// //   );
// // };

// // export default Signup;
// import { useState } from "react";
// import { supabase } from "../lib/supabase";
// import { useNavigate } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";

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
//     const { data, error } = await supabase.auth.signUp({
//       email: form.email,
//       password: form.password,
//       options: {
//         emailRedirectTo: "http://localhost:5173/verify",
//       },
//     });

//     if (error) {
//       alert(error.message);
//       return;
//     }

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
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">

//       {/* 🔥 BACK BUTTON */}
//       <button
//         onClick={() => navigate("/")}
//         className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-black"
//       >
//         <ArrowLeft size={18} /> Back to Home
//       </button>

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



// import { useState } from "react";
// import { supabase } from "../lib/supabase";
// import { useNavigate } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";

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
//     const { data, error } = await supabase.auth.signUp({
//       email: form.email,
//       password: form.password,
//       options: {
//         emailRedirectTo: "http://localhost:5173/verify",
//       },
//     });

//     if (error) {
//       alert(error.message);
//       return;
//     }

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
//     <div className="min-h-screen flex items-center justify-center bg-[#0B1220] text-[#E5E7EB]">

//       <button
//         onClick={() => navigate("/")}
//         className="absolute top-6 left-6 flex items-center gap-2 text-[#9CA3AF] hover:text-white transition"
//       >
//         <ArrowLeft size={18} /> Back to Home
//       </button>

//       <div className="bg-gradient-to-br from-[#111827] to-[#1F2937] p-8 rounded-2xl shadow-xl w-[360px] space-y-5">

//         <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-[#A855F7] to-[#EC4899] bg-clip-text text-transparent">
//           Create Account
//         </h2>

//         {["name","email","password","phone","age","job"].map((field)=>(
//           <input
//             key={field}
//             type={field === "password" ? "password" : "text"}
//             placeholder={field}
//             className="w-full bg-[#0B1220] border border-white/10 p-3 rounded-xl text-[#E5E7EB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
//             onChange={(e)=>setForm({...form, [field]: e.target.value})}
//           />
//         ))}

//         <button
//           onClick={handleSignup}
//           className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white shadow-lg hover:brightness-110 hover:scale-[1.02] transition"
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
    job: "",
    gender: ""
  });

  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("Please fill all required fields");
      return;
    }

    if (Number(form.age) < 0) {
      alert("Invalid age");
      return;
    }

    setLoading(true);

    try {
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

      const userId = data?.user?.id;

      if (!userId) {
        console.warn("User not returned immediately (email verification ON)");
        alert("Signup successful 🎉 Please verify your email.");
        navigate("/login");
        return;
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: data.user.id,
            name: form.name,
            email: form.email,
            phone: form.phone,
            age: form.age,
            job: form.job,
            gender: form.gender,
          },
        ]);

      if (profileError) {
        console.error("Profile Insert Error:", profileError);
        alert("Profile saved partially. Please update later.");
      }

      alert("Signup successful 🎉 Check your email to verify your account.");
      navigate("/login");

    } catch (err) {
      console.error("Signup Error:", err);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
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
          Create Account
        </h2>

        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full bg-[#0B1220] border border-white/10 p-3 rounded-xl text-[#E5E7EB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full bg-[#0B1220] border border-white/10 p-3 rounded-xl text-[#E5E7EB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full bg-[#0B1220] border border-white/10 p-3 rounded-xl text-[#E5E7EB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
        />

        <input
          type="tel"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full bg-[#0B1220] border border-white/10 p-3 rounded-xl text-[#E5E7EB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
        />

        <input
          type="number"
          min="1"
          placeholder="Age"
          value={form.age}
          onChange={(e) => {
            const value = e.target.value;

            
            if (value < 0) return;

            setForm({ ...form, age: value });
          }}
          className="w-full bg-[#0B1220] border border-white/10 p-3 rounded-xl text-[#E5E7EB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
        />

        <input
          type="text"
          placeholder="Job"
          value={form.job}
          onChange={(e) => setForm({ ...form, job: e.target.value })}
          className="w-full bg-[#0B1220] border border-white/10 p-3 rounded-xl text-[#E5E7EB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
        />

        <select
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
          className="w-full bg-[#0B1220] border border-white/10 p-3 rounded-xl text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
        >
          <option value="" className="text-[#9CA3AF]">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Rather Not Say</option>
        </select>

        <button
          onClick={handleSignup}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg transition ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-[#A855F7] to-[#EC4899] hover:brightness-110 hover:scale-[1.02]"
          }`}
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

      </div>
    </div>
  );
};

export default Signup;