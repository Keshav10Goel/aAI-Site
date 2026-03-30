// // import { Link } from "react-router-dom";
// // import {
// //   LineChart,
// //   Line,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   CartesianGrid,
// //   BarChart,
// //   Bar,
// //   ResponsiveContainer
// // } from "recharts";
// // import { useEffect, useState } from "react";
// // import { supabase } from "../lib/supabase";

// // const Progress = () => {

// //   const [sessions, setSessions] = useState([]);

// //   // 🔥 FETCH DATA FROM SUPABASE
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       const { data, error } = await supabase
// //         .from("sessions")
// //         .select("*")
// //         .order("created_at", { ascending: true });

// //       if (error) {
// //         console.error("❌ Fetch error:", error);
// //       } else {
// //         setSessions(data);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   // 🔥 FORMAT DATA FOR CHARTS (FIXED IST + PROPER PARSING)
// //   const formattedData = sessions.map((item) => {

// //     // ✅ FIX: proper ISO conversion (VERY IMPORTANT)
// //     const date = new Date(item.created_at.replace(" ", "T") + "Z");

// //     return {
// //       time: date.toLocaleTimeString("en-IN", {
// //         hour: "2-digit",
// //         minute: "2-digit",
// //         timeZone: "Asia/Kolkata"
// //       }),
// //       stress: item.stress_score,
// //       blink: item.blink_rate,
// //       screen: item.screen_time,
// //     };
// //   });

// //   // 🔥 AI INSIGHTS (UNCHANGED)
// //   const insights = [];

// //   if (sessions.length > 0) {
// //     const avgStress =
// //       sessions.reduce((a, b) => a + b.stress_score, 0) / sessions.length;

// //     const avgBlink =
// //       sessions.reduce((a, b) => a + b.blink_rate, 0) / sessions.length;

// //     const maxScreen =
// //       Math.max(...sessions.map((s) => s.screen_time));

// //     if (avgStress < 60) {
// //       insights.push("⚠️ High eye strain detected. Take more breaks.");
// //     } else {
// //       insights.push("✅ Your eye health looks stable overall.");
// //     }

// //     if (avgBlink < 10) {
// //       insights.push("👁️ Low blink rate detected. You may be staring too much.");
// //     }

// //     if (maxScreen > 120) {
// //       insights.push("💻 Long screen sessions detected. Follow 20-20-20 rule.");
// //     }

// //     if (sessions.length > 5) {
// //       insights.push("📊 Your data is building — trends are becoming more accurate.");
// //     }
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-100 p-10">

// //       {/* HEADER */}
// //       <div className="flex justify-between items-center mb-10">

// //         <Link to="/monitor" className="text-gray-600 font-medium">
// //           ← Back to Dashboard
// //         </Link>

// //         <h1 className="text-3xl font-bold text-purple-600">
// //           Progress & Insights
// //         </h1>

// //         <div></div>
// //       </div>

// //       {/* CHARTS */}
// //       <div className="grid grid-cols-2 gap-8">

// //         {/* STRESS */}
// //         <div className="bg-white rounded-xl shadow p-6">
// //           <h2 className="text-lg font-semibold mb-2">
// //             Eye Stress Score Trend
// //           </h2>

// //           <ResponsiveContainer width="100%" height={250}>
// //             <LineChart data={formattedData}>
// //               <CartesianGrid strokeDasharray="3 3" />
// //               <XAxis dataKey="time" />
// //               <YAxis domain={[0, 100]} />
// //               <Tooltip />
// //               <Line type="monotone" dataKey="stress" stroke="#7c5cff" strokeWidth={3} />
// //             </LineChart>
// //           </ResponsiveContainer>
// //         </div>

// //         {/* SCREEN TIME */}
// //         <div className="bg-white rounded-xl shadow p-6">
// //           <h2 className="text-lg font-semibold mb-2">
// //             Screen Time
// //           </h2>

// //           <ResponsiveContainer width="100%" height={250}>
// //             <BarChart data={formattedData}>
// //               <CartesianGrid strokeDasharray="3 3" />
// //               <XAxis dataKey="time" />
// //               <YAxis />
// //               <Tooltip />
// //               <Bar dataKey="screen" fill="#b59ce8" radius={[6,6,0,0]} />
// //             </BarChart>
// //           </ResponsiveContainer>
// //         </div>
// //       </div>

// //       {/* SECOND ROW */}
// //       <div className="grid grid-cols-2 gap-8 mt-8">

// //         {/* BLINK */}
// //         <div className="bg-white rounded-xl shadow p-6">
// //           <h2 className="text-lg font-semibold mb-2">
// //             Blink Rate Analysis
// //           </h2>

// //           <ResponsiveContainer width="100%" height={250}>
// //             <LineChart data={formattedData}>
// //               <CartesianGrid strokeDasharray="3 3" />
// //               <XAxis dataKey="time" />
// //               <YAxis />
// //               <Tooltip />
// //               <Line type="monotone" dataKey="blink" stroke="#7c5cff" strokeWidth={3} />
// //             </LineChart>
// //           </ResponsiveContainer>
// //         </div>

// //         {/* INSIGHTS */}
// //         <div className="bg-white rounded-xl shadow p-6">
// //           <h2 className="text-lg font-semibold mb-4">
// //             AI Insights
// //           </h2>

// //           <ul className="space-y-3">
// //             {insights.length > 0 ? (
// //               insights.map((text, index) => (
// //                 <li key={index} className="flex items-start gap-3">
// //                   <span className="bg-purple-200 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center text-sm">
// //                     {index + 1}
// //                   </span>
// //                   <p className="text-gray-600">{text}</p>
// //                 </li>
// //               ))
// //             ) : (
// //               <p className="text-gray-500">No data yet. Start monitoring 👀</p>
// //             )}
// //           </ul>
// //         </div>
// //       </div>

// //       {/* TABLE */}
// //       <div className="bg-white rounded-xl shadow p-6 mt-8">
// //         <h2 className="text-lg font-semibold mb-2">
// //           Session Logs
// //         </h2>

// //         <table className="w-full text-left">
// //           <thead>
// //             <tr className="border-b">
// //               <th className="py-3">Time</th>
// //               <th>Stress</th>
// //               <th>Screen</th>
// //               <th>Blink</th>
// //             </tr>
// //           </thead>

// //           <tbody>
// //             {formattedData.map((row, index) => (
// //               <tr key={index} className="border-b">
// //                 <td className="py-3">{row.time}</td>
// //                 <td>{row.stress}</td>
// //                 <td>{row.screen} min</td>
// //                 <td>{row.blink} bpm</td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>

// //     </div>
// //   );
// // };

// // export default Progress;

// import { Link } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { supabase } from "../lib/supabase";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   BarChart,
//   Bar,
//   ResponsiveContainer,
// } from "recharts";

// const Progress = () => {
//   const [sessions, setSessions] = useState([]);
//   const [filterMode, setFilterMode] = useState("forever"); // daily | monthly | forever
//   const [chartData, setChartData] = useState([]);

//   // 🔥 Fetch all sessions once
//   useEffect(() => {
//     const fetchData = async () => {
//       const { data, error } = await supabase
//         .from("sessions")
//         .select("*")
//         .order("created_at", { ascending: true });

//       if (error) {
//         console.error("❌ Fetch error:", error);
//       } else {
//         setSessions(data);
//       }
//     };
//     fetchData();
//   }, []);

//   // 🔥 Filter and transform data when filterMode or sessions change
//   useEffect(() => {
//     if (!sessions.length) {
//       setChartData([]);
//       return;
//     }

//     const now = new Date();
//     let filtered = [...sessions];

//     // 1. Apply date filter
//     if (filterMode === "daily") {
//       const todayStart = new Date(now);
//       todayStart.setHours(0, 0, 0, 0);
//       filtered = filtered.filter((s) => new Date(s.created_at) >= todayStart);
//     } else if (filterMode === "monthly") {
//       const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//       filtered = filtered.filter((s) => new Date(s.created_at) >= firstOfMonth);
//     }
//     // "forever" keeps all sessions

//     // 2. Group data for charts
//     let grouped;
//     if (filterMode === "daily") {
//       // For daily: show each session with time on X‑axis
//       grouped = filtered.map((s) => ({
//         time: new Date(s.created_at).toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//         stress: s.stress_score,
//         blink: s.blink_rate,
//         screen: s.screen_time,
//       }));
//     } else {
//       // For monthly / forever: group by day
//       const dayMap = new Map();
//       filtered.forEach((s) => {
//         const date = new Date(s.created_at);
//         const dayKey = date.toISOString().split("T")[0]; // YYYY-MM-DD
//         if (!dayMap.has(dayKey)) {
//           dayMap.set(dayKey, {
//             day: date.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
//             stress: [],
//             blink: [],
//             screen: [],
//           });
//         }
//         const entry = dayMap.get(dayKey);
//         entry.stress.push(s.stress_score);
//         entry.blink.push(s.blink_rate);
//         entry.screen.push(s.screen_time);
//       });

//       // For each day, take the latest (or average) value
//       grouped = Array.from(dayMap.values()).map((entry) => ({
//         time: entry.day, // X‑axis label
//         stress: entry.stress[entry.stress.length - 1],    // latest stress
//         blink: entry.blink[entry.blink.length - 1],        // latest blink
//         screen: entry.screen[entry.screen.length - 1],     // latest screen time
//       }));
//     }

//     setChartData(grouped);
//   }, [sessions, filterMode]);

//   // 🔥 Generate AI insights (based on all sessions, not just filtered)
//   const insights = [];
//   if (sessions.length > 0) {
//     const avgStress = sessions.reduce((a, b) => a + b.stress_score, 0) / sessions.length;
//     const avgBlink = sessions.reduce((a, b) => a + b.blink_rate, 0) / sessions.length;
//     const maxScreen = Math.max(...sessions.map((s) => s.screen_time));

//     if (avgStress < 60) insights.push("⚠️ High eye strain detected. Take more breaks.");
//     else insights.push("✅ Your eye health looks stable overall.");

//     if (avgBlink < 10) insights.push("👁️ Low blink rate detected. You may be staring too much.");

//     if (maxScreen > 120) insights.push("💻 Long screen sessions detected. Follow 20-20-20 rule.");

//     if (sessions.length > 5) insights.push("📊 Your data is building — trends are becoming more accurate.");
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-10">
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-10">
//         <Link to="/monitor" className="text-gray-600 font-medium">
//           ← Back to Dashboard
//         </Link>
//         <h1 className="text-3xl font-bold text-purple-600">Progress & Insights</h1>
//         <div></div>
//       </div>

//       {/* FILTER BUTTONS */}
//       <div className="flex justify-end gap-4 mb-6">
//         <button
//           onClick={() => setFilterMode("daily")}
//           className={`px-4 py-2 rounded-lg ${
//             filterMode === "daily"
//               ? "bg-purple-600 text-white"
//               : "bg-gray-200 text-gray-700"
//           }`}
//         >
//           Daily
//         </button>
//         <button
//           onClick={() => setFilterMode("monthly")}
//           className={`px-4 py-2 rounded-lg ${
//             filterMode === "monthly"
//               ? "bg-purple-600 text-white"
//               : "bg-gray-200 text-gray-700"
//           }`}
//         >
//           Monthly
//         </button>
//         <button
//           onClick={() => setFilterMode("forever")}
//           className={`px-4 py-2 rounded-lg ${
//             filterMode === "forever"
//               ? "bg-purple-600 text-white"
//               : "bg-gray-200 text-gray-700"
//           }`}
//         >
//           Forever
//         </button>
//       </div>

//       {/* CHARTS */}
//       <div className="grid grid-cols-2 gap-8">
//         {/* STRESS TREND */}
//         <div className="bg-white rounded-xl shadow p-6">
//           <h2 className="text-lg font-semibold mb-2">Eye Stress Score Trend</h2>
//           <ResponsiveContainer width="100%" height={250}>
//             <LineChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="time" />
//               <YAxis domain={[0, 100]} />
//               <Tooltip />
//               <Line type="monotone" dataKey="stress" stroke="#7c5cff" strokeWidth={3} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* SCREEN TIME */}
//         <div className="bg-white rounded-xl shadow p-6">
//           <h2 className="text-lg font-semibold mb-2">Screen Time</h2>
//           <ResponsiveContainer width="100%" height={250}>
//             <BarChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="time" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="screen" fill="#b59ce8" radius={[6,6,0,0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* SECOND ROW */}
//       <div className="grid grid-cols-2 gap-8 mt-8">
//         {/* BLINK RATE */}
//         <div className="bg-white rounded-xl shadow p-6">
//           <h2 className="text-lg font-semibold mb-2">Blink Rate Analysis</h2>
//           <ResponsiveContainer width="100%" height={250}>
//             <LineChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="time" />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="blink" stroke="#7c5cff" strokeWidth={3} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* AI INSIGHTS */}
//         <div className="bg-white rounded-xl shadow p-6">
//           <h2 className="text-lg font-semibold mb-4">AI Insights</h2>
//           <ul className="space-y-3">
//             {insights.length > 0 ? (
//               insights.map((text, idx) => (
//                 <li key={idx} className="flex items-start gap-3">
//                   <span className="bg-purple-200 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center text-sm">
//                     {idx + 1}
//                   </span>
//                   <p className="text-gray-600">{text}</p>
//                 </li>
//               ))
//             ) : (
//               <p className="text-gray-500">No data yet. Start monitoring 👀</p>
//             )}
//           </ul>
//         </div>
//       </div>

//       {/* SESSION LOGS TABLE */}
//       <div className="bg-white rounded-xl shadow p-6 mt-8">
//         <h2 className="text-lg font-semibold mb-2">Session Logs</h2>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="border-b">
//                 <th className="py-3">Time</th>
//                 <th>Stress</th>
//                 <th>Screen</th>
//                 <th>Blink</th>
//                 <th>Distance</th>
//                 <th>Head</th>
//                 <th>Expression</th>
//                 <th>Redness</th>
//               </tr>
//             </thead>
//             <tbody>
//               {chartData.map((row, idx) => (
//                 <tr key={idx} className="border-b">
//                   <td className="py-3">{row.time}</td>
//                   <td>{row.stress}</td>
//                   <td>{row.screen} min</td>
//                   <td>{row.blink} bpm</td>
//                   <td>{sessions[idx]?.distance || "—"}</td>
//                   <td>{sessions[idx]?.head_position || "—"}</td>
//                   <td>{sessions[idx]?.expression || "—"}</td>
//                   <td>{sessions[idx]?.redness || "—"}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Progress;


import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

const Progress = () => {
  const [sessions, setSessions] = useState([]);
  const [filterMode, setFilterMode] = useState("forever");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser();

if (!userData?.user) return;

const { data, error } = await supabase
  .from("sessions")
  .select("*")
  .eq("user_id", userData.user.id)
  .order("created_at", { ascending: true });
      
      if (error) {
        console.error("❌ Fetch error:", error);
      } else {
        setSessions(data);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!sessions.length) {
      setChartData([]);
      return;
    }

    const now = new Date();
    let filtered = [...sessions];

    if (filterMode === "daily") {
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);
      filtered = filtered.filter((s) => new Date(s.created_at) >= todayStart);
    } else if (filterMode === "monthly") {
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      filtered = filtered.filter((s) => new Date(s.created_at) >= firstOfMonth);
    }

    let grouped;
    if (filterMode === "daily") {
      grouped = filtered.map((s) => ({
        time: new Date(s.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        stress: s.stress_score,
        blink: s.blink_rate,
        screen: s.screen_time,
      }));
    } else {
      const dayMap = new Map();
      filtered.forEach((s) => {
        const date = new Date(s.created_at);
        const dayKey = date.toISOString().split("T")[0];
        if (!dayMap.has(dayKey)) {
          dayMap.set(dayKey, {
            day: date.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
            stress: [],
            blink: [],
            screen: [],
          });
        }
        const entry = dayMap.get(dayKey);
        entry.stress.push(s.stress_score);
        entry.blink.push(s.blink_rate);
        entry.screen.push(s.screen_time);
      });

      grouped = Array.from(dayMap.values()).map((entry) => ({
        time: entry.day,
        stress: entry.stress[entry.stress.length - 1],
        blink: entry.blink[entry.blink.length - 1],
        screen: entry.screen[entry.screen.length - 1],
      }));
    }

    setChartData(grouped);
  }, [sessions, filterMode]);

  const insights = [];
  if (sessions.length > 0) {
    const avgStress = sessions.reduce((a, b) => a + b.stress_score, 0) / sessions.length;
    const avgBlink = sessions.reduce((a, b) => a + b.blink_rate, 0) / sessions.length;
    const maxScreen = Math.max(...sessions.map((s) => s.screen_time));

    if (avgStress < 60) insights.push("⚠️ High eye strain detected. Take more breaks.");
    else insights.push("✅ Your eye health looks stable overall.");

    if (avgBlink < 10) insights.push("👁️ Low blink rate detected. You may be staring too much.");

    if (maxScreen > 120) insights.push("💻 Long screen sessions detected. Follow 20-20-20 rule.");

    if (sessions.length > 5) insights.push("📊 Your data is building — trends are becoming more accurate.");
  }

  return (
    <div className="min-h-screen bg-[#0B1220] p-10 text-[#E5E7EB]">

      <div className="flex justify-between items-center mb-10">
        <Link to="/monitor" className="text-[#9CA3AF] font-medium hover:text-white">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#A855F7] to-[#EC4899] bg-clip-text text-transparent">
          Progress & Insights
        </h1>
        <div></div>
      </div>

      <div className="flex justify-end gap-4 mb-6">
        {["daily", "monthly", "forever"].map((mode) => (
          <button
            key={mode}
            onClick={() => setFilterMode(mode)}
            className={`px-4 py-2 rounded-xl font-medium transition ${
              filterMode === mode
                ? "bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white"
                : "bg-[#111827] text-[#9CA3AF] hover:text-white"
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-[#111827] to-[#1F2937] rounded-2xl shadow-xl p-6">
          <h2 className="text-lg font-semibold mb-2">Eye Stress Score Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#1F2937" strokeDasharray="3 3" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis domain={[0, 100]} stroke="#9CA3AF" />
              <Tooltip />
              <Line type="monotone" dataKey="stress" stroke="#A855F7" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gradient-to-br from-[#111827] to-[#1F2937] rounded-2xl shadow-xl p-6">
          <h2 className="text-lg font-semibold mb-2">Screen Time</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid stroke="#1F2937" strokeDasharray="3 3" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Bar dataKey="screen" fill="#EC4899" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mt-8">
        <div className="bg-gradient-to-br from-[#111827] to-[#1F2937] rounded-2xl shadow-xl p-6">
          <h2 className="text-lg font-semibold mb-2">Blink Rate Analysis</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#1F2937" strokeDasharray="3 3" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Line type="monotone" dataKey="blink" stroke="#A855F7" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gradient-to-br from-[#111827] to-[#1F2937] rounded-2xl shadow-xl p-6">
          <h2 className="text-lg font-semibold mb-4">AI Insights</h2>
          <ul className="space-y-3">
            {insights.length > 0 ? (
              insights.map((text, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    {idx + 1}
                  </span>
                  <p className="text-[#9CA3AF]">{text}</p>
                </li>
              ))
            ) : (
              <p className="text-[#9CA3AF]">No data yet. Start monitoring 👀</p>
            )}
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#111827] to-[#1F2937] rounded-2xl shadow-xl p-6 mt-8">
        <h2 className="text-lg font-semibold mb-2">Session Logs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-[#9CA3AF]">
                <th className="py-3">Time</th>
                <th>Stress</th>
                <th>Screen</th>
                <th>Blink</th>
                <th>Distance</th>
                <th>Head</th>
                <th>Expression</th>
                <th>Redness</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((row, idx) => (
                <tr key={idx} className="border-b border-white/10 hover:bg-white/5 transition">
                  <td className="py-3">{row.time}</td>
                  <td className="text-[#22C55E] font-semibold">{row.stress}</td>
                  <td>{row.screen} min</td>
                  <td>{row.blink} bpm</td>
                  <td>{sessions[idx]?.distance || "—"}</td>
                  <td>{sessions[idx]?.head_position || "—"}</td>
                  <td>{sessions[idx]?.expression || "—"}</td>
                  <td>{sessions[idx]?.redness || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Progress;
