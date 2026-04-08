// // import React, { useState } from "react";

// // const ProfileModal = ({ close }) => {
// //   const [form, setForm] = useState({
// //     name: "",
// //     age: "",
// //     gender: "",
// //     role: ""
// //   });

// //   const handleChange = (e) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// //   const saveProfile = () => {
// //     localStorage.setItem("userProfile", JSON.stringify(form));
// //     close();
// //   };

// //   return (
// //     <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
// //       <div className="bg-white p-8 rounded-xl w-[420px] shadow-lg">

// //         <h2 className="text-xl font-bold mb-4 text-center">
// //           Setup Your Profile
// //         </h2>

// //         <input name="name" placeholder="Full Name" onChange={handleChange} className="w-full border p-2 mb-2" />
// //         <input name="age" type="number" placeholder="Age" onChange={handleChange} className="w-full border p-2 mb-2" />

// //         <select name="gender" onChange={handleChange} className="w-full border p-2 mb-2">
// //           <option value="">Select Gender</option>
// //           <option>Male</option>
// //           <option>Female</option>
// //         </select>

// //         <select name="role" onChange={handleChange} className="w-full border p-2 mb-2">
// //           <option value="">Select Role</option>
// //           <option>Student</option>
// //           <option>Developer</option>
// //         </select>

// //         <div className="flex gap-2 mt-4">
// //           <button onClick={close} className="w-1/2 border p-2">Cancel</button>
// //           <button onClick={saveProfile} className="w-1/2 bg-purple-500 text-white p-2">Save</button>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // };

// // export default ProfileModal;

// import React, { useState } from "react";

// const ProfileModal = ({ close }) => {
//   const [form, setForm] = useState({
//     name: "",
//     age: "",
//     gender: "",
//     role: ""
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const saveProfile = () => {
//     localStorage.setItem("userProfile", JSON.stringify(form));
//     close();
//   };

//   return (
//     <div className="fixed inset-0 bg-[#0B1220]/90 backdrop-blur-sm flex justify-center items-center z-50">
//       <div className="w-[420px] rounded-2xl p-8 bg-gradient-to-br from-[#111827] to-[#1F2937] shadow-2xl">

//         <h2 className="text-2xl font-semibold text-center mb-6 bg-gradient-to-r from-[#A855F7] to-[#EC4899] bg-clip-text text-transparent">
//           Setup Your Profile
//         </h2>

//         <div className="space-y-3">
//           <input
//             name="name"
//             placeholder="Full Name"
//             onChange={handleChange}
//             className="w-full p-3 rounded-xl bg-[#0B1220] text-[#E5E7EB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A855F7]/50 transition"
//           />

//           <input
//             name="age"
//             type="number"
//             placeholder="Age"
//             onChange={handleChange}
//             className="w-full p-3 rounded-xl bg-[#0B1220] text-[#E5E7EB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A855F7]/50 transition"
//           />

//           <select
//             name="gender"
//             onChange={handleChange}
//             className="w-full p-3 rounded-xl bg-[#0B1220] text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#A855F7]/50 transition"
//           >
//             <option value="" className="text-[#9CA3AF]">Select Gender</option>
//             <option>Male</option>
//             <option>Female</option>
//           </select>

//           <select
//             name="role"
//             onChange={handleChange}
//             className="w-full p-3 rounded-xl bg-[#0B1220] text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#A855F7]/50 transition"
//           >
//             <option value="" className="text-[#9CA3AF]">Select Role</option>
//             <option>Student</option>
//             <option>Developer</option>
//           </select>
//         </div>

//         <div className="flex gap-3 mt-6">
//           <button
//             onClick={close}
//             className="w-1/2 py-3 rounded-xl bg-[#0B1220] text-[#9CA3AF] hover:bg-[#111827] transition"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={saveProfile}
//             className="w-1/2 py-3 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white font-medium shadow-lg hover:brightness-110 hover:scale-[1.02] transition"
//           >
//             Save
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ProfileModal;

// import React, { useState, useEffect } from "react";

// const ProfileModal = ({ close }) => {
//   const [form, setForm] = useState({
//     name: "",
//     age: "",
//     gender: "",
//     role: ""
//   });

//   const [loading, setLoading] = useState(false);

//   const isFirstTimeUser = !localStorage.getItem("userProfile");

//   useEffect(() => {
//     try {
//       const stored = localStorage.getItem("userProfile");
//       if (stored) {
//         const parsed = JSON.parse(stored);
//         if (parsed && typeof parsed === "object") {
//           setForm(parsed);
//         }
//       }
//     } catch (err) {
//       console.error("Corrupt localStorage data", err);
//       localStorage.removeItem("userProfile");
//     }
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const saveProfile = async () => {
//     if (!form.name || !form.age || Number(form.age) <= 0) return;

//     setLoading(true);

//     try {
//       localStorage.setItem("userProfile", JSON.stringify(form));

//       fetch("/api/profile", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(form)
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           console.log("Profile saved to backend:", data);
//         })
//         .catch((err) => {
//           console.error("API error:", err);
//         });

//       close();
//     } catch (err) {
//       console.error("Save failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isDisabled =
//     !form.name || !form.age || Number(form.age) <= 0;

//   return (
//     <div className="fixed inset-0 bg-[#0B1220]/90 backdrop-blur-sm flex justify-center items-center z-50">
//       <div className="w-[420px] rounded-2xl p-8 bg-gradient-to-br from-[#111827] to-[#1F2937] shadow-2xl">

//         <h2 className="text-2xl font-semibold text-center mb-6 bg-gradient-to-r from-[#A855F7] to-[#EC4899] bg-clip-text text-transparent">
//           {isFirstTimeUser ? "Create Your Profile" : "Your Profile"}
//         </h2>

//         <div className="space-y-3">
//           <input
//             name="name"
//             value={form.name}
//             placeholder="Full Name"
//             onChange={handleChange}
//             className="w-full p-3 rounded-xl bg-[#0B1220] text-[#E5E7EB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A855F7]/50 transition"
//           />

//           <input
//             name="age"
//             type="number"
//             value={form.age}
//             placeholder="Age"
//             onChange={handleChange}
//             className="w-full p-3 rounded-xl bg-[#0B1220] text-[#E5E7EB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A855F7]/50 transition"
//           />

//           <select
//             name="gender"
//             value={form.gender}
//             onChange={handleChange}
//             className="w-full p-3 rounded-xl bg-[#0B1220] text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#A855F7]/50 transition"
//           >
//             <option value="" className="text-[#9CA3AF]">Select Gender</option>
//             <option>Male</option>
//             <option>Female</option>
//           </select>

//           <select
//             name="role"
//             value={form.role}
//             onChange={handleChange}
//             className="w-full p-3 rounded-xl bg-[#0B1220] text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#A855F7]/50 transition"
//           >
//             <option value="" className="text-[#9CA3AF]">Select Role</option>
//             <option>Student</option>
//             <option>Developer</option>
//           </select>
//         </div>

//         <div className="flex gap-3 mt-6">
//           <button
//             onClick={close}
//             className="w-1/2 py-3 rounded-xl bg-[#0B1220] text-[#9CA3AF] hover:bg-[#111827] transition"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={saveProfile}
//             disabled={isDisabled || loading}
//             className={`w-1/2 py-3 rounded-xl text-white font-medium shadow-lg transition
//               ${isDisabled
//                 ? "bg-gray-600 cursor-not-allowed"
//                 : "bg-gradient-to-r from-[#A855F7] to-[#EC4899] hover:brightness-110 hover:scale-[1.02]"
//               }`}
//           >
//             {isFirstTimeUser ? "Save Profile" : "Update Profile"}
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ProfileModal;

import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const ProfileModal = ({ close }) => {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    role: ""
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);

  // 🔥 FETCH PROFILE FROM SUPABASE (SAFE + NO CRASH)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();

        if (!userData?.user) {
          setInitialLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userData.user.id)
          .maybeSingle(); // ✅ safer than .single()

        if (error) {
          console.error("Fetch error:", error);
        }

        if (data) {
          setForm({
            name: data.name || "",
            age: data.age || "",
            gender: data.gender || "",
            role: data.job || ""
          });

          // ✅ Better first-time detection
          if (data.name || data.age || data.gender) {
            setIsFirstTimeUser(false);
          }
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 🔹 HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 SAVE / UPDATE PROFILE
  const saveProfile = async () => {
    if (!form.name || !form.age || Number(form.age) <= 0) return;

    setLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData?.user) {
        alert("User not logged in");
        return;
      }

      const { error } = await supabase
  .from("profiles")
  .upsert({
    id: userData.user.id, // 🔥 VERY IMPORTANT
    name: form.name,
    age: form.age,
    gender: form.gender,
    job: form.role
  });

      if (error) {
        console.error("Update error:", error);
        alert("Failed to update profile");
        return;
      }
      alert("✅ Profile saved successfully!");
      close();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    !form.name || !form.age || Number(form.age) <= 0;

  // 🔄 FIXED LOADING UI (NO FLICKER)
  if (initialLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black/70 text-white z-50">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0B1220]/90 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="w-[420px] rounded-2xl p-8 bg-gradient-to-br from-[#111827] to-[#1F2937] shadow-2xl">

        <h2 className="text-2xl font-semibold text-center mb-6 bg-gradient-to-r from-[#A855F7] to-[#EC4899] bg-clip-text text-transparent">
          {isFirstTimeUser ? "Create Your Profile" : "Your Profile"}
        </h2>

        <div className="space-y-3">

          <input
            name="name"
            value={form.name}
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-[#0B1220] text-[#E5E7EB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A855F7]/50 transition"
          />

          <input
            name="age"
            type="number"
            value={form.age}
            placeholder="Age"
            min="1"
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-[#0B1220] text-[#E5E7EB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A855F7]/50 transition"
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-[#0B1220] text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#A855F7]/50 transition"
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-[#0B1220] text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#A855F7]/50 transition"
          >
            <option value="">Select Role</option>
            <option>Student</option>
            <option>Developer</option>
          </select>

        </div>

        <div className="flex gap-3 mt-6">

          <button
            onClick={close}
            className="w-1/2 py-3 rounded-xl bg-[#0B1220] text-[#9CA3AF] hover:bg-[#111827] transition"
          >
            Cancel
          </button>

          <button
            onClick={saveProfile}
            disabled={isDisabled || loading}
            className={`w-1/2 py-3 rounded-xl text-white font-medium shadow-lg transition
              ${
                isDisabled
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#A855F7] to-[#EC4899] hover:brightness-110 hover:scale-[1.02]"
              }`}
          >
            {loading
              ? "Saving..."
              : isFirstTimeUser
              ? "Save Profile"
              : "Update Profile"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default ProfileModal;