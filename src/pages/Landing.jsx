import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Eye, Activity, Monitor, Brain, UserCircle } from "lucide-react";
import ProfileModal from "../components/ProfileModal";
import Footer from "../components/Footer";

const Landing = () => {
const navigate = useNavigate();
const [showProfile, setShowProfile] = useState(false);

  const [textIndex, setTextIndex] = useState(0);
const [typedText, setTypedText] = useState("");
const [isDeleting, setIsDeleting] = useState(false);
const texts = [
  "Smart Eye Monitoring...",
  "Fatigue Detection...",
  "Real-Time Health Tracking..."
];
useEffect(() => {
  const currentText = texts[textIndex];

  const speed = isDeleting ? 80 : 120; // 🔥 control speed here

  const timeout = setTimeout(() => {

    if (!isDeleting) {
      setTypedText(currentText.substring(0, typedText.length + 1));

      if (typedText === currentText) {
        setTimeout(() => setIsDeleting(true), 1000); // pause before delete
      }

    } else {
      setTypedText(currentText.substring(0, typedText.length - 1));

      if (typedText === "") {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }
    }

  }, speed);

  return () => clearTimeout(timeout);

}, [typedText, isDeleting, textIndex]);
  // AUTH STATE
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(false);

  // AUTH LISTENER
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
      setLoading(false);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOpenDropdown(false);
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#E5E7EB]">

      {/* ================= NAVBAR ================= */}
<nav className="flex justify-between items-center px-12 py-6 bg-[#0B1220]/80 backdrop-blur-lg shadow-lg sticky top-0 z-50">

  {/* LOGO */}
  <h1
    className="text-2xl font-bold bg-gradient-to-r from-[#A855F7] to-[#EC4899] bg-clip-text text-transparent cursor-pointer"
    onClick={() => navigate("/")}
  >
    aAI-Site
  </h1>

  {/* NAV LINKS */}
  <div className="flex items-center gap-6 text-[#9CA3AF] font-medium">

  <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
    Home
  </button>

  <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
    Features
  </button>

  {!user && (
    <>
      <button onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}>
        How it Works
      </button>

      <button onClick={() => navigate("/login")}>
        Login
      </button>

      <button
        onClick={() => navigate("/signup")}
        className="bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white px-4 py-1 rounded-xl shadow"
      >
        Sign Up
      </button>
    </>
  )}

  {user && (
    <button onClick={() => navigate("/monitor")}>
      Dashboard
    </button>
  )}

</div>
        {/* PROFILE */}
        {!loading && user && (
          <div className="relative">
            <div
              onClick={() => setOpenDropdown(!openDropdown)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <UserCircle className="text-[#A855F7]" size={30} />
            </div>

            {openDropdown && (
              <div className="absolute right-0 mt-3 w-40 bg-[#111827] border border-white/10 rounded-xl shadow-xl p-2">
                <button
                  onClick={() => {
                  setOpenDropdown(false);
                  setShowProfile(true);
}}
                  className="block w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg"
                >
                  Profile
                </button>

                <button
                  onClick={() => navigate("/monitor")}
                  className="block w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg"
                >
                  Dashboard
                </button>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 hover:bg-red-500/20 text-red-400 rounded-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* ================= HERO ================= */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">

        <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover opacity-80">
          <source src="/Video.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-[#0B1220]/80"></div>

        <div className="relative z-10 px-6">
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            AI Powered <br />
            <span className="bg-gradient-to-r from-[#A855F7] to-[#EC4899] bg-clip-text text-transparent">
              {typedText}
              <span className="animate-pulse">|</span>
            </span>
          </h1>

          <p className="text-lg text-[#9CA3AF] max-w-2xl mx-auto">
            Real-time AI system tracking blink rate, posture and fatigue.
          </p>

          <button
            onClick={() => navigate("/monitor")}
            className="mt-10 px-10 py-4 bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white text-lg rounded-2xl shadow-lg hover:scale-105 transition"
          >
            Start Monitoring 🚀
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mt-32 px-10 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-14">
          Key Features of aAI-Site
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          <FeatureCard icon={<Eye size={32} />} title="Blink Detection" text="Tracks fatigue" />
          <FeatureCard icon={<Monitor size={32} />} title="Screen Distance" text="Maintains posture" />
          <FeatureCard icon={<Activity size={32} />} title="Eye Redness" text="Detect irritation" />
          <FeatureCard icon={<Brain size={32} />} title="AI Strain Score" text="Smart evaluation" />
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="mt-32 px-10">
        <h2 className="text-3xl font-bold text-center mb-4">
          How aAI-Site Works
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <StepCard step="01" title="Enable Camera" text="Grant webcam access" />
          <StepCard step="02" title="Calibration" text="Quick setup" />
          <StepCard step="03" title="Monitoring" text="AI protects your eyes" />
        </div>
      </section>

      {showProfile && <ProfileModal close={() => setShowProfile(false)} />}
      <Footer />
    </div>
  );
};

export default Landing;
const FeatureCard = ({ icon, title, text }) => (
  <div className="bg-gradient-to-br from-[#111827] to-[#1F2937] p-6 rounded-2xl shadow-xl text-center">
    <div className="flex justify-center mb-4 text-[#A855F7]">{icon}</div>
    <h3 className="font-semibold text-lg mb-2 text-[#E5E7EB]">{title}</h3>
    <p className="text-[#9CA3AF] text-sm">{text}</p>
  </div>
);

const StepCard = ({ step, title, text }) => (
  <div className="bg-gradient-to-br from-[#111827] to-[#1F2937] p-8 rounded-2xl shadow-xl">
    <p className="bg-gradient-to-r from-[#A855F7] to-[#EC4899] bg-clip-text text-transparent font-semibold mb-2">
      Step {step}
    </p>
    <h3 className="text-xl font-semibold mb-3 text-[#E5E7EB]">{title}</h3>
    <p className="text-[#9CA3AF]">{text}</p>
  </div>
);
