

// // // // import { useNavigate } from "react-router-dom";
// // // // import { useState } from "react";
// // // // import { Eye, Activity, Monitor, Brain, UserCircle } from "lucide-react";
// // // // import ProfileModal from "../components/ProfileModal";
// // // // const Landing = () => {

// // // //   const navigate = useNavigate();
// // // //   const [showProfile, setShowProfile] = useState(false);

// // // //   return (

// // // //     <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-white">

// // // //       {/* ================= NAVBAR ================= */}

// // // //       <nav className="flex justify-between items-center px-12 py-6 bg-white/70 backdrop-blur-lg shadow-sm sticky top-0 z-50">

// // // //         <h1
// // // //           className="text-2xl font-bold text-purple-700 cursor-pointer"
// // // //           onClick={() => navigate("/")}
// // // //         >
// // // //           aAI-Site
// // // //         </h1>

// // // //         <div className="flex items-center gap-8 text-gray-700 font-medium">

// // // //           <button onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>
// // // //             Home
// // // //           </button>

// // // //           <button onClick={() =>
// // // //             document.getElementById("features")
// // // //             ?.scrollIntoView({behavior:"smooth"})
// // // //           }>
// // // //             Features
// // // //           </button>

// // // //           <button onClick={() =>
// // // //             document.getElementById("how")
// // // //             ?.scrollIntoView({behavior:"smooth"})
// // // //           }>
// // // //             How it Works
// // // //           </button>

// // // //           <button onClick={() => navigate("/monitor")}>
// // // //             Dashboard
// // // //           </button>

// // // //         </div>

// // // //         {/* PROFILE BUTTON */}
// // // //         <div
// // // //           onClick={() => setShowProfile(true)}
// // // //           className="flex items-center gap-2 cursor-pointer"
// // // //         >
// // // //           <UserCircle className="text-purple-600" size={30}/>
// // // //           <span className="text-gray-700">Profile</span>
// // // //         </div>

// // // //       </nav>


// // // //       {/* ================= HERO ================= */}

// // // //       {/* <section className="relative text-center mt-20 px-6 overflow-hidden">

// // // //         {/* Glow Background */}
// // // //         {/* <div className="absolute inset-0 -z-10">
// // // //           <div className="absolute w-[500px] h-[500px] bg-purple-300 blur-[120px] opacity-30 top-[-100px] left-1/2 -translate-x-1/2"></div>
// // // //         </div> */}
// // // // {/* 
// // // //         <h1 className="text-6xl font-bold text-gray-800 mb-6 leading-tight">
// // // //           AI Powered <br/>
// // // //           <span className="text-purple-600">Eye Health Monitoring</span>
// // // //         </h1>

// // // //         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
// // // //           Real-time AI system tracking blink rate, posture and fatigue.
// // // //         </p>

// // // //         <button
// // // //           onClick={() => navigate("/monitor")}
// // // //           className="mt-10 px-10 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-lg rounded-xl shadow-lg hover:scale-105 transition"
// // // //         >
// // // //           Start Monitoring 🚀
// // // //         </button>
// // // //       </section> */} 
// // // //       <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">

// // // //   {/* 🎬 VIDEO BACKGROUND */}
// // // //   <video
// // // //     autoPlay
// // // //     loop
// // // //     muted
// // // //     playsInline
// // // //     className="absolute top-0 left-0 w-full h-full object-cover"
// // // //   >
// // // //     <source src="Video.mp4" type="video/mp4" />
// // // //   </video>

// // // //   {/* 🔥 OVERLAY (VERY IMPORTANT) */}
// // // //   <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

// // // //   {/* 🧠 CONTENT */}
// // // //   <div className="relative z-10 px-6">

// // // //     <h1 className="text-6xl font-bold text-gray-800 mb-6 leading-tight">
// // // //       AI Powered <br/>
// // // //       <span className="text-purple-600">Eye Health Monitoring</span>
// // // //     </h1>

// // // //     <p className="text-lg text-gray-600 max-w-2xl mx-auto">
// // // //       Real-time AI system tracking blink rate, posture and fatigue.
// // // //     </p>

// // // //     <button
// // // //       onClick={() => navigate("/monitor")}
// // // //       className="mt-10 px-10 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-lg rounded-xl shadow-lg hover:scale-105 transition"
// // // //     >
// // // //       Start Monitoring 🚀
// // // //     </button>

// // // //   </div>

// // // // </section>


// // // //       {/* ================= FEATURES ================= */}

// // // //       <section id="features" className="mt-32 px-10 max-w-6xl mx-auto">

// // // //         <h2 className="text-3xl font-bold text-center mb-14">
// // // //           Key Features of aAI-Site
// // // //         </h2>

// // // //         <div className="grid md:grid-cols-4 gap-8">

// // // //           <FeatureCard icon={<Eye size={32}/>} title="Blink Detection" text="Tracks fatigue"/>

// // // //           <FeatureCard icon={<Monitor size={32}/>} title="Screen Distance" text="Maintains posture"/>

// // // //           <FeatureCard icon={<Activity size={32}/>} title="Eye Redness" text="Detect irritation"/>

// // // //           <FeatureCard icon={<Brain size={32}/>} title="AI Stress Score" text="Smart evaluation"/>

// // // //         </div>

// // // //       </section>


// // // //       {/* ================= HOW IT WORKS ================= */}

// // // //       <section id="how" className="mt-32 px-10">

// // // //         <h2 className="text-3xl font-bold text-center mb-4">
// // // //           How aAI-Site Works
// // // //         </h2>

// // // //         <p className="text-center text-gray-600 mb-14">
// // // //           Simple setup, powerful protection for your eyes.
// // // //         </p>

// // // //         <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">

// // // //           <StepCard step="01" title="Enable Camera" text="Grant webcam access"/>

// // // //           <StepCard step="02" title="Calibration" text="Quick setup"/>

// // // //           <StepCard step="03" title="Monitoring" text="AI protects your eyes"/>

// // // //         </div>

// // // //       </section>


// // // //       {/* ================= STATS ================= */}

// // // //       <section className="mt-32 text-center px-10">

// // // //         <h2 className="text-3xl font-bold mb-10">
// // // //           Why Eye Monitoring Matters
// // // //         </h2>

// // // //         <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">

// // // //           <StatBox number="60%" text="People face eye strain"/>

// // // //           <StatBox number="15-20" text="Ideal blink/min"/>

// // // //           <StatBox number="20-20-20" text="Break rule"/>

// // // //         </div>

// // // //       </section>


// // // //       {/* ================= CTA ================= */}

// // // //       <section className="mt-32 text-center pb-24">

// // // //         <h2 className="text-4xl font-bold mb-6">
// // // //           Start protecting your eyes today
// // // //         </h2>

// // // //         <p className="text-gray-500 mb-6">
// // // //           Join the future of AI health monitoring 🚀
// // // //         </p>

// // // //         <button
// // // //           onClick={() => navigate("/monitor")}
// // // //           className="px-12 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg rounded-xl shadow-lg hover:scale-105 transition"
// // // //         >
// // // //           Launch aAI-Site
// // // //         </button>

// // // //       </section>


// // // //       {/* ================= FOOTER ================= */}

// // // //       <footer className="bg-purple-600 text-white py-12 px-10">

// // // //         <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">

// // // //           <div>
// // // //             <h2 className="text-2xl font-bold mb-2">aAI-Site</h2>
// // // //             <p className="text-purple-200">
// // // //               AI powered eye health monitoring.
// // // //             </p>
// // // //           </div>

// // // //           <div>
// // // //             <h3 className="font-semibold mb-3">Navigation</h3>
// // // //             <ul className="space-y-2 text-purple-200">
// // // //               <li>Dashboard</li>
// // // //               <li>Features</li>
// // // //               <li>How it Works</li>
// // // //             </ul>
// // // //           </div>

// // // //           <div>
// // // //             <h3 className="font-semibold mb-3">Support</h3>
// // // //             <ul className="space-y-2 text-purple-200">
// // // //               <li>Help Center</li>
// // // //               <li>Contact</li>
// // // //             </ul>
// // // //           </div>

// // // //         </div>

// // // //       </footer>


// // // //       {/* PROFILE MODAL */}
// // // //       {showProfile && <ProfileModal close={() => setShowProfile(false)} />}

// // // //     </div>
// // // //   );
// // // // };

// // // // export default Landing;


// // // // /* ================= COMPONENTS ================= */

// // // // const FeatureCard = ({icon,title,text}) => (
// // // //   <div className="bg-white p-6 rounded-xl shadow hover:shadow-purple-200 hover:-translate-y-2 hover:scale-[1.02] transition duration-300 text-center">
// // // //     <div className="flex justify-center mb-4 text-purple-600">{icon}</div>
// // // //     <h3 className="font-semibold text-lg mb-2">{title}</h3>
// // // //     <p className="text-gray-600 text-sm">{text}</p>
// // // //   </div>
// // // // );

// // // // const StepCard = ({step,title,text}) => (
// // // //   <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition">
// // // //     <p className="text-purple-500 font-semibold mb-2">Step {step}</p>
// // // //     <h3 className="text-xl font-semibold mb-3">{title}</h3>
// // // //     <p className="text-gray-600">{text}</p>
// // // //   </div>
// // // // );

// // // // const StatBox = ({number,text}) => (
// // // //   <div className="bg-white p-8 rounded-xl shadow hover:scale-110 transition duration-300">
// // // //     <h3 className="text-4xl font-bold text-purple-600 mb-2">{number}</h3>
// // // //     <p className="text-gray-600">{text}</p>
// // // //   </div>
// // // // );


// // // // /* ================= PROFILE MODAL ================= */

// // import { useNavigate } from "react-router-dom";
// // import { useState } from "react";
// // import { Eye, Activity, Monitor, Brain, UserCircle } from "lucide-react";
// // import ProfileModal from "../components/ProfileModal";

// // const Landing = () => {
// //   const navigate = useNavigate();
// //   const [showProfile, setShowProfile] = useState(false);

// //   return (
// //     <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-white">

// //       {/* ================= NAVBAR ================= */}
// //       <nav className="flex justify-between items-center px-12 py-6 bg-white/70 backdrop-blur-lg shadow-sm sticky top-0 z-50">

// //         <h1
// //           className="text-2xl font-bold text-purple-700 cursor-pointer"
// //           onClick={() => navigate("/")}
// //         >
// //           aAI-Site
// //         </h1>

// //         {/* NAV LINKS */}
// //         <div className="flex items-center gap-6 text-gray-700 font-medium">

// //           <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
// //             Home
// //           </button>

// //           <button
// //             onClick={() =>
// //               document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
// //             }
// //           >
// //             Features
// //           </button>

// //           <button
// //             onClick={() =>
// //               document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })
// //             }
// //           >
// //             How it Works
// //           </button>

// //           {/* 🔐 LOGIN */}
// //           <button
// //             onClick={() => navigate("/login")}
// //             className="hover:text-purple-600"
// //           >
// //             Login
// //           </button>

// //           {/* 🆕 SIGNUP */}
// //           <button
// //             onClick={() => navigate("/signup")}
// //             className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700"
// //           >
// //             Sign Up
// //           </button>

// //           {/* DASHBOARD */}
// //           <button onClick={() => navigate("/monitor")}>
// //             Dashboard
// //           </button>
// //         </div>

// //         {/* PROFILE */}
// //         <div
// //           onClick={() => setShowProfile(true)}
// //           className="flex items-center gap-2 cursor-pointer"
// //         >
// //           <UserCircle className="text-purple-600" size={30} />
// //           <span className="text-gray-700">Profile</span>
// //         </div>
// //       </nav>

// //       {/* ================= HERO ================= */}
// //       <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">

// //         {/* VIDEO */}
// //         <video
// //           autoPlay
// //           loop
// //           muted
// //           playsInline
// //           className="absolute top-0 left-0 w-full h-full object-cover"
// //         >
// //           <source src="/Video.mp4" type="video/mp4" />
// //         </video>

// //         {/* OVERLAY */}
// //         <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

// //         {/* CONTENT */}
// //         <div className="relative z-10 px-6">

// //           <h1 className="text-6xl font-bold text-gray-800 mb-6 leading-tight">
// //             AI Powered <br />
// //             <span className="text-purple-600">Eye Health Monitoring</span>
// //           </h1>

// //           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
// //             Real-time AI system tracking blink rate, posture and fatigue.
// //           </p>

// //           <button
// //             onClick={() => navigate("/monitor")}
// //             className="mt-10 px-10 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-lg rounded-xl shadow-lg hover:scale-105 transition"
// //           >
// //             Start Monitoring 🚀
// //           </button>
// //         </div>
// //       </section>

// //       {/* ================= FEATURES ================= */}
// //       <section id="features" className="mt-32 px-10 max-w-6xl mx-auto">
// //         <h2 className="text-3xl font-bold text-center mb-14">
// //           Key Features of aAI-Site
// //         </h2>

// //         <div className="grid md:grid-cols-4 gap-8">
// //           <FeatureCard icon={<Eye size={32} />} title="Blink Detection" text="Tracks fatigue" />
// //           <FeatureCard icon={<Monitor size={32} />} title="Screen Distance" text="Maintains posture" />
// //           <FeatureCard icon={<Activity size={32} />} title="Eye Redness" text="Detect irritation" />
// //           <FeatureCard icon={<Brain size={32} />} title="AI Stress Score" text="Smart evaluation" />
// //         </div>
// //       </section>

// //       {/* ================= HOW ================= */}
// //       <section id="how" className="mt-32 px-10">
// //         <h2 className="text-3xl font-bold text-center mb-4">
// //           How aAI-Site Works
// //         </h2>

// //         <p className="text-center text-gray-600 mb-14">
// //           Simple setup, powerful protection for your eyes.
// //         </p>

// //         <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
// //           <StepCard step="01" title="Enable Camera" text="Grant webcam access" />
// //           <StepCard step="02" title="Calibration" text="Quick setup" />
// //           <StepCard step="03" title="Monitoring" text="AI protects your eyes" />
// //         </div>
// //       </section>

// //       {/* PROFILE MODAL */}
// //       {showProfile && <ProfileModal close={() => setShowProfile(false)} />}
// //     </div>
// //   );
// // };

// // export default Landing;

// // /* COMPONENTS */

// // const FeatureCard = ({ icon, title, text }) => (
// //   <div className="bg-white p-6 rounded-xl shadow text-center">
// //     <div className="flex justify-center mb-4 text-purple-600">{icon}</div>
// //     <h3 className="font-semibold text-lg mb-2">{title}</h3>
// //     <p className="text-gray-600 text-sm">{text}</p>
// //   </div>
// // );

// // const StepCard = ({ step, title, text }) => (
// //   <div className="bg-white p-8 rounded-xl shadow">
// //     <p className="text-purple-500 font-semibold mb-2">Step {step}</p>
// //     <h3 className="text-xl font-semibold mb-3">{title}</h3>
// //     <p className="text-gray-600">{text}</p>
// //   </div>
// // );



// // // import { useNavigate } from "react-router-dom";
// // // import WebcamFeed from "../components/WebcamFeed";
// // // import { ArrowLeft } from "lucide-react";
// // // import { supabase } from "../lib/supabase";
// // // import { useState, useEffect, useRef } from "react";

// // // const Dashboard = () => {
// // //   const navigate = useNavigate();
// // //   const badStartRef = useRef(null);

// // //   const [isMonitoring, setIsMonitoring] = useState(false);
// // //   const [blinkRate, setBlinkRate] = useState(0);
// // //   const [distance, setDistance] = useState("unknown");
// // //   const [expression, setExpression] = useState("neutral");
// // //   const [redness, setRedness] = useState("normal");
// // //   const [headPosition, setHeadPosition] = useState("aligned");
// // //   const [stressScore, setStressScore] = useState(100);
// // //   const [screenTime, setScreenTime] = useState(0);

// // //   const historyRef = useRef({ blink: [], stress: [] });
// // //   const intervalRef = useRef(null);

// // //   const handleLogout = async () => {
// // //     await supabase.auth.signOut();
// // //     navigate("/login");
// // //   };

// // //   const sendNotification = (message) => {
// // //     if ("Notification" in window && Notification.permission === "granted") {
// // //       new Notification("aAI Alert 🚨", { body: message });
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     if (!isMonitoring) return;
// // //     const timer = setInterval(() => {
// // //       setScreenTime((prev) => prev + 1);
// // //     }, 60000);
// // //     return () => clearInterval(timer);
// // //   }, [isMonitoring]);

// // //   useEffect(() => {
// // //     if (!isMonitoring) return;
// // //     const collector = setInterval(() => {
// // //       historyRef.current.blink.push(blinkRate);
// // //       historyRef.current.stress.push(stressScore);
// // //     }, 1000);
// // //     return () => clearInterval(collector);
// // //   }, [isMonitoring, blinkRate, stressScore]);

// // //   useEffect(() => {
// // //     if (!isMonitoring) return;

// // //     const isBad =
// // //       stressScore < 40 ||
// // //       headPosition === "tilted" ||
// // //       distance === "too close";

// // //     if (isBad) {
// // //       if (!badStartRef.current) {
// // //         badStartRef.current = Date.now();
// // //       }

// // //       if (Date.now() - badStartRef.current > 10000) {
// // //         sendNotification("Take care of your eyes 👀");
// // //         badStartRef.current = null;
// // //       }
// // //     } else {
// // //       badStartRef.current = null;
// // //     }
// // //   }, [stressScore, headPosition, distance, isMonitoring]);

// // //   const saveSessionToDB = async () => {
// // //     try {
// // //       const history = historyRef.current;
// // //       if (history.blink.length === 0) return;

// // //       const avgBlink =
// // //         history.blink.reduce((a, b) => a + b, 0) / history.blink.length;

// // //       const avgStress =
// // //         history.stress.reduce((a, b) => a + b, 0) / history.stress.length;

// // //       const { data: userData } = await supabase.auth.getUser();
// // //       if (!userData?.user) return;

// // //       await supabase.from("sessions").insert([
// // //         {
// // //           user_id: userData.user.id,
// // //           blink_rate: Math.round(avgBlink),
// // //           stress_score: Math.round(avgStress),
// // //           screen_time: screenTime,
// // //           distance,
// // //           head_position: headPosition,
// // //           expression,
// // //           redness,
// // //         },
// // //       ]);

// // //       historyRef.current = { blink: [], stress: [] };
// // //     } catch (err) {
// // //       console.error(err);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     if (isMonitoring) {
// // //       if (!intervalRef.current) {
// // //         intervalRef.current = setInterval(saveSessionToDB, 300000);
// // //       }
// // //     } else {
// // //       clearInterval(intervalRef.current);
// // //       intervalRef.current = null;
// // //     }

// // //     return () => clearInterval(intervalRef.current);
// // //   }, [isMonitoring]);

// // //   const handleToggleMonitoring = async () => {
// // //     const { data } = await supabase.auth.getUser();

// // //     if (!data.user) {
// // //       navigate("/login");
// // //       return;
// // //     }

// // //     if (isMonitoring) await saveSessionToDB();
// // //     setIsMonitoring((prev) => !prev);
// // //   };

// // //   const formatTime = (min) =>
// // //     min < 60 ? `${min} min` : `${Math.floor(min / 60)}h ${min % 60}m`;

// // //   const getScoreColor = () =>
// // //     stressScore >= 70
// // //       ? "text-green-500"
// // //       : stressScore >= 40
// // //       ? "text-yellow-500"
// // //       : "text-red-500";

// // //   return (
// // //     <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-white px-10 py-8">

// // //       {/* HEADER */}
// // //       <div className="flex justify-between items-center mb-12">

// // //         <button
// // //           onClick={() => navigate("/")}
// // //           className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition"
// // //         >
// // //           <ArrowLeft size={18} />
// // //           Back
// // //         </button>

// // //         <h1 className="text-4xl font-bold text-purple-700">
// // //           aAI Dashboard
// // //         </h1>

// // //         <div className="flex gap-6 font-medium text-gray-700">
// // //           <button
// // //             onClick={() => navigate("/progress")}
// // //             className="hover:text-purple-600 transition"
// // //           >
// // //             Progress
// // //           </button>

// // //           <button
// // //             onClick={handleLogout}
// // //             className="text-red-500 hover:text-red-600 transition"
// // //           >
// // //             Logout
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* GRID */}
// // //       <div className="grid md:grid-cols-3 gap-8">

// // //         {/* CAMERA */}
// // //         <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">

// // //           <h2 className="text-lg font-semibold mb-4 text-gray-800">
// // //             Camera
// // //           </h2>

// // //           <div className="h-[260px] bg-black rounded-xl flex items-center justify-center text-gray-400">
// // //             {isMonitoring ? (
// // //               <WebcamFeed
// // //                 setBlinkRate={setBlinkRate}
// // //                 setDistance={setDistance}
// // //                 setRedness={setRedness}
// // //                 setStressScore={setStressScore}
// // //                 setHeadPosition={setHeadPosition}
// // //                 setExpression={setExpression}
// // //               />
// // //             ) : (
// // //               "Camera Off"
// // //             )}
// // //           </div>

// // //           <button
// // //             onClick={handleToggleMonitoring}
// // //             className={`mt-5 w-full py-3 rounded-xl text-white font-medium shadow transition ${
// // //               isMonitoring
// // //                 ? "bg-red-500 hover:bg-red-600"
// // //                 : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-[1.02]"
// // //             }`}
// // //           >
// // //             {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
// // //           </button>
// // //         </div>

// // //         {/* STRESS */}
// // //         <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">

// // //           <h2 className="text-lg font-semibold mb-4 text-gray-800">
// // //             Stress Score
// // //           </h2>

// // //           <div className={`text-6xl font-bold ${getScoreColor()}`}>
// // //             {stressScore}
// // //           </div>

// // //           <p className="text-gray-500 mt-2 text-sm">
// // //             Real-time AI analysis
// // //           </p>
// // //         </div>

// // //         {/* METRICS */}
// // //         <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">

// // //           <h2 className="text-lg font-semibold mb-4 text-gray-800">
// // //             Metrics
// // //           </h2>

// // //           <Metric label="Screen Time" value={formatTime(screenTime)} />
// // //           <Metric label="Blink Rate" value={blinkRate} />
// // //           <Metric label="Distance" value={distance} />
// // //           <Metric label="Head Position" value={headPosition} />
// // //           <Metric label="Expression" value={expression} />
// // //           <Metric label="Redness" value={redness} />
// // //         </div>

// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;

// // // const Metric = ({ label, value }) => (
// // //   <div className="flex justify-between py-3 border-b text-sm">
// // //     <span className="text-gray-600">{label}</span>
// // //     <span className="font-medium text-gray-800">{value}</span>
// // //   </div>
// // // );



// import { useNavigate } from "react-router-dom";
// import WebcamFeed from "../components/WebcamFeed";
// import { ArrowLeft } from "lucide-react";
// import { supabase } from "../lib/supabase";
// import { useState, useEffect, useRef } from "react";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const badStartRef = useRef(null);

//   const [isMonitoring, setIsMonitoring] = useState(false);
//   const [blinkRate, setBlinkRate] = useState(0);
//   const [distance, setDistance] = useState("unknown");
//   const [expression, setExpression] = useState("neutral");
//   const [redness, setRedness] = useState("normal");
//   const [headPosition, setHeadPosition] = useState("aligned");
//   const [stressScore, setStressScore] = useState(100);
//   const [screenTime, setScreenTime] = useState(0);

//   const historyRef = useRef({ blink: [], stress: [] });
//   const intervalRef = useRef(null);

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     navigate("/login");
//   };

//   const sendNotification = (message) => {
//     if ("Notification" in window && Notification.permission === "granted") {
//       new Notification("aAI Alert 🚨", { body: message });
//     }
//   };

//   useEffect(() => {
//     if (!isMonitoring) return;
//     const timer = setInterval(() => {
//       setScreenTime((prev) => prev + 1);
//     }, 60000);
//     return () => clearInterval(timer);
//   }, [isMonitoring]);

//   useEffect(() => {
//     if (!isMonitoring) return;
//     const collector = setInterval(() => {
//       historyRef.current.blink.push(blinkRate);
//       historyRef.current.stress.push(stressScore);
//     }, 1000);
//     return () => clearInterval(collector);
//   }, [isMonitoring, blinkRate, stressScore]);

//   useEffect(() => {
//     if (!isMonitoring) return;

//     const isBad =
//       stressScore < 40 ||
//       headPosition === "tilted" ||
//       distance === "too close";

//     if (isBad) {
//       if (!badStartRef.current) {
//         badStartRef.current = Date.now();
//       }

//       if (Date.now() - badStartRef.current > 10000) {
//         sendNotification("Take care of your eyes 👀");
//         badStartRef.current = null;
//       }
//     } else {
//       badStartRef.current = null;
//     }
//   }, [stressScore, headPosition, distance, isMonitoring]);

//   const saveSessionToDB = async () => {
//     try {
//       const history = historyRef.current;
//       if (history.blink.length === 0) return;

//       const avgBlink =
//         history.blink.reduce((a, b) => a + b, 0) / history.blink.length;

//       const avgStress =
//         history.stress.reduce((a, b) => a + b, 0) / history.stress.length;

//       const { data: userData } = await supabase.auth.getUser();
//       if (!userData?.user) return;

//       await supabase.from("sessions").insert([
//         {
//           user_id: userData.user.id,
//           blink_rate: Math.round(avgBlink),
//           stress_score: Math.round(avgStress),
//           screen_time: screenTime,
//           distance,
//           head_position: headPosition,
//           expression,
//           redness,
//         },
//       ]);

//       historyRef.current = { blink: [], stress: [] };
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     if (isMonitoring) {
//       if (!intervalRef.current) {
//         intervalRef.current = setInterval(saveSessionToDB, 300000);
//       }
//     } else {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }

//     return () => clearInterval(intervalRef.current);
//   }, [isMonitoring]);

//   const handleToggleMonitoring = async () => {
//     const { data } = await supabase.auth.getUser();

//     if (!data.user) {
//       navigate("/login");
//       return;
//     }

//     if (isMonitoring) await saveSessionToDB();
//     setIsMonitoring((prev) => !prev);
//   };

//   const formatTime = (min) =>
//     min < 60 ? `${min} min` : `${Math.floor(min / 60)}h ${min % 60}m`;

//   const getScoreColor = () =>
//     stressScore >= 70
//       ? "text-green-400"
//       : stressScore >= 40
//       ? "text-yellow-400"
//       : "text-red-400";

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] px-10 py-8 text-white">

//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-12">

//         <button
//           onClick={() => navigate("/")}
//           className="flex items-center gap-2 text-gray-400 hover:text-white transition"
//         >
//           <ArrowLeft size={18} />
//           Back
//         </button>

//         <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
//           aAI Dashboard
//         </h1>

//         <div className="flex gap-6 font-medium">
//           <button
//             onClick={() => navigate("/progress")}
//             className="text-gray-300 hover:text-purple-400 transition"
//           >
//             Progress
//           </button>

//           <button
//             onClick={handleLogout}
//             className="text-red-400 hover:text-red-500 transition"
//           >
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* GRID */}
//       <div className="grid md:grid-cols-3 gap-8">

//         {/* CAMERA */}
//         <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-lg">

//           <h2 className="text-lg font-semibold mb-4 text-purple-300">
//             Camera
//           </h2>

//           <div className="h-[260px] bg-black rounded-xl flex items-center justify-center text-gray-400">
//             {isMonitoring ? (
//               <WebcamFeed
//                 setBlinkRate={setBlinkRate}
//                 setDistance={setDistance}
//                 setRedness={setRedness}
//                 setStressScore={setStressScore}
//                 setHeadPosition={setHeadPosition}
//                 setExpression={setExpression}
//               />
//             ) : (
//               "Camera Off"
//             )}
//           </div>

//           <button
//             onClick={handleToggleMonitoring}
//             className={`mt-5 w-full py-3 rounded-xl text-white font-medium transition ${
//               isMonitoring
//                 ? "bg-red-500 hover:bg-red-600"
//                 : "bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-[1.02]"
//             }`}
//           >
//             {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
//           </button>
//         </div>

//         {/* STRESS */}
//         <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-lg text-center">

//           <h2 className="text-lg font-semibold mb-4 text-purple-300">
//             Stress Score
//           </h2>

//           <div className={`text-6xl font-bold ${getScoreColor()}`}>
//             {stressScore}
//           </div>

//           <p className="text-gray-400 mt-2 text-sm">
//             Real-time AI analysis
//           </p>
//         </div>

//         {/* METRICS */}
//         <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-lg">

//           <h2 className="text-lg font-semibold mb-4 text-purple-300">
//             Metrics
//           </h2>

//           <Metric label="Screen Time" value={formatTime(screenTime)} />
//           <Metric label="Blink Rate" value={blinkRate} />
//           <Metric label="Distance" value={distance} />
//           <Metric label="Head Position" value={headPosition} />
//           <Metric label="Expression" value={expression} />
//           <Metric label="Redness" value={redness} />
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// const Metric = ({ label, value }) => (
//   <div className="flex justify-between py-3 border-b border-white/10 text-sm">
//     <span className="text-gray-400">{label}</span>
//     <span className="font-medium text-white">{value}</span>
//   </div>
// );




import { useNavigate } from "react-router-dom";
import WebcamFeed from "../components/WebcamFeed";
import { ArrowLeft } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useState, useEffect, useRef } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const badStartRef = useRef(null);

  const [isMonitoring, setIsMonitoring] = useState(false);
  const [blinkRate, setBlinkRate] = useState(0);
  const [distance, setDistance] = useState("unknown");
  const [expression, setExpression] = useState("neutral");
  const [redness, setRedness] = useState("normal");
  const [headPosition, setHeadPosition] = useState("aligned");
  const [stressScore, setStressScore] = useState(100);
  const [screenTime, setScreenTime] = useState(0);

  const historyRef = useRef({ blink: [], stress: [] });
  const intervalRef = useRef(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const sendNotification = (message) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("aAI Alert 🚨", { body: message });
    }
  };

  useEffect(() => {
    if (!isMonitoring) return;
    const timer = setInterval(() => {
      setScreenTime((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(timer);
  }, [isMonitoring]);

  useEffect(() => {
    if (!isMonitoring) return;
    const collector = setInterval(() => {
      historyRef.current.blink.push(blinkRate);
      historyRef.current.stress.push(stressScore);
    }, 1000);
    return () => clearInterval(collector);
  }, [isMonitoring, blinkRate, stressScore]);

  useEffect(() => {
    if (!isMonitoring) return;

    const isBad =
      stressScore < 40 ||
      headPosition === "tilted" ||
      distance === "too close";

    if (isBad) {
      if (!badStartRef.current) {
        badStartRef.current = Date.now();
      }

      if (Date.now() - badStartRef.current > 10000) {
        sendNotification("Take care of your eyes 👀");
        badStartRef.current = null;
      }
    } else {
      badStartRef.current = null;
    }
  }, [stressScore, headPosition, distance, isMonitoring]);

  const saveSessionToDB = async () => {
    try {
      const history = historyRef.current;
      if (history.blink.length === 0) return;

      const avgBlink =
        history.blink.reduce((a, b) => a + b, 0) / history.blink.length;

      const avgStress =
        history.stress.reduce((a, b) => a + b, 0) / history.stress.length;

      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      await supabase.from("sessions").insert([
        {
          user_id: userData.user.id,
          blink_rate: Math.round(avgBlink),
          stress_score: Math.round(avgStress),
          screen_time: screenTime,
          distance,
          head_position: headPosition,
          expression,
          redness,
        },
      ]);

      historyRef.current = { blink: [], stress: [] };
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isMonitoring) {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(saveSessionToDB, 300000);
      }
    } else {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => clearInterval(intervalRef.current);
  }, [isMonitoring]);

  const handleToggleMonitoring = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      navigate("/login");
      return;
    }

    if (isMonitoring) await saveSessionToDB();
    setIsMonitoring((prev) => !prev);
  };

  const formatTime = (min) =>
    min < 60 ? `${min} min` : `${Math.floor(min / 60)}h ${min % 60}m`;

  const getScoreColor = () =>
    stressScore >= 70
      ? "text-green-500"
      : stressScore >= 40
      ? "text-yellow-500"
      : "text-red-500";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-white px-10 py-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-12">

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 className="text-4xl font-bold text-purple-700">
          aAI Dashboard
        </h1>

        <div className="flex gap-6 font-medium text-gray-700">
          <button
            onClick={() => navigate("/progress")}
            className="hover:text-purple-600 transition"
          >
            Progress
          </button>

          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-8">

        {/* CAMERA */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">

          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Camera
          </h2>

          <div className="h-[260px] bg-black rounded-xl flex items-center justify-center text-gray-400">
            {isMonitoring ? (
              <WebcamFeed
                setBlinkRate={setBlinkRate}
                setDistance={setDistance}
                setRedness={setRedness}
                setStressScore={setStressScore}
                setHeadPosition={setHeadPosition}
                setExpression={setExpression}
              />
            ) : (
              "Camera Off"
            )}
          </div>

          <button
            onClick={handleToggleMonitoring}
            className={`mt-5 w-full py-3 rounded-xl text-white font-medium shadow transition ${
              isMonitoring
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-[1.02]"
            }`}
          >
            {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
          </button>
        </div>

        {/* STRESS */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">

          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Stress Score
          </h2>

          <div className={`text-6xl font-bold ${getScoreColor()}`}>
            {stressScore}
          </div>

          <p className="text-gray-500 mt-2 text-sm">
            Real-time AI analysis
          </p>
        </div>

        {/* METRICS */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">

          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Metrics
          </h2>

          <Metric label="Screen Time" value={formatTime(screenTime)} />
          <Metric label="Blink Rate" value={blinkRate} />
          <Metric label="Distance" value={distance} />
          <Metric label="Head Position" value={headPosition} />
          <Metric label="Expression" value={expression} />
          <Metric label="Redness" value={redness} />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

const Metric = ({ label, value }) => (
  <div className="flex justify-between py-3 border-b text-sm">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium text-gray-800">{value}</span>
  </div>
);
