// // import { useEffect, useRef } from "react";

// // const WebcamFeed = ({
// //   setBlinkRate = () => {},
// //   setDistance = () => {},
// //   setRedness = () => {},
// //   setStressScore = () => {},
// //   setHeadPosition = () => {},
// //   setExpression = () => {},
// //   triggerAlert = () => {}
// // }) => {

// //   const videoRef = useRef(null);
// //   const canvasRef = useRef(null);

// //   const faceMeshRef = useRef(null);
// //   const cameraRef = useRef(null);

// //   const blinkTimes = useRef([]);
// //   const eyeClosed = useRef(false);
// //   const lastBlinkTime = useRef(0);

// //   const eyeHistory = useRef([]);
// //   const rednessHistory = useRef([]);

// //   const expressionRef = useRef("focused");
// //   const distanceRef = useRef("optimal");
// //   const headRef = useRef("aligned");

// //   const smoothedScore = useRef(100);
// //   const smooth = (prev, current) => prev * 0.8 + current * 0.2;

// //   const detectRedness = (imageData) => {
// //     let redPixels = 0;
// //     let total = 0;
// //     const data = imageData.data;

// //     for (let i = 0; i < data.length; i += 4) {
// //       const r = data[i];
// //       const g = data[i + 1];
// //       const b = data[i + 2];

// //       if (r > g * 1.15 && r > b * 1.15) redPixels++;
// //       total++;
// //     }

// //     return redPixels / total;
// //   };

// //   useEffect(() => {

// //     if (!window.FaceMesh || !window.Camera) {
// //       console.error("MediaPipe not loaded");
// //       return;
// //     }

// //     const faceMesh = new window.FaceMesh({
// //       locateFile: (file) =>
// //         `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
// //     });

// //     faceMesh.setOptions({
// //       maxNumFaces: 1,
// //       refineLandmarks: true
// //     });

// //     faceMesh.onResults((results) => {

// //       const canvas = canvasRef.current;
// //       if (!canvas) return;

// //       const ctx = canvas.getContext("2d");
// //       ctx.clearRect(0, 0, canvas.width, canvas.height);
// //       ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

// //       if (!results.multiFaceLandmarks?.length) return;

// //       const lm = results.multiFaceLandmarks[0];

// //       /* ---------- BLINK ---------- */
// //       const raw = Math.abs(lm[159].y - lm[145].y);

// //       eyeHistory.current.push(raw);
// //       if (eyeHistory.current.length > 5) eyeHistory.current.shift();

// //       const avgEye =
// //         eyeHistory.current.reduce((a, b) => a + b, 0) /
// //         eyeHistory.current.length;

// //       if (avgEye < 0.025 && !eyeClosed.current)
// //         eyeClosed.current = true;

// //       if (avgEye > 0.03 && eyeClosed.current) {
// //         const now = Date.now();
// //         if (now - lastBlinkTime.current > 150) {
// //           blinkTimes.current.push(now);
// //           lastBlinkTime.current = now;
// //         }
// //         eyeClosed.current = false;
// //       }

// //       /* ---------- DISTANCE ---------- */
// //       const z = lm[1].z;

// //       if (z < -0.10) distanceRef.current = "too close";
// //       else if (z > -0.07) distanceRef.current = "too far";
// //       else distanceRef.current = "optimal";

// //       setDistance(distanceRef.current);

// //       /* ---------- HEAD ---------- */
// //       const tilt =
// //         (lm[263].y - lm[33].y) /
// //         (lm[263].x - lm[33].x);

// //       const headState = Math.abs(tilt) > 0.1 ? "tilted" : "aligned";
// //       headRef.current = headState;
// //       setHeadPosition(headState);

// //       /* ---------- EXPRESSION ---------- */
// //       const mouthOpen = Math.abs(lm[13].y - lm[14].y);
// //       const mouthWidth = Math.abs(lm[61].x - lm[291].x);
// //       const browHeight = Math.abs(lm[65].y - lm[295].y);

// //       let expression = "focused";

// //       if (avgEye < 0.015) expression = "drowsy";
// //       else if (mouthOpen > 0.06) expression = "yawning";
// //       else if (mouthWidth > 0.07 && avgEye > 0.02) expression = "relaxed";
// //       else if (avgEye < 0.02 && browHeight < 0.02) expression = "strained";

// //       if (expressionRef.current !== expression) {
// //         expressionRef.current = expression;
// //         setExpression(expression);
// //       }

// //       /* ---------- REDNESS ---------- */
// //       const lx = lm[33].x * canvas.width;
// //       const ly = lm[33].y * canvas.height;

// //       if (lx > 20 && ly > 20 && lx < canvas.width - 20 && ly < canvas.height - 20) {

// //         const region = ctx.getImageData(lx - 10, ly - 10, 20, 20);
// //         const redness = detectRedness(region);

// //         rednessHistory.current.push(redness);
// //         if (rednessHistory.current.length > 10)
// //           rednessHistory.current.shift();

// //         const avgRed =
// //           rednessHistory.current.reduce((a, b) => a + b, 0) /
// //           rednessHistory.current.length;

// //         if (avgRed > 0.45) setRedness("high");
// //         else if (avgRed > 0.30) setRedness("moderate");
// //         else setRedness("normal");
// //       }

// //     });

// //     faceMeshRef.current = faceMesh;

// //     const camera = new window.Camera(videoRef.current, {
// //       onFrame: async () => {
// //         await faceMeshRef.current.send({ image: videoRef.current });
// //       },
// //       width: 640,
// //       height: 480
// //     });

// //     camera.start();
// //     cameraRef.current = camera;

// //     /* ---------- MAIN LOOP ---------- */
// //     const interval = setInterval(() => {

// //       const now = Date.now();

// //       blinkTimes.current =
// //         blinkTimes.current.filter(t => now - t < 60000);

// //       const rate = blinkTimes.current.length;
// //       setBlinkRate(rate);

// //       let score = 100;

// //       if (rate < 12) score -= 10;
// //       if (rate < 8) score -= 15;
// //       if (rate < 5) score -= 20;

// //       if (distanceRef.current === "too close") score -= 10;
// //       if (distanceRef.current === "too far") score -= 5;

// //       if (headRef.current === "tilted") score -= 8;

// //       if (expressionRef.current === "drowsy") score -= 20;
// //       if (expressionRef.current === "strained") score -= 15;

// //       const redness =
// //         rednessHistory.current.reduce((a, b) => a + b, 0) /
// //         (rednessHistory.current.length || 1);

// //       if (redness > 0.45) score -= 10;

// //       score = Math.max(0, Math.min(100, score));

// //       smoothedScore.current = smooth(smoothedScore.current, score);
// //       setStressScore(Math.round(smoothedScore.current));

// //     }, 1000);

// //     return () => {
// //       clearInterval(interval);
// //       cameraRef.current?.stop();
// //       faceMeshRef.current?.close();
// //     };

// //   }, []);

// //   return (
// //     <div className="w-full h-full">
// //       <video ref={videoRef} className="hidden" />
// //       <canvas
// //         ref={canvasRef}
// //         width="640"
// //         height="480"
// //         className="rounded-lg w-full h-full object-cover scale-x-[-1]"
// //       />
// //     </div>
// //   );
// // };

// // export default WebcamFeed;
// import { useEffect, useRef } from "react";

// const WebcamFeed = ({
//   setBlinkRate = () => {},
//   setDistance = () => {},
//   setRedness = () => {},
//   setStressScore = () => {},
//   setHeadPosition = () => {},
//   setExpression = () => {}
// }) => {

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   const faceMeshRef = useRef(null);
//   const cameraRef = useRef(null);

//   const blinkTimes = useRef([]);
//   const eyeClosed = useRef(false);
//   const lastBlinkTime = useRef(0);

//   const eyeHistory = useRef([]);
//   const rednessHistory = useRef([]);

//   const expressionRef = useRef("focused");
//   const distanceRef = useRef("optimal");
//   const headRef = useRef("aligned");

//   const smoothedScore = useRef(100);
//   const smooth = (prev, current) => prev * 0.8 + current * 0.2;

//   const detectRedness = (imageData) => {
//     let redPixels = 0;
//     let total = 0;

//     const data = imageData.data;

//     for (let i = 0; i < data.length; i += 4) {
//       const r = data[i];
//       const g = data[i + 1];
//       const b = data[i + 2];

//       if (r > g * 1.15 && r > b * 1.15) redPixels++;
//       total++;
//     }

//     return redPixels / total;
//   };

//   useEffect(() => {

//     if (!window.FaceMesh || !window.Camera) {
//       console.error("MediaPipe not loaded");
//       return;
//     }

//     const faceMesh = new window.FaceMesh({
//       locateFile: (file) =>
//         `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`
//     });

//     faceMesh.setOptions({
//       maxNumFaces: 1,
//       refineLandmarks: true
//     });

//     faceMesh.onResults((results) => {

//       const canvas = canvasRef.current;
//       if (!canvas) return;

//       const ctx = canvas.getContext("2d");
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

//       if (!results.multiFaceLandmarks?.length) return;

//       const lm = results.multiFaceLandmarks[0];

//       /* ---------- BLINK ---------- */
//       const raw = Math.abs(lm[159].y - lm[145].y);

//       eyeHistory.current.push(raw);
//       if (eyeHistory.current.length > 5) eyeHistory.current.shift();

//       const avgEye =
//         eyeHistory.current.reduce((a, b) => a + b, 0) /
//         eyeHistory.current.length;

//       if (avgEye < 0.025 && !eyeClosed.current)
//         eyeClosed.current = true;

//       if (avgEye > 0.03 && eyeClosed.current) {
//         const now = Date.now();
//         if (now - lastBlinkTime.current > 150) {
//           blinkTimes.current.push(now);
//           lastBlinkTime.current = now;
//         }
//         eyeClosed.current = false;
//       }

//       /* ---------- DISTANCE ---------- */
//       const z = lm[1].z;

//       if (z < -0.10) distanceRef.current = "too close";
//       else if (z > -0.07) distanceRef.current = "too far";
//       else distanceRef.current = "optimal";

//       setDistance(distanceRef.current);

//       /* ---------- HEAD ---------- */
//       const tilt =
//         (lm[263].y - lm[33].y) /
//         (lm[263].x - lm[33].x);

//       const headState = Math.abs(tilt) > 0.1 ? "tilted" : "aligned";
//       headRef.current = headState;
//       setHeadPosition(headState);

//       /* ---------- EXPRESSION ---------- */
//       const mouthOpen = Math.abs(lm[13].y - lm[14].y);
//       const mouthWidth = Math.abs(lm[61].x - lm[291].x);
//       const browHeight = Math.abs(lm[65].y - lm[295].y);

//       let expression = "focused";

//       if (avgEye < 0.015) expression = "drowsy";
//       else if (mouthOpen > 0.06) expression = "yawning";
//       else if (mouthWidth > 0.07 && avgEye > 0.02) expression = "relaxed";
//       else if (avgEye < 0.02 && browHeight < 0.02) expression = "strained";

//       if (expressionRef.current !== expression) {
//         expressionRef.current = expression;
//         setExpression(expression);
//       }

//       /* ---------- REDNESS ---------- */
//       const lx = lm[33].x * canvas.width;
//       const ly = lm[33].y * canvas.height;

//       if (lx > 20 && ly > 20 && lx < canvas.width - 20 && ly < canvas.height - 20) {
//         const region = ctx.getImageData(lx - 10, ly - 10, 20, 20);

//         const redness = detectRedness(region);

//         rednessHistory.current.push(redness);
//         if (rednessHistory.current.length > 10)
//           rednessHistory.current.shift();

//         const avgRed =
//           rednessHistory.current.reduce((a, b) => a + b, 0) /
//           rednessHistory.current.length;

//         if (avgRed > 0.45) setRedness("high");
//         else if (avgRed > 0.30) setRedness("moderate");
//         else setRedness("normal");
//       }

//     });

//     faceMeshRef.current = faceMesh;

//     const camera = new window.Camera(videoRef.current, {
//       onFrame: async () => {
//         if (videoRef.current.readyState === 4) {
//           await faceMeshRef.current.send({
//             image: videoRef.current
//           });
//         }
//       },
//       width: 640,
//       height: 480
//     });

//     camera.start();
//     cameraRef.current = camera;

//     /* ---------- MAIN LOOP ---------- */
//     const interval = setInterval(() => {

//       const now = Date.now();

//       blinkTimes.current =
//         blinkTimes.current.filter(t => now - t < 60000);

//       const rate = blinkTimes.current.length;
//       setBlinkRate(rate);

//       let score = 100;

//       if (rate < 12) score -= 10;
//       if (rate < 8) score -= 15;
//       if (rate < 5) score -= 20;

//       if (distanceRef.current === "too close") score -= 10;
//       if (distanceRef.current === "too far") score -= 5;

//       if (headRef.current === "tilted") score -= 8;

//       if (expressionRef.current === "drowsy") score -= 20;
//       if (expressionRef.current === "strained") score -= 15;

//       const redness =
//         rednessHistory.current.reduce((a, b) => a + b, 0) /
//         (rednessHistory.current.length || 1);

//       if (redness > 0.45) score -= 10;

//       score = Math.max(0, Math.min(100, score));

//       smoothedScore.current = smooth(smoothedScore.current, score);
//       setStressScore(Math.round(smoothedScore.current));

//     }, 1000);

//     return () => {
//       clearInterval(interval);
//       cameraRef.current?.stop();
//       faceMeshRef.current?.close();
//     };

//   }, []);

//   return (
//     <div className="w-full h-full">
//       <video ref={videoRef} className="hidden" />
//       <canvas
//         ref={canvasRef}
//         width="640"
//         height="480"
//         className="rounded-lg w-full h-full object-cover scale-x-[-1]"
//       />
//     </div>
//   );
// };

// export default WebcamFeed;

// import { useEffect, useRef } from "react";

// const WebcamFeed = ({
//   setBlinkRate = () => {},
//   setDistance = () => {},
//   setRedness = () => {},
//   setStressScore = () => {},
//   setHeadPosition = () => {},
//   setExpression = () => {}
// }) => {

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   const faceMeshRef = useRef(null);
//   const cameraRef = useRef(null);

//   const blinkTimes = useRef([]);
//   const eyeClosed = useRef(false);
//   const lastBlinkTime = useRef(0);

//   const eyeHistory = useRef([]);
//   const rednessHistory = useRef([]);

//   const expressionRef = useRef("focused");
//   const distanceRef = useRef("optimal");
//   const headRef = useRef("aligned");

//   const smoothedScore = useRef(100);
//   const smooth = (prev, current) => prev * 0.8 + current * 0.2;

//   /* ---------- LOAD MEDIAPIPE SAFELY ---------- */
//   const loadScript = (src) => {
//     return new Promise((resolve, reject) => {
//       if (document.querySelector(`script[src="${src}"]`)) {
//         resolve();
//         return;
//       }

//       const script = document.createElement("script");
//       script.src = src;
//       script.async = true;
//       script.onload = resolve;
//       script.onerror = reject;
//       document.body.appendChild(script);
//     });
//   };

//   const detectRedness = (imageData) => {
//     let redPixels = 0;
//     let total = 0;
//     const data = imageData.data;

//     for (let i = 0; i < data.length; i += 4) {
//       const r = data[i];
//       const g = data[i + 1];
//       const b = data[i + 2];

//       if (r > g * 1.15 && r > b * 1.15) redPixels++;
//       total++;
//     }

//     return redPixels / total;
//   };

//   useEffect(() => {

//     let interval;

//     const init = async () => {
//       try {
//         /* 🔥 FIX: Load correct MediaPipe (no WASM crash) */
//         await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/face_mesh.js");
//         await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");

//         if (!window.FaceMesh || !window.Camera) {
//           console.error("MediaPipe failed to load");
//           return;
//         }

//         const faceMesh = new window.FaceMesh({
//           locateFile: (file) =>
//             `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`
//         });

//         faceMesh.setOptions({
//           maxNumFaces: 1,
//           refineLandmarks: true,
//           minDetectionConfidence: 0.5,
//           minTrackingConfidence: 0.5
//         });

//         faceMesh.onResults((results) => {

//           const canvas = canvasRef.current;
//           if (!canvas) return;

//           const ctx = canvas.getContext("2d");
//           ctx.clearRect(0, 0, canvas.width, canvas.height);
//           ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

//           if (!results.multiFaceLandmarks?.length) return;

//           const lm = results.multiFaceLandmarks[0];

//           /* ---------- BLINK ---------- */
//           const raw = Math.abs(lm[159].y - lm[145].y);

//           eyeHistory.current.push(raw);
//           if (eyeHistory.current.length > 5) eyeHistory.current.shift();

//           const avgEye =
//             eyeHistory.current.reduce((a, b) => a + b, 0) /
//             eyeHistory.current.length;

//           if (avgEye < 0.025 && !eyeClosed.current)
//             eyeClosed.current = true;

//           if (avgEye > 0.03 && eyeClosed.current) {
//             const now = Date.now();
//             if (now - lastBlinkTime.current > 150) {
//               blinkTimes.current.push(now);
//               lastBlinkTime.current = now;
//             }
//             eyeClosed.current = false;
//           }

//           /* ---------- DISTANCE ---------- */
//           const z = lm[1].z;

//           if (z < -0.10) distanceRef.current = "too close";
//           else if (z > -0.07) distanceRef.current = "too far";
//           else distanceRef.current = "optimal";

//           setDistance(distanceRef.current);

//           /* ---------- HEAD ---------- */
//           const tilt =
//             (lm[263].y - lm[33].y) /
//             (lm[263].x - lm[33].x);

//           const headState = Math.abs(tilt) > 0.1 ? "tilted" : "aligned";
//           headRef.current = headState;
//           setHeadPosition(headState);

//           /* ---------- EXPRESSION ---------- */
//           const mouthOpen = Math.abs(lm[13].y - lm[14].y);
//           const mouthWidth = Math.abs(lm[61].x - lm[291].x);
//           const browHeight = Math.abs(lm[65].y - lm[295].y);

//           let expression = "focused";

//           if (avgEye < 0.015) expression = "drowsy";
//           else if (mouthOpen > 0.06) expression = "yawning";
//           else if (mouthWidth > 0.07 && avgEye > 0.02) expression = "relaxed";
//           else if (avgEye < 0.02 && browHeight < 0.02) expression = "strained";

//           if (expressionRef.current !== expression) {
//             expressionRef.current = expression;
//             setExpression(expression);
//           }

//           /* ---------- REDNESS ---------- */
//           const lx = lm[33].x * canvas.width;
//           const ly = lm[33].y * canvas.height;

//           if (lx > 20 && ly > 20 && lx < canvas.width - 20 && ly < canvas.height - 20) {
//             const region = ctx.getImageData(lx - 10, ly - 10, 20, 20);
//             const redness = detectRedness(region);

//             rednessHistory.current.push(redness);
//             if (rednessHistory.current.length > 10)
//               rednessHistory.current.shift();

//             const avgRed =
//               rednessHistory.current.reduce((a, b) => a + b, 0) /
//               rednessHistory.current.length;

//             if (avgRed > 0.45) setRedness("high");
//             else if (avgRed > 0.30) setRedness("moderate");
//             else setRedness("normal");
//           }

//         });

//         faceMeshRef.current = faceMesh;

//         const camera = new window.Camera(videoRef.current, {
//           onFrame: async () => {
//             if (videoRef.current.readyState === 4) {
//               await faceMesh.send({ image: videoRef.current });
//             }
//           },
//           width: 640,
//           height: 480
//         });

//         camera.start();
//         cameraRef.current = camera;

//         /* ---------- MAIN LOOP ---------- */
//         interval = setInterval(() => {

//           const now = Date.now();

//           blinkTimes.current =
//             blinkTimes.current.filter(t => now - t < 60000);

//           const rate = blinkTimes.current.length;
//           setBlinkRate(rate);

//           let score = 100;

//           if (rate < 12) score -= 10;
//           if (rate < 8) score -= 15;
//           if (rate < 5) score -= 20;

//           if (distanceRef.current === "too close") score -= 10;
//           if (distanceRef.current === "too far") score -= 5;

//           if (headRef.current === "tilted") score -= 8;

//           if (expressionRef.current === "drowsy") score -= 20;
//           if (expressionRef.current === "strained") score -= 15;

//           const redness =
//             rednessHistory.current.reduce((a, b) => a + b, 0) /
//             (rednessHistory.current.length || 1);

//           if (redness > 0.45) score -= 10;

//           score = Math.max(0, Math.min(100, score));

//           smoothedScore.current = smooth(smoothedScore.current, score);
//           setStressScore(Math.round(smoothedScore.current));

//         }, 1000);

//       } catch (err) {
//         console.error("INIT FAILED:", err);
//       }
//     };

//     init();

//     return () => {
//       clearInterval(interval);
//       cameraRef.current?.stop();
//       faceMeshRef.current?.close();
//     };

//   }, []);

//   return (
//     <div className="w-full h-full">
//       <video ref={videoRef} className="hidden" />
//       <canvas
//         ref={canvasRef}
//         width="640"
//         height="480"
//         className="rounded-lg w-full h-full object-cover scale-x-[-1]"
//       />
//     </div>
//   );
// };

// export default WebcamFeed;

// import { useEffect, useRef } from "react";

// const WebcamFeed = ({
//   setBlinkRate = () => {},
//   setDistance = () => {},
//   setRedness = () => {},
//   setStressScore = () => {},
//   setHeadPosition = () => {},
//   setExpression = () => {}
// }) => {

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   const faceMeshRef = useRef(null);
//   const cameraRef = useRef(null);

//   const blinkTimes = useRef([]);
//   const eyeClosed = useRef(false);
//   const lastBlinkTime = useRef(0);

//   const eyeHistory = useRef([]);
//   const rednessHistory = useRef([]);

//   const expressionRef = useRef("focused");
//   const distanceRef = useRef("optimal");
//   const headRef = useRef("aligned");

//   const smoothedScore = useRef(100);
//   const smooth = (prev, current) => prev * 0.8 + current * 0.2;

//   /* ---------- LOAD MEDIAPIPE ---------- */
//   const loadScript = (src) => {
//     return new Promise((resolve, reject) => {
//       if (document.querySelector(`script[src="${src}"]`)) {
//         resolve();
//         return;
//       }

//       const script = document.createElement("script");
//       script.src = src;
//       script.async = true;
//       script.onload = resolve;
//       script.onerror = reject;
//       document.body.appendChild(script);
//     });
//   };

//   /* ---------- REDNESS ---------- */
//   const detectRedness = (imageData) => {
//     let redPixels = 0;
//     let total = 0;

//     const data = imageData.data;

//     for (let i = 0; i < data.length; i += 4) {
//       const r = data[i];
//       const g = data[i + 1];
//       const b = data[i + 2];

//       if (r > g * 1.15 && r > b * 1.15) redPixels++;
//       total++;
//     }

//     return redPixels / total;
//   };

//   useEffect(() => {

//     let interval;

//     const init = async () => {
//       try {
//         await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/face_mesh.js");
//         await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");

//         if (!window.FaceMesh || !window.Camera) {
//           console.error("MediaPipe failed to load");
//           return;
//         }

//         const faceMesh = new window.FaceMesh({
//           locateFile: (file) =>
//             `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`
//         });

//         faceMesh.setOptions({
//           maxNumFaces: 1,
//           refineLandmarks: true,
//           minDetectionConfidence: 0.5,
//           minTrackingConfidence: 0.5
//         });

//         faceMesh.onResults((results) => {

//           const canvas = canvasRef.current;
//           if (!canvas) return;

//           const ctx = canvas.getContext("2d");
//           ctx.clearRect(0, 0, canvas.width, canvas.height);
//           ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

//           if (!results.multiFaceLandmarks?.length) return;

//           const lm = results.multiFaceLandmarks[0];

//           /* ---------- 🔥 OLD FAST BLINK LOGIC ---------- */

//           const top = lm[159];
//           const bottom = lm[145];

//           const raw = Math.abs(top.y - bottom.y);

//           // SAME old smoothing (fast response)
//           eyeHistory.current.push(raw);
//           if (eyeHistory.current.length > 5)
//             eyeHistory.current.shift();

//           const eyeDistance =
//             eyeHistory.current.reduce((a, b) => a + b, 0) /
//             eyeHistory.current.length;

//           // SAME thresholds (no delay)
//           if (eyeDistance < 0.025 && !eyeClosed.current)
//             eyeClosed.current = true;

//           if (eyeDistance > 0.03 && eyeClosed.current) {
//             const now = Date.now();

//             if (now - lastBlinkTime.current > 150) {
//               blinkTimes.current.push(now);
//               lastBlinkTime.current = now;
//             }

//             eyeClosed.current = false;
//           }

//           /* ---------- DISTANCE ---------- */

//           const z = lm[1].z;

//           if (z < -0.10) distanceRef.current = "too close";
//           else if (z > -0.07) distanceRef.current = "too far";
//           else distanceRef.current = "optimal";

//           setDistance(distanceRef.current);

//           /* ---------- HEAD ---------- */

//           const tilt =
//             (lm[263].y - lm[33].y) /
//             (lm[263].x - lm[33].x);

//           const headState = Math.abs(tilt) > 0.1 ? "tilted" : "aligned";
//           headRef.current = headState;
//           setHeadPosition(headState);

//           /* ---------- EXPRESSION ---------- */

//           const mouthOpen = Math.abs(lm[13].y - lm[14].y);
//           const mouthWidth = Math.abs(lm[61].x - lm[291].x);
//           const browHeight = Math.abs(lm[65].y - lm[295].y);

//           let expression = "focused";

//           if (eyeDistance < 0.015) expression = "drowsy";
//           else if (mouthOpen > 0.06) expression = "yawning";
//           else if (mouthWidth > 0.07 && eyeDistance > 0.02) expression = "relaxed";
//           else if (eyeDistance < 0.02 && browHeight < 0.02) expression = "strained";

//           if (expressionRef.current !== expression) {
//             expressionRef.current = expression;
//             setExpression(expression);
//           }

//           /* ---------- REDNESS ---------- */

//           const lx = lm[33].x * canvas.width;
//           const ly = lm[33].y * canvas.height;

//           if (lx > 20 && ly > 20 && lx < canvas.width - 20 && ly < canvas.height - 20) {
//             const region = ctx.getImageData(lx - 10, ly - 10, 20, 20);

//             const redness = detectRedness(region);

//             rednessHistory.current.push(redness);
//             if (rednessHistory.current.length > 10)
//               rednessHistory.current.shift();

//             const avgRed =
//               rednessHistory.current.reduce((a, b) => a + b, 0) /
//               rednessHistory.current.length;

//             if (avgRed > 0.45) setRedness("high");
//             else if (avgRed > 0.30) setRedness("moderate");
//             else setRedness("normal");
//           }

//         });

//         faceMeshRef.current = faceMesh;

//         const camera = new window.Camera(videoRef.current, {
//           onFrame: async () => {
//   try {
//     if (videoRef.current && videoRef.current.readyState === 4) {
//       await faceMeshRef.current.send({
//         image: videoRef.current,
//       });
//     }
//   } catch (err) {
//     console.warn("Frame skipped");
//   }
// },
//           width: 640,
//           height: 480
//         });

//         camera.start();
//         cameraRef.current = camera;

//         /* ---------- MAIN LOOP ---------- */

//         interval = setInterval(() => {

//           const now = Date.now();

//           blinkTimes.current =
//             blinkTimes.current.filter(t => now - t < 60000);

//           const rate = blinkTimes.current.length;
//           setBlinkRate(rate);

//           let score = 100;

//           if (rate < 12) score -= 10;
//           if (rate < 8) score -= 15;
//           if (rate < 5) score -= 20;

//           if (distanceRef.current === "too close") score -= 10;
//           if (distanceRef.current === "too far") score -= 5;

//           if (headRef.current === "tilted") score -= 8;

//           if (expressionRef.current === "drowsy") score -= 20;
//           if (expressionRef.current === "strained") score -= 15;

//           const redness =
//             rednessHistory.current.reduce((a, b) => a + b, 0) /
//             (rednessHistory.current.length || 1);

//           if (redness > 0.45) score -= 10;

//           score = Math.max(0, Math.min(100, score));

//           smoothedScore.current = smooth(smoothedScore.current, score);
//           setStressScore(Math.round(smoothedScore.current));

//         }, 1000);

//       } catch (err) {
//         console.error("INIT FAILED:", err);
//       }
//     };

//     init();

//     return () => {
//       clearInterval(interval);
//       cameraRef.current?.stop();
//       faceMeshRef.current?.close();
//     };

//   }, []);

//   return (
//     <div className="w-full h-full">
//       <video ref={videoRef} className="hidden" />
//       <canvas
//         ref={canvasRef}
//         width="640"
//         height="480"
//         className="rounded-lg w-full h-full object-cover scale-x-[-1]"
//       />
//     </div>
//   );
// };

// export default WebcamFeed;

// import { useEffect, useRef } from "react";

// const WebcamFeed = ({
//   setBlinkRate = () => {},
//   setDistance = () => {},
//   setRedness = () => {},
//   setStressScore = () => {},
//   setHeadPosition = () => {},
//   setExpression = () => {}
// }) => {

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   const faceMeshRef = useRef(null);
//   const cameraRef = useRef(null);

//   const blinkTimes = useRef([]);
//   const eyeClosed = useRef(false);
//   const lastBlinkTime = useRef(0);

//   const eyeHistory = useRef([]);
//   const rednessHistory = useRef([]);

//   const expressionRef = useRef("focused");
//   const distanceRef = useRef("optimal");
//   const headRef = useRef("aligned");

//   const smoothedScore = useRef(100);
//   const eyeCloseStart = useRef(null);
//   const redState = useRef("normal");

//   const smooth = (prev, current) => prev * 0.9 + current * 0.1;

//   const loadScript = (src) => {
//     return new Promise((resolve, reject) => {
//       if (document.querySelector(`script[src="${src}"]`)) return resolve();

//       const script = document.createElement("script");
//       script.src = src;
//       script.async = true;
//       script.onload = resolve;
//       script.onerror = reject;
//       document.body.appendChild(script);
//     });
//   };

//   const detectRedness = (imageData) => {
//     let redPixels = 0, total = 0;
//     const data = imageData.data;

//     for (let i = 0; i < data.length; i += 4) {
//       const r = data[i], g = data[i + 1], b = data[i + 2];
//       if (r > g * 1.15 && r > b * 1.15) redPixels++;
//       total++;
//     }
//     return redPixels / total;
//   };

//   useEffect(() => {

//     let interval;

//     const init = async () => {
//       try {
//         await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/face_mesh.js");
//         await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");

//         const faceMesh = new window.FaceMesh({
//           locateFile: (file) =>
//             `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`
//         });

//         faceMesh.setOptions({
//           maxNumFaces: 1,
//           refineLandmarks: true,
//           minDetectionConfidence: 0.5,
//           minTrackingConfidence: 0.5
//         });

//         faceMesh.onResults((results) => {

//           const canvas = canvasRef.current;
//           if (!canvas) return;

//           const ctx = canvas.getContext("2d");
//           ctx.clearRect(0, 0, canvas.width, canvas.height);
//           ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

//           if (!results.multiFaceLandmarks?.length) return;

//           const lm = results.multiFaceLandmarks[0];

//           /* ---------- BLINK ---------- */
//           const raw = Math.abs(lm[159].y - lm[145].y);
//           eyeHistory.current.push(raw);
//           if (eyeHistory.current.length > 5) eyeHistory.current.shift();

//           const eyeDistance =
//             eyeHistory.current.reduce((a, b) => a + b, 0) /
//             eyeHistory.current.length;

//           if (eyeDistance < 0.025 && !eyeClosed.current)
//             eyeClosed.current = true;

//           if (eyeDistance > 0.03 && eyeClosed.current) {
//             const now = Date.now();
//             if (now - lastBlinkTime.current > 150) {
//               blinkTimes.current.push(now);
//               lastBlinkTime.current = now;
//             }
//             eyeClosed.current = false;
//           }

//           /* ---------- DISTANCE ---------- */
//           const z = lm[1].z;
//           distanceRef.current =
//             z < -0.10 ? "too close" :
//             z > -0.07 ? "too far" : "optimal";
//           setDistance(distanceRef.current);

//           /* ---------- HEAD ---------- */
//           const tilt = (lm[263].y - lm[33].y) / (lm[263].x - lm[33].x);
//           headRef.current = Math.abs(tilt) > 0.1 ? "tilted" : "aligned";
//           setHeadPosition(headRef.current);

//           /* ---------- EXPRESSION ---------- */
//           const now = Date.now();
//           let expression = "focused";

//           if (eyeDistance < 0.015) {
//             if (!eyeCloseStart.current) eyeCloseStart.current = now;
//             if (now - eyeCloseStart.current > 2000)
//               expression = "drowsy";
//           } else eyeCloseStart.current = null;

//           const mouthOpen = Math.abs(lm[13].y - lm[14].y);
//           const mouthWidth = Math.abs(lm[61].x - lm[291].x);

//           if (mouthOpen > 0.07) expression = "shocked";
//           else if (mouthWidth > 0.065 && eyeDistance > 0.02)
//             expression = "smile";

//           if (expressionRef.current !== expression) {
//             expressionRef.current = expression;
//             setExpression(expression);
//           }

//           /* ---------- REDNESS ---------- */
//           const lx = lm[33].x * canvas.width;
//           const ly = lm[33].y * canvas.height;

//           if (lx > 20 && ly > 20 && lx < canvas.width - 20) {
//             const region = ctx.getImageData(lx - 10, ly - 10, 20, 20);
//             const red = detectRedness(region);

//             rednessHistory.current.push(red);
//             if (rednessHistory.current.length > 10)
//               rednessHistory.current.shift();

//             const avgRed =
//               rednessHistory.current.reduce((a, b) => a + b, 0) /
//               rednessHistory.current.length;

//             if (avgRed > 0.45) redState.current = "high";
//             else if (avgRed > 0.30) redState.current = "moderate";

//             setRedness(redState.current);
//           }
//         });

//         faceMeshRef.current = faceMesh;

//         const camera = new window.Camera(videoRef.current, {
//           onFrame: async () => {
//             if (document.visibilityState !== "visible") return;
//             await faceMesh.send({ image: videoRef.current });
//           },
//           width: 640,
//           height: 480
//         });

//         camera.start();
//         cameraRef.current = camera;

//         /* ---------- STRESS ENGINE ---------- */
//         interval = setInterval(() => {

//           const now = Date.now();
//           blinkTimes.current =
//             blinkTimes.current.filter(t => now - t < 60000);

//           const rate = blinkTimes.current.length;
//           setBlinkRate(rate);

//           let score = 100;

//           // Blink
//           if (rate < 15) score -= 5;
//           if (rate < 10) score -= 10;
//           if (rate < 6) score -= 15;

//           // Distance
//           if (distanceRef.current === "too close") score -= 12;
//           if (distanceRef.current === "too far") score -= 6;

//           // Head
//           if (headRef.current === "tilted") score -= 10;

//           // Expression
//           if (expressionRef.current === "drowsy") score -= 25;
//           else if (expressionRef.current === "shocked") score -= 8;

//           // Redness
//           const redness =
//             rednessHistory.current.reduce((a, b) => a + b, 0) /
//             (rednessHistory.current.length || 1);

//           if (redness > 0.45) score -= 12;
//           else if (redness > 0.30) score -= 6;

//           score = Math.max(20, Math.min(100, score));

//           smoothedScore.current = smooth(smoothedScore.current, score);
//           setStressScore(Math.round(smoothedScore.current));

//         }, 1000);

//       } catch (err) {
//         console.error("INIT FAILED:", err);
//       }
//     };

//     init();

//     return () => {
//       clearInterval(interval);
//       cameraRef.current?.stop();
//       faceMeshRef.current?.close();
//     };

//   }, []);

//   return (
//     <div className="w-full h-full">
//       <video ref={videoRef} className="hidden" />
//       <canvas
//         ref={canvasRef}
//         width="640"
//         height="480"
//         className="rounded-lg w-full h-full object-cover scale-x-[-1]"
//       />
//     </div>
//   );
// };

// export default WebcamFeed;

// import { useEffect, useRef } from "react";

// const WebcamFeed = ({
//   setBlinkRate = () => {},
//   setDistance = () => {},
//   setRedness = () => {},
//   setStressScore = () => {},
//   setHeadPosition = () => {},
//   setExpression = () => {}
// }) => {

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   const faceMeshRef = useRef(null);
//   const cameraRef = useRef(null);

//   const blinkTimes = useRef([]);
//   const eyeClosed = useRef(false);
//   const lastBlinkTime = useRef(0);

//   const eyeHistory = useRef([]);
//   const rednessHistory = useRef([]);

//   const expressionRef = useRef("focused");
//   const distanceRef = useRef("optimal");
//   const headRef = useRef("aligned");

//   const smoothedScore = useRef(100);
//   const eyeCloseStart = useRef(null);
//   const redState = useRef("normal");

//   const smooth = (prev, current) => prev * 0.9 + current * 0.1;

//   const loadScript = (src) => {
//     return new Promise((resolve, reject) => {
//       if (document.querySelector(`script[src="${src}"]`)) return resolve();

//       const script = document.createElement("script");
//       script.src = src;
//       script.async = true;
//       script.onload = resolve;
//       script.onerror = reject;
//       document.body.appendChild(script);
//     });
//   };

//   const detectRedness = (imageData) => {
//     let redPixels = 0, total = 0;
//     const data = imageData.data;

//     for (let i = 0; i < data.length; i += 4) {
//       const r = data[i], g = data[i + 1], b = data[i + 2];
//       if (r > g * 1.15 && r > b * 1.15) redPixels++;
//       total++;
//     }
//     return redPixels / total;
//   };

//   useEffect(() => {

//     let interval;

//     const init = async () => {
//       try {
//         await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/face_mesh.js");
//         await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");

//         const faceMesh = new window.FaceMesh({
//           locateFile: (file) =>
//             `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`
//         });

//         faceMesh.setOptions({
//           maxNumFaces: 1,
//           refineLandmarks: true,
//           minDetectionConfidence: 0.5,
//           minTrackingConfidence: 0.5
//         });

//         faceMesh.onResults((results) => {

//           const canvas = canvasRef.current;
//           if (!canvas) return;

//           const ctx = canvas.getContext("2d");
//           ctx.clearRect(0, 0, canvas.width, canvas.height);
//           ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

//           if (!results.multiFaceLandmarks?.length) return;

//           const lm = results.multiFaceLandmarks[0];

//           // 👁️ BLINK
//           const raw = Math.abs(lm[159].y - lm[145].y);
//           eyeHistory.current.push(raw);
//           if (eyeHistory.current.length > 5) eyeHistory.current.shift();

//           const eyeDistance =
//             eyeHistory.current.reduce((a, b) => a + b, 0) /
//             eyeHistory.current.length;

//           if (eyeDistance < 0.025 && !eyeClosed.current)
//             eyeClosed.current = true;

//           if (eyeDistance > 0.03 && eyeClosed.current) {
//             const now = Date.now();
//             if (now - lastBlinkTime.current > 150) {
//               blinkTimes.current.push(now);
//               lastBlinkTime.current = now;
//             }
//             eyeClosed.current = false;
//           }

//           // 📏 DISTANCE
//           const z = lm[1].z;
//           distanceRef.current =
//             z < -0.10 ? "too close" :
//             z > -0.07 ? "too far" : "optimal";
//           setDistance(distanceRef.current);

//           // 🧍 HEAD
//           const tilt = (lm[263].y - lm[33].y) / (lm[263].x - lm[33].x);
//           headRef.current = Math.abs(tilt) > 0.1 ? "tilted" : "aligned";
//           setHeadPosition(headRef.current);

//           // 😵 EXPRESSION (FIXED)
//           const now = Date.now();
//           let expression = "focused";

//           if (eyeDistance < 0.015) {
//             if (!eyeCloseStart.current) eyeCloseStart.current = now;
//             if (now - eyeCloseStart.current > 2000)
//               expression = "drowsy";
//           } else eyeCloseStart.current = null;

//           const mouthOpen = Math.abs(lm[13].y - lm[14].y);
//           const mouthWidth = Math.abs(lm[61].x - lm[291].x);

//           if (mouthOpen > 0.07) expression = "shocked";
//           else if (mouthWidth > 0.065 && eyeDistance > 0.02)
//             expression = "smile";

//           if (expressionRef.current !== expression) {
//             expressionRef.current = expression;
//             setExpression(expression);
//           }

//           // 👁️ REDNESS (STABLE)
//           const lx = lm[33].x * canvas.width;
//           const ly = lm[33].y * canvas.height;

//           if (lx > 20 && ly > 20 && lx < canvas.width - 20) {
//             const region = ctx.getImageData(lx - 10, ly - 10, 20, 20);
//             const red = detectRedness(region);

//             rednessHistory.current.push(red);
//             if (rednessHistory.current.length > 10)
//               rednessHistory.current.shift();

//             const avgRed =
//               rednessHistory.current.reduce((a, b) => a + b, 0) /
//               rednessHistory.current.length;

//             if (avgRed > 0.45) redState.current = "high";
//             else if (avgRed > 0.30) redState.current = "moderate";

//             setRedness(redState.current);
//           }
//         });

//         faceMeshRef.current = faceMesh;

//         const camera = new window.Camera(videoRef.current, {
//           onFrame: async () => {
//             try {
//               if (videoRef.current && videoRef.current.readyState === 4) {
//                 await faceMeshRef.current.send({
//                   image: videoRef.current,
//                 });
//               }
//             } catch {
//               console.warn("Frame skipped");
//             }
//           },
//           width: 640,
//           height: 480
//         });

//         camera.start();
//         cameraRef.current = camera;

//         // 🧠 STRESS ENGINE
//         interval = setInterval(() => {

//           const now = Date.now();
//           blinkTimes.current =
//             blinkTimes.current.filter(t => now - t < 60000);

//           const rate = blinkTimes.current.length;
//           setBlinkRate(rate);

//           let score = 100;

//           if (rate < 15) score -= 5;
//           if (rate < 10) score -= 10;
//           if (rate < 6) score -= 15;

//           if (distanceRef.current === "too close") score -= 12;
//           if (distanceRef.current === "too far") score -= 6;

//           if (headRef.current === "tilted") score -= 10;

//           if (expressionRef.current === "drowsy") score -= 25;
//           else if (expressionRef.current === "shocked") score -= 8;

//           const redness =
//             rednessHistory.current.reduce((a, b) => a + b, 0) /
//             (rednessHistory.current.length || 1);

//           if (redness > 0.45) score -= 12;
//           else if (redness > 0.30) score -= 6;

//           score = Math.max(20, Math.min(100, score));

//           smoothedScore.current = smooth(smoothedScore.current, score);
//           setStressScore(Math.round(smoothedScore.current));

//         }, 1000);

//       } catch (err) {
//         console.error("INIT FAILED:", err);
//       }
//     };

//     init();

//     return () => {
//       clearInterval(interval);
//       cameraRef.current?.stop();
//       faceMeshRef.current?.close();
//     };

//   }, []);

//   return (
//     <div className="w-full h-full">
//       <video ref={videoRef} className="hidden" />
//       <canvas
//         ref={canvasRef}
//         width="640"
//         height="480"
//         className="rounded-lg w-full h-full object-cover scale-x-[-1]"
//       />
//     </div>
//   );
// };

// // export default WebcamFeed;
// import { useEffect, useRef } from "react";

// const WebcamFeed = ({
//   setBlinkRate = () => {},
//   setDistance = () => {},
//   setRedness = () => {},
//   setStressScore = () => {},
//   setHeadPosition = () => {},
//   setExpression = () => {}
// }) => {

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   const faceMeshRef = useRef(null);
//   const cameraRef = useRef(null);

//   const blinkTimes = useRef([]);
//   const eyeClosed = useRef(false);
//   const lastBlinkTime = useRef(0);

//   const eyeHistory = useRef([]);
//   const rednessHistory = useRef([]);

//   const expressionRef = useRef("focused");
//   const distanceRef = useRef("optimal");
//   const headRef = useRef("aligned");

//   const smoothedScore = useRef(100);
//   const eyeCloseStart = useRef(null);
//   const redState = useRef("normal");

//   // 🔥 UPDATED SMOOTHING HERE
//   const smooth = (prev, current) => prev *0.6 + current * 0.4;

//   const loadScript = (src) => {
//     return new Promise((resolve, reject) => {
//       if (document.querySelector(`script[src="${src}"]`)) return resolve();

//       const script = document.createElement("script");
//       script.src = src;
//       script.async = true;
//       script.onload = resolve;
//       script.onerror = reject;
//       document.body.appendChild(script);
//     });
//   };

//   const detectRedness = (imageData) => {
//     let redPixels = 0, total = 0;
//     const data = imageData.data;

//     for (let i = 0; i < data.length; i += 4) {
//       const r = data[i], g = data[i + 1], b = data[i + 2];
//       if (r > g * 1.15 && r > b * 1.15) redPixels++;
//       total++;
//     }
//     return redPixels / total;
//   };

//   useEffect(() => {

//     let interval;

//     const init = async () => {
//       try {
//         await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/face_mesh.js");
//         await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");

//         const faceMesh = new window.FaceMesh({
//           locateFile: (file) =>
//             `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`
//         });

//         faceMesh.setOptions({
//           maxNumFaces: 1,
//           refineLandmarks: true,
//           minDetectionConfidence: 0.5,
//           minTrackingConfidence: 0.5
//         });

//         faceMesh.onResults((results) => {

//           const canvas = canvasRef.current;
//           if (!canvas) return;

//           const ctx = canvas.getContext("2d");
//           ctx.clearRect(0, 0, canvas.width, canvas.height);
//           ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

//           if (!results.multiFaceLandmarks?.length) return;

//           const lm = results.multiFaceLandmarks[0];

//           const raw = Math.abs(lm[159].y - lm[145].y);
//           eyeHistory.current.push(raw);
//           if (eyeHistory.current.length > 5) eyeHistory.current.shift();

//           const eyeDistance =
//             eyeHistory.current.reduce((a, b) => a + b, 0) /
//             eyeHistory.current.length;

//           if (eyeDistance < 0.025 && !eyeClosed.current)
//             eyeClosed.current = true;

//           if (eyeDistance > 0.03 && eyeClosed.current) {
//             const now = Date.now();
//             if (now - lastBlinkTime.current > 150) {
//               blinkTimes.current.push(now);
//               lastBlinkTime.current = now;
//             }
//             eyeClosed.current = false;
//           }

//           const z = lm[1].z;
//           distanceRef.current =
//             z < -0.10 ? "too close" :
//             z > -0.07 ? "too far" : "optimal";
//           setDistance(distanceRef.current);

//           const tilt = (lm[263].y - lm[33].y) / (lm[263].x - lm[33].x);
//           headRef.current = Math.abs(tilt) > 0.1 ? "tilted" : "aligned";
//           setHeadPosition(headRef.current);

//           const now = Date.now();
//           let expression = "focused";

//           if (eyeDistance < 0.015) {
//             if (!eyeCloseStart.current) eyeCloseStart.current = now;
//             if (now - eyeCloseStart.current > 2000)
//               expression = "drowsy";
//           } else eyeCloseStart.current = null;

//           const mouthOpen = Math.abs(lm[13].y - lm[14].y);
//           const mouthWidth = Math.abs(lm[61].x - lm[291].x);

//           if (mouthOpen > 0.07) expression = "shocked";
//           else if (mouthWidth > 0.065 && eyeDistance > 0.02)
//             expression = "smile";

//           if (expressionRef.current !== expression) {
//             expressionRef.current = expression;
//             setExpression(expression);
//           }

//           const lx = lm[33].x * canvas.width;
//           const ly = lm[33].y * canvas.height;

//           if (lx > 20 && ly > 20 && lx < canvas.width - 20) {
//             const region = ctx.getImageData(lx - 10, ly - 10, 20, 20);
//             const red = detectRedness(region);

//             rednessHistory.current.push(red);
//             if (rednessHistory.current.length > 10)
//               rednessHistory.current.shift();

//             const avgRed =
//               rednessHistory.current.reduce((a, b) => a + b, 0) /
//               rednessHistory.current.length;

//             if (avgRed > 0.45) redState.current = "high";
//             else if (avgRed > 0.30) redState.current = "moderate";

//             setRedness(redState.current);
//           }
//         });

//         faceMeshRef.current = faceMesh;

//         const camera = new window.Camera(videoRef.current, {
//           onFrame: async () => {
//             try {
//               if (videoRef.current && videoRef.current.readyState === 4) {
//                 await faceMeshRef.current.send({
//                   image: videoRef.current,
//                 });
//               }
//             } catch {
//               console.warn("Frame skipped");
//             }
//           },
//           width: 640,
//           height: 480
//         });

//         camera.start();
//         cameraRef.current = camera;

//         interval = setInterval(() => {

//           const now = Date.now();
//           blinkTimes.current =
//             blinkTimes.current.filter(t => now - t < 60000);

//           const rate = blinkTimes.current.length;
//           setBlinkRate(rate);

//           let score = 100;

//           if (rate < 15) score -= 5;
//           if (rate < 10) score -= 10;
//           if (rate < 6) score -= 15;

//           if (distanceRef.current === "too close") score -= 12;
//           if (distanceRef.current === "too far") score -= 6;

//           if (headRef.current === "tilted") score -= 10;

//           if (expressionRef.current === "drowsy") score -= 25;
//           else if (expressionRef.current === "shocked") score -= 8;

//           const redness =
//             rednessHistory.current.reduce((a, b) => a + b, 0) /
//             (rednessHistory.current.length || 1);

//           if (redness > 0.45) score -= 12;
//           else if (redness > 0.30) score -= 6;

//           score = Math.max(20, Math.min(100, score));

//           // 🔥 SMOOTHING APPLIED HERE
//           smoothedScore.current = smooth(smoothedScore.current, score);

//           setStressScore(Math.round(smoothedScore.current));

//         }, 1000);

//       } catch (err) {
//         console.error("INIT FAILED:", err);
//       }
//     };

//     init();

//     return () => {
//       clearInterval(interval);
//       cameraRef.current?.stop();
//       faceMeshRef.current?.close();
//     };

//   }, []);

//   return (
//     <div className="w-full h-full">
//       <video ref={videoRef} className="hidden" />
//       <canvas
//         ref={canvasRef}
//         width="640"
//         height="480"
//         className="rounded-lg w-full h-full object-cover scale-x-[-1]"
//       />
//     </div>
//   );
// };

// export default WebcamFeed;
import { useEffect, useRef } from "react";

const WebcamFeed = ({
  setBlinkRate = () => {},
  setDistance = () => {},
  setRedness = () => {},
  setStressScore = () => {},
  setHeadPosition = () => {},
  setExpression = () => {}
}) => {

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const faceMeshRef = useRef(null);
  const cameraRef = useRef(null);

  const blinkTimes = useRef([]);
  const eyeClosed = useRef(false);
  const lastBlinkTime = useRef(0);

  const eyeHistory = useRef([]);
  const rednessHistory = useRef([]);

  const expressionRef = useRef("focused");
  const distanceRef = useRef("optimal");
  const headRef = useRef("aligned");

  const smoothedScore = useRef(100);
  const eyeCloseStart = useRef(null);
  const redState = useRef("normal");

  // 🔥 FINAL SMOOTHING (balanced)
  const smooth = (prev, current) => prev * 0.6 + current * 0.4;

  const detectRedness = (imageData) => {
    let redPixels = 0, total = 0;
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (r > g * 1.15 && r > b * 1.15) redPixels++;
      total++;
    }
    return redPixels / total;
  };

  useEffect(() => {

    let interval;

    const init = async () => {

      // ✅ IMPORTANT: Use ONLY global scripts (from index.html)
      if (!window.FaceMesh || !window.Camera) {
        console.error("MediaPipe not loaded properly");
        return;
      }

      const faceMesh = new window.FaceMesh({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      faceMesh.onResults((results) => {

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        if (!results.multiFaceLandmarks?.length) return;

        const lm = results.multiFaceLandmarks[0];

        /* ---------- 👁️ BLINK ---------- */
        const raw = Math.abs(lm[159].y - lm[145].y);

        eyeHistory.current.push(raw);
        if (eyeHistory.current.length > 5) eyeHistory.current.shift();

        const eyeDistance =
          eyeHistory.current.reduce((a, b) => a + b, 0) /
          eyeHistory.current.length;

        if (eyeDistance < 0.025 && !eyeClosed.current)
          eyeClosed.current = true;

        if (eyeDistance > 0.03 && eyeClosed.current) {
          const now = Date.now();
          if (now - lastBlinkTime.current > 150) {
            blinkTimes.current.push(now);
            lastBlinkTime.current = now;
          }
          eyeClosed.current = false;
        }

        /* ---------- 📏 DISTANCE ---------- */
        const z = lm[1].z;
        distanceRef.current =
          z < -0.10 ? "too close" :
          z > -0.07 ? "too far" : "optimal";

        setDistance(distanceRef.current);

        /* ---------- 🧍 HEAD ---------- */
        const tilt = (lm[263].y - lm[33].y) / (lm[263].x - lm[33].x);
        headRef.current = Math.abs(tilt) > 0.1 ? "tilted" : "aligned";

        setHeadPosition(headRef.current);

        /* ---------- 😵 EXPRESSION ---------- */
        const now = Date.now();
        let expression = "focused";

        if (eyeDistance < 0.015) {
          if (!eyeCloseStart.current) eyeCloseStart.current = now;
          if (now - eyeCloseStart.current > 2000)
            expression = "drowsy";
        } else {
          eyeCloseStart.current = null;
        }

        const mouthOpen = Math.abs(lm[13].y - lm[14].y);
        const mouthWidth = Math.abs(lm[61].x - lm[291].x);

        if (mouthOpen > 0.07) expression = "shocked";
        else if (mouthWidth > 0.065 && eyeDistance > 0.02)
          expression = "smile";

        if (expressionRef.current !== expression) {
          expressionRef.current = expression;
          setExpression(expression);
        }

        /* ---------- 👁️ REDNESS ---------- */
        const lx = lm[33].x * canvas.width;
        const ly = lm[33].y * canvas.height;

        if (lx > 20 && ly > 20 && lx < canvas.width - 20) {
          const region = ctx.getImageData(lx - 10, ly - 10, 20, 20);
          const red = detectRedness(region);

          rednessHistory.current.push(red);
          if (rednessHistory.current.length > 10)
            rednessHistory.current.shift();

          const avgRed =
            rednessHistory.current.reduce((a, b) => a + b, 0) /
            rednessHistory.current.length;

          // ✅ FIXED (no stuck state)
          if (avgRed > 0.45) redState.current = "high";
          else if (avgRed > 0.30) redState.current = "moderate";
          else redState.current = "normal";

          setRedness(redState.current);
        }

      });

      faceMeshRef.current = faceMesh;

      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          try {
            if (videoRef.current?.readyState === 4) {
              await faceMeshRef.current.send({
                image: videoRef.current,
              });
            }
          } catch {
            // silent skip (important for stability)
          }
        },
        width: 640,
        height: 480
      });

      camera.start();
      cameraRef.current = camera;

      /* ---------- 🧠 STRESS ENGINE ---------- */
      interval = setInterval(() => {

        const now = Date.now();

        blinkTimes.current =
          blinkTimes.current.filter(t => now - t < 60000);

        const rate = blinkTimes.current.length;
        setBlinkRate(rate);

        let score = 100;

        // Blink
        if (rate < 15) score -= 5;
        if (rate < 10) score -= 10;
        if (rate < 6) score -= 15;

        // Distance
        if (distanceRef.current === "too close") score -= 12;
        if (distanceRef.current === "too far") score -= 6;

        // Head
        if (headRef.current === "tilted") score -= 10;

        // Expression
        if (expressionRef.current === "drowsy") score -= 25;
        else if (expressionRef.current === "shocked") score -= 8;

        // Redness
        const redness =
          rednessHistory.current.reduce((a, b) => a + b, 0) /
          (rednessHistory.current.length || 1);

        if (redness > 0.45) score -= 12;
        else if (redness > 0.30) score -= 6;

        score = Math.max(20, Math.min(100, score));

        // 🔥 SMOOTHING
        smoothedScore.current = smooth(smoothedScore.current, score);

        setStressScore(Math.round(smoothedScore.current));

      }, 1000);

    };

    init();

    return () => {
      clearInterval(interval);
      cameraRef.current?.stop();
      faceMeshRef.current?.close();
    };

  }, []);

  return (
    <div className="w-full h-full">
      <video ref={videoRef} className="hidden" />
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        className="rounded-lg w-full h-full object-cover scale-x-[-1]"
      />
    </div>
  );
};

export default WebcamFeed;