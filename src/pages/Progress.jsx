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

// const CustomTooltip = ({ active, payload, label }) => {
//   if (!active || !payload || !payload.length) return null;

//   return (
//     <div className="bg-[#111827] p-3 rounded-xl shadow-lg border border-white/10">
//       <p className="text-[#E5E7EB] font-medium">
//         {label} IST
//       </p>

//       {payload.map((item, i) => (
//         <p key={i} className="text-[#9CA3AF] text-sm">
//           {item.name}: {item.value}
//         </p>
//       ))}
//     </div>
//   );
// };
//  const avg = (arr) =>
//   arr.reduce((a, b) => a + b, 0) / arr.length;

// // ✅ SAFE IST FUNCTIONS (GLOBAL USE)
// const formatTimeIST = (date) => {
//   return new Intl.DateTimeFormat("en-IN", {
//     timeZone: "Asia/Kolkata",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   }).format(new Date(date));
// };

// const formatDateIST = (date) => {
//   return new Intl.DateTimeFormat("en-CA", {
//     timeZone: "Asia/Kolkata",
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//   }).format(new Date(date)); // YYYY-MM-DD
// };


// const Progress = () => {
//   const [sessions, setSessions] = useState([]);
//   const [filterMode, setFilterMode] = useState("forever");
//   const [chartData, setChartData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const { data: userData } = await supabase.auth.getUser();

// if (!userData?.user) return;

// const { data, error } = await supabase
//   .from("sessions")
//   .select("*")
//   .eq("user_id", userData.user.id)
//   .order("created_at", { ascending: true });
      
//       if (error) {
//         console.error("❌ Fetch error:", error);
//       } else {
//         setSessions(data);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (!sessions.length) {
//       setChartData([]);
//       return;
//     }

//     const now = new Date();
//     let filtered = [...sessions];

//     if (filterMode === "daily") {
//       const todayKey = formatDateIST(new Date());

// filtered = sessions.filter((s) => {
//   return formatDateIST(s.created_at) === todayKey;
// });

//     } else if (filterMode === "monthly") {
//      const now = new Date();

// filtered = sessions.filter((s) => {
//   const d = new Date(s.created_at);
//   return (
//     d.getMonth() === now.getMonth() &&
//     d.getFullYear() === now.getFullYear()
//   );
// });

// filtered = filtered.filter((s) => {
//   const ist = convertUTCtoISTDate(s.created_at);

//   return (
//     ist.getMonth() === firstOfMonth.getMonth() &&
//     ist.getFullYear() === firstOfMonth.getFullYear()
//   );
// });   }

//    let grouped;

// if (filterMode === "daily") {
//   grouped = filtered.map((s) => ({
//     time: formatTimeIST(s.created_at),
//     stress: s.stress_score,
//     blink: s.blink_rate,
//     screen: s.screen_time,
//   }));
// } else {
//   const dayMap = new Map();

//   filtered.forEach((s) => {
//     const istDate = new Date(
//       new Date(s.created_at).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
//     );

//     const dayKey = istDate.toISOString().split("T")[0];

//     if (!dayMap.has(dayKey)) {
//       dayMap.set(dayKey, {
//         day: istDate.toLocaleDateString("en-IN", {
//           day: "numeric",
//           month: "short"
//         }),
//         stress: [],
//         blink: [],
//         screen: [],
//       });
//     }

//     const entry = dayMap.get(dayKey);
//     entry.stress.push(s.stress_score);
//     entry.blink.push(s.blink_rate);
//     entry.screen.push(s.screen_time);
//   });

//   grouped = Array.from(dayMap.values()).map((entry) => ({
//     time: entry.day,
//     stress: avg(entry.stress),
//     blink: avg(entry.blink),
//     screen: avg(entry.screen),
//   }));
// }
   
//     const entry = dayMap.get(dayKey);
//     entry.stress.push(s.stress_score);
//     entry.blink.push(s.blink_rate);
//     entry.screen.push(s.screen_time);
//   });

//   grouped = Array.from(dayMap.values()).map((entry) => ({
//   time: entry.day,
//   stress: avg(entry.stress),
//   blink: avg(entry.blink),
//   screen: avg(entry.screen),
// }));
// }

// setChartData(grouped);
// }, [sessions, filterMode]);
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
//     <div className="min-h-screen bg-[#0B1220] p-10 text-[#E5E7EB]">

//       <div className="flex justify-between items-center mb-10">
//         <Link to="/monitor" className="text-[#9CA3AF] font-medium hover:text-white">
//           ← Back to Dashboard
//         </Link>
//         <h1 className="text-3xl font-bold bg-gradient-to-r from-[#A855F7] to-[#EC4899] bg-clip-text text-transparent">
//           Progress & Insights
//         </h1>
//         <div></div>
//       </div>

//       <div className="flex justify-end gap-4 mb-6">
//         {["daily", "monthly", "forever"].map((mode) => (
//           <button
//             key={mode}
//             onClick={() => setFilterMode(mode)}
//             className={`px-4 py-2 rounded-xl font-medium transition ${
//               filterMode === mode
//                 ? "bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white"
//                 : "bg-[#111827] text-[#9CA3AF] hover:text-white"
//             }`}
//           >
//             {mode.charAt(0).toUpperCase() + mode.slice(1)}
//           </button>
//         ))}
//       </div>

//       <div className="grid grid-cols-2 gap-8">
//         <div className="bg-gradient-to-br from-[#111827] to-[#1F2937] rounded-2xl shadow-xl p-6">
//           <h2 className="text-lg font-semibold mb-2">Eye Stress Score Trend</h2>
//           <ResponsiveContainer width="100%" height={250}>
//             <LineChart data={chartData}>
//               <CartesianGrid stroke="#1F2937" strokeDasharray="3 3" />
//               <XAxis dataKey="time" stroke="#9CA3AF" />
//               <YAxis domain={[0, 100]} stroke="#9CA3AF" />
//               <Tooltip content={<CustomTooltip />} />
//               <Line type="monotone" dataKey="stress" stroke="#A855F7" strokeWidth={3} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="bg-gradient-to-br from-[#111827] to-[#1F2937] rounded-2xl shadow-xl p-6">
//           <h2 className="text-lg font-semibold mb-2">Screen Time</h2>
//           <ResponsiveContainer width="100%" height={250}>
//             <BarChart data={chartData}>
//               <CartesianGrid stroke="#1F2937" strokeDasharray="3 3" />
//               <XAxis dataKey="time" stroke="#9CA3AF" />
//               <YAxis stroke="#9CA3AF" />
//               <Tooltip content={<CustomTooltip />} />
//               <Bar dataKey="screen" fill="#EC4899" radius={[6,6,0,0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-8 mt-8">
//         <div className="bg-gradient-to-br from-[#111827] to-[#1F2937] rounded-2xl shadow-xl p-6">
//           <h2 className="text-lg font-semibold mb-2">Blink Rate Analysis</h2>
//           <ResponsiveContainer width="100%" height={250}>
//             <LineChart data={chartData}>
//               <CartesianGrid stroke="#1F2937" strokeDasharray="3 3" />
//               <XAxis dataKey="time" stroke="#9CA3AF" />
//               <YAxis stroke="#9CA3AF" />
//               <Tooltip content={<CustomTooltip />} />
//               <Line type="monotone" dataKey="blink" stroke="#A855F7" strokeWidth={3} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="bg-gradient-to-br from-[#111827] to-[#1F2937] rounded-2xl shadow-xl p-6">
//           <h2 className="text-lg font-semibold mb-4">AI Insights</h2>
//           <ul className="space-y-3">
//             {insights.length > 0 ? (
//               insights.map((text, idx) => (
//                 <li key={idx} className="flex items-start gap-3">
//                   <span className="bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
//                     {idx + 1}
//                   </span>
//                   <p className="text-[#9CA3AF]">{text}</p>
//                 </li>
//               ))
//             ) : (
//               <p className="text-[#9CA3AF]">No data yet. Start monitoring 👀</p>
//             )}
//           </ul>
//         </div>
//       </div>

//       <div className="bg-gradient-to-br from-[#111827] to-[#1F2937] rounded-2xl shadow-xl p-6 mt-8">
//         <h2 className="text-lg font-semibold mb-2">Session Logs</h2>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="border-b border-white/10 text-[#9CA3AF]">
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
//   {sessions.map((row, idx) => (
//     <tr key={idx} className="border-b border-white/10 hover:bg-white/5 transition">
      
//       {/* ✅ TIME (IST FIX) */}
//       <td className="py-3">{formatTimeIST(row.created_at)}</td>

//       {/* ✅ CORRECT FIELDS */}
//       <td className="text-[#22C55E] font-semibold">
//         {row.stress_score ?? "—"}
//       </td>

//       <td>
//         {row.screen_time ? Math.floor(row.screen_time / 60) : 0} min
//       </td>

//       <td>{row.blink_rate ?? "—"} bpm</td>

//       <td>{row.distance ?? "—"}</td>

//       <td>
//         {typeof row.head_position === "string"
//           ? JSON.parse(row.head_position)?.yaw?.toFixed(1) ?? "—"
//           : "—"}
//       </td>

//       <td>{row.expression ?? "—"}</td>

//       <td>{row.redness ?? "—"}</td>

//     </tr>
//   ))}
// </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Progress;

import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "../lib/supabase";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, BarChart, Bar, ResponsiveContainer
} from "recharts";

/* ---------------- UTILITIES ---------------- */

const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

const safeParse = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

const formatScreenTime = (seconds) => {
  if (!seconds) return "0 min";

  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;

  if (hrs > 0) return `${hrs} hr ${remainingMins} min`;
  return `${remainingMins} min`;
};

const formatTimeIST = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));

const formatDateIST = (date) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));

/* ---------------- TOOLTIP ---------------- */

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-[#111827] p-3 rounded-xl border border-white/10 shadow-xl">
      <p className="text-white font-medium">{label} IST</p>
      {payload.map((item, i) => (
        <p key={i} className="text-gray-400 text-sm">
          {item.name === "screen"
  ? formatScreenTime(item.value)
  : item.value}
        </p>
      ))}
    </div>
  );
};

/* ---------------- MAIN ---------------- */

export default function Progress() {
  const [sessions, setSessions] = useState([]);
  const [filterMode, setFilterMode] = useState("forever");
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH ---------------- */

useEffect(() => {
  let channel;

  const setup = async () => {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData?.user) {
      console.error("❌ No user found (auth issue)");
      setLoading(false);
      return;
    }

    const userId = userData.user.id;

    // FETCH DATA
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("❌ Fetch error:", error);
    } else {
      console.log("✅ Data:", data);
      setSessions(data || []);
    }

    // REALTIME
    channel = supabase
      .channel("sessions-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "sessions",
        },
        (payload) => {
          const newRow = payload.new;

          if (newRow.user_id !== userId) return;

          setSessions((prev) => {
            if (prev.some(p => p.id === newRow.id)) return prev;
            return [...prev, newRow];
          });
        }
      )
      .subscribe();

    setLoading(false);
  };

  setup();

  return () => {
    if (channel) supabase.removeChannel(channel);
  };
}, []);

  /* ---------------- FILTER + GROUP ---------------- */

  const chartData = useMemo(() => {
    if (!sessions.length) return [];

    let filtered = [...sessions];
    const now = new Date();

    // DAILY
    if (filterMode === "daily") {
      const today = new Date().toDateString();

filtered = sessions.filter(
  (s) => new Date(s.created_at).toDateString() === today
);

      return filtered.map((s) => ({
        time: formatTimeIST(s.created_at),
        stress: s.stress_score ?? 0,
        blink: s.blink_rate ?? 0,
        screen: s.screen_time ?? 0,
      }));
    }

    // MONTHLY
    if (filterMode === "monthly") {
      filtered = sessions.filter((s) => {
        const d = new Date(s.created_at);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      });
    }

    // GROUPING (monthly + forever)
    const map = new Map();

    filtered.forEach((s) => {
      const key = formatDateIST(s.created_at);

      if (!map.has(key)) {
        map.set(key, { time: key, stress: [], blink: [], screen: [] });
      }

      const entry = map.get(key);
      entry.stress.push(s.stress_score ?? 0);
      entry.blink.push(s.blink_rate ?? 0);
      entry.screen.push(s.screen_time ?? 0);
    });

    return Array.from(map.values()).map((e) => ({
      time: e.time,
      stress: avg(e.stress),
      blink: avg(e.blink),
      screen: avg(e.screen)
    }));

  }, [sessions, filterMode]);

  /* ---------------- INSIGHTS ---------------- */

const insights = useMemo(() => {
  if (!sessions.length) return [];

  const avgStress = avg(sessions.map(s => s.stress_score ?? 0));
  const avgBlink = avg(sessions.map(s => s.blink_rate ?? 0));
  const maxScreen = Math.max(...sessions.map(s => s.screen_time ?? 0));

  const rednessDetected = sessions.some(s => s.redness > 0.5); // adjust threshold if needed

  const res = [];

  if (avgBlink < 10) {
    res.push("👁️ Low blink rate detected. Try consciously blinking more to prevent dry eyes.");
  }

  if (avgStress < 40) {
    res.push("⚠️ High eye strain detected. Take short breaks and reduce screen brightness.");
  }

  if (avgStress > 70) {
    res.push("🧘 Great! Your eye stress is low. Maintain proper posture and lighting.");
  }

  if (maxScreen > 3600) {
    res.push("💻 Long screen sessions detected. Follow 20-20-20 rule.");
  }

  if (rednessDetected) {
    res.push("🔴 Eye redness detected. Consider washing your eyes and reducing screen exposure.");
  }

  if (sessions.length > 5) {
    res.push("📊 Your data is improving. Insights will become more accurate over time.");
  }

  if (res.length === 0) {
    res.push("🪑 Maintain proper sitting posture and keep screen at eye level.");
  }

  return res;

}, [sessions]);

  const dailyLogs = useMemo(() => {
  const todayKey = new Date().toDateString();

  return sessions
    .filter((s) => 
      new Date(s.created_at).toDateString() === todayKey
    )
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 15);

}, [sessions]);
  
  /* ---------------- UI ---------------- */
  
  return (
    <div className="min-h-screen bg-[#0B1220] text-white p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <Link to="/monitor" className="text-gray-400 hover:text-white">
          ← Back
        </Link>

        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Progress Dashboard
        </h1>

        <div />
      </div>

      {/* FILTER */}
      <div className="flex gap-3 mb-6 justify-end">
        {["daily", "monthly", "forever"].map(mode => (
          <button
            key={mode}
            onClick={() => setFilterMode(mode)}
            className={`px-4 py-2 rounded-xl ${
              filterMode === mode
                ? "bg-gradient-to-r from-purple-500 to-pink-500"
                : "bg-gray-800 text-gray-400"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* LOADING */}
      {loading && <p className="text-gray-400">Loading data...</p>}

      {!loading && chartData.length === 0 && (
        <p className="text-gray-400">No data yet 👀</p>
      )}

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">

        <ChartCard title="Stress Trend">
          <LineChart data={chartData}>
            <CartesianGrid stroke="#222" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Line dataKey="stress" stroke="#A855F7" strokeWidth={3} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Screen Time">
          <BarChart data={chartData}>
            <CartesianGrid stroke="#222" />
            <XAxis dataKey="time" />
            <YAxis tickFormatter={(val) => `${Math.floor(val / 60)}m`} />
            
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="screen" fill="#EC4899" />
          </BarChart>
        </ChartCard>

        <ChartCard title="Blink Rate">
          <LineChart data={chartData}>
            <CartesianGrid stroke="#222" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Line dataKey="blink" stroke="#22C55E" strokeWidth={3} />
          </LineChart>
        </ChartCard>

        {/* INSIGHTS */}
        <div className="bg-gray-900 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-4">AI Insights</h2>
          {insights.map((i, idx) => (
            <p key={idx} className="text-gray-400 mb-2">{i}</p>
          ))}
        </div>

      </div>

      {/* TABLE */}
      <div className="mt-10 bg-gray-900 p-6 rounded-2xl overflow-x-auto">
        <h2 className="mb-4 font-semibold">Session Logs</h2>

        <table className="w-full text-left text-sm">
          <thead className="text-gray-400">
            <tr>
              <th>Time</th>
              <th>Stress</th>
              <th>Screen</th>
              <th>Blink</th>
            </tr>
          </thead>

          <tbody>
           {filterMode === "daily" ? (
  dailyLogs.length > 0 ? (
    dailyLogs.map((s, i) => {
      
      return (
        <tr key={i} className="border-t border-gray-800">
          <td>{formatTimeIST(s.created_at)}</td>
          <td>{s.stress_score ?? "-"}</td>
          <td>{formatScreenTime(s.screen_time)}</td>
          <td>{s.blink_rate ?? "-"}</td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="5" className="text-center text-[#9CA3AF] py-6">
        No logs for today 📭
      </td>
    </tr>
  )
) : (
  <tr>
    <td colSpan="5" className="text-center text-[#9CA3AF] py-6">
      Logs available only in Daily view 📅
    </td>
  </tr>
)}
          </tbody>
        </table>
      </div>

    </div>
  );
}

/* ---------------- REUSABLE CARD ---------------- */

function ChartCard({ title, children }) {
  return (
    <div className="bg-gray-900 p-6 rounded-2xl">
      <h2 className="mb-3 font-semibold">{title}</h2>
      <ResponsiveContainer width="100%" height={250}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}