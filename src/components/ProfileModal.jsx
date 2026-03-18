import { useState } from "react";

const ProfileModal = ({ close }) => {

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    role: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveProfile = () => {
    localStorage.setItem("userProfile", JSON.stringify(form));
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">

      <div className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl w-[420px] shadow-2xl animate-fadeIn">

        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Setup Your Profile 👤
        </h2>

        {/* NAME */}
        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="input"
        />

        {/* AGE */}
        <input
          name="age"
          type="number"
          placeholder="Age"
          onChange={handleChange}
          className="input"
        />

        {/* GENDER */}
        <select
          name="gender"
          onChange={handleChange}
          className="input"
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Prefer not to say</option>
        </select>

        {/* ROLE (UPGRADED 🔥) */}
        <select
          name="role"
          onChange={handleChange}
          className="input"
        >
          <option value="">Select Role</option>
          <option>Student</option>
          <option>Software Developer</option>
          <option>Designer</option>
          <option>Freelancer</option>
          <option>Office Worker</option>
          <option>Gamer</option>
          <option>Content Creator</option>
        </select>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-6">

          <button
            onClick={close}
            className="w-1/2 py-3 rounded-xl border hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={saveProfile}
            className="w-1/2 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl shadow hover:scale-105 transition"
          >
            Save 🚀
          </button>

        </div>

      </div>
    </div>
  );
};

export default ProfileModal;