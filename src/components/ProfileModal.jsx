import React, { useState } from "react";

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
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl w-[420px] shadow-lg">

        <h2 className="text-xl font-bold mb-4 text-center">
          Setup Your Profile
        </h2>

        <input name="name" placeholder="Full Name" onChange={handleChange} className="w-full border p-2 mb-2" />
        <input name="age" type="number" placeholder="Age" onChange={handleChange} className="w-full border p-2 mb-2" />

        <select name="gender" onChange={handleChange} className="w-full border p-2 mb-2">
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        <select name="role" onChange={handleChange} className="w-full border p-2 mb-2">
          <option value="">Select Role</option>
          <option>Student</option>
          <option>Developer</option>
        </select>

        <div className="flex gap-2 mt-4">
          <button onClick={close} className="w-1/2 border p-2">Cancel</button>
          <button onClick={saveProfile} className="w-1/2 bg-purple-500 text-white p-2">Save</button>
        </div>

      </div>
    </div>
  );
};

export default ProfileModal;