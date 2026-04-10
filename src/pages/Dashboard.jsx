

import { useNavigate } from "react-router-dom";
import WebcamFeed from "../components/WebcamFeed";
import { ArrowLeft } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useState, useEffect, useRef } from "react";

const Dashboard = () => {

  const navigate = useNavigate();
  const webcamRef = useRef(null);

  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [isFaceVisible, setIsFaceVisible] = useState(false);
  const [blinkRate, setBlinkRate] = useState(0);
  const [distance, setDistance] = useState("unknown");
  const [expression, setExpression] = useState("neutral");
  const [redness, setRedness] = useState("normal");
  const [headPosition, setHeadPosition] = useState(null);
  const [stressScore, setStressScore] = useState(100);
  const [screenTime, setScreenTime] = useState(0);

  
  const activeStartRef = useRef(null);
const accumulatedTimeRef = useRef(0);
  const historyRef = useRef({ blink: [], stress: [] });
  const intervalRef = useRef(null);
  const badStartRef = useRef(null);

  /* ---------------- NOTIFICATION PERMISSION ---------------- */
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);
  useEffect(() => {
  if (!isMonitoring) return;

  if (isFaceVisible) {
    if (!activeStartRef.current) {
      activeStartRef.current = Date.now();
    }
  } else {
    if (activeStartRef.current) {
      accumulatedTimeRef.current += Date.now() - activeStartRef.current;
      activeStartRef.current = null;
    }
  }
}, [isFaceVisible, isMonitoring]);
  /* ---------------- PiP STATE SYNC ---------------- */
useEffect(() => {
  const handlePiPClose = () => {
    setIsPiP(false); // 🔥 sync React state with browser
  };

  document.addEventListener("leavepictureinpicture", handlePiPClose);

  return () => {
    document.removeEventListener("leavepictureinpicture", handlePiPClose);
  };
}, []);
useEffect(() => {
  if (!isMonitoring) return;

  const timer = setInterval(() => {
    let total = accumulatedTimeRef.current;

    if (activeStartRef.current) {
      total += Date.now() - activeStartRef.current;
    }

    setScreenTime(Math.floor(total / 1000));
  }, 1000);

  return () => clearInterval(timer);
}, [isMonitoring]);

  /* ---------------- MONITOR TOGGLE ---------------- */
  const handleToggleMonitoring = async () => {
  try {
    const { data } = await supabase.auth.getUser();

    if (!data?.user) {
      navigate("/login");
      return;
    }

    if (isMonitoring) {
      // ================= STOP =================

      // Close PiP
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiP(false);
      }
      // Save session
      await saveSessionToDB();

      // Stop camera
      webcamRef.current?.stopCamera();

    } else {
      // ================= START =================

      // startTimeRef.current = Date.now();
    }

    // Toggle state LAST
    setIsMonitoring(prev => !prev);

  } catch (err) {
    console.error("Toggle error:", err);
  }
};

  /* ---------------- PiP TOGGLE ---------------- */
  const handlePiP = async () => {
    if (!document.pictureInPictureElement) {
      await webcamRef.current?.enablePiP();
      setIsPiP(true);
    } else {
      await document.exitPictureInPicture();
      setIsPiP(false);
    }
  };
  

  /* ---------------- SCREEN TIME ---------------- */
 
  /* ---------------- HISTORY TRACK ---------------- */
  useEffect(() => {
    if (!isMonitoring) return;

    const collector = setInterval(() => {
      historyRef.current.blink.push(blinkRate);
      historyRef.current.stress.push(stressScore);
    }, 1000);

    return () => clearInterval(collector);
  }, [isMonitoring, blinkRate, stressScore]);

  /* ---------------- BAD CONDITION ALERT ---------------- */
  useEffect(() => {
    if (!isMonitoring) return;

    const isBad = stressScore < 40 || distance === "too close";

    if (isBad) {
      if (!badStartRef.current) badStartRef.current = Date.now();

      if (Date.now() - badStartRef.current > 10000) {
        if (Notification.permission === "granted") {
          new Notification("Eye Alert 🚨", {
            body: "Take a break!"
          });
        }
        badStartRef.current = null;
      }
    } else {
      badStartRef.current = null;
    }
  }, [stressScore, distance, isMonitoring]);

  /* ---------------- SAVE SESSION ---------------- */
 const saveSessionToDB = async () => {
  try {
    const history = historyRef.current;

    if (history.blink.length === 0) return;

    const avgBlink =
      history.blink.reduce((a, b) => a + b, 0) / history.blink.length;

    const avgStress =
      history.stress.reduce((a, b) => a + b, 0) / history.stress.length;

    const { data } = await supabase.auth.getUser();
    if (!data?.user) return;

    // ✅ STEP 1: CALCULATE SCREEN TIME (OBJECT KE BAHAR)
    let total = accumulatedTimeRef.current;

    if (activeStartRef.current) {
      total += Date.now() - activeStartRef.current;
    }

    const finalScreenTime = Math.floor(total / 1000);

    // ✅ DEBUG
    console.log("FINAL SCREEN TIME:", finalScreenTime);
    console.log("STATE SCREEN TIME:", screenTime);

    // ✅ STEP 2: SAVE CORRECT VALUE
    await supabase.from("sessions").insert([
      {
        user_id: data.user.id,
        blink_rate: Math.round(avgBlink),
        stress_score: Math.round(avgStress),
        screen_time: finalScreenTime, // 🔥 MAIN FIX
        distance,
        head_position:
          typeof headPosition === "object"
            ? JSON.stringify(headPosition)
            : headPosition,
        expression,
        redness
      }
    ]);

    historyRef.current = { blink: [], stress: [] };

  } catch (err) {
    console.error(err);
  }
};
  /* ---------------- AUTO SAVE ---------------- */
  useEffect(() => {
    if (isMonitoring) {
      intervalRef.current = setInterval(saveSessionToDB, 300000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isMonitoring]);

  /* ---------------- HELPERS ---------------- */
  const formatTime = (min) =>
  min < 60 ? `${min} min` : `${Math.floor(min / 60)}h ${min % 60}m`;

  const getScoreColor = () =>
    stressScore >= 70
      ? "text-green-400"
      : stressScore >= 40
      ? "text-yellow-400"
      : "text-red-400";

  const formatIST = (date) => {
  return new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }) + " IST";
};
const formatScreenTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n) => String(n).padStart(2, "0");

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  return `${pad(minutes)}:${pad(seconds)}`;
};

      // ---------------- HEAD POSITION FORMATTER ----------------
const getHeadStatus = (headPosition) => {
  if (!headPosition || typeof headPosition !== "object") return "Unknown";
return Math.abs(headPosition.yaw) < 10 &&
         Math.abs(headPosition.pitch) < 10
    ? "aligned"
    : "tilted";
  
};

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-[#0B1220] text-[#E5E7EB] p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-400 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#A855F7] to-[#EC4899] bg-clip-text text-transparent">
          aAI Dashboard
        </h1>

        {/* 🔥 RIGHT SIDE ACTIONS */}
        <div className="flex items-center gap-6">

          {/* ✅ PROGRESS BUTTON */}
         <button
onClick={() => window.open("/progress","_blank")}>
  Progress
</button>

          <button
            onClick={() => supabase.auth.signOut()}
            className="text-red-400 hover:text-red-500"
          >
            Logout
          </button>

        </div>

      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* CAMERA */}
        <div className="bg-gradient-to-br from-[#111827] to-[#1F2937] p-6 rounded-2xl">

          {isMonitoring ? (
            <WebcamFeed
              ref={webcamRef}
              setBlinkRate={setBlinkRate}
              setDistance={setDistance}
              setRedness={setRedness}
              setStressScore={setStressScore}
              setHeadPosition={setHeadPosition}
              setExpression={setExpression}
              setIsFaceVisible={setIsFaceVisible}
              
              
            />
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400">
              Camera Off
            </div>
          )}

          <button
            onClick={handleToggleMonitoring}
            className="mt-4 w-full py-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#EC4899]"
          >
            {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
          </button>

          <button
            onClick={handlePiP}
            className="mt-2 w-full py-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#EC4899]"
          >
            {isPiP ? "Disable Floating Mode" : "Enable Floating Mode"}
          </button>

        </div>

        {/* STRESS */}
        <div className="bg-[#111827] p-6 rounded-2xl text-center">
          <h2 className="mb-4">Strain Score</h2>
          <div className={`text-6xl font-bold ${getScoreColor()}`}>
            {stressScore}
          </div>
        </div>

        {/* METRICS */}
        <div className="bg-[#111827] p-6 rounded-2xl space-y-2">

          <Metric label="Blink Rate" value={blinkRate} />
          <Metric label="Distance" value={distance} />

          <Metric
            label="Head Position"
            value={getHeadStatus(headPosition) }
          />

          <Metric label="Expression" value={expression} />
          <Metric label="Redness" value={redness} />
          <Metric label="Active Screen Time" value={formatScreenTime(screenTime)} />

        </div>

      </div>
    </div>
  );
};

export default Dashboard;

/* COMPONENT */
const Metric = ({ label, value }) => (
  <div className="flex justify-between border-b border-white/10 py-2 text-sm">
    <span className="text-gray-400">{label}</span>
    <span>{value}</span>
  </div>
);