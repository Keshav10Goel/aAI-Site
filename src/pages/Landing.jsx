

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, Activity, Monitor, Brain, UserCircle } from "lucide-react";
import ProfileModal from "../components/ProfileModal";
const Landing = () => {

  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  return (

    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-white">

      {/* ================= NAVBAR ================= */}

      <nav className="flex justify-between items-center px-12 py-6 bg-white/70 backdrop-blur-lg shadow-sm sticky top-0 z-50">

        <h1
          className="text-2xl font-bold text-purple-700 cursor-pointer"
          onClick={() => navigate("/")}
        >
          aAI-Site
        </h1>

        <div className="flex items-center gap-8 text-gray-700 font-medium">

          <button onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>
            Home
          </button>

          <button onClick={() =>
            document.getElementById("features")
            ?.scrollIntoView({behavior:"smooth"})
          }>
            Features
          </button>

          <button onClick={() =>
            document.getElementById("how")
            ?.scrollIntoView({behavior:"smooth"})
          }>
            How it Works
          </button>

          <button onClick={() => navigate("/monitor")}>
            Dashboard
          </button>

        </div>

        {/* PROFILE BUTTON */}
        <div
          onClick={() => setShowProfile(true)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <UserCircle className="text-purple-600" size={30}/>
          <span className="text-gray-700">Profile</span>
        </div>

      </nav>


      {/* ================= HERO ================= */}

      {/* <section className="relative text-center mt-20 px-6 overflow-hidden">

        {/* Glow Background */}
        {/* <div className="absolute inset-0 -z-10">
          <div className="absolute w-[500px] h-[500px] bg-purple-300 blur-[120px] opacity-30 top-[-100px] left-1/2 -translate-x-1/2"></div>
        </div> */}
{/* 
        <h1 className="text-6xl font-bold text-gray-800 mb-6 leading-tight">
          AI Powered <br/>
          <span className="text-purple-600">Eye Health Monitoring</span>
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Real-time AI system tracking blink rate, posture and fatigue.
        </p>

        <button
          onClick={() => navigate("/monitor")}
          className="mt-10 px-10 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-lg rounded-xl shadow-lg hover:scale-105 transition"
        >
          Start Monitoring 🚀
        </button>
      </section> */} 
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">

  {/* 🎬 VIDEO BACKGROUND */}
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute top-0 left-0 w-full h-full object-cover"
  >
    <source src="Video.mp4" type="video/mp4" />
  </video>

  {/* 🔥 OVERLAY (VERY IMPORTANT) */}
  <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

  {/* 🧠 CONTENT */}
  <div className="relative z-10 px-6">

    <h1 className="text-6xl font-bold text-gray-800 mb-6 leading-tight">
      AI Powered <br/>
      <span className="text-purple-600">Eye Health Monitoring</span>
    </h1>

    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
      Real-time AI system tracking blink rate, posture and fatigue.
    </p>

    <button
      onClick={() => navigate("/monitor")}
      className="mt-10 px-10 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-lg rounded-xl shadow-lg hover:scale-105 transition"
    >
      Start Monitoring 🚀
    </button>

  </div>

</section>


      {/* ================= FEATURES ================= */}

      <section id="features" className="mt-32 px-10 max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold text-center mb-14">
          Key Features of aAI-Site
        </h2>

        <div className="grid md:grid-cols-4 gap-8">

          <FeatureCard icon={<Eye size={32}/>} title="Blink Detection" text="Tracks fatigue"/>

          <FeatureCard icon={<Monitor size={32}/>} title="Screen Distance" text="Maintains posture"/>

          <FeatureCard icon={<Activity size={32}/>} title="Eye Redness" text="Detect irritation"/>

          <FeatureCard icon={<Brain size={32}/>} title="AI Stress Score" text="Smart evaluation"/>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}

      <section id="how" className="mt-32 px-10">

        <h2 className="text-3xl font-bold text-center mb-4">
          How aAI-Site Works
        </h2>

        <p className="text-center text-gray-600 mb-14">
          Simple setup, powerful protection for your eyes.
        </p>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">

          <StepCard step="01" title="Enable Camera" text="Grant webcam access"/>

          <StepCard step="02" title="Calibration" text="Quick setup"/>

          <StepCard step="03" title="Monitoring" text="AI protects your eyes"/>

        </div>

      </section>


      {/* ================= STATS ================= */}

      <section className="mt-32 text-center px-10">

        <h2 className="text-3xl font-bold mb-10">
          Why Eye Monitoring Matters
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">

          <StatBox number="60%" text="People face eye strain"/>

          <StatBox number="15-20" text="Ideal blink/min"/>

          <StatBox number="20-20-20" text="Break rule"/>

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section className="mt-32 text-center pb-24">

        <h2 className="text-4xl font-bold mb-6">
          Start protecting your eyes today
        </h2>

        <p className="text-gray-500 mb-6">
          Join the future of AI health monitoring 🚀
        </p>

        <button
          onClick={() => navigate("/monitor")}
          className="px-12 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg rounded-xl shadow-lg hover:scale-105 transition"
        >
          Launch aAI-Site
        </button>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="bg-purple-600 text-white py-12 px-10">

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">

          <div>
            <h2 className="text-2xl font-bold mb-2">aAI-Site</h2>
            <p className="text-purple-200">
              AI powered eye health monitoring.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Navigation</h3>
            <ul className="space-y-2 text-purple-200">
              <li>Dashboard</li>
              <li>Features</li>
              <li>How it Works</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-purple-200">
              <li>Help Center</li>
              <li>Contact</li>
            </ul>
          </div>

        </div>

      </footer>


      {/* PROFILE MODAL */}
      {showProfile && <ProfileModal close={() => setShowProfile(false)} />}

    </div>
  );
};

export default Landing;


/* ================= COMPONENTS ================= */

const FeatureCard = ({icon,title,text}) => (
  <div className="bg-white p-6 rounded-xl shadow hover:shadow-purple-200 hover:-translate-y-2 hover:scale-[1.02] transition duration-300 text-center">
    <div className="flex justify-center mb-4 text-purple-600">{icon}</div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{text}</p>
  </div>
);

const StepCard = ({step,title,text}) => (
  <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition">
    <p className="text-purple-500 font-semibold mb-2">Step {step}</p>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-600">{text}</p>
  </div>
);

const StatBox = ({number,text}) => (
  <div className="bg-white p-8 rounded-xl shadow hover:scale-110 transition duration-300">
    <h3 className="text-4xl font-bold text-purple-600 mb-2">{number}</h3>
    <p className="text-gray-600">{text}</p>
  </div>
);


/* ================= PROFILE MODAL ================= */

