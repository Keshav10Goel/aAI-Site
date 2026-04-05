

// import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from "react";

// /* CONSTANTS */
// const BLINK_EAR_THRESHOLD = 0.2;
// const BLINK_EAR_OPEN_THRESHOLD = 0.25;
// const BLINK_DEBOUNCE_MS = 120;
// const STRESS_UPDATE_INTERVAL_MS = 1000;
// const DISTANCE_THROTTLE_MS = 500;
// const SMOOTHING_FACTOR = 0.75;

// /* HELPERS */
// const dist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

// function computeEAR(lm) {
//   const left = dist(lm[159], lm[145]) / dist(lm[33], lm[133]);
//   const right = dist(lm[386], lm[374]) / dist(lm[263], lm[362]);
//   return (left + right) / 2;
// }

// function getFaceArea(lm, w, h) {
//   let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
//   for (let p of lm) {
//     const x = p.x * w;
//     const y = p.y * h;
//     minX = Math.min(minX, x);
//     minY = Math.min(minY, y);
//     maxX = Math.max(maxX, x);
//     maxY = Math.max(maxY, y);
//   }
//   return (maxX - minX) * (maxY - minY);
// }

// const WebcamFeed = forwardRef((props, ref) => {

//   const {
//     setBlinkRate,
//     setDistance,
//     setRedness,
//     setStressScore,
//     setHeadPosition,
//     setExpression
//   } = props;

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const pipVideoRef = useRef(null);

//   const faceMeshRef = useRef(null);
//   const cameraRef = useRef(null);

//   const blinkTimes = useRef([]);
//   const earHistory = useRef([]);
//   const eyeClosed = useRef(false);
//   const lastBlink = useRef(0);

//   const referenceFace = useRef(null);
//   const calibrated = useRef(false);
//   const distanceRef = useRef("optimal");
//   const throttle = useRef(0);

//   const smoothed = useRef(100);
//   const tooCloseStart = useRef(null);
//   const lastFrame = useRef(0);

//   /* ---------------- PiP ---------------- */
//   const enablePiP = async () => {
//     const canvas = canvasRef.current;
//     const stream = canvas.captureStream(30);

//     if (!pipVideoRef.current) {
//       pipVideoRef.current = document.createElement("video");
//       pipVideoRef.current.muted = true;
//     }

//     pipVideoRef.current.srcObject = stream;
//     await pipVideoRef.current.play();

//     if (document.pictureInPictureElement) {
//       await document.exitPictureInPicture();
//     } else {
//       await pipVideoRef.current.requestPictureInPicture();
//     }
//   };

//   useImperativeHandle(ref, () => ({ enablePiP }));

//   /* ---------------- DRAW UI ---------------- */
//   const drawUI = (ctx, canvas) => {
//     const score = Math.round(smoothed.current);

//     const text = `Stress: ${score}`;
//     ctx.font = "bold 28px sans-serif";

//     const width = ctx.measureText(text).width;
//     const x = canvas.width / 2 - width / 2;
//     const y = canvas.height - 25;

//     let color = "#22C55E";
//     if (score < 70) color = "#facc15";
//     if (score < 40) color = "#ef4444";

//     ctx.fillStyle = "rgba(0,0,0,0.6)";
//     ctx.fillRect(x - 20, y - 35, width + 40, 45);

//     ctx.fillStyle = color;
//     ctx.fillText(text, x, y);

//     if (distanceRef.current === "too close") {
//       if (!tooCloseStart.current) tooCloseStart.current = Date.now();

//       if (Date.now() - tooCloseStart.current > 5000) {
//         ctx.fillStyle = "#EC4899";
//         ctx.fillText("Too Close to Screen", x, y - 45);
//       }
//     } else {
//       tooCloseStart.current = null;
//     }
//   };

//   /* ---------------- MAIN ---------------- */
//   const onResults = useCallback((res) => {

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d", { willReadFrequently: true });

//     /* MIRROR FIX */
//     ctx.save();
//     ctx.scale(-1, 1);
//     ctx.drawImage(res.image, -canvas.width, 0, canvas.width, canvas.height);
//     ctx.restore();

//     drawUI(ctx, canvas);

//     if (!res.multiFaceLandmarks?.length) return;

//     const lm = res.multiFaceLandmarks[0];
//     const w = res.image.width;
//     const h = res.image.height;

//     /* BLINK */
//     const ear = computeEAR(lm);
//     earHistory.current.push(ear);
//     if (earHistory.current.length > 5) earHistory.current.shift();

//     const avg = earHistory.current.reduce((a,b)=>a+b,0)/earHistory.current.length;

//     if (avg < BLINK_EAR_THRESHOLD && !eyeClosed.current) eyeClosed.current = true;

//     if (avg > BLINK_EAR_OPEN_THRESHOLD && eyeClosed.current) {
//       const now = Date.now();
//       if (now - lastBlink.current > BLINK_DEBOUNCE_MS) {
//         blinkTimes.current.push(now);
//         lastBlink.current = now;
//       }
//       eyeClosed.current = false;
//     }

//     /* DISTANCE */
//     const area = getFaceArea(lm, w, h);

//     if (!calibrated.current) {
//       referenceFace.current = area;
//       calibrated.current = true;
//     }

//     let state = "optimal";
//     const ratio = area / referenceFace.current;

//     if (ratio > 1.3) state = "too close";
//     else if (ratio < 0.7) state = "too far";

//     distanceRef.current = state;

//     if (Date.now() - throttle.current > DISTANCE_THROTTLE_MS) {
//       setDistance(state);
//       throttle.current = Date.now();
//     }

//     /* HEAD */
//     const nose = lm[1];
//     const yaw = (nose.x - 0.5) * 60;
//     const pitch = (nose.y - 0.5) * 40;

//     setHeadPosition({ yaw, pitch });

//     setExpression("neutral");
//     setRedness("normal");

//   }, []);

//   /* ---------------- STRESS ---------------- */
//   useEffect(() => {
//     const interval = setInterval(() => {

//       const now = Date.now();
//       blinkTimes.current = blinkTimes.current.filter(t => now - t < 60000);

//       const rate = blinkTimes.current.length;
//       setBlinkRate(rate);

//       let score = 100;

//       if (rate < 15) score -= 5;
//       if (rate < 10) score -= 10;
//       if (rate < 6) score -= 15;

//       if (distanceRef.current === "too close") score -= 12;

//       score = Math.max(20, Math.min(100, score));

//       smoothed.current =
//         smoothed.current * SMOOTHING_FACTOR +
//         score * (1 - SMOOTHING_FACTOR);

//       setStressScore(Math.round(smoothed.current));

//     }, STRESS_UPDATE_INTERVAL_MS);

//     return () => clearInterval(interval);

//   }, []);

//   /* ---------------- INIT ---------------- */
//   useEffect(() => {

//     const init = async () => {

//       const faceMesh = new window.FaceMesh({
//         locateFile: file =>
//           `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
//       });

//       faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true });
//       faceMesh.onResults(onResults);

//       faceMeshRef.current = faceMesh;

//       const camera = new window.Camera(videoRef.current, {
//         onFrame: async () => {
//           if (Date.now() - lastFrame.current > 50) {
//             lastFrame.current = Date.now();
//             await faceMesh.send({ image: videoRef.current });
//           }
//         },
//         width: 640,
//         height: 480
//       });

//       await camera.start();
//       cameraRef.current = camera;
//     };

//     init();

//     return () => {
//       cameraRef.current?.stop();
//       faceMeshRef.current?.close();
//     };

//   }, [onResults]);

//   return (
//     <div className="w-full h-full">
//       <video ref={videoRef} autoPlay muted playsInline className="hidden" />
//       <canvas ref={canvasRef} width="640" height="480" className="w-full h-full rounded-xl shadow-xl" />
//     </div>
//   );
// });

// export default WebcamFeed;


// import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from "react";

// /* CONSTANTS */
// const BLINK_EAR_THRESHOLD = 0.2;
// const BLINK_EAR_OPEN_THRESHOLD = 0.25;
// const BLINK_DEBOUNCE_MS = 120;
// const STRESS_UPDATE_INTERVAL_MS = 1000;
// const DISTANCE_THROTTLE_MS = 500;
// const SMOOTHING_FACTOR = 0.75;

// /* HELPERS */
// const dist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

// function computeEAR(lm) {
//   const left = dist(lm[159], lm[145]) / dist(lm[33], lm[133]);
//   const right = dist(lm[386], lm[374]) / dist(lm[263], lm[362]);
//   return (left + right) / 2;
// }

// function getFaceArea(lm, w, h) {
//   let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
//   for (let p of lm) {
//     const x = p.x * w;
//     const y = p.y * h;
//     minX = Math.min(minX, x);
//     minY = Math.min(minY, y);
//     maxX = Math.max(maxX, x);
//     maxY = Math.max(maxY, y);
//   }
//   return (maxX - minX) * (maxY - minY);
// }

// const WebcamFeed = forwardRef((props, ref) => {

//   const {
//     setBlinkRate,
//     setDistance,
//     setRedness,
//     setStressScore,
//     setHeadPosition,
//     setExpression
//   } = props;

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const pipVideoRef = useRef(null);

//   const faceMeshRef = useRef(null);
//   const cameraRef = useRef(null);

//   const blinkTimes = useRef([]);
//   const earHistory = useRef([]);
//   const eyeClosed = useRef(false);
//   const lastBlink = useRef(0);

//   const referenceFace = useRef(null);
//   const calibrated = useRef(false);
//   const distanceRef = useRef("optimal");
//   const throttle = useRef(0);

//   const smoothed = useRef(100);
//   const tooCloseStart = useRef(null);
//   const lastFrame = useRef(0);

//   /* ---------------- PiP ---------------- */
//   const enablePiP = async () => {
//     const canvas = canvasRef.current;
//     const stream = canvas.captureStream(30);

//     if (!pipVideoRef.current) {
//       pipVideoRef.current = document.createElement("video");
//       pipVideoRef.current.muted = true;
//     }

//     pipVideoRef.current.srcObject = stream;
//     await pipVideoRef.current.play();

//     if (document.pictureInPictureElement) {
//       await document.exitPictureInPicture();
//     } else {
//       await pipVideoRef.current.requestPictureInPicture();
//     }
//   };

//   useImperativeHandle(ref, () => ({ enablePiP }));

//   /* ---------------- DRAW UI ---------------- */
//   const drawUI = (ctx, canvas) => {
//     const score = Math.round(smoothed.current);

//     const text = `Stress: ${score}`;
//     ctx.font = "bold 28px sans-serif";

//     const width = ctx.measureText(text).width;
//     const x = canvas.width / 2 - width / 2;
//     const y = canvas.height - 25;

//     let color = "#22C55E";
//     if (score < 70) color = "#facc15";
//     if (score < 40) color = "#ef4444";

//     ctx.fillStyle = "rgba(0,0,0,0.6)";
//     ctx.fillRect(x - 20, y - 35, width + 40, 45);

//     ctx.fillStyle = color;
//     ctx.fillText(text, x, y);

//     if (distanceRef.current === "too close") {
//       if (!tooCloseStart.current) tooCloseStart.current = Date.now();

//       if (Date.now() - tooCloseStart.current > 5000) {
//         ctx.fillStyle = "#EC4899";
//         ctx.fillText("Too Close to Screen", x, y - 45);
//       }
//     } else {
//       tooCloseStart.current = null;
//     }
//   };

//   /* ---------------- MAIN ---------------- */
//   const onResults = useCallback((res) => {

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d", { willReadFrequently: true });

//     ctx.save();
//     ctx.scale(-1, 1);
//     ctx.drawImage(res.image, -canvas.width, 0, canvas.width, canvas.height);
//     ctx.restore();

//     drawUI(ctx, canvas);

//     if (!res.multiFaceLandmarks?.length) return;

//     const lm = res.multiFaceLandmarks[0];
//     const w = res.image.width;
//     const h = res.image.height;

//     /* BLINK */
//     const ear = computeEAR(lm);
//     earHistory.current.push(ear);
//     if (earHistory.current.length > 5) earHistory.current.shift();

//     const avg = earHistory.current.reduce((a,b)=>a+b,0)/earHistory.current.length;

//     if (avg < BLINK_EAR_THRESHOLD && !eyeClosed.current) eyeClosed.current = true;

//     if (avg > BLINK_EAR_OPEN_THRESHOLD && eyeClosed.current) {
//       const now = Date.now();
//       if (now - lastBlink.current > BLINK_DEBOUNCE_MS) {
//         blinkTimes.current.push(now);
//         lastBlink.current = now;
//       }
//       eyeClosed.current = false;
//     }

//     /* DISTANCE */
//     const area = getFaceArea(lm, w, h);

//     if (!calibrated.current) {
//       referenceFace.current = area;
//       calibrated.current = true;
//     }

//     let state = "optimal";
//     const ratio = area / referenceFace.current;

//     if (ratio > 1.3) state = "too close";
//     else if (ratio < 0.7) state = "too far";

//     distanceRef.current = state;

//     if (Date.now() - throttle.current > DISTANCE_THROTTLE_MS) {
//       setDistance(state);
//       throttle.current = Date.now();
//     }

//     /* HEAD */
//     const nose = lm[1];
//     const yaw = (nose.x - 0.5) * 60;
//     const pitch = (nose.y - 0.5) * 40;

//     setHeadPosition({ yaw, pitch });

//     setExpression("neutral");
//     setRedness("normal");

//   }, []);

//   /* ---------------- IMPROVED STRESS BASE ---------------- */
//   useEffect(() => {
//     const interval = setInterval(() => {

//       const now = Date.now();
//       blinkTimes.current = blinkTimes.current.filter(t => now - t < 60000);

//       const rate = blinkTimes.current.length;
//       setBlinkRate(rate);

//       let score = 100;

//       // blink contribution
//       if (rate >= 15 && rate <= 20) score += 5;
//       else if (rate < 10) score -= 15;
//       else if (rate > 25) score -= 8;

//       // distance contribution
//       if (distanceRef.current === "too close") score -= 15;
//       else if (distanceRef.current === "too far") score -= 8;

//       score = Math.max(20, Math.min(100, score));

//       smoothed.current =
//         smoothed.current * SMOOTHING_FACTOR +
//         score * (1 - SMOOTHING_FACTOR);

//       setStressScore(Math.round(smoothed.current));

//     }, STRESS_UPDATE_INTERVAL_MS);

//     return () => clearInterval(interval);

//   }, []);

//   /* ---------------- INIT ---------------- */
//   useEffect(() => {

//     const init = async () => {

//       const faceMesh = new window.FaceMesh({
//         locateFile: file =>
//           `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
//       });

//       faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true });
//       faceMesh.onResults(onResults);

//       faceMeshRef.current = faceMesh;

//       const camera = new window.Camera(videoRef.current, {
//         onFrame: async () => {
//           if (Date.now() - lastFrame.current > 50) {
//             lastFrame.current = Date.now();
//             await faceMesh.send({ image: videoRef.current });
//           }
//         },
//         width: 640,
//         height: 480
//       });

//       await camera.start();
//       cameraRef.current = camera;
//     };

//     init();

//     return () => {
//       cameraRef.current?.stop();
//       faceMeshRef.current?.close();
//     };

//   }, [onResults]);

//   return (
//     <div className="w-full h-full">
//       <video ref={videoRef} autoPlay muted playsInline className="hidden" />
//       <canvas ref={canvasRef} width="640" height="480" className="w-full h-full rounded-xl shadow-xl" />
//     </div>
//   );
// });

// export default WebcamFeed;

// import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from "react";

// /* CONSTANTS */
// const BLINK_EAR_THRESHOLD = 0.2;
// const BLINK_EAR_OPEN_THRESHOLD = 0.25;
// const BLINK_DEBOUNCE_MS = 120;
// const STRESS_UPDATE_INTERVAL_MS = 1000;
// const STATE_THROTTLE_MS = 500;
// const SMOOTHING_FACTOR = 0.75;
// const FACE_TIMEOUT_MS = 1500;

// /* HELPERS */
// const dist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

// function computeEAR(lm) {
//   const left = dist(lm[159], lm[145]) / dist(lm[33], lm[133]);
//   const right = dist(lm[386], lm[374]) / dist(lm[263], lm[362]);
//   return (left + right) / 2;
// }

// function computeMAR(lm) {
//   const width = dist(lm[78], lm[308]); 
//   const height = dist(lm[13], lm[14]); 
//   return width === 0 ? 0 : height / width;
// }

// function getFaceArea(lm, w, h) {
//   let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
//   for (let p of lm) {
//     const x = p.x * w;
//     const y = p.y * h;
//     minX = Math.min(minX, x);
//     minY = Math.min(minY, y);
//     maxX = Math.max(maxX, x);
//     maxY = Math.max(maxY, y);
//   }
//   return (maxX - minX) * (maxY - minY);
// }

// const WebcamFeed = forwardRef((props, ref) => {

//   const {
//     setBlinkRate,
//     setDistance,
//     setRedness,
//     setStressScore,
//     setHeadPosition,
//     setExpression,
//     screenTime
//   } = props;

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const pipVideoRef = useRef(null);

//   const faceMeshRef = useRef(null);
//   const cameraRef = useRef(null);

//   const blinkTimes = useRef([]);
//   const earHistory = useRef([]);
//   const eyeClosed = useRef(false);
//   const lastBlink = useRef(0);

//   const referenceFace = useRef(null);
//   const calibrated = useRef(false);
  
//   // Tracking Refs to prevent unnecessary re-renders
//   const distanceRef = useRef("unknown");
//   const headStateRef = useRef({ yaw: 0, pitch: 0, aligned: true });
//   const expressionRef = useRef("neutral");
  
//   const throttle = useRef(0);
//   const lastFaceTime = useRef(0);
//   const sessionStart = useRef(Date.now());

//   const smoothed = useRef(100);
//   const tooCloseStart = useRef(null);
//   const lastFrame = useRef(0);

//   /* ---------------- PiP ---------------- */
//   const enablePiP = async () => {
//     const canvas = canvasRef.current;
//     const stream = canvas.captureStream(30);

//     if (!pipVideoRef.current) {
//       pipVideoRef.current = document.createElement("video");
//       pipVideoRef.current.muted = true;
//     }

//     pipVideoRef.current.srcObject = stream;
//     await pipVideoRef.current.play();

//     if (document.pictureInPictureElement) {
//       await document.exitPictureInPicture();
//     } else {
//       await pipVideoRef.current.requestPictureInPicture();
//     }
//   };

//   useImperativeHandle(ref, () => ({ enablePiP }));

//   /* ---------------- DRAW UI ---------------- */
//   const drawUI = (ctx, canvas) => {
//     const score = Math.round(smoothed.current);

//     const text = `Stress: ${score}`;
//     ctx.font = "bold 28px sans-serif";

//     const width = ctx.measureText(text).width;
//     const x = canvas.width / 2 - width / 2;
//     const y = canvas.height - 25;

//     let color = "#22C55E";
//     if (score < 70) color = "#facc15";
//     if (score < 40) color = "#ef4444";

//     ctx.fillStyle = "rgba(0,0,0,0.6)";
//     ctx.fillRect(x - 20, y - 35, width + 40, 45);

//     ctx.fillStyle = color;
//     ctx.fillText(text, x, y);

//     if (distanceRef.current === "too close") {
//       if (!tooCloseStart.current) tooCloseStart.current = Date.now();

//       if (Date.now() - tooCloseStart.current > 5000) {
//         ctx.fillStyle = "#EC4899";
//         ctx.fillText("Too Close to Screen", x, y - 45);
//       }
//     } else {
//       tooCloseStart.current = null;
//     }
//   };

//   /* ---------------- MAIN ---------------- */
//   const onResults = useCallback((res) => {

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d", { willReadFrequently: true });

//     ctx.save();
//     ctx.scale(-1, 1);
//     ctx.drawImage(res.image, -canvas.width, 0, canvas.width, canvas.height);
//     ctx.restore();

//     drawUI(ctx, canvas);

//     if (!res.multiFaceLandmarks?.length) return;

//     // Face detected
//     lastFaceTime.current = Date.now();
//     const lm = res.multiFaceLandmarks[0];
//     const w = res.image.width;
//     const h = res.image.height;

//     /* BLINK */
//     const ear = computeEAR(lm);
//     earHistory.current.push(ear);
//     if (earHistory.current.length > 5) earHistory.current.shift();

//     const avg = earHistory.current.reduce((a,b)=>a+b,0)/earHistory.current.length;

//     if (avg < BLINK_EAR_THRESHOLD && !eyeClosed.current) eyeClosed.current = true;

//     if (avg > BLINK_EAR_OPEN_THRESHOLD && eyeClosed.current) {
//       const now = Date.now();
//       if (now - lastBlink.current > BLINK_DEBOUNCE_MS) {
//         blinkTimes.current.push(now);
//         lastBlink.current = now;
//       }
//       eyeClosed.current = false;
//     }

//     /* DISTANCE */
//     const area = getFaceArea(lm, w, h);

//     if (!calibrated.current) {
//       referenceFace.current = area;
//       calibrated.current = true;
//     }

//     let distState = "optimal";
//     const ratio = area / referenceFace.current;

//     if (ratio > 1.3) distState = "too close";
//     else if (ratio < 0.7) distState = "too far";
//     distanceRef.current = distState;

//     /* HEAD POSITION */
//     const nose = lm[1];
//     const yaw = (nose.x - 0.5) * 60;
//     const pitch = (nose.y - 0.5) * 40;
//     const aligned = Math.abs(yaw) < 15 && Math.abs(pitch) < 15;
//     headStateRef.current = { yaw, pitch, aligned };

//     /* EXPRESSION DETECTOR */
//     const mar = computeMAR(lm);
//     const smileRatio = dist(lm[78], lm[308]) / dist(lm[234], lm[454]);
//     const sleepyEyes = avg < 0.23 && avg > 0.15; 
    
//     let exprState = "neutral";
//     if (mar > 0.5) exprState = "yawning";
//     else if (smileRatio > 0.40 && mar < 0.2) exprState = "smiling";
//     else if (sleepyEyes) exprState = "sleepy";
//     else if (aligned) exprState = "focused";

//     expressionRef.current = exprState;

//     /* THROTTLED STATE UPDATES (To keep React Fast) */
//     if (Date.now() - throttle.current > STATE_THROTTLE_MS) {
//       setDistance(distState);
//       setHeadPosition({ yaw, pitch });
//       setExpression(exprState);
//       setRedness("normal"); // Required to keep UI intact, redness logic removed completely
//       throttle.current = Date.now();
//     }

//   }, [setDistance, setHeadPosition, setExpression, setRedness]);

//   /* ---------------- IMPROVED STRESS SCORING ENGINE ---------------- */
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const now = Date.now();
//       const faceVisible = (now - lastFaceTime.current) < FACE_TIMEOUT_MS;

//       // 🛑 RULE: NO FACE -> INSTANT RESET
//       if (!faceVisible) {
//         setBlinkRate(0);
//         setDistance("unknown");
//         setStressScore(0);
//         smoothed.current = 0; // Hard reset smoothing
//         return; 
//       }

//       /* BLINK OPTIMIZATION & RESPONSIVE SAMPLING */
//       blinkTimes.current = blinkTimes.current.filter(t => now - t < 60000);
      
//       const sessionLength = Math.max(1, (now - sessionStart.current) / 1000);
//       let calculatedRate = blinkTimes.current.length;
      
//       // If we haven't reached 60s yet, extrapolate to make it responsive
//       if (sessionLength < 60) {
//         calculatedRate = Math.round(calculatedRate * (60 / sessionLength));
//       }
//       setBlinkRate(calculatedRate);

//       /* BASE SCORE START */
//       let score = 100;

//       // 👁️ Blink Contribution
//       if (calculatedRate >= 15 && calculatedRate <= 20) score += 5;
//       else if (calculatedRate < 10) score -= 20; // Strong penalty
//       else if (calculatedRate > 25) score -= 10; // Mild penalty

//       // 📏 Distance Contribution
//       if (distanceRef.current === "too close") score -= 20;
//       else if (distanceRef.current === "too far") score -= 10;
//       else if (distanceRef.current === "unknown") score -= 5;

//       // 🧍 Head Position Contribution
//       if (headStateRef.current.aligned) score += 5;
//       else score -= 15;

//       // 😴 Facial Expression Contribution
//       const expr = expressionRef.current;
//       if (expr === "focused" || expr === "smiling") score += 10;
//       else if (expr === "sleepy") score -= 25;
//       else if (expr === "yawning") score -= 40;

//       // ⏱️ Screen Time Impact
//       if (screenTime > 60) {
//         const extraPenalty = Math.floor(screenTime - 60) * 1;
//         score -= extraPenalty;
//       }

//       // 🧮 Clamp & Smooth
//       score = Math.max(0, Math.min(100, score)); // Strict clamp 0 to 100

//       smoothed.current = 
//         smoothed.current * SMOOTHING_FACTOR + 
//         score * (1 - SMOOTHING_FACTOR);

//       setStressScore(Math.round(smoothed.current));

//     }, STRESS_UPDATE_INTERVAL_MS);

//     return () => clearInterval(interval);

//   }, [screenTime, setBlinkRate, setDistance, setStressScore]);

//   /* ---------------- INIT ---------------- */
//   useEffect(() => {

//     const init = async () => {

//       const faceMesh = new window.FaceMesh({
//         locateFile: file =>
//           `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
//       });

//       faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true });
//       faceMesh.onResults(onResults);

//       faceMeshRef.current = faceMesh;

//       const camera = new window.Camera(videoRef.current, {
//         onFrame: async () => {
//           if (Date.now() - lastFrame.current > 50) { // Keep ~20 FPS efficiency
//             lastFrame.current = Date.now();
//             await faceMesh.send({ image: videoRef.current });
//           }
//         },
//         width: 640,
//         height: 480
//       });

//       await camera.start();
//       cameraRef.current = camera;
//     };

//     init();

//     return () => {
//       cameraRef.current?.stop();
//       faceMeshRef.current?.close();
//     };

//   }, [onResults]);

//   return (
//     <div className="w-full h-full">
//       <video ref={videoRef} autoPlay muted playsInline className="hidden" />
//       <canvas ref={canvasRef} width="640" height="480" className="w-full h-full rounded-xl shadow-xl" />
//     </div>
//   );
// });

// export default WebcamFeed;


import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from "react";

/* CONSTANTS */
const BLINK_EAR_THRESHOLD = 0.2;
const BLINK_EAR_OPEN_THRESHOLD = 0.25;
const BLINK_DEBOUNCE_MS = 300;
const STRESS_UPDATE_INTERVAL_MS = 1000;
const STATE_THROTTLE_MS = 500;
const SMOOTHING_FACTOR = 0.75;
const FACE_TIMEOUT_MS = 1500;

/* HELPERS */
const dist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

function computeEAR(lm) {
  const left = dist(lm[159], lm[145]) / dist(lm[33], lm[133]);
  const right = dist(lm[386], lm[374]) / dist(lm[263], lm[362]);
  return (left + right) / 2;
}

function computeMAR(lm) {
  const width = dist(lm[78], lm[308]); 
  const height = dist(lm[13], lm[14]); 
  return width === 0 ? 0 : height / width;
}

function getFaceArea(lm, w, h) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let p of lm) {
    const x = p.x * w;
    const y = p.y * h;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  return (maxX - minX) * (maxY - minY);
}

const WebcamFeed = forwardRef((props, ref) => {

  const {
    setBlinkRate,
    setDistance,
    setRedness,
    setStressScore,
    setHeadPosition,
    setExpression,
    screenTime
  } = props;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const pipVideoRef = useRef(null);

  const faceMeshRef = useRef(null);
  const cameraRef = useRef(null);

  const blinkTimes = useRef([]);
  const earHistory = useRef([]);
  const eyeClosed = useRef(false);
  const lastBlink = useRef(0);
  const closeFrames = useRef(0);
  const referenceFace = useRef(null);
  const calibrated = useRef(false);
  
  const distanceRef = useRef("unknown");
  const headStateRef = useRef({ yaw: 0, pitch: 0 });
  const expressionRef = useRef("neutral");
  
  const throttle = useRef(0);
  const lastFaceTime = useRef(0);
  const sessionStart = useRef(Date.now());

  const smoothed = useRef(100);
  const tooCloseStart = useRef(null);
  const lastFrame = useRef(0);
  const stopCamera = () => {
  try {
    // Stop MediaPipe
    faceMeshRef.current?.reset?.();
    faceMeshRef.current?.close();

    // Stop Camera instance
    cameraRef.current?.stop();

    // 🔥 CRITICAL: Stop actual webcam stream
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

  } catch (err) {
    console.error("Stop camera error:", err);
  }
};

  /* PiP */
  const enablePiP = async () => {
  const canvas = canvasRef.current;

  if (!canvas) {
    console.warn("Canvas not ready");
    return;
  }

  const stream = canvas.captureStream(30);

  if (!pipVideoRef.current) {
    pipVideoRef.current = document.createElement("video");
    pipVideoRef.current.muted = true;
    pipVideoRef.current.playsInline = true; // 🔥 extra safety (no side effects)
  }

  pipVideoRef.current.srcObject = stream;

  try {
    await pipVideoRef.current.play();

    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else {
      await pipVideoRef.current.requestPictureInPicture();
    }
  } catch (err) {
    console.error("PiP error:", err);
  }
};

  useImperativeHandle(ref, () => ({
  enablePiP,
  stopCamera, // 🔥 expose this
}));

  /* DRAW */
  const drawUI = (ctx, canvas) => {
    const score = Math.round(smoothed.current);

    const text = `Stress: ${score}`;
    ctx.font = "bold 28px sans-serif";

    const width = ctx.measureText(text).width;
    const x = canvas.width / 2 - width / 2;
    const y = canvas.height - 25;

    let color = "#22C55E";
    if (score < 70) color = "#facc15";
    if (score < 40) color = "#ef4444";

    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(x - 20, y - 35, width + 40, 45);

    ctx.fillStyle = color;
    ctx.fillText(text, x, y);

    if (distanceRef.current === "too close") {
  if (!tooCloseStart.current) tooCloseStart.current = Date.now();

  if (Date.now() - tooCloseStart.current > 5000) {
    ctx.fillStyle = "#EC4899";
    ctx.fillText("Too Close to Screen", x, y - 45);
  }
} else {
  tooCloseStart.current = null;
}
  };

  /* MAIN */
  const onResults = useCallback((res) => {
   try{
   const canvas = canvasRef.current;
if (!canvas) return;

const ctx = canvas.getContext("2d", { willReadFrequently: true });
if (!ctx) return;
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(res.image, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    drawUI(ctx, canvas);

    if (!res.multiFaceLandmarks?.length) return;

    lastFaceTime.current = Date.now();

    const lm = res.multiFaceLandmarks[0];
    const w = res.image.width;
    const h = res.image.height;

    /* BLINK */
const ear = computeEAR(lm);

earHistory.current.push(ear);
if (earHistory.current.length > 3) earHistory.current.shift();

const prevEAR = earHistory.current[earHistory.current.length - 2] || ear;
const smoothedEAR = ear * 0.7 + prevEAR * 0.3;

// 👁️ CLOSE DETECTION (stable)
if (smoothedEAR < BLINK_EAR_THRESHOLD) {
  closeFrames.current++;

  if (closeFrames.current >= 2 && !eyeClosed.current) {
    eyeClosed.current = true;
  }
} else {
  closeFrames.current = 0;
}

// 👁️ OPEN + COUNT
if (smoothedEAR > BLINK_EAR_OPEN_THRESHOLD && eyeClosed.current) {
  const now = Date.now();

  if (now - lastBlink.current > BLINK_DEBOUNCE_MS) {
    blinkTimes.current.push(now);
    lastBlink.current = now;
  }

  eyeClosed.current = false;
}
    /* DISTANCE */
    const area = getFaceArea(lm, w, h);

    if (!calibrated.current) {
      referenceFace.current = area;
      calibrated.current = true;
    }

    const ratio = area / referenceFace.current;

    if (ratio > 1.3) distanceRef.current = "too close";
    else if (ratio < 0.7) distanceRef.current = "too far";
    else distanceRef.current = "optimal";

    /* HEAD */
    /* HEAD (IMPROVED LOGIC) */

// Eyes se center nikaal
const leftEye = lm[33];
const rightEye = lm[263];

// Eye center
const eyeCenterX = (leftEye.x + rightEye.x) / 2;
const eyeCenterY = (leftEye.y + rightEye.y) / 2;

// Yaw (left-right)
const yaw = (eyeCenterX - 0.5) * 100;

// Pitch (up-down)
const pitch = (eyeCenterY - 0.5) * 100;

// Roll (actual tilt detection 🔥)
const dy = rightEye.y - leftEye.y;
const dx = rightEye.x - leftEye.x;
const roll = Math.atan2(dy, dx) * (180 / Math.PI);

// Final state
headStateRef.current = {
  yaw,
  pitch,
  roll
};
  

    /* EXPRESSION */
    const mar = computeMAR(lm);
    const smileRatio = dist(lm[78], lm[308]) / dist(lm[234], lm[454]);

   const sleepyEyes = smoothedEAR < 0.23 && smoothedEAR > 0.15;

let exprState = "neutral";

if (mar > 0.5) exprState = "yawning";
else if (smileRatio > 0.40 && mar < 0.2) exprState = "smiling";
else if (sleepyEyes) exprState = "sleepy";
else if (Math.abs(headStateRef.current.yaw) < 12 && Math.abs(headStateRef.current.roll) < 10)
  exprState = "focused";

expressionRef.current = exprState;

    if (Date.now() - throttle.current > STATE_THROTTLE_MS) {
      setDistance(distanceRef.current);
      setHeadPosition(headStateRef.current);
      setExpression(expressionRef.current);
      throttle.current = Date.now();
    }
  } catch (err){
    console.error("FaceMesh Error:",err);
  }
  }, [setBlinkRate,
  setDistance,
  setHeadPosition,
  setExpression]);

  /* 🚀 NEW STRESS ENGINE */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      const faceVisible = (now - lastFaceTime.current) < FACE_TIMEOUT_MS;

      if (!faceVisible) {
        smoothed.current = 0;
        setStressScore(0);
        return;
      }

      blinkTimes.current = blinkTimes.current.filter(t => now - t < 60000);
      const blinkRate = blinkTimes.current.length;
      setBlinkRate(blinkRate);

      let score = 100;

      /* BLINK */
      let blinkPenalty = 0;
      if (blinkRate < 15) blinkPenalty += (15 - blinkRate) * 0.8;
      if (blinkRate < 10) blinkPenalty += (10 - blinkRate) * 1.2;
      if (blinkRate < 6) blinkPenalty += (6 - blinkRate) * 2;
      score -= Math.min(40, blinkPenalty);

      /* DISTANCE */
      if (distanceRef.current === "too close") score -= 20;
      else if (distanceRef.current === "too far") score -= 10;

      /* HEAD */
      const yaw = Math.abs(headStateRef.current.yaw);
      const pitch = Math.abs(headStateRef.current.pitch);

      let headPenalty = 0;
      if (yaw > 15) headPenalty += (yaw - 15) * 0.6;
      if (pitch > 15) headPenalty += (pitch - 15) * 0.6;

      score -= Math.min(20, headPenalty);

      /* EXPRESSION */
      const expr = expressionRef.current;

if (expr === "smiling" || expr === "focused") {
  score += 8;
}
else if (expr === "sleepy") {
  score -= 18;
}
else if (expr === "yawning") {
  score -= 25;
}
else if (expr === "eyebrow_raised") {
  score -= 6;
}

      /* SCREEN TIME */
      const minutes = (now - sessionStart.current) / 60000;

      if (minutes > 30) score -= (minutes - 30) * 0.2;
      if (minutes > 60) score -= (minutes - 60) * 0.3;

      /* CLAMP */
      score = Math.max(0, Math.min(100, score));

      /* SMOOTH */
      smoothed.current =
        smoothed.current * SMOOTHING_FACTOR +
        score * (1 - SMOOTHING_FACTOR);

      setStressScore(Math.round(smoothed.current));

    }, STRESS_UPDATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  /* INIT */
  useEffect(() => {
    const init = async () => {
      const faceMesh = new window.FaceMesh({
        locateFile: file =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });

faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});      faceMesh.onResults(onResults);
      faceMeshRef.current = faceMesh;
      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (Date.now() - lastFrame.current > 30) {
            lastFrame.current = Date.now();
            try {
  await faceMesh.send({ image: videoRef.current });
} catch (err) {
  console.error("Frame send error:", err);
}
          }
        },
        width: 640,
        height: 480
      });

      await camera.start();
      cameraRef.current = camera;
      if (videoRef.current) {
      // videoRef.current.onloadedmetadata = async () => {
        try {
          await videoRef.current.play();
        } catch (err) {
          console.warn("Video play failed:", err);
        }
      };
    }
  
    

    init();

    return () => {};
  }, []);

  return (
    <div className="w-full h-full">
      <video ref={videoRef} autoPlay muted playsInline className="hidden" />
      <canvas ref={canvasRef} width="640" height="480" className="w-full h-full rounded-xl shadow-xl" />
    </div>
  );
});

export default WebcamFeed;