import { useNavigate } from "react-router-dom";
import { UserCircle } from "lucide-react";

const Navbar = () => {

  const navigate = useNavigate();

  return (

    <nav className="flex justify-between items-center px-12 py-5 bg-white shadow-sm sticky top-0 z-50">

      {/* LOGO */}

      <h1
        className="text-2xl font-bold text-purple-600 cursor-pointer"
        onClick={() => navigate("/")}
      >
        aAI-Site
      </h1>

      {/* NAV LINKS */}

      <div className="flex items-center gap-8 text-gray-700 font-medium">

        <button onClick={() => navigate("/")}>
          Home
        </button>

        <button onClick={() => navigate("/monitor")}>
          Dashboard
        </button>

        <button onClick={() => navigate("/progress")}>
          Progress
        </button>

        <button
          onClick={() =>
            document
              .getElementById("how-it-works")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          How it Works
        </button>

      </div>

      {/* USER PROFILE */}

      <div className="flex items-center gap-3 cursor-pointer">

        <UserCircle size={32} className="text-purple-600" />

        <span className="text-gray-700 font-medium">
          Profile
        </span>

      </div>

    </nav>

  );

};

export default Navbar;
