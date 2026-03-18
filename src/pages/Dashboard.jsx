
// // // import { useState, useEffect } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import WebcamFeed from "../components/WebcamFeed";
// // // import { ArrowLeft } from "lucide-react";

// // // const Dashboard = () => {

// // // const navigate = useNavigate();

// // // /* ----------- STATE ----------- */

// // // const [isMonitoring,setIsMonitoring] = useState(false);

// // // const [blinkRate,setBlinkRate] = useState(0);
// // // const [distance,setDistance] = useState("unknown");
// // // const [expression,setExpression] = useState("neutral");
// // // const [redness,setRedness] = useState("normal");
// // // const [headPosition,setHeadPosition] = useState("aligned");

// // // const [stressScore,setStressScore] = useState(100);
// // // const [screenTime,setScreenTime] = useState(0);

// // // /* ----------- SCREEN TIMER ----------- */

// // // useEffect(()=>{

// // // if(!isMonitoring) return;

// // // const timer = setInterval(()=>{

// // // setScreenTime(prev=>prev+1);

// // // },60000);

// // // return ()=> clearInterval(timer);

// // // },[isMonitoring]);

// // // /* ----------- FORMAT TIME ----------- */

// // // const formatTime = (minutes)=>{

// // // const hrs = Math.floor(minutes/60);
// // // const mins = minutes % 60;

// // // if(hrs===0) return `${mins} min`;

// // // return `${hrs}h ${mins}m`;

// // // };

// // // /* ----------- CONTROLS ----------- */

// // // const startMonitoring = ()=>{
// // // setIsMonitoring(true);
// // // };

// // // const resetMonitoring = ()=>{
// // // setIsMonitoring(false);
// // // setBlinkRate(0);
// // // setScreenTime(0);
// // // setStressScore(100);
// // // };

// // // /* ----------- UI ----------- */

// // // return (

// // // <div className="min-h-screen bg-gray-50 px-10 py-8">

// // // {/* HEADER */}

// // // <div className="flex justify-between items-center mb-10">

// // // <button
// // // onClick={()=>navigate("/")}
// // // className="flex items-center gap-2 text-gray-600"
// // // >
// // // <ArrowLeft size={18}/>
// // // Back to Home
// // // </button>

// // // <h1 className="text-3xl font-bold text-purple-600">
// // // aAI-Site Dashboard
// // // </h1>

// // // <button
// // // onClick={()=>navigate("/progress")}
// // // className="text-purple-600 font-medium"
// // // >
// // // Progress
// // // </button>

// // // </div>


// // // {/* GRID */}

// // // <div className="grid grid-cols-3 gap-8">

// // // {/* CAMERA PANEL */}

// // // <div className="bg-white rounded-xl shadow p-6">

// // // <h2 className="font-semibold text-lg mb-4">
// // // Camera Setup
// // // </h2>

// // // <div className="bg-purple-50 rounded-lg h-[260px] overflow-hidden">

// // // {isMonitoring && (

// // // <WebcamFeed
// // // setBlinkRate={setBlinkRate}
// // // setDistance={setDistance}
// // // setRedness={setRedness}
// // // setStressScore={setStressScore}
// // // setHeadPosition={setHeadPosition}
// // // setExpression={setExpression}
// // // />

// // // )}

// // // </div>

// // // <button
// // // onClick={() => setIsMonitoring(!isMonitoring)}
// // // className={`mt-5 w-full py-2 rounded-lg text-white transition ${
// // //   isMonitoring
// // //     ? "bg-red-500 hover:bg-red-600"
// // //     : "bg-purple-500 hover:bg-purple-600"
// // // }`}
// // // >
// // // {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
// // // </button>

// // // </div>


// // // {/* STRESS SCORE */}

// // // <div className="bg-white rounded-xl shadow p-6 text-center">

// // // <h2 className="font-semibold text-lg">
// // // Stress Score
// // // </h2>

// // // <p className="text-sm text-gray-500 mb-6">
// // // Your current eye strain level
// // // </p>

// // // <div className="flex justify-center">

// // // <div className="w-44 h-44 border-8 border-purple-200 rounded-full flex items-center justify-center">

// // // <span className="text-5xl font-bold text-green-600">
// // // {stressScore}
// // // </span>

// // // </div>

// // // </div>

// // // <div className="flex justify-between mt-6 text-sm">

// // // <span className="text-red-500">Poor</span>
// // // <span className="text-yellow-500">Fair</span>
// // // <span className="text-green-600">Good</span>

// // // </div>

// // // <p className="text-gray-500 mt-3 text-sm">
// // // Eye health score based on all metrics
// // // </p>

// // // <div className="flex justify-center gap-4 mt-6">

// // // <button
// // // onClick={startMonitoring}
// // // className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
// // // >
// // // Start Monitoring
// // // </button>

// // // <button
// // // onClick={resetMonitoring}
// // // className="border px-4 py-2 rounded-lg"
// // // >
// // // Reset
// // // </button>

// // // </div>

// // // </div>


// // // {/* METRICS */}

// // // <div className="bg-white rounded-xl shadow p-6">

// // // <h2 className="font-semibold text-lg mb-4">
// // // Eye Health Metrics
// // // </h2>

// // // <Metric label="Screen Time" value={formatTime(screenTime)}/>

// // // <Metric label="Blink Rate" value={`${blinkRate} bpm`} good/>

// // // <Metric label="Distance" value={distance}/>

// // // <Metric label="Head Position" value={headPosition}/>

// // // <Metric label="Expression" value={expression}/>

// // // <Metric label="Eye Redness" value={redness}/>

// // // </div>

// // // </div>

// // // </div>

// // // );

// // // };

// // // export default Dashboard;


// // // /* METRIC COMPONENT */

// // // const Metric = ({label,value,good}) => (

// // // <div className="flex justify-between py-3 border-b text-sm">

// // // <span className="text-gray-600">
// // // {label}
// // // </span>

// // // <span className={`${good ? "text-green-600":"text-gray-800"}`}>
// // // {value}
// // // </span>

// // // </div>

// // // );
// // // import { useState, useEffect } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import WebcamFeed from "../components/WebcamFeed";
// // // import { ArrowLeft } from "lucide-react";

// // // const Dashboard = () => {
// // //   const navigate = useNavigate();

// // //   const [isMonitoring, setIsMonitoring] = useState(false);
// // //   const [blinkRate, setBlinkRate] = useState(0);
// // //   const [distance, setDistance] = useState("unknown");
// // //   const [expression, setExpression] = useState("neutral");
// // //   const [redness, setRedness] = useState("normal");
// // //   const [headPosition, setHeadPosition] = useState("aligned");
// // //   const [stressScore, setStressScore] = useState(100);
// // //   const [screenTime, setScreenTime] = useState(0);

// // //   useEffect(() => {
// // //     if (!isMonitoring) return;

// // //     const timer = setInterval(() => {
// // //       setScreenTime((prev) => prev + 1);
// // //     }, 60000);

// // //     return () => clearInterval(timer);
// // //   }, [isMonitoring]);

// // //   const formatTime = (minutes) => {
// // //     const hrs = Math.floor(minutes / 60);
// // //     const mins = minutes % 60;
// // //     return hrs === 0 ? `${mins} min` : `${hrs}h ${mins}m`;
// // //   };

// // //   const getScoreColor = () => {
// // //     if (stressScore >= 70) return "text-green-500 border-green-200";
// // //     if (stressScore >= 40) return "text-yellow-500 border-yellow-200";
// // //     return "text-red-500 border-red-200";
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 px-10 py-8">
// // //       {/* HEADER */}
// // //       <div className="flex justify-between items-center mb-10">
// // //         <button
// // //           onClick={() => navigate("/")}
// // //           className="flex items-center gap-2 text-gray-600 hover:text-black"
// // //         >
// // //           <ArrowLeft size={18} /> Back
// // //         </button>

// // //         <h1 className="text-3xl font-bold text-purple-600">
// // //           aAI-Site Dashboard
// // //         </h1>

// // //         <button
// // //           onClick={() => navigate("/progress")}
// // //           className="text-purple-600 font-medium hover:underline"
// // //         >
// // //           Progress
// // //         </button>
// // //       </div>

// // //       {/* GRID */}
// // //       <div className="grid grid-cols-3 gap-8">
// // //         {/* CAMERA PANEL */}
// // //         <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6">
// // //           <h2 className="font-semibold text-lg mb-4">Camera</h2>

// // //           <div className="rounded-xl overflow-hidden h-[260px] bg-black">
// // //             {isMonitoring && (
// // //               <WebcamFeed
// // //                 setBlinkRate={setBlinkRate}
// // //                 setDistance={setDistance}
// // //                 setRedness={setRedness}
// // //                 setStressScore={setStressScore}
// // //                 setHeadPosition={setHeadPosition}
// // //                 setExpression={setExpression}
// // //               />
// // //             )}
// // //           </div>

// // //           <button
// // //             onClick={() => setIsMonitoring(!isMonitoring)}
// // //             className={`mt-5 w-full py-2 rounded-lg text-white transition ${
// // //               isMonitoring
// // //                 ? "bg-red-500 hover:bg-red-600"
// // //                 : "bg-purple-500 hover:bg-purple-600"
// // //             }`}
// // //           >
// // //             {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
// // //           </button>
// // //         </div>

// // //         {/* STRESS SCORE */}
// // //         <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 text-center">
// // //           <h2 className="font-semibold text-lg">Stress Score</h2>

// // //           <div className="flex justify-center mt-6">
// // //             <div
// // //               className={`w-44 h-44 border-8 rounded-full flex items-center justify-center ${getScoreColor()}`}
// // //             >
// // //               <span className="text-5xl font-bold">
// // //                 {stressScore}
// // //               </span>
// // //             </div>
// // //           </div>

// // //           <p className="text-gray-500 mt-4 text-sm">
// // //             Real-time eye strain indicator
// // //           </p>

// // //           <div className="flex justify-center gap-4 mt-6">
// // //             <button
// // //               onClick={() => setIsMonitoring(true)}
// // //               className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
// // //             >
// // //               Start
// // //             </button>

// // //             <button
// // //               onClick={() => {
// // //                 setIsMonitoring(false);
// // //                 setBlinkRate(0);
// // //                 setScreenTime(0);
// // //                 setStressScore(100);
// // //               }}
// // //               className="border px-4 py-2 rounded-lg"
// // //             >
// // //               Reset
// // //             </button>
// // //           </div>
// // //         </div>

// // //         {/* METRICS + CAT VIDEO */}
// // //         <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6">
// // //           <h2 className="font-semibold text-lg mb-4">Metrics</h2>

// // //           <Metric label="Screen Time" value={formatTime(screenTime)} />
// // //           <Metric label="Blink Rate" value={`${blinkRate} bpm`} good />
// // //           <Metric label="Distance" value={distance} />
// // //           <Metric label="Head Position" value={headPosition} />
// // //           <Metric label="Expression" value={expression} />
// // //           <Metric label="Eye Redness" value={redness} />

// // //           {/* CAT VIDEO */}
// // //           <div className="mt-6 rounded-xl overflow-hidden">
// // //             <video
// // //               autoPlay
// // //               loop
// // //               muted
// // //               className="w-full rounded-xl"
// // //             >
// // //               {/* <source src="323473.mp4" type="video/mp4" /> */}
// // //             </video>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;

// // // const Metric = ({ label, value, good }) => (
// // //   <div className="flex justify-between py-2 text-sm">
// // //     <span className="text-gray-600">{label}</span>
// // //     <span className={`${good ? "text-green-500" : "text-gray-800"}`}>
// // //       {value}
// // //     </span>
// // //   </div>
// // // );
// // // import { useState, useEffect } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import WebcamFeed from "../components/WebcamFeed";
// // // import { ArrowLeft } from "lucide-react";

// // // const Dashboard = () => {
// // //   const navigate = useNavigate();

// // //   const [isMonitoring, setIsMonitoring] = useState(false);
// // //   const [blinkRate, setBlinkRate] = useState(0);
// // //   const [distance, setDistance] = useState("unknown");
// // //   const [expression, setExpression] = useState("neutral");
// // //   const [redness, setRedness] = useState("normal");
// // //   const [headPosition, setHeadPosition] = useState("aligned");
// // //   const [stressScore, setStressScore] = useState(100);
// // //   const [screenTime, setScreenTime] = useState(0);

// // //   useEffect(() => {
// // //     if (!isMonitoring) return;

// // //     const timer = setInterval(() => {
// // //       setScreenTime((prev) => prev + 1);
// // //     }, 60000);

// // //     return () => clearInterval(timer);
// // //   }, [isMonitoring]);

// // //   const formatTime = (minutes) => {
// // //     const hrs = Math.floor(minutes / 60);
// // //     const mins = minutes % 60;
// // //     return hrs === 0 ? `${mins} min` : `${hrs}h ${mins}m`;
// // //   };

// // //   const getScoreColor = () => {
// // //     if (stressScore >= 70) return "text-green-500 border-green-200";
// // //     if (stressScore >= 40) return "text-yellow-500 border-yellow-200";
// // //     return "text-red-500 border-red-200";
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 px-10 py-8">

// // //       {/* HEADER */}
// // //       <div className="flex justify-between items-center mb-10">
// // //         <button
// // //           onClick={() => navigate("/")}
// // //           className="flex items-center gap-2 text-gray-600 hover:text-black"
// // //         >
// // //           <ArrowLeft size={18} /> Back
// // //         </button>

// // //         <h1 className="text-3xl font-bold text-purple-600">
// // //           aAI-Site Dashboard
// // //         </h1>

// // //         <button
// // //           onClick={() => navigate("/progress")}
// // //           className="text-purple-600 font-medium hover:underline"
// // //         >
// // //           Progress
// // //         </button>
// // //       </div>

// // //       {/* GRID */}
// // //       <div className="grid grid-cols-3 gap-8 items-start">

// // //         {/* CAMERA PANEL */}
// // //         <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6">
// // //           <h2 className="font-semibold text-lg mb-4">Camera</h2>

// // //           <div className="rounded-xl overflow-hidden h-[260px] bg-black">
// // //             {isMonitoring && (
// // //               <WebcamFeed
// // //                 setBlinkRate={setBlinkRate}
// // //                 setDistance={setDistance}
// // //                 setRedness={setRedness}
// // //                 setStressScore={setStressScore}
// // //                 setHeadPosition={setHeadPosition}
// // //                 setExpression={setExpression}
// // //               />
// // //             )}
// // //           </div>

// // //           <button
// // //             onClick={() => setIsMonitoring(!isMonitoring)}
// // //             className={`mt-5 w-full py-2 rounded-lg text-white transition ${
// // //               isMonitoring
// // //                 ? "bg-red-500 hover:bg-red-600"
// // //                 : "bg-purple-500 hover:bg-purple-600"
// // //             }`}
// // //           >
// // //             {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
// // //           </button>
// // //         </div>

// // //         {/* STRESS SCORE (COMPACT) */}
// // //         <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 text-center h-fit">

// // //           <h2 className="font-semibold text-lg">Stress Score</h2>

// // //           <div className="flex justify-center mt-4">
// // //             <div
// // //               className={`w-36 h-36 border-8 rounded-full flex items-center justify-center ${getScoreColor()}`}
// // //             >
// // //               <span className="text-4xl font-bold">
// // //                 {stressScore}
// // //               </span>
// // //             </div>
// // //           </div>

// // //           <p className="text-gray-500 mt-3 text-sm">
// // //             Real-time eye strain indicator
// // //           </p>

// // //           <div className="flex justify-center gap-3 mt-4">
// // //             <button
// // //               onClick={() => setIsMonitoring(true)}
// // //               className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
// // //             >
// // //               Start
// // //             </button>

// // //             <button
// // //               onClick={() => {
// // //                 setIsMonitoring(false);
// // //                 setBlinkRate(0);
// // //                 setScreenTime(0);
// // //                 setStressScore(100);
// // //               }}
// // //               className="border px-4 py-2 rounded-lg"
// // //             >
// // //               Reset
// // //             </button>
// // //           </div>

// // //         </div>

// // //         {/* METRICS */}
// // //         <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6">
// // //           <h2 className="font-semibold text-lg mb-4">Metrics</h2>

// // //           <Metric label="Screen Time" value={formatTime(screenTime)} />
// // //           <Metric label="Blink Rate" value={`${blinkRate} bpm`} good />
// // //           <Metric label="Distance" value={distance} />
// // //           <Metric label="Head Position" value={headPosition} />
// // //           <Metric label="Expression" value={expression} />
// // //           <Metric label="Eye Redness" value={redness} />
// // //         </div>

// // //       </div>

// // //       {/* 🎬 CENTER VIDEO BLOCK */}
// // //       <div className="flex justify-center mt-12">

// // //         <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-4 w-[320px]">

// // //           <video
// // //             autoPlay
// // //             loop
// // //             muted
// // //             className="w-full h-[200px] object-cover rounded-xl"
// // //           >
// // //             <source src="/323473.mp4" type="video/mp4" />
// // //           </video>

// // //         </div>

// // //       </div>

// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;

// // // const Metric = ({ label, value, good }) => (
// // //   <div className="flex justify-between py-2 text-sm">
// // //     <span className="text-gray-600">{label}</span>
// // //     <span className={`${good ? "text-green-500" : "text-gray-800"}`}>
// // //       {value}
// // //     </span>
// // //   </div>
// // // );
// // import { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import WebcamFeed from "../components/WebcamFeed";
// // import { ArrowLeft } from "lucide-react";

// // const Dashboard = () => {
// //   const navigate = useNavigate();

// //   const [isMonitoring, setIsMonitoring] = useState(false);
// //   const [blinkRate, setBlinkRate] = useState(0);
// //   const [distance, setDistance] = useState("unknown");
// //   const [expression, setExpression] = useState("neutral");
// //   const [redness, setRedness] = useState("normal");
// //   const [headPosition, setHeadPosition] = useState("aligned");
// //   const [stressScore, setStressScore] = useState(100);
// //   const [screenTime, setScreenTime] = useState(0);

// //   useEffect(() => {
// //     if (!isMonitoring) return;

// //     const timer = setInterval(() => {
// //       setScreenTime((prev) => prev + 1);
// //     }, 60000);

// //     return () => clearInterval(timer);
// //   }, [isMonitoring]);

// //   const formatTime = (minutes) => {
// //     const hrs = Math.floor(minutes / 60);
// //     const mins = minutes % 60;
// //     return hrs === 0 ? `${mins} min` : `${hrs}h ${mins}m`;
// //   };

// //   const getScoreColor = () => {
// //     if (stressScore >= 70) return "text-green-500 border-green-200";
// //     if (stressScore >= 40) return "text-yellow-500 border-yellow-200";
// //     return "text-red-500 border-red-200";
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 px-10 py-8">

// //       {/* HEADER */}
// //       <div className="flex justify-between items-center mb-10">
// //         <button
// //           onClick={() => navigate("/")}
// //           className="flex items-center gap-2 text-gray-600 hover:text-black"
// //         >
// //           <ArrowLeft size={18} /> Back
// //         </button>

// //         <h1 className="text-3xl font-bold text-purple-600">
// //           aAI-Site Dashboard
// //         </h1>

// //         <button
// //           onClick={() => navigate("/progress")}
// //           className="text-purple-600 font-medium hover:underline"
// //         >
// //           Progress
// //         </button>
// //       </div>

// //       {/* GRID */}
// //       <div className="grid grid-cols-3 gap-8 items-start">

// //         {/* CAMERA PANEL */}
// //         <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 h-[360px] flex flex-col">
// //           <h2 className="font-semibold text-lg mb-4">Camera</h2>

// //           <div className="rounded-xl overflow-hidden h-[220px] bg-black">
// //             {isMonitoring && (
// //               <WebcamFeed
// //                 setBlinkRate={setBlinkRate}
// //                 setDistance={setDistance}
// //                 setRedness={setRedness}
// //                 setStressScore={setStressScore}
// //                 setHeadPosition={setHeadPosition}
// //                 setExpression={setExpression}
// //               />
// //             )}
// //           </div>

// //           <button
// //             onClick={() => setIsMonitoring(!isMonitoring)}
// //             className={`mt-4 w-full py-2 rounded-lg text-white transition ${
// //               isMonitoring
// //                 ? "bg-red-500 hover:bg-red-600"
// //                 : "bg-purple-500 hover:bg-purple-600"
// //             }`}
// //           >
// //             {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
// //           </button>
// //         </div>

// //         {/* STRESS SCORE */}
// //         <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 text-center h-fit">

// //           <h2 className="font-semibold text-lg">Stress Score</h2>

// //           <div className="flex justify-center mt-4">
// //             <div
// //               className={`w-36 h-36 border-8 rounded-full flex items-center justify-center ${getScoreColor()}`}
// //             >
// //               <span className="text-4xl font-bold">
// //                 {stressScore}
// //               </span>
// //             </div>
// //           </div>

// //           <p className="text-gray-500 mt-3 text-sm">
// //             Real-time eye strain indicator
// //           </p>

// //           <div className="flex justify-center gap-3 mt-4">
// //             <button
// //               onClick={() => setIsMonitoring(true)}
// //               className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
// //             >
// //               Start
// //             </button>

// //             <button
// //               onClick={() => {
// //                 setIsMonitoring(false);
// //                 setBlinkRate(0);
// //                 setScreenTime(0);
// //                 setStressScore(100);
// //               }}
// //               className="border px-4 py-2 rounded-lg"
// //             >
// //               Reset
// //             </button>
// //           </div>

// //         </div>

// //         {/* METRICS (MATCH HEIGHT WITH CAMERA) */}
// //         <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 h-[360px] flex flex-col">
// //           <h2 className="font-semibold text-lg mb-4">Metrics</h2>

// //           <div className="flex-1 overflow-hidden">
// //             <Metric label="Screen Time" value={formatTime(screenTime)} />
// //             <Metric label="Blink Rate" value={`${blinkRate} bpm`} good />
// //             <Metric label="Distance" value={distance} />
// //             <Metric label="Head Position" value={headPosition} />
// //             <Metric label="Expression" value={expression} />
// //             <Metric label="Eye Redness" value={redness} />
// //           </div>
// //         </div>

// //       </div>

// //       {/* 🎬 CAT VIDEO CENTER (FIXED CROPPING) */}
// //       <div className="flex justify-center mt-8">

// //         <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-3 w-[340px]">

// //           <video
// //             autoPlay
// //             loop
// //             muted
// //             className="w-full h-[220px] object-cover object-[center_30%] rounded-xl"
// //           >
// //             <source src="/323473.mp4" type="video/mp4" />
// //           </video>

// //         </div>

// //       </div>

// //     </div>
// //   );
// // };

// // export default Dashboard;

// // const Metric = ({ label, value, good }) => (
// //   <div className="flex justify-between py-2 text-sm">
// //     <span className="text-gray-600">{label}</span>
// //     <span className={`${good ? "text-green-500" : "text-gray-800"}`}>
// //       {value}
// //     </span>
// //   </div>
// // );

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import WebcamFeed from "../components/WebcamFeed";
// import { ArrowLeft } from "lucide-react";

// const Dashboard = () => {
//   const navigate = useNavigate();

//   const [isMonitoring, setIsMonitoring] = useState(false);
//   const [blinkRate, setBlinkRate] = useState(0);
//   const [distance, setDistance] = useState("unknown");
//   const [expression, setExpression] = useState("neutral");
//   const [redness, setRedness] = useState("normal");
//   const [headPosition, setHeadPosition] = useState("aligned");
//   const [stressScore, setStressScore] = useState(100);
//   const [screenTime, setScreenTime] = useState(0);

//   useEffect(() => {
//     if (!isMonitoring) return;

//     const timer = setInterval(() => {
//       setScreenTime((prev) => prev + 1);
//     }, 60000);

//     return () => clearInterval(timer);
//   }, [isMonitoring]);

//   const formatTime = (minutes) => {
//     const hrs = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return hrs === 0 ? `${mins} min` : `${hrs}h ${mins}m`;
//   };

//   const getScoreColor = () => {
//     if (stressScore >= 70) return "text-green-500 border-green-200";
//     if (stressScore >= 40) return "text-yellow-500 border-yellow-200";
//     return "text-red-500 border-red-200";
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 px-10 py-8">

//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-10">
//         <button
//           onClick={() => navigate("/")}
//           className="flex items-center gap-2 text-gray-600 hover:text-black"
//         >
//           <ArrowLeft size={18} /> Back
//         </button>

//         <h1 className="text-3xl font-bold text-purple-600">
//           aAI-Site Dashboard
//         </h1>

//         <button
//           onClick={() => navigate("/progress")}
//           className="text-purple-600 font-medium hover:underline"
//         >
//           Progress
//         </button>
//       </div>

//       {/* GRID */}
//       <div className="grid grid-cols-3 gap-8 items-start">

//         {/* CAMERA */}
//         <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 h-[360px] flex flex-col">
//           <h2 className="font-semibold text-lg mb-4">Camera</h2>

//           <div className="rounded-xl overflow-hidden h-[220px] bg-black">
//             {isMonitoring && (
//               <WebcamFeed
//                 setBlinkRate={setBlinkRate}
//                 setDistance={setDistance}
//                 setRedness={setRedness}
//                 setStressScore={setStressScore}
//                 setHeadPosition={setHeadPosition}
//                 setExpression={setExpression}
//               />
//             )}
//           </div>

//           <button
//             onClick={() => setIsMonitoring(!isMonitoring)}
//             className={`mt-4 w-full py-2 rounded-lg text-white ${
//               isMonitoring
//                 ? "bg-red-500"
//                 : "bg-purple-500"
//             }`}
//           >
//             {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
//           </button>
//         </div>

//         {/* STRESS */}
//         <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 text-center h-fit">

//           <h2 className="font-semibold text-lg">Stress Score</h2>

//           <div className="flex justify-center mt-4">
//             <div className={`w-36 h-36 border-8 rounded-full flex items-center justify-center ${getScoreColor()}`}>
//               <span className="text-4xl font-bold">{stressScore}</span>
//             </div>
//           </div>

//           <p className="text-gray-500 mt-3 text-sm">
//             Real-time eye strain indicator
//           </p>

//           <div className="flex justify-center gap-3 mt-4">
//             <button
//               onClick={() => setIsMonitoring(true)}
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//             >
//               Start
//             </button>

//             <button
//               onClick={() => {
//                 setIsMonitoring(false);
//                 setBlinkRate(0);
//                 setScreenTime(0);
//                 setStressScore(100);
//               }}
//               className="border px-4 py-2 rounded-lg"
//             >
//               Reset
//             </button>
//           </div>
//         </div>

//         {/* METRICS */}
//         <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 h-[360px] flex flex-col">
//           <h2 className="font-semibold text-lg mb-4">Metrics</h2>

//           <div className="flex-1">
//             <Metric label="Screen Time" value={formatTime(screenTime)} />
//             <Metric label="Blink Rate" value={`${blinkRate} bpm`} good />
//             <Metric label="Distance" value={distance} />
//             <Metric label="Head Position" value={headPosition} />
//             <Metric label="Expression" value={expression} />
//             <Metric label="Eye Redness" value={redness} />
//           </div>
//         </div>

//       </div>

//       {/* 🎬 CAT VIDEO FIXED */}
//       <div className="flex justify-center mt-6">

//         <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-2 w-[320px] overflow-hidden">

//           <video
//             autoPlay
//             loop
//             muted
//             className="w-full h-[220px] object-cover scale-125 -translate-y-[60px] rounded-xl"
//           >
//             <source src="/323473.mp4" type="video/mp4" />
//           </video>

//         </div>

//       </div>

//     </div>
//   );
// };

// export default Dashboard;

// const Metric = ({ label, value, good }) => (
//   <div className="flex justify-between py-2 text-sm">
//     <span className="text-gray-600">{label}</span>
//     <span className={good ? "text-green-500" : "text-gray-800"}>
//       {value}
//     </span>
//   </div>
// );
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WebcamFeed from "../components/WebcamFeed";
import { ArrowLeft } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const [isMonitoring, setIsMonitoring] = useState(false);
  const [blinkRate, setBlinkRate] = useState(0);
  const [distance, setDistance] = useState("unknown");
  const [expression, setExpression] = useState("neutral");
  const [redness, setRedness] = useState("normal");
  const [headPosition, setHeadPosition] = useState("aligned");
  const [stressScore, setStressScore] = useState(100);
  const [screenTime, setScreenTime] = useState(0);

  useEffect(() => {
    if (!isMonitoring) return;
    const timer = setInterval(() => {
      setScreenTime((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(timer);
  }, [isMonitoring]);

  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs === 0 ? `${mins} min` : `${hrs}h ${mins}m`;
  };

  const getScoreColor = () => {
    if (stressScore >= 70) return "text-green-500 border-green-200";
    if (stressScore >= 40) return "text-yellow-500 border-yellow-200";
    return "text-red-500 border-red-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 px-10 py-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-600">
          <ArrowLeft size={18} /> Back
        </button>

        <h1 className="text-3xl font-bold text-purple-600">
          aAI-Site Dashboard
        </h1>

        <button onClick={() => navigate("/progress")} className="text-purple-600 font-medium">
          Progress
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-3 gap-8 items-start">

        {/* CAMERA */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 h-[360px] flex flex-col">
          <h2 className="font-semibold text-lg mb-4">Camera</h2>

          <div className="rounded-xl overflow-hidden h-[220px] bg-black">
            {isMonitoring && (
              <WebcamFeed
                setBlinkRate={setBlinkRate}
                setDistance={setDistance}
                setRedness={setRedness}
                setStressScore={setStressScore}
                setHeadPosition={setHeadPosition}
                setExpression={setExpression}
              />
            )}
          </div>

          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`mt-4 w-full py-2 rounded-lg text-white ${
              isMonitoring ? "bg-red-500" : "bg-purple-500"
            }`}
          >
            {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
          </button>
        </div>

        {/* STRESS */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 text-center h-fit">
          <h2 className="font-semibold text-lg">Stress Score</h2>

          <div className="flex justify-center mt-4">
            <div className={`w-36 h-36 border-8 rounded-full flex items-center justify-center ${getScoreColor()}`}>
              <span className="text-4xl font-bold">{stressScore}</span>
            </div>
          </div>

          <p className="text-gray-500 mt-3 text-sm">
            Real-time eye strain indicator
          </p>

          <div className="flex justify-center gap-3 mt-4">
            <button onClick={() => setIsMonitoring(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              Start
            </button>

            <button
              onClick={() => {
                setIsMonitoring(false);
                setBlinkRate(0);
                setScreenTime(0);
                setStressScore(100);
              }}
              className="border px-4 py-2 rounded-lg"
            >
              Reset
            </button>
          </div>
        </div>

        {/* METRICS */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 h-[360px] flex flex-col">
          <h2 className="font-semibold text-lg mb-4">Metrics</h2>

          <div className="flex-1">
            <Metric label="Screen Time" value={formatTime(screenTime)} />
            <Metric label="Blink Rate" value={`${blinkRate} bpm`} good />
            <Metric label="Distance" value={distance} />
            <Metric label="Head Position" value={headPosition} />
            <Metric label="Expression" value={expression} />
            <Metric label="Eye Redness" value={redness} />
          </div>
        </div>

      </div>

      {/* 🎬 CAT VIDEO (FINAL FIX) */}
      <div className="flex justify-center mt-6">

        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg w-[150px] h-[240px] overflow-hidden">

          <video
            autoPlay
            loop
            muted
            className="w-full h-full object-cover scale-[o.2] translate-y-[-120px]"
          >
            <source src="/billi.mp4" type="video/mp4" />
          </video>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;

const Metric = ({ label, value, good }) => (
  <div className="flex justify-between py-2 text-sm">
    <span className="text-gray-600">{label}</span>
    <span className={good ? "text-green-500" : "text-gray-800"}>
      {value}
    </span>
  </div>
);