// import { useEffect, useState } from "react";

// const Footer = () => {
//   const [eyes, setEyes] = useState(0);
//   const [blink, setBlink] = useState(0);
//   const [sessions, setSessions] = useState(0);

//   // Count-up animation
//   useEffect(() => {
//     let e = 0, b = 0, s = 0;

//     const interval = setInterval(() => {
//       if (e < 1284) e += 12;
//       if (b < 32) b += 1;
//       if (s < 87) s += 1;

//       setEyes(e);
//       setBlink(b);
//       setSessions(s);

//       if (e >= 1284 && b >= 32 && s >= 87) {
//         clearInterval(interval);
//       }
//     }, 30);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <footer className="mt-32 bg-[#0B1220] border-t border-white/5 relative overflow-hidden">

//       {/* 🌊 WAVEFORM */}
//       <div className="absolute inset-0 opacity-30">
//         <div className="wave"></div>
//       </div>

//       <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">

//         {/* 🔴 STATUS */}
//         <div className="flex items-center justify-center gap-3 mb-8">
//           <span className="relative flex h-3 w-3">
//             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//             <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
//           </span>

//           <p className="text-[#E5E7EB] font-medium tracking-wide">
//             System Status: <span className="text-green-400">ACTIVE</span>
//           </p>
//         </div>

//         {/* 📊 METRICS */}
//         <div className="grid md:grid-cols-3 gap-6 text-center mb-10">

//           <Metric label="Eyes Protected Today 👁️" value={eyes} />
//           <Metric label="Avg Blink Rate Saved" value={`${blink}%`} />
//           <Metric label="Active Sessions" value={sessions} />

//         </div>

//         {/* 💬 TAGLINE */}
//         <div className="text-center">
//           <p className="text-lg font-semibold bg-gradient-to-r from-[#A855F7] to-[#EC4899] bg-clip-text text-transparent animate-fadeIn">
//             Your eyes never blink alone.
//           </p>
//         </div>

//       </div>

//       {/* ✨ CUSTOM CSS */}
//       <style>{`
//         .wave {
//           position: absolute;
//           width: 200%;
//           height: 100%;
//           background: linear-gradient(90deg, transparent, #A855F7, #EC4899, transparent);
//           opacity: 0.2;
//           animation: waveMove 6s linear infinite;
//           filter: blur(40px);
//         }

//         @keyframes waveMove {
//           0% { transform: translateX(-50%); }
//           100% { transform: translateX(0%); }
//         }

//         @keyframes fadeIn {
//           0% { opacity: 0; transform: translateY(10px); }
//           100% { opacity: 1; transform: translateY(0); }
//         }

//         .animate-fadeIn {
//           animation: fadeIn 1.5s ease forwards;
//         }
//       `}</style>

//     </footer>
//   );
// };

// const Metric = ({ label, value }) => (
//   <div className="bg-gradient-to-br from-[#111827] to-[#1F2937] rounded-2xl p-6 shadow-xl hover:shadow-purple-500/10 transition">

//     <p className="text-[#9CA3AF] text-sm mb-2 tracking-wide">
//       {label}
//     </p>

//     <h3 className="text-2xl font-bold text-[#E5E7EB] tracking-wide glow">
//       {value}
//     </h3>

//     <style>{`
//       .glow {
//         text-shadow: 0 0 8px rgba(168,85,247,0.4), 0 0 12px rgba(236,72,153,0.3);
//       }
//     `}</style>

//   </div>
// );

// export default Footer;

import { useEffect, useState } from "react";

const Footer = () => {
  const [eyes, setEyes] = useState(0);
  const [blink, setBlink] = useState(0);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    let e = 0, b = 0, s = 0;

    const interval = setInterval(() => {
      if (e < 2847) e += 25;
      if (b < 46) b += 1;
      if (s < 132) s += 1;

      setEyes(e);
      setBlink(b);
      setSessions(s);

      if (e >= 2847 && b >= 46 && s >= 132) {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="mt-32 bg-[#0B1220] border-t border-white/10 relative overflow-hidden">

      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="aurora"></div>
      </div>

      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="wave"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">

        <div className="flex items-center justify-center gap-3 mb-12">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#22C55E] shadow-[0_0_10px_#22C55E]"></span>
          </span>

          <p className="text-[#E5E7EB] font-medium tracking-wide text-sm md:text-base">
            System Status: <span className="text-[#22C55E] animate-pulse">ACTIVE</span>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-center mb-14">

          <Metric label="Eyes Protected Today 👁️" value={eyes} />
          <Metric label="Avg Blink Rate Saved" value={`${blink}%`} />
          <Metric label="Active Monitoring Sessions" value={sessions} />

        </div>

        <div className="text-center space-y-2">
          <p className="text-lg md:text-xl font-semibold bg-gradient-to-r from-[#A855F7] to-[#EC4899] bg-clip-text text-transparent animate-fadeIn">
            Your eyes never blink alone.
          </p>

          <p className="text-[#9CA3AF] text-sm animate-fadeIn delay-200">
            Real-time AI continuously monitoring and protecting your vision.
          </p>
        </div>

        <br />
        <div className="text-center space-y-2">
          <p className="text-lg md:text-xl font-semibold bg-gradient-to-r from-[#A855F7] to-[#EC4899] bg-clip-text text-transparent animate-fadeIn">
            Made by Team Tech Titans...
          </p>
          <p className="text-[#9CA3AF] text-sm animate-fadeIn delay-200"></p>
          </div>

      </div>

      <style>{`
        .wave {
          position: absolute;
          width: 200%;
          height: 100%;
          background: linear-gradient(90deg, transparent, #A855F7, #EC4899, transparent);
          opacity: 0.1;
          animation: waveMove 8s linear infinite;
          filter: blur(60px);
        }

        @keyframes waveMove {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }

        .aurora {
          position: absolute;
          width: 150%;
          height: 150%;
          background: radial-gradient(circle at 20% 30%, #A855F7, transparent 40%),
                      radial-gradient(circle at 80% 70%, #EC4899, transparent 40%);
          animation: floatGlow 10s ease-in-out infinite alternate;
          filter: blur(90px);
          opacity: 0.25;
        }

        @keyframes floatGlow {
          0% { transform: translateY(-15px); }
          100% { transform: translateY(15px); }
        }

        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 1.2s ease forwards;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .glow {
          text-shadow: 0 0 8px rgba(168,85,247,0.4),
                       0 0 16px rgba(236,72,153,0.3);
        }
      `}</style>

    </footer>
  );
};

const Metric = ({ label, value }) => {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    setDisplay(value);
  }, [value]);

  return (
    <div className="bg-gradient-to-br from-[#111827] to-[#1F2937] rounded-2xl p-6 shadow-lg hover:shadow-xl hover:shadow-[#A855F7]/10 transition-all duration-300">

      <p className="text-[#9CA3AF] text-sm mb-2 tracking-wide">
        {label}
      </p>

      <h3 className="text-3xl font-bold text-[#E5E7EB] glow tracking-wide">
        {display}
      </h3>

    </div>
  );
};

export default Footer;
