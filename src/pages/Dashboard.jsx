// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import WebcamFeed from "../components/WebcamFeed";
// import { ArrowLeft } from "lucide-react";
// import { supabase } from "../lib/supabase";

// const Dashboard = () => {
//   const navigate = useNavigate();

//   // 🔐 Auth states
//   const [showAuthPopup, setShowAuthPopup] = useState(false);
//   const [pendingStart, setPendingStart] = useState(false);

//   // 🎛️ Monitoring
//   const [isMonitoring, setIsMonitoring] = useState(false);

//   // 📊 Metrics
//   const [blinkRate, setBlinkRate] = useState(0);
//   const [distance, setDistance] = useState("unknown");
//   const [expression, setExpression] = useState("neutral");
//   const [redness, setRedness] = useState("normal");
//   const [headPosition, setHeadPosition] = useState("aligned");
//   const [stressScore, setStressScore] = useState(100);
//   const [screenTime, setScreenTime] = useState(0);

//   const latestData = useRef({});
//   const intervalRef = useRef(null);

//   // 🔥 Sync latest values
//   useEffect(() => {
//     latestData.current = {
//       blinkRate,
//       stressScore,
//       screenTime,
//       distance,
//       headPosition,
//       expression,
//       redness,
//     };
//   }, [blinkRate, stressScore, screenTime, distance, headPosition, expression, redness]);

//   // ⏱️ Screen time tracker
//   useEffect(() => {
//     if (!isMonitoring) return;

//     const timer = setInterval(() => {
//       setScreenTime((prev) => prev + 1);
//     }, 60000);

//     return () => clearInterval(timer);
//   }, [isMonitoring]);

//   // 🧠 Save session
//   const saveSessionToDB = async () => {
//     try {
//       const data = latestData.current;

//       if (data.screenTime === 0) return;

//       const { data: userData } = await supabase.auth.getUser();
//       const user = userData?.user;

//       if (!user) return;

//       const { error } = await supabase.from("sessions").insert([
//         {
//           user_id: user.id,
//           blink_rate: data.blinkRate,
//           stress_score: data.stressScore,
//           screen_time: data.screenTime,
//           distance: data.distance,
//           head_position: data.headPosition,
//           expression: data.expression,
//           redness: data.redness,
//         },
//       ]);

//       if (error) console.error("❌ Save error:", error);
//       else console.log("✅ Data saved");
//     } catch (err) {
//       console.error("🔥 Crash:", err);
//     }
//   };

//   // 🔥 Auto save every 5 min
//   useEffect(() => {
//     if (isMonitoring) {
//       if (!intervalRef.current) {
//         intervalRef.current = setInterval(() => {
//           saveSessionToDB();
//         }, 300000); // 5 min
//       }
//     } else {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }

//     return () => clearInterval(intervalRef.current);
//   }, [isMonitoring]);

//   // 🎛️ Toggle Monitoring
//   const handleToggleMonitoring = async () => {
//     try {
//       const { data } = await supabase.auth.getUser();

//       if (!data.user) {
//         setPendingStart(true);
//         setShowAuthPopup(true);
//         return;
//       }

//       if (isMonitoring) {
//         await saveSessionToDB();
//       }

//       setIsMonitoring((prev) => !prev);
//     } catch (err) {
//       console.error("Toggle error:", err);
//     }
//   };

//   // 🔥 Auto start after login
//   useEffect(() => {
//     const checkUser = async () => {
//       const { data } = await supabase.auth.getUser();

//       if (data.user && pendingStart) {
//         setIsMonitoring(true);
//         setPendingStart(false);
//       }
//     };

//     checkUser();
//   }, [pendingStart]);

//   const formatTime = (min) =>
//     min < 60 ? `${min} min` : `${Math.floor(min / 60)}h ${min % 60}m`;

//   const getScoreColor = () =>
//     stressScore >= 70
//       ? "text-green-500"
//       : stressScore >= 40
//       ? "text-yellow-500"
//       : "text-red-500";

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 px-10 py-8">

//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-10">
//         <button
//           onClick={() => navigate("/")}
//           className="flex items-center gap-2 text-gray-600"
//         >
//           <ArrowLeft size={18} /> Back
//         </button>

//         <h1 className="text-3xl font-bold text-purple-600">
//           aAI Dashboard
//         </h1>

//         <button
//           onClick={() => navigate("/progress")}
//           className="text-purple-600 font-medium"
//         >
//           Progress
//         </button>
//       </div>

//       {/* GRID */}
//       <div className="grid grid-cols-3 gap-8">

//         {/* CAMERA */}
//         <div className="bg-white p-6 rounded-xl shadow">
//           <h2 className="font-semibold mb-3">Camera</h2>

//           <div className="h-[300px] bg-black rounded-xl overflow-hidden flex items-center justify-center text-white">
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
//             className={`mt-4 w-full py-2 rounded text-white ${
//               isMonitoring ? "bg-red-500" : "bg-purple-500"
//             }`}
//           >
//             {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
//           </button>
//         </div>

//         {/* STRESS */}
//         <div className="bg-white p-6 rounded-xl shadow text-center">
//           <h2 className="font-semibold mb-3">Stress Score</h2>

//           <div className={`text-5xl font-bold ${getScoreColor()}`}>
//             {stressScore}
//           </div>
//         </div>

//         {/* METRICS */}
//         <div className="bg-white p-6 rounded-xl shadow">
//           <Metric label="Screen Time" value={formatTime(screenTime)} />
//           <Metric label="Blink Rate" value={`${blinkRate}`} />
//           <Metric label="Distance" value={distance} />
//           <Metric label="Head Position" value={headPosition} />
//           <Metric label="Expression" value={expression} />
//           <Metric label="Redness" value={redness} />
//         </div>

//       </div>

//       {/* 🐱 BILLI */}
//       <div className="flex justify-center mt-6">
//         <div className="w-[220px] h-[260px] rounded-xl overflow-hidden shadow">
//           <video autoPlay loop muted className="w-full h-full object-cover">
//             <source src="/billi.mp4" type="video/mp4" />
//           </video>
//         </div>
//       </div>

//       {/* 🔐 AUTH POPUP */}
//       {showAuthPopup && (
//         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-xl text-center space-y-4 shadow-lg">

//             <h2 className="text-lg font-bold text-purple-600">
//               Login Required 🔐
//             </h2>

//             <p className="text-sm text-gray-600">
//               Monitoring start karne ke liye login karo bro 😏
//             </p>

//             <div className="flex gap-3 justify-center">
//               <button
//                 onClick={() => navigate("/login")}
//                 className="bg-purple-500 text-white px-4 py-2 rounded"
//               >
//                 Login
//               </button>

//               <button
//                 onClick={() => navigate("/signup")}
//                 className="border px-4 py-2 rounded"
//               >
//                 Sign Up
//               </button>
//             </div>

//             <button
//               onClick={() => setShowAuthPopup(false)}
//               className="text-sm text-gray-500"
//             >
//               Cancel
//             </button>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

// // 📊 Metric Component
// const Metric = ({ label, value }) => (
//   <div className="flex justify-between py-2 text-sm">
//     <span className="text-gray-600">{label}</span>
//     <span>{value}</span>
//   </div>
// // );
// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import WebcamFeed from "../components/WebcamFeed";
// import { ArrowLeft } from "lucide-react";
// import { supabase } from "../lib/supabase";
// const badStartRef = useRef(null);
// const Dashboard = () => {
//   const navigate = useNavigate();

//   // 🔐 Auth states
//   const [showAuthPopup, setShowAuthPopup] = useState(false);
//   const [pendingStart, setPendingStart] = useState(false);

//   // 🎛️ Monitoring
//   const [isMonitoring, setIsMonitoring] = useState(false);

//   // 📊 Metrics
//   const [blinkRate, setBlinkRate] = useState(0);
//   const [distance, setDistance] = useState("unknown");
//   const [expression, setExpression] = useState("neutral");
//   const [redness, setRedness] = useState("normal");
//   const [headPosition, setHeadPosition] = useState("aligned");
//   const [stressScore, setStressScore] = useState(100);
//   const [screenTime, setScreenTime] = useState(0);

//   const latestData = useRef({});
//   const intervalRef = useRef(null);

//   // 🔥 Logout function
//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     navigate("/login");
//   };
// const sendNotification = (message) => {
//   if (Notification.permission === "granted") {
//     new Notification("aAI Alert 🚨", {
//       body: message,
//     });
//   }
// };
//   // 🔥 Sync latest values
//   useEffect(() => {
//     latestData.current = {
//       blinkRate,
//       stressScore,
//       screenTime,
//       distance,
//       headPosition,
//       expression,
//       redness,
//     };
//   }, [blinkRate, stressScore, screenTime, distance, headPosition, expression, redness]);

//   // ⏱️ Screen time tracker
//   useEffect(() => {
//     if (!isMonitoring) return;

//     const timer = setInterval(() => {
//       setScreenTime((prev) => prev + 1);
//     }, 60000);

//     return () => clearInterval(timer);
//   }, [isMonitoring]);

//   // 🧠 Save session
//   const saveSessionToDB = async () => {
//     try {
//       const data = latestData.current;

//       if (data.screenTime === 0) return;

//       const { data: userData } = await supabase.auth.getUser();
//       const user = userData?.user;

//       if (!user) return;

//       const { error } = await supabase.from("sessions").insert([
//         {
//           user_id: user.id,
//           blink_rate: data.blinkRate,
//           stress_score: data.stressScore,
//           screen_time: data.screenTime,
//           distance: data.distance,
//           head_position: data.headPosition,
//           expression: data.expression,
//           redness: data.redness,
//         },
//       ]);

//       if (error) console.error("❌ Save error:", error);
//       else console.log("✅ Data saved");
//     } catch (err) {
//       console.error("🔥 Crash:", err);
//     }
//   };
//   useEffect(() => {
//   if (!isMonitoring) return;

//   const isBad =
//     stressScore < 40 ||
//     headPosition === "tilted" ||
//     distance === "too close";

//   if (isBad) {
//     if (!badStartRef.current) {
//       badStartRef.current = Date.now();
//     }

//     const duration = Date.now() - badStartRef.current;

//     // 🔥 TEST MODE: 10 sec
//     if (duration > 10000) {
//       let msg = "";

//       if (stressScore < 40) msg = "High eye strain detected 👀";
//       else if (headPosition === "tilted") msg = "Fix your posture 🧍";
//       else if (distance === "too close") msg = "Move away from screen 📏";

//       sendNotification(msg);

//       // reset to avoid spam
//       badStartRef.current = null;
//     }
//   } else {
//     badStartRef.current = null;
//   }
// }, [stressScore, headPosition, distance, isMonitoring]);
//   // 🔥 Auto save every 5 min
//   useEffect(() => {
//     if (isMonitoring) {
//       if (!intervalRef.current) {
//         intervalRef.current = setInterval(() => {
//           saveSessionToDB();
//         }, 300000);
//       }
//     } else {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }

//     return () => clearInterval(intervalRef.current);
//   }, [isMonitoring]);

//   // 🎛️ Toggle Monitoring
//   const handleToggleMonitoring = async () => {
//     try {
//       const { data } = await supabase.auth.getUser();

//       if (!data.user) {
//         setPendingStart(true);
//         setShowAuthPopup(true);
//         return;
//       }

//       if (isMonitoring) {
//         await saveSessionToDB();
//       }

//       setIsMonitoring((prev) => !prev);
//     } catch (err) {
//       console.error("Toggle error:", err);
//     }
//   };

//   // 🔥 Auto start after login
//   useEffect(() => {
//     const checkUser = async () => {
//       const { data } = await supabase.auth.getUser();

//       if (data.user && pendingStart) {
//         setIsMonitoring(true);
//         setPendingStart(false);
//       }
//     };

//     checkUser();
//   }, [pendingStart]);

//   const formatTime = (min) =>
//     min < 60 ? `${min} min` : `${Math.floor(min / 60)}h ${min % 60}m`;

//   const getScoreColor = () =>
//     stressScore >= 70
//       ? "text-green-500"
//       : stressScore >= 40
//       ? "text-yellow-500"
//       : "text-red-500";

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 px-10 py-8">

//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-10">

//         <button
//           onClick={() => navigate("/")}
//           className="flex items-center gap-2 text-gray-600"
//         >
//           <ArrowLeft size={18} /> Back
//         </button>

//         <h1 className="text-3xl font-bold text-purple-600">
//           aAI Dashboard
//         </h1>

//         <div className="flex gap-4 items-center">
//           <button
//             onClick={() => navigate("/progress")}
//             className="text-purple-600 font-medium"
//           >
//             Progress
//           </button>

//           {/* 🔥 LOGOUT BUTTON */}
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
//           >
//             Logout
//           </button>
//         </div>

//       </div>

//       {/* GRID */}
//       <div className="grid grid-cols-3 gap-8">

//         {/* CAMERA */}
//         <div className="bg-white p-6 rounded-xl shadow">
//           <h2 className="font-semibold mb-3">Camera</h2>

//           <div className="h-[300px] bg-black rounded-xl overflow-hidden flex items-center justify-center text-white">
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
//             className={`mt-4 w-full py-2 rounded text-white ${
//               isMonitoring ? "bg-red-500" : "bg-purple-500"
//             }`}
//           >
//             {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
//           </button>
//         </div>

//         {/* STRESS */}
//         <div className="bg-white p-6 rounded-xl shadow text-center">
//           <h2 className="font-semibold mb-3">Stress Score</h2>

//           <div className={`text-5xl font-bold ${getScoreColor()}`}>
//             {stressScore}
//           </div>
//         </div>

//         {/* METRICS */}
//         <div className="bg-white p-6 rounded-xl shadow">
//           <Metric label="Screen Time" value={formatTime(screenTime)} />
//           <Metric label="Blink Rate" value={`${blinkRate}`} />
//           <Metric label="Distance" value={distance} />
//           <Metric label="Head Position" value={headPosition} />
//           <Metric label="Expression" value={expression} />
//           <Metric label="Redness" value={redness} />
//         </div>

//       </div>

//       {/* 🐱 BILLI */}
//       <div className="flex justify-center mt-6">
//         <div className="w-[220px] h-[260px] rounded-xl overflow-hidden shadow">
//           <video autoPlay loop muted className="w-full h-full object-cover">
//             <source src="/billi.mp4" type="video/mp4" />
//           </video>
//         </div>
//       </div>

//       {/* 🔐 AUTH POPUP */}
//       {showAuthPopup && (
//         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-xl text-center space-y-4 shadow-lg">

//             <h2 className="text-lg font-bold text-purple-600">
//               Login Required 🔐
//             </h2>

//             <p className="text-sm text-gray-600">
//               Monitoring start karne ke liye login karo bro 😏
//             </p>

//             <div className="flex gap-3 justify-center">
//               <button
//                 onClick={() => navigate("/login")}
//                 className="bg-purple-500 text-white px-4 py-2 rounded"
//               >
//                 Login
//               </button>

//               <button
//                 onClick={() => navigate("/signup")}
//                 className="border px-4 py-2 rounded"
//               >
//                 Sign Up
//               </button>
//             </div>

//             <button
//               onClick={() => setShowAuthPopup(false)}
//               className="text-sm text-gray-500"
//             >
//               Cancel
//             </button>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

// // 📊 Metric Component
// const Metric = ({ label, value }) => (
//   <div className="flex justify-between py-2 text-sm">
//     <span className="text-gray-600">{label}</span>
//     <span>{value}</span>
//   </div>
// );import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import WebcamFeed from "../components/WebcamFeed";
import { ArrowLeft } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useState, useEffect, useRef } from "react";
const Dashboard = () => {
  const navigate = useNavigate();

  // 🔥 FIX: Hook inside component
  const badStartRef = useRef(null);

  // 🔐 Auth states
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [pendingStart, setPendingStart] = useState(false);

  // 🎛️ Monitoring
  const [isMonitoring, setIsMonitoring] = useState(false);

  // 📊 Metrics
  const [blinkRate, setBlinkRate] = useState(0);
  const [distance, setDistance] = useState("unknown");
  const [expression, setExpression] = useState("neutral");
  const [redness, setRedness] = useState("normal");
  const [headPosition, setHeadPosition] = useState("aligned");
  const [stressScore, setStressScore] = useState(100);
  const [screenTime, setScreenTime] = useState(0);

  const latestData = useRef({});
  const intervalRef = useRef(null);

  // 🔥 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // 🔔 Notification function
  const sendNotification = (message) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("aAI Alert 🚨", {
        body: message,
      });
    }
  };

  // 🔄 Sync latest values
  useEffect(() => {
    latestData.current = {
      blinkRate,
      stressScore,
      screenTime,
      distance,
      headPosition,
      expression,
      redness,
    };
  }, [blinkRate, stressScore, screenTime, distance, headPosition, expression, redness]);

  // ⏱️ Screen time
  useEffect(() => {
    if (!isMonitoring) return;

    const timer = setInterval(() => {
      setScreenTime((prev) => prev + 1);
    }, 60000);

    return () => clearInterval(timer);
  }, [isMonitoring]);

  // 🔥 NOTIFICATION LOGIC
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

      const duration = Date.now() - badStartRef.current;

      if (duration > 10000) {
        let msg = "";

        if (stressScore < 40) msg = "High eye strain detected 👀";
        else if (headPosition === "tilted") msg = "Fix your posture 🧍";
        else if (distance === "too close") msg = "Move away from screen 📏";

        sendNotification(msg);

        badStartRef.current = null;
      }
    } else {
      badStartRef.current = null;
    }
  }, [stressScore, headPosition, distance, isMonitoring]);

  // 💾 Save session
  const saveSessionToDB = async () => {
    try {
      const data = latestData.current;

      if (data.screenTime === 0) return;

      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) return;

      await supabase.from("sessions").insert([
        {
          user_id: user.id,
          blink_rate: data.blinkRate,
          stress_score: data.stressScore,
          screen_time: data.screenTime,
          distance: data.distance,
          head_position: data.headPosition,
          expression: data.expression,
          redness: data.redness,
        },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔁 Auto save
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

  // ▶️ Toggle monitoring
  const handleToggleMonitoring = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      setPendingStart(true);
      setShowAuthPopup(true);
      return;
    }

    if (isMonitoring) await saveSessionToDB();

    setIsMonitoring((prev) => !prev);
  };

  // 🔄 Auto start after login
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user && pendingStart) {
        setIsMonitoring(true);
        setPendingStart(false);
      }
    };
    checkUser();
  }, [pendingStart]);

  const formatTime = (min) =>
    min < 60 ? `${min} min` : `${Math.floor(min / 60)}h ${min % 60}m`;

  const getScoreColor = () =>
    stressScore >= 70
      ? "text-green-500"
      : stressScore >= 40
      ? "text-yellow-500"
      : "text-red-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 px-10 py-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">

        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-600">
          <ArrowLeft size={18} /> Back
        </button>

        <h1 className="text-3xl font-bold text-purple-600">
          aAI Dashboard
        </h1>

        <div className="flex gap-4 items-center">
          <button onClick={() => navigate("/progress")} className="text-purple-600 font-medium">
            Progress
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

      </div>

      {/* GRID */}
      <div className="grid grid-cols-3 gap-8">

        {/* CAMERA */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Camera</h2>

          <div className="h-[300px] bg-black rounded-xl flex items-center justify-center text-white">
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
            className={`mt-4 w-full py-2 rounded text-white ${
              isMonitoring ? "bg-red-500" : "bg-purple-500"
            }`}
          >
            {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
          </button>
        </div>

        {/* STRESS */}
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="font-semibold mb-3">Stress Score</h2>
          <div className={`text-5xl font-bold ${getScoreColor()}`}>
            {stressScore}
          </div>
        </div>

        {/* METRICS */}
        <div className="bg-white p-6 rounded-xl shadow">
          <Metric label="Screen Time" value={formatTime(screenTime)} />
          <Metric label="Blink Rate" value={`${blinkRate}`} />
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
  <div className="flex justify-between py-2 text-sm">
    <span className="text-gray-600">{label}</span>
    <span>{value}</span>
  </div>
);
