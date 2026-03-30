// // // // // // // // // // import { useEffect, useRef } from "react";

// // // // // // // // // // const WebcamFeed = ({
// // // // // // // // // //   setBlinkRate = () => {},
// // // // // // // // // //   setDistance = () => {},
// // // // // // // // // //   setRedness = () => {},
// // // // // // // // // //   setStressScore = () => {},
// // // // // // // // // //   setHeadPosition = () => {},
// // // // // // // // // //   setExpression = () => {},
// // // // // // // // // //   triggerAlert = () => {}
// // // // // // // // // // }) => {

// // // // // // // // // //   const videoRef = useRef(null);
// // // // // // // // // //   const canvasRef = useRef(null);

// // // // // // // // // //   const faceMeshRef = useRef(null);
// // // // // // // // // //   const cameraRef = useRef(null);

// // // // // // // // // //   const blinkTimes = useRef([]);
// // // // // // // // // //   const eyeClosed = useRef(false);
// // // // // // // // // //   const lastBlinkTime = useRef(0);

// // // // // // // // // //   const eyeHistory = useRef([]);
// // // // // // // // // //   const rednessHistory = useRef([]);

// // // // // // // // // //   const expressionRef = useRef("focused");
// // // // // // // // // //   const distanceRef = useRef("optimal");
// // // // // // // // // //   const headRef = useRef("aligned");

// // // // // // // // // //   const smoothedScore = useRef(100);
// // // // // // // // // //   const smooth = (prev, current) => prev * 0.8 + current * 0.2;

// // // // // // // // // //   const detectRedness = (imageData) => {
// // // // // // // // // //     let redPixels = 0;
// // // // // // // // // //     let total = 0;
// // // // // // // // // //     const data = imageData.data;

// // // // // // // // // //     for (let i = 0; i < data.length; i += 4) {
// // // // // // // // // //       const r = data[i];
// // // // // // // // // //       const g = data[i + 1];
// // // // // // // // // //       const b = data[i + 2];

// // // // // // // // // //       if (r > g * 1.15 && r > b * 1.15) redPixels++;
// // // // // // // // // //       total++;
// // // // // // // // // //     }

// // // // // // // // // //     return redPixels / total;
// // // // // // // // // //   };

// // // // // // // // // //   useEffect(() => {

// // // // // // // // // //     if (!window.FaceMesh || !window.Camera) {
// // // // // // // // // //       console.error("MediaPipe not loaded");
// // // // // // // // // //       return;
// // // // // // // // // //     }

// // // // // // // // // //     const faceMesh = new window.FaceMesh({
// // // // // // // // // //       locateFile: (file) =>
// // // // // // // // // //         `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
// // // // // // // // // //     });

// // // // // // // // // //     faceMesh.setOptions({
// // // // // // // // // //       maxNumFaces: 1,
// // // // // // // // // //       refineLandmarks: true
// // // // // // // // // //     });

// // // // // // // // // //     faceMesh.onResults((results) => {

// // // // // // // // // //       const canvas = canvasRef.current;
// // // // // // // // // //       if (!canvas) return;

// // // // // // // // // //       const ctx = canvas.getContext("2d");
// // // // // // // // // //       ctx.clearRect(0, 0, canvas.width, canvas.height);
// // // // // // // // // //       ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

// // // // // // // // // //       if (!results.multiFaceLandmarks?.length) return;

// // // // // // // // // //       const lm = results.multiFaceLandmarks[0];

// // // // // // // // // //       /* ---------- BLINK ---------- */
// // // // // // // // // //       const raw = Math.abs(lm[159].y - lm[145].y);

// // // // // // // // // //       eyeHistory.current.push(raw);
// // // // // // // // // //       if (eyeHistory.current.length > 5) eyeHistory.current.shift();

// // // // // // // // // //       const avgEye =
// // // // // // // // // //         eyeHistory.current.reduce((a, b) => a + b, 0) /
// // // // // // // // // //         eyeHistory.current.length;

// // // // // // // // // //       if (avgEye < 0.025 && !eyeClosed.current)
// // // // // // // // // //         eyeClosed.current = true;

// // // // // // // // // //       if (avgEye > 0.03 && eyeClosed.current) {
// // // // // // // // // //         const now = Date.now();
// // // // // // // // // //         if (now - lastBlinkTime.current > 150) {
// // // // // // // // // //           blinkTimes.current.push(now);
// // // // // // // // // //           lastBlinkTime.current = now;
// // // // // // // // // //         }
// // // // // // // // // //         eyeClosed.current = false;
// // // // // // // // // //       }

// // // // // // // // // //       /* ---------- DISTANCE ---------- */
// // // // // // // // // //       const z = lm[1].z;

// // // // // // // // // //       if (z < -0.10) distanceRef.current = "too close";
// // // // // // // // // //       else if (z > -0.07) distanceRef.current = "too far";
// // // // // // // // // //       else distanceRef.current = "optimal";

// // // // // // // // // //       setDistance(distanceRef.current);

// // // // // // // // // //       /* ---------- HEAD ---------- */
// // // // // // // // // //       const tilt =
// // // // // // // // // //         (lm[263].y - lm[33].y) /
// // // // // // // // // //         (lm[263].x - lm[33].x);

// // // // // // // // // //       const headState = Math.abs(tilt) > 0.1 ? "tilted" : "aligned";
// // // // // // // // // //       headRef.current = headState;
// // // // // // // // // //       setHeadPosition(headState);

// // // // // // // // // //       /* ---------- EXPRESSION ---------- */
// // // // // // // // // //       const mouthOpen = Math.abs(lm[13].y - lm[14].y);
// // // // // // // // // //       const mouthWidth = Math.abs(lm[61].x - lm[291].x);
// // // // // // // // // //       const browHeight = Math.abs(lm[65].y - lm[295].y);

// // // // // // // // // //       let expression = "focused";

// // // // // // // // // //       if (avgEye < 0.015) expression = "drowsy";
// // // // // // // // // //       else if (mouthOpen > 0.06) expression = "yawning";
// // // // // // // // // //       else if (mouthWidth > 0.07 && avgEye > 0.02) expression = "relaxed";
// // // // // // // // // //       else if (avgEye < 0.02 && browHeight < 0.02) expression = "strained";

// // // // // // // // // //       if (expressionRef.current !== expression) {
// // // // // // // // // //         expressionRef.current = expression;
// // // // // // // // // //         setExpression(expression);
// // // // // // // // // //       }

// // // // // // // // // //       /* ---------- REDNESS ---------- */
// // // // // // // // // //       const lx = lm[33].x * canvas.width;
// // // // // // // // // //       const ly = lm[33].y * canvas.height;

// // // // // // // // // //       if (lx > 20 && ly > 20 && lx < canvas.width - 20 && ly < canvas.height - 20) {

// // // // // // // // // //         const region = ctx.getImageData(lx - 10, ly - 10, 20, 20);
// // // // // // // // // //         const redness = detectRedness(region);

// // // // // // // // // //         rednessHistory.current.push(redness);
// // // // // // // // // //         if (rednessHistory.current.length > 10)
// // // // // // // // // //           rednessHistory.current.shift();

// // // // // // // // // //         const avgRed =
// // // // // // // // // //           rednessHistory.current.reduce((a, b) => a + b, 0) /
// // // // // // // // // //           rednessHistory.current.length;

// // // // // // // // // //         if (avgRed > 0.45) setRedness("high");
// // // // // // // // // //         else if (avgRed > 0.30) setRedness("moderate");
// // // // // // // // // //         else setRedness("normal");
// // // // // // // // // //       }

// // // // // // // // // //     });

// // // // // // // // // //     faceMeshRef.current = faceMesh;

// // // // // // // // // //     const camera = new window.Camera(videoRef.current, {
// // // // // // // // // //       onFrame: async () => {
// // // // // // // // // //         await faceMeshRef.current.send({ image: videoRef.current });
// // // // // // // // // //       },
// // // // // // // // // //       width: 640,
// // // // // // // // // //       height: 480
// // // // // // // // // //     });

// // // // // // // // // //     camera.start();
// // // // // // // // // //     cameraRef.current = camera;

// // // // // // // // // //     /* ---------- MAIN LOOP ---------- */
// // // // // // // // // //     const interval = setInterval(() => {

// // // // // // // // // //       const now = Date.now();

// // // // // // // // // //       blinkTimes.current =
// // // // // // // // // //         blinkTimes.current.filter(t => now - t < 60000);

// // // // // // // // // //       const rate = blinkTimes.current.length;
// // // // // // // // // //       setBlinkRate(rate);

// // // // // // // // // //       let score = 100;

// // // // // // // // // //       if (rate < 12) score -= 10;
// // // // // // // // // //       if (rate < 8) score -= 15;
// // // // // // // // // //       if (rate < 5) score -= 20;

// // // // // // // // // //       if (distanceRef.current === "too close") score -= 10;
// // // // // // // // // //       if (distanceRef.current === "too far") score -= 5;

// // // // // // // // // //       if (headRef.current === "tilted") score -= 8;

// // // // // // // // // //       if (expressionRef.current === "drowsy") score -= 20;
// // // // // // // // // //       if (expressionRef.current === "strained") score -= 15;

// // // // // // // // // //       const redness =
// // // // // // // // // //         rednessHistory.current.reduce((a, b) => a + b, 0) /
// // // // // // // // // //         (rednessHistory.current.length || 1);

// // // // // // // // // //       if (redness > 0.45) score -= 10;

// // // // // // // // // //       score = Math.max(0, Math.min(100, score));

// // // // // // // // // //       smoothedScore.current = smooth(smoothedScore.current, score);
// // // // // // // // // //       setStressScore(Math.round(smoothedScore.current));

// // // // // // // // // //     }, 1000);

// // // // // // // // // //     return () => {
// // // // // // // // // //       clearInterval(interval);
// // // // // // // // // //       cameraRef.current?.stop();
// // // // // // // // // //       faceMeshRef.current?.close();
// // // // // // // // // //     };

// // // // // // // // // //   }, []);

// // // // // // // // // //   return (
// // // // // // // // // //     <div className="w-full h-full">
// // // // // // // // // //       <video ref={videoRef} className="hidden" />
// // // // // // // // // //       <canvas
// // // // // // // // // //         ref={canvasRef}
// // // // // // // // // //         width="640"
// // // // // // // // // //         height="480"
// // // // // // // // // //         className="rounded-lg w-full h-full object-cover scale-x-[-1]"
// // // // // // // // // //       />
// // // // // // // // // //     </div>
// // // // // // // // // //   );
// // // // // // // // // // };

// // // // // // // // // // export default WebcamFeed;
// // // // // // // // // import { useEffect, useRef } from "react";

// // // // // // // // // const WebcamFeed = ({
// // // // // // // // //   setBlinkRate = () => {},
// // // // // // // // //   setDistance = () => {},
// // // // // // // // //   setRedness = () => {},
// // // // // // // // //   setStressScore = () => {},
// // // // // // // // //   setHeadPosition = () => {},
// // // // // // // // //   setExpression = () => {}
// // // // // // // // // }) => {

// // // // // // // // //   const videoRef = useRef(null);
// // // // // // // // //   const canvasRef = useRef(null);

// // // // // // // // //   const faceMeshRef = useRef(null);
// // // // // // // // //   const cameraRef = useRef(null);

// // // // // // // // //   const blinkTimes = useRef([]);
// // // // // // // // //   const eyeClosed = useRef(false);
// // // // // // // // //   const lastBlinkTime = useRef(0);

// // // // // // // // //   const eyeHistory = useRef([]);
// // // // // // // // //   const rednessHistory = useRef([]);

// // // // // // // // //   const expressionRef = useRef("focused");
// // // // // // // // //   const distanceRef = useRef("optimal");
// // // // // // // // //   const headRef = useRef("aligned");

// // // // // // // // //   const smoothedScore = useRef(100);
// // // // // // // // //   const smooth = (prev, current) => prev * 0.8 + current * 0.2;

// // // // // // // // //   const detectRedness = (imageData) => {
// // // // // // // // //     let redPixels = 0;
// // // // // // // // //     let total = 0;

// // // // // // // // //     const data = imageData.data;

// // // // // // // // //     for (let i = 0; i < data.length; i += 4) {
// // // // // // // // //       const r = data[i];
// // // // // // // // //       const g = data[i + 1];
// // // // // // // // //       const b = data[i + 2];

// // // // // // // // //       if (r > g * 1.15 && r > b * 1.15) redPixels++;
// // // // // // // // //       total++;
// // // // // // // // //     }

// // // // // // // // //     return redPixels / total;
// // // // // // // // //   };

// // // // // // // // //   useEffect(() => {

// // // // // // // // //     if (!window.FaceMesh || !window.Camera) {
// // // // // // // // //       console.error("MediaPipe not loaded");
// // // // // // // // //       return;
// // // // // // // // //     }

// // // // // // // // //     const faceMesh = new window.FaceMesh({
// // // // // // // // //       locateFile: (file) =>
// // // // // // // // //         `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`
// // // // // // // // //     });

// // // // // // // // //     faceMesh.setOptions({
// // // // // // // // //       maxNumFaces: 1,
// // // // // // // // //       refineLandmarks: true
// // // // // // // // //     });

// // // // // // // // //     faceMesh.onResults((results) => {

// // // // // // // // //       const canvas = canvasRef.current;
// // // // // // // // //       if (!canvas) return;

// // // // // // // // //       const ctx = canvas.getContext("2d");
// // // // // // // // //       ctx.clearRect(0, 0, canvas.width, canvas.height);
// // // // // // // // //       ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

// // // // // // // // //       if (!results.multiFaceLandmarks?.length) return;

// // // // // // // // //       const lm = results.multiFaceLandmarks[0];

// // // // // // // // //       /* ---------- BLINK ---------- */
// // // // // // // // //       const raw = Math.abs(lm[159].y - lm[145].y);

// // // // // // // // //       eyeHistory.current.push(raw);
// // // // // // // // //       if (eyeHistory.current.length > 5) eyeHistory.current.shift();

// // // // // // // // //       const avgEye =
// // // // // // // // //         eyeHistory.current.reduce((a, b) => a + b, 0) /
// // // // // // // // //         eyeHistory.current.length;

// // // // // // // // //       if (avgEye < 0.025 && !eyeClosed.current)
// // // // // // // // //         eyeClosed.current = true;

// // // // // // // // //       if (avgEye > 0.03 && eyeClosed.current) {
// // // // // // // // //         const now = Date.now();
// // // // // // // // //         if (now - lastBlinkTime.current > 150) {
// // // // // // // // //           blinkTimes.current.push(now);
// // // // // // // // //           lastBlinkTime.current = now;
// // // // // // // // //         }
// // // // // // // // //         eyeClosed.current = false;
// // // // // // // // //       }

// // // // // // // // //       /* ---------- DISTANCE ---------- */
// // // // // // // // //       const z = lm[1].z;

// // // // // // // // //       if (z < -0.10) distanceRef.current = "too close";
// // // // // // // // //       else if (z > -0.07) distanceRef.current = "too far";
// // // // // // // // //       else distanceRef.current = "optimal";

// // // // // // // // //       setDistance(distanceRef.current);

// // // // // // // // //       /* ---------- HEAD ---------- */
// // // // // // // // //       const tilt =
// // // // // // // // //         (lm[263].y - lm[33].y) /
// // // // // // // // //         (lm[263].x - lm[33].x);

// // // // // // // // //       const headState = Math.abs(tilt) > 0.1 ? "tilted" : "aligned";
// // // // // // // // //       headRef.current = headState;
// // // // // // // // //       setHeadPosition(headState);

// // // // // // // // //       /* ---------- EXPRESSION ---------- */
// // // // // // // // //       const mouthOpen = Math.abs(lm[13].y - lm[14].y);
// // // // // // // // //       const mouthWidth = Math.abs(lm[61].x - lm[291].x);
// // // // // // // // //       const browHeight = Math.abs(lm[65].y - lm[295].y);

// // // // // // // // //       let expression = "focused";

// // // // // // // // //       if (avgEye < 0.015) expression = "drowsy";
// // // // // // // // //       else if (mouthOpen > 0.06) expression = "yawning";
// // // // // // // // //       else if (mouthWidth > 0.07 && avgEye > 0.02) expression = "relaxed";
// // // // // // // // //       else if (avgEye < 0.02 && browHeight < 0.02) expression = "strained";

// // // // // // // // //       if (expressionRef.current !== expression) {
// // // // // // // // //         expressionRef.current = expression;
// // // // // // // // //         setExpression(expression);
// // // // // // // // //       }

// // // // // // // // //       /* ---------- REDNESS ---------- */
// // // // // // // // //       const lx = lm[33].x * canvas.width;
// // // // // // // // //       const ly = lm[33].y * canvas.height;

// // // // // // // // //       if (lx > 20 && ly > 20 && lx < canvas.width - 20 && ly < canvas.height - 20) {
// // // // // // // // //         const region = ctx.getImageData(lx - 10, ly - 10, 20, 20);

// // // // // // // // //         const redness = detectRedness(region);

// // // // // // // // //         rednessHistory.current.push(redness);
// // // // // // // // //         if (rednessHistory.current.length > 10)
// // // // // // // // //           rednessHistory.current.shift();

// // // // // // // // //         const avgRed =
// // // // // // // // //           rednessHistory.current.reduce((a, b) => a + b, 0) /
// // // // // // // // //           rednessHistory.current.length;

// // // // // // // // //         if (avgRed > 0.45) setRedness("high");
// // // // // // // // //         else if (avgRed > 0.30) setRedness("moderate");
// // // // // // // // //         else setRedness("normal");
// // // // // // // // //       }

// // // // // // // // //     });

// // // // // // // // //     faceMeshRef.current = faceMesh;

// // // // // // // // //     const camera = new window.Camera(videoRef.current, {
// // // // // // // // //       onFrame: async () => {
// // // // // // // // //         if (videoRef.current.readyState === 4) {
// // // // // // // // //           await faceMeshRef.current.send({
// // // // // // // // //             image: videoRef.current
// // // // // // // // //           });
// // // // // // // // //         }
// // // // // // // // //       },
// // // // // // // // //       width: 640,
// // // // // // // // //       height: 480
// // // // // // // // //     });

// // // // // // // // //     camera.start();
// // // // // // // // //     cameraRef.current = camera;

// // // // // // // // //     /* ---------- MAIN LOOP ---------- */
// // // // // // // // //     const interval = setInterval(() => {

// // // // // // // // //       const now = Date.now();

// // // // // // // // //       blinkTimes.current =
// // // // // // // // //         blinkTimes.current.filter(t => now - t < 60000);

// // // // // // // // //       const rate = blinkTimes.current.length;
// // // // // // // // //       setBlinkRate(rate);

// // // // // // // // //       let score = 100;

// // // // // // // // //       if (rate < 12) score -= 10;
// // // // // // // // //       if (rate < 8) score -= 15;
// // // // // // // // //       if (rate < 5) score -= 20;

// // // // // // // // //       if (distanceRef.current === "too close") score -= 10;
// // // // // // // // //       if (distanceRef.current === "too far") score -= 5;

// // // // // // // // //       if (headRef.current === "tilted") score -= 8;

// // // // // // // // //       if (expressionRef.current === "drowsy") score -= 20;
// // // // // // // // //       if (expressionRef.current === "strained") score -= 15;

// // // // // // // // //       const redness =
// // // // // // // // //         rednessHistory.current.reduce((a, b) => a + b, 0) /
// // // // // // // // //         (rednessHistory.current.length || 1);

// // // // // // // // //       if (redness > 0.45) score -= 10;

// // // // // // // // //       score = Math.max(0, Math.min(100, score));

// // // // // // // // //       smoothedScore.current = smooth(smoothedScore.current, score);
// // // // // // // // //       setStressScore(Math.round(smoothedScore.current));

// // // // // // // // //     }, 1000);

// // // // // // // // //     return () => {
// // // // // // // // //       clearInterval(interval);
// // // // // // // // //       cameraRef.current?.stop();
// // // // // // // // //       faceMeshRef.current?.close();
// // // // // // // // //     };

// // // // // // // // //   }, []);

// // // // // // // // //   return (
// // // // // // // // //     <div className="w-full h-full">
// // // // // // // // //       <video ref={videoRef} className="hidden" />
// // // // // // // // //       <canvas
// // // // // // // // //         ref={canvasRef}
// // // // // // // // //         width="640"
// // // // // // // // //         height="480"
// // // // // // // // //         className="rounded-lg w-full h-full object-cover scale-x-[-1]"
// // // // // // // // //       />
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default WebcamFeed;

// // // // // // // // // import { useEffect, useRef } from "react";

// // // // // // // // // const WebcamFeed = ({
// // // // // // // // //   setBlinkRate = () => {},
// // // // // // // // //   setDistance = () => {},
// // // // // // // // //   setRedness = () => {},
// // // // // // // // //   setStressScore = () => {},
// // // // // // // // //   setHeadPosition = () => {},
// // // // // // // // //   setExpression = () => {}
// // // // // // // // // }) => {

// // // // // // // // //   const videoRef = useRef(null);
// // // // // // // // //   const canvasRef = useRef(null);

// // // // // // // // //   const faceMeshRef = useRef(null);
// // // // // // // // //   const cameraRef = useRef(null);

// // // // // // // // //   const blinkTimes = useRef([]);
// // // // // // // // //   const eyeClosed = useRef(false);
// // // // // // // // //   const lastBlinkTime = useRef(0);

// // // // // // // // //   const eyeHistory = useRef([]);
// // // // // // // // //   const rednessHistory = useRef([]);

// // // // // // // // //   const expressionRef = useRef("focused");
// // // // // // // // //   const distanceRef = useRef("optimal");
// // // // // // // // //   const headRef = useRef("aligned");

// // // // // // // // //   const smoothedScore = useRef(100);
// // // // // // // // //   const smooth = (prev, current) => prev * 0.8 + current * 0.2;

// // // // // // // // //   /* ---------- LOAD MEDIAPIPE SAFELY ---------- */
// // // // // // // // //   const loadScript = (src) => {
// // // // // // // // //     return new Promise((resolve, reject) => {
// // // // // // // // //       if (document.querySelector(`script[src="${src}"]`)) {
// // // // // // // // //         resolve();
// // // // // // // // //         return;
// // // // // // // // //       }

// // // // // // // // //       const script = document.createElement("script");
// // // // // // // // //       script.src = src;
// // // // // // // // //       script.async = true;
// // // // // // // // //       script.onload = resolve;
// // // // // // // // //       script.onerror = reject;
// // // // // // // // //       document.body.appendChild(script);
// // // // // // // // //     });
// // // // // // // // //   };

// // // // // // // // //   const detectRedness = (imageData) => {
// // // // // // // // //     let redPixels = 0;
// // // // // // // // //     let total = 0;
// // // // // // // // //     const data = imageData.data;

// // // // // // // // //     for (let i = 0; i < data.length; i += 4) {
// // // // // // // // //       const r = data[i];
// // // // // // // // //       const g = data[i + 1];
// // // // // // // // //       const b = data[i + 2];

// // // // // // // // //       if (r > g * 1.15 && r > b * 1.15) redPixels++;
// // // // // // // // //       total++;
// // // // // // // // //     }

// // // // // // // // //     return redPixels / total;
// // // // // // // // //   };

// // // // // // // // //   useEffect(() => {

// // // // // // // // //     let interval;

// // // // // // // // //     const init = async () => {
// // // // // // // // //       try {
// // // // // // // // //         /* 🔥 FIX: Load correct MediaPipe (no WASM crash) */
// // // // // // // // //         await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/face_mesh.js");
// // // // // // // // //         await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");

// // // // // // // // //         if (!window.FaceMesh || !window.Camera) {
// // // // // // // // //           console.error("MediaPipe failed to load");
// // // // // // // // //           return;
// // // // // // // // //         }

// // // // // // // // //         const faceMesh = new window.FaceMesh({
// // // // // // // // //           locateFile: (file) =>
// // // // // // // // //             `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`
// // // // // // // // //         });

// // // // // // // // //         faceMesh.setOptions({
// // // // // // // // //           maxNumFaces: 1,
// // // // // // // // //           refineLandmarks: true,
// // // // // // // // //           minDetectionConfidence: 0.5,
// // // // // // // // //           minTrackingConfidence: 0.5
// // // // // // // // //         });

// // // // // // // // //         faceMesh.onResults((results) => {

// // // // // // // // //           const canvas = canvasRef.current;
// // // // // // // // //           if (!canvas) return;

// // // // // // // // //           const ctx = canvas.getContext("2d");
// // // // // // // // //           ctx.clearRect(0, 0, canvas.width, canvas.height);
// // // // // // // // //           ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

// // // // // // // // //           if (!results.multiFaceLandmarks?.length) return;

// // // // // // // // //           const lm = results.multiFaceLandmarks[0];

// // // // // // // // //           /* ---------- BLINK ---------- */
// // // // // // // // //           const raw = Math.abs(lm[159].y - lm[145].y);

// // // // // // // // //           eyeHistory.current.push(raw);
// // // // // // // // //           if (eyeHistory.current.length > 5) eyeHistory.current.shift();

// // // // // // // // //           const avgEye =
// // // // // // // // //             eyeHistory.current.reduce((a, b) => a + b, 0) /
// // // // // // // // //             eyeHistory.current.length;

// // // // // // // // //           if (avgEye < 0.025 && !eyeClosed.current)
// // // // // // // // //             eyeClosed.current = true;

// // // // // // // // //           if (avgEye > 0.03 && eyeClosed.current) {
// // // // // // // // //             const now = Date.now();
// // // // // // // // //             if (now - lastBlinkTime.current > 150) {
// // // // // // // // //               blinkTimes.current.push(now);
// // // // // // // // //               lastBlinkTime.current = now;
// // // // // // // // //             }
// // // // // // // // //             eyeClosed.current = false;
// // // // // // // // //           }

// // // // // // // // //           /* ---------- DISTANCE ---------- */
// // // // // // // // //           const z = lm[1].z;

// // // // // // // // //           if (z < -0.10) distanceRef.current = "too close";
// // // // // // // // //           else if (z > -0.07) distanceRef.current = "too far";
// // // // // // // // //           else distanceRef.current = "optimal";

// // // // // // // // //           setDistance(distanceRef.current);

// // // // // // // // //           /* ---------- HEAD ---------- */
// // // // // // // // //           const tilt =
// // // // // // // // //             (lm[263].y - lm[33].y) /
// // // // // // // // //             (lm[263].x - lm[33].x);

// // // // // // // // //           const headState = Math.abs(tilt) > 0.1 ? "tilted" : "aligned";
// // // // // // // // //           headRef.current = headState;
// // // // // // // // //           setHeadPosition(headState);

// // // // // // // // //           /* ---------- EXPRESSION ---------- */
// // // // // // // // //           const mouthOpen = Math.abs(lm[13].y - lm[14].y);
// // // // // // // // //           const mouthWidth = Math.abs(lm[61].x - lm[291].x);
// // // // // // // // //           const browHeight = Math.abs(lm[65].y - lm[295].y);

// // // // // // // // //           let expression = "focused";

// // // // // // // // //           if (avgEye < 0.015) expression = "drowsy";
// // // // // // // // //           else if (mouthOpen > 0.06) expression = "yawning";
// // // // // // // // //           else if (mouthWidth > 0.07 && avgEye > 0.02) expression = "relaxed";
// // // // // // // // //           else if (avgEye < 0.02 && browHeight < 0.02) expression = "strained";

// // // // // // // // //           if (expressionRef.current !== expression) {
// // // // // // // // //             expressionRef.current = expression;
// // // // // // // // //             setExpression(expression);
// // // // // // // // //           }

// // // // // // // // //           /* ---------- REDNESS ---------- */
// // // // // // // // //           const lx = lm[33].x * canvas.width;
// // // // // // // // //           const ly = lm[33].y * canvas.height;

// // // // // // // // //           if (lx > 20 && ly > 20 && lx < canvas.width - 20 && ly < canvas.height - 20) {
// // // // // // // // //             const region = ctx.getImageData(lx - 10, ly - 10, 20, 20);
// // // // // // // // //             const redness = detectRedness(region);

// // // // // // // // //             rednessHistory.current.push(redness);
// // // // // // // // //             if (rednessHistory.current.length > 10)
// // // // // // // // //               rednessHistory.current.shift();

// // // // // // // // //             const avgRed =
// // // // // // // // //               rednessHistory.current.reduce((a, b) => a + b, 0) /
// // // // // // // // //               rednessHistory.current.length;

// // // // // // // // //             if (avgRed > 0.45) setRedness("high");
// // // // // // // // //             else if (avgRed > 0.30) setRedness("moderate");
// // // // // // // // //             else setRedness("normal");
// // // // // // // // //           }

// // // // // // // // //         });

// // // // // // // // //         faceMeshRef.current = faceMesh;

// // // // // // // // //         const camera = new window.Camera(videoRef.current, {
// // // // // // // // //           onFrame: async () => {
// // // // // // // // //             if (videoRef.current.readyState === 4) {
// // // // // // // // //               await faceMesh.send({ image: videoRef.current });
// // // // // // // // //             }
// // // // // // // // //           },
// // // // // // // // //           width: 640,
// // // // // // // // //           height: 480
// // // // // // // // //         });

// // // // // // // // //         camera.start();
// // // // // // // // //         cameraRef.current = camera;

// // // // // // // // //         /* ---------- MAIN LOOP ---------- */
// // // // // // // // //         interval = setInterval(() => {

// // // // // // // // //           const now = Date.now();

// // // // // // // // //           blinkTimes.current =
// // // // // // // // //             blinkTimes.current.filter(t => now - t < 60000);

// // // // // // // // //           const rate = blinkTimes.current.length;
// // // // // // // // //           setBlinkRate(rate);

// // // // // // // // //           let score = 100;

// // // // // // // // //           if (rate < 12) score -= 10;
// // // // // // // // //           if (rate < 8) score -= 15;
// // // // // // // // //           if (rate < 5) score -= 20;

// // // // // // // // //           if (distanceRef.current === "too close") score -= 10;
// // // // // // // // //           if (distanceRef.current === "too far") score -= 5;

// // // // // // // // //           if (headRef.current === "tilted") score -= 8;

// // // // // // // // //           if (expressionRef.current === "drowsy") score -= 20;
// // // // // // // // //           if (expressionRef.current === "strained") score -= 15;

// // // // // // // // //           const redness =
// // // // // // // // //             rednessHistory.current.reduce((a, b) => a + b, 0) /
// // // // // // // // //             (rednessHistory.current.length || 1);

// // // // // // // // //           if (redness > 0.45) score -= 10;

// // // // // // // // //           score = Math.max(0, Math.min(100, score));

// // // // // // // // //           smoothedScore.current = smooth(smoothedScore.current, score);
// // // // // // // // //           setStressScore(Math.round(smoothedScore.current));

// // // // // // // // //         }, 1000);

// // // // // // // // //       } catch (err) {
// // // // // // // // //         console.error("INIT FAILED:", err);
// // // // // // // // //       }
// // // // // // // // //     };

// // // // // // // // //     init();

// // // // // // // // //     return () => {
// // // // // // // // //       clearInterval(interval);
// // // // // // // // //       cameraRef.current?.stop();
// // // // // // // // //       faceMeshRef.current?.close();
// // // // // // // // //     };

// // // // // // // // //   }, []);

// // // // // // // // //   return (
// // // // // // // // //     <div className="w-full h-full">
// // // // // // // // //       <video ref={videoRef} className="hidden" />
// // // // // // // // //       <canvas
// // // // // // // // //         ref={canvasRef}
// // // // // // // // //         width="640"
// // // // // // // // //         height="480"
// // // // // // // // //         className="rounded-lg w-full h-full object-cover scale-x-[-1]"
// // // // // // // // //       />
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default WebcamFeed;

// // // // // // // // // import { useEffect, useRef } from "react";

// // // // // // // // // const WebcamFeed = ({
// // // // // // // // //   setBlinkRate = () => {},
// // // // // // // // //   setDistance = () => {},
// // // // // // // // //   setRedness = () => {},
// // // // // // // // //   setStressScore = () => {},
// // // // // // // // //   setHeadPosition = () => {},
// // // // // // // // //   setExpression = () => {}
// // // // // // // // // }) => {

// // // // // // // // //   const videoRef = useRef(null);
// // // // // // // // //   const canvasRef = useRef(null);

// // // // // // // // //   const faceMeshRef = useRef(null);
// // // // // // // // //   const cameraRef = useRef(null);

// // // // // // // // //   const blinkTimes = useRef([]);
// // // // // // // // //   const eyeClosed = useRef(false);
// // // // // // // // //   const lastBlinkTime = useRef(0);

// // // // // // // // //   const eyeHistory = useRef([]);
// // // // // // // // //   const rednessHistory = useRef([]);

// // // // // // // // //   const expressionRef = useRef("focused");
// // // // // // // // //   const distanceRef = useRef("optimal");
// // // // // // // // //   const headRef = useRef("aligned");

// // // // // // // // //   const smoothedScore = useRef(100);
// // // // // // // // //   const smooth = (prev, current) => prev * 0.8 + current * 0.2;

// // // // // // // // //   /* ---------- LOAD MEDIAPIPE ---------- */
// // // // // // // // //   const loadScript = (src) => {
// // // // // // // // //     return new Promise((resolve, reject) => {
// // // // // // // // //       if (document.querySelector(`script[src="${src}"]`)) {
// // // // // // // // //         resolve();
// // // // // // // // //         return;
// // // // // // // // //       }

// // // // // // // // //       const script = document.createElement("script");
// // // // // // // // //       script.src = src;
// // // // // // // // //       script.async = true;
// // // // // // // // //       script.onload = resolve;
// // // // // // // // //       script.onerror = reject;
// // // // // // // // //       document.body.appendChild(script);
// // // // // // // // //     });
// // // // // // // // //   };

// // // // // // // // //   /* ---------- REDNESS ---------- */
// // // // // // // // //   const detectRedness = (imageData) => {
// // // // // // // // //     let redPixels = 0;
// // // // // // // // //     let total = 0;

// // // // // // // // //     const data = imageData.data;

// // // // // // // // //     for (let i = 0; i < data.length; i += 4) {
// // // // // // // // //       const r = data[i];
// // // // // // // // //       const g = data[i + 1];
// // // // // // // // //       const b = data[i + 2];

// // // // // // // // //       if (r > g * 1.15 && r > b * 1.15) redPixels++;
// // // // // // // // //       total++;
// // // // // // // // //     }

// // // // // // // // //     return redPixels / total;
// // // // // // // // //   };

// // // // // // // // //   useEffect(() => {

// // // // // // // // //     let interval;

// // // // // // // // //     const init = async () => {
// // // // // // // // //       try {
// // // // // // // // //         await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/face_mesh.js");
// // // // // // // // //         await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");

// // // // // // // // //         if (!window.FaceMesh || !window.Camera) {
// // // // // // // // //           console.error("MediaPipe failed to load");
// // // // // // // // //           return;
// // // // // // // // //         }

// // // // // // // // //         const faceMesh = new window.FaceMesh({
// // // // // // // // //           locateFile: (file) =>
// // // // // // // // //             `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`
// // // // // // // // //         });

// // // // // // // // //         faceMesh.setOptions({
// // // // // // // // //           maxNumFaces: 1,
// // // // // // // // //           refineLandmarks: true,
// // // // // // // // //           minDetectionConfidence: 0.5,
// // // // // // // // //           minTrackingConfidence: 0.5
// // // // // // // // //         });

// // // // // // // // //         faceMesh.onResults((results) => {

// // // // // // // // //           const canvas = canvasRef.current;
// // // // // // // // //           if (!canvas) return;

// // // // // // // // //           const ctx = canvas.getContext("2d");
// // // // // // // // //           ctx.clearRect(0, 0, canvas.width, canvas.height);
// // // // // // // // //           ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

// // // // // // // // //           if (!results.multiFaceLandmarks?.length) return;

// // // // // // // // //           const lm = results.multiFaceLandmarks[0];

// // // // // // // // //           /* ---------- 🔥 OLD FAST BLINK LOGIC ---------- */

// // // // // // // // //           const top = lm[159];
// // // // // // // // //           const bottom = lm[145];

// // // // // // // // //           const raw = Math.abs(top.y - bottom.y);

// // // // // // // // //           // SAME old smoothing (fast response)
// // // // // // // // //           eyeHistory.current.push(raw);
// // // // // // // // //           if (eyeHistory.current.length > 5)
// // // // // // // // //             eyeHistory.current.shift();

// // // // // // // // //           const eyeDistance =
// // // // // // // // //             eyeHistory.current.reduce((a, b) => a + b, 0) /
// // // // // // // // //             eyeHistory.current.length;

// // // // // // // // //           // SAME thresholds (no delay)
// // // // // // // // //           if (eyeDistance < 0.025 && !eyeClosed.current)
// // // // // // // // //             eyeClosed.current = true;

// // // // // // // // //           if (eyeDistance > 0.03 && eyeClosed.current) {
// // // // // // // // //             const now = Date.now();

// // // // // // // // //             if (now - lastBlinkTime.current > 150) {
// // // // // // // // //               blinkTimes.current.push(now);
// // // // // // // // //               lastBlinkTime.current = now;
// // // // // // // // //             }

// // // // // // // // //             eyeClosed.current = false;
// // // // // // // // //           }

// // // // // // // // //           /* ---------- DISTANCE ---------- */

// // // // // // // // //           const z = lm[1].z;

// // // // // // // // //           if (z < -0.10) distanceRef.current = "too close";
// // // // // // // // //           else if (z > -0.07) distanceRef.current = "too far";
// // // // // // // // //           else distanceRef.current = "optimal";

// // // // // // // // //           setDistance(distanceRef.current);

// // // // // // // // //           /* ---------- HEAD ---------- */

// // // // // // // // //           const tilt =
// // // // // // // // //             (lm[263].y - lm[33].y) /
// // // // // // // // //             (lm[263].x - lm[33].x);

// // // // // // // // //           const headState = Math.abs(tilt) > 0.1 ? "tilted" : "aligned";
// // // // // // // // //           headRef.current = headState;
// // // // // // // // //           setHeadPosition(headState);

// // // // // // // // //           /* ---------- EXPRESSION ---------- */

// // // // // // // // //           const mouthOpen = Math.abs(lm[13].y - lm[14].y);
// // // // // // // // //           const mouthWidth = Math.abs(lm[61].x - lm[291].x);
// // // // // // // // //           const browHeight = Math.abs(lm[65].y - lm[295].y);

// // // // // // // // //           let expression = "focused";

// // // // // // // // //           if (eyeDistance < 0.015) expression = "drowsy";
// // // // // // // // //           else if (mouthOpen > 0.06) expression = "yawning";
// // // // // // // // //           else if (mouthWidth > 0.07 && eyeDistance > 0.02) expression = "relaxed";
// // // // // // // // //           else if (eyeDistance < 0.02 && browHeight < 0.02) expression = "strained";

// // // // // // // // //           if (expressionRef.current !== expression) {
// // // // // // // // //             expressionRef.current = expression;
// // // // // // // // //             setExpression(expression);
// // // // // // // // //           }

// // // // // // // // //           /* ---------- REDNESS ---------- */

// // // // // // // // //           const lx = lm[33].x * canvas.width;
// // // // // // // // //           const ly = lm[33].y * canvas.height;

// // // // // // // // //           if (lx > 20 && ly > 20 && lx < canvas.width - 20 && ly < canvas.height - 20) {
// // // // // // // // //             const region = ctx.getImageData(lx - 10, ly - 10, 20, 20);

// // // // // // // // //             const redness = detectRedness(region);

// // // // // // // // //             rednessHistory.current.push(redness);
// // // // // // // // //             if (rednessHistory.current.length > 10)
// // // // // // // // //               rednessHistory.current.shift();

// // // // // // // // //             const avgRed =
// // // // // // // // //               rednessHistory.current.reduce((a, b) => a + b, 0) /
// // // // // // // // //               rednessHistory.current.length;

// // // // // // // // //             if (avgRed > 0.45) setRedness("high");
// // // // // // // // //             else if (avgRed > 0.30) setRedness("moderate");
// // // // // // // // //             else setRedness("normal");
// // // // // // // // //           }

// // // // // // // // //         });

// // // // // // // // //         faceMeshRef.current = faceMesh;

// // // // // // // // //         const camera = new window.Camera(videoRef.current, {
// // // // // // // // //           onFrame: async () => {
// // // // // // // // //   try {
// // // // // // // // //     if (videoRef.current && videoRef.current.readyState === 4) {
// // // // // // // // //       await faceMeshRef.current.send({
// // // // // // // // //         image: videoRef.current,
// // // // // // // // //       });
// // // // // // // // //     }
// // // // // // // // //   } catch (err) {
// // // // // // // // //     console.warn("Frame skipped");
// // // // // // // // //   }
// // // // // // // // // },
// // // // // // // // //           width: 640,
// // // // // // // // //           height: 480
// // // // // // // // //         });

// // // // // // // // //         camera.start();
// // // // // // // // //         cameraRef.current = camera;

// // // // // // // // //         /* ---------- MAIN LOOP ---------- */

// // // // // // // // //         interval = setInterval(() => {

// // // // // // // // //           const now = Date.now();

// // // // // // // // //           blinkTimes.current =
// // // // // // // // //             blinkTimes.current.filter(t => now - t < 60000);

// // // // // // // // //           const rate = blinkTimes.current.length;
// // // // // // // // //           setBlinkRate(rate);

// // // // // // // // //           let score = 100;

// // // // // // // // //           if (rate < 12) score -= 10;
// // // // // // // // //           if (rate < 8) score -= 15;
// // // // // // // // //           if (rate < 5) score -= 20;

// // // // // // // // //           if (distanceRef.current === "too close") score -= 10;
// // // // // // // // //           if (distanceRef.current === "too far") score -= 5;

// // // // // // // // //           if (headRef.current === "tilted") score -= 8;

// // // // // // // // //           if (expressionRef.current === "drowsy") score -= 20;
// // // // // // // // //           if (expressionRef.current === "strained") score -= 15;

// // // // // // // // //           const redness =
// // // // // // // // //             rednessHistory.current.reduce((a, b) => a + b, 0) /
// // // // // // // // //             (rednessHistory.current.length || 1);

// // // // // // // // //           if (redness > 0.45) score -= 10;

// // // // // // // // //           score = Math.max(0, Math.min(100, score));

// // // // // // // // //           smoothedScore.current = smooth(smoothedScore.current, score);
// // // // // // // // //           setStressScore(Math.round(smoothedScore.current));

// // // // // // // // //         }, 1000);

// // // // // // // // //       } catch (err) {
// // // // // // // // //         console.error("INIT FAILED:", err);
// // // // // // // // //       }
// // // // // // // // //     };

// // // // // // // // //     init();

// // // // // // // // //     return () => {
// // // // // // // // //       clearInterval(interval);
// // // // // // // // //       cameraRef.current?.stop();
// // // // // // // // //       faceMeshRef.current?.close();
// // // // // // // // //     };

// // // // // // // // //   }, []);

// // // // // // // // //   return (
// // // // // // // // //     <div className="w-full h-full">
// // // // // // // // //       <video ref={videoRef} className="hidden" />
// // // // // // // // //       <canvas
// // // // // // // // //         ref={canvasRef}
// // // // // // // // //         width="640"
// // // // // // // // //         height="480"
// // // // // // // // //         className="rounded-lg w-full h-full object-cover scale-x-[-1]"
// // // // // // // // //       />
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default WebcamFeed;

// // // // // // // // // import { useEffect, useRef } from "react";

// // // // // // // // // const WebcamFeed = ({
// // // // // // // // //   setBlinkRate = () => {},
// // // // // // // // //   setDistance = () => {},
// // // // // // // // //   setRedness = () => {},
// // // // // // // // //   setStressScore = () => {},
// // // // // // // // //   setHeadPosition = () => {},
// // // // // // // // //   setExpression = () => {}
// // // // // // // // // }) => {

// // // // // // // // //   const videoRef = useRef(null);
// // // // // // // // //   const canvasRef = useRef(null);

// // // // // // // // //   const faceMeshRef = useRef(null);
// // // // // // // // //   const cameraRef = useRef(null);

// // // // // // // // //   const blinkTimes = useRef([]);
// // // // // // // // //   const eyeClosed = useRef(false);
// // // // // // // // //   const lastBlinkTime = useRef(0);

// // // // // // // // //   const eyeHistory = useRef([]);
// // // // // // // // //   const rednessHistory = useRef([]);

// // // // // // // // //   const expressionRef = useRef("focused");
// // // // // // // // //   const distanceRef = useRef("optimal");
// // // // // // // // //   const headRef = useRef("aligned");

// // // // // // // // //   const smoothedScore = useRef(100);
// // // // // // // // //   const eyeCloseStart = useRef(null);
// // // // // // // // //   const redState = useRef("normal");

// // // // // // // // //   const smooth = (prev, current) => prev * 0.9 + current * 0.1;

// // // // // // // // //   const loadScript = (src) => {
// // // // // // // // //     return new Promise((resolve, reject) => {
// // // // // // // // //       if (document.querySelector(`script[src="${src}"]`)) return resolve();

// // // // // // // // //       const script = document.createElement("script");
// // // // // // // // //       script.src = src;
// // // // // // // // //       script.async = true;
// // // // // // // // //       script.onload = resolve;
// // // // // // // // //       script.onerror = reject;
// // // // // // // // //       document.body.appendChild(script);
// // // // // // // // //     });
// // // // // // // // //   };

// // // // // // // // //   const detectRedness = (imageData) => {
// // // // // // // // //     let redPixels = 0, total = 0;
// // // // // // // // //     const data = imageData.data;

// // // // // // // // //     for (let i = 0; i < data.length; i += 4) {
// // // // // // // // //       const r = data[i], g = data[i + 1], b = data[i + 2];
// // // // // // // // //       if (r > g * 1.15 && r > b * 1.15) redPixels++;
// // // // // // // // //       total++;
// // // // // // // // //     }
// // // // // // // // //     return redPixels / total;
// // // // // // // // //   };

// // // // // // // // //   useEffect(() => {

// // // // // // // // //     let interval;

// // // // // // // // //     const init = async () => {
// // // // // // // // //       try {
// // // // // // // // //         await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/face_mesh.js");
// // // // // // // // //         await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");

// // // // // // // // //         const faceMesh = new window.FaceMesh({
// // // // // // // // //           locateFile: (file) =>
// // // // // // // // //             `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`
// // // // // // // // //         });

// // // // // // // // //         faceMesh.setOptions({
// // // // // // // // //           maxNumFaces: 1,
// // // // // // // // //           refineLandmarks: true,
// // // // // // // // //           minDetectionConfidence: 0.5,
// // // // // // // // //           minTrackingConfidence: 0.5
// // // // // // // // //         });

// // // // // // // // //         faceMesh.onResults((results) => {

// // // // // // // // //           const canvas = canvasRef.current;
// // // // // // // // //           if (!canvas) return;

// // // // // // // // //           const ctx = canvas.getContext("2d");
// // // // // // // // //           ctx.clearRect(0, 0, canvas.width, canvas.height);
// // // // // // // // //           ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

// // // // // // // // //           if (!results.multiFaceLandmarks?.length) return;

// // // // // // // // //           const lm = results.multiFaceLandmarks[0];

// // // // // // // // //           /* ---------- BLINK ---------- */
// // // // // // // // //           const raw = Math.abs(lm[159].y - lm[145].y);
// // // // // // // // //           eyeHistory.current.push(raw);
// // // // // // // // //           if (eyeHistory.current.length > 5) eyeHistory.current.shift();

// // // // // // // // //           const eyeDistance =
// // // // // // // // //             eyeHistory.current.reduce((a, b) => a + b, 0) /
// // // // // // // // //             eyeHistory.current.length;

// // // // // // // // //           if (eyeDistance < 0.025 && !eyeClosed.current)
// // // // // // // // //             eyeClosed.current = true;

// // // // // // // // //           if (eyeDistance > 0.03 && eyeClosed.current) {
// // // // // // // // //             const now = Date.now();
// // // // // // // // //             if (now - lastBlinkTime.current > 150) {
// // // // // // // // //               blinkTimes.current.push(now);
// // // // // // // // //               lastBlinkTime.current = now;
// // // // // // // // //             }
// // // // // // // // //             eyeClosed.current = false;
// // // // // // // // //           }

// // // // // // // // //           /* ---------- DISTANCE ---------- */
// // // // // // // // //           const z = lm[1].z;
// // // // // // // // //           distanceRef.current =
// // // // // // // // //             z < -0.10 ? "too close" :
// // // // // // // // //             z > -0.07 ? "too far" : "optimal";
// // // // // // // // //           setDistance(distanceRef.current);

// // // // // // // // //           /* ---------- HEAD ---------- */
// // // // // // // // //           const tilt = (lm[263].y - lm[33].y) / (lm[263].x - lm[33].x);
// // // // // // // // //           headRef.current = Math.abs(tilt) > 0.1 ? "tilted" : "aligned";
// // // // // // // // //           setHeadPosition(headRef.current);

// // // // // // // // //           /* ---------- EXPRESSION ---------- */
// // // // // // // // //           const now = Date.now();
// // // // // // // // //           let expression = "focused";

// // // // // // // // //           if (eyeDistance < 0.015) {
// // // // // // // // //             if (!eyeCloseStart.current) eyeCloseStart.current = now;
// // // // // // // // //             if (now - eyeCloseStart.current > 2000)
// // // // // // // // //               expression = "drowsy";
// // // // // // // // //           } else eyeCloseStart.current = null;

// // // // // // // // //           const mouthOpen = Math.abs(lm[13].y - lm[14].y);
// // // // // // // // //           const mouthWidth = Math.abs(lm[61].x - lm[291].x);

// // // // // // // // //           if (mouthOpen > 0.07) expression = "shocked";
// // // // // // // // //           else if (mouthWidth > 0.065 && eyeDistance > 0.02)
// // // // // // // // //             expression = "smile";

// // // // // // // // //           if (expressionRef.current !== expression) {
// // // // // // // // //             expressionRef.current = expression;
// // // // // // // // //             setExpression(expression);
// // // // // // // // //           }

// // // // // // // // //           /* ---------- REDNESS ---------- */
// // // // // // // // //           const lx = lm[33].x * canvas.width;
// // // // // // // // //           const ly = lm[33].y * canvas.height;

// // // // // // // // //           if (lx > 20 && ly > 20 && lx < canvas.width - 20) {
// // // // // // // // //             const region = ctx.getImageData(lx - 10, ly - 10, 20, 20);
// // // // // // // // //             const red = detectRedness(region);

// // // // // // // // //             rednessHistory.current.push(red);
// // // // // // // // //             if (rednessHistory.current.length > 10)
// // // // // // // // //               rednessHistory.current.shift();

// // // // // // // // //             const avgRed =
// // // // // // // // //               rednessHistory.current.reduce((a, b) => a + b, 0) /
// // // // // // // // //               rednessHistory.current.length;

// // // // // // // // //             if (avgRed > 0.45) redState.current = "high";
// // // // // // // // //             else if (avgRed > 0.30) redState.current = "moderate";

// // // // // // // // //             setRedness(redState.current);
// // // // // // // // //           }
// // // // // // // // //         });

// // // // // // // // //         faceMeshRef.current = faceMesh;

// // // // // // // // //         const camera = new window.Camera(videoRef.current, {
// // // // // // // // //           onFrame: async () => {
// // // // // // // // //             if (document.visibilityState !== "visible") return;
// // // // // // // // //             await faceMesh.send({ image: videoRef.current });
// // // // // // // // //           },
// // // // // // // // //           width: 640,
// // // // // // // // //           height: 480
// // // // // // // // //         });

// // // // // // // // //         camera.start();
// // // // // // // // //         cameraRef.current = camera;

// // // // // // // // //         /* ---------- STRESS ENGINE ---------- */
// // // // // // // // //         interval = setInterval(() => {

// // // // // // // // //           const now = Date.now();
// // // // // // // // //           blinkTimes.current =
// // // // // // // // //             blinkTimes.current.filter(t => now - t < 60000);

// // // // // // // // //           const rate = blinkTimes.current.length;
// // // // // // // // //           setBlinkRate(rate);

// // // // // // // // //           let score = 100;

// // // // // // // // //           // Blink
// // // // // // // // //           if (rate < 15) score -= 5;
// // // // // // // // //           if (rate < 10) score -= 10;
// // // // // // // // //           if (rate < 6) score -= 15;

// // // // // // // // //           // Distance
// // // // // // // // //           if (distanceRef.current === "too close") score -= 12;
// // // // // // // // //           if (distanceRef.current === "too far") score -= 6;

// // // // // // // // //           // Head
// // // // // // // // //           if (headRef.current === "tilted") score -= 10;

// // // // // // // // //           // Expression
// // // // // // // // //           if (expressionRef.current === "drowsy") score -= 25;
// // // // // // // // //           else if (expressionRef.current === "shocked") score -= 8;

// // // // // // // // //           // Redness
// // // // // // // // //           const redness =
// // // // // // // // //             rednessHistory.current.reduce((a, b) => a + b, 0) /
// // // // // // // // //             (rednessHistory.current.length || 1);

// // // // // // // // //           if (redness > 0.45) score -= 12;
// // // // // // // // //           else if (redness > 0.30) score -= 6;

// // // // // // // // //           score = Math.max(20, Math.min(100, score));

// // // // // // // // //           smoothedScore.current = smooth(smoothedScore.current, score);
// // // // // // // // //           setStressScore(Math.round(smoothedScore.current));

// // // // // // // // //         }, 1000);

// // // // // // // // //       } catch (err) {
// // // // // // // // //         console.error("INIT FAILED:", err);
// // // // // // // // //       }
// // // // // // // // //     };

// // // // // // // // //     init();

// // // // // // // // //     return () => {
// // // // // // // // //       clearInterval(interval);
// // // // // // // // //       cameraRef.current?.stop();
// // // // // // // // //       faceMeshRef.current?.close();
// // // // // // // // //     };

// // // // // // // // //   }, []);

// // // // // // // // //   return (
// // // // // // // // //     <div className="w-full h-full">
// // // // // // // // //       <video ref={videoRef} className="hidden" />
// // // // // // // // //       <canvas
// // // // // // // // //         ref={canvasRef}
// // // // // // // // //         width="640"
// // // // // // // // //         height="480"
// // // // // // // // //         className="rounded-lg w-full h-full object-cover scale-x-[-1]"
// // // // // // // // //       />
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default WebcamFeed;

// // // // // // // // // import { useEffect, useRef } from "react";

// // // // // // // // // const WebcamFeed = ({
// // // // // // // // //   setBlinkRate = () => {},
// // // // // // // // //   setDistance = () => {},
// // // // // // // // //   setRedness = () => {},
// // // // // // // // //   setStressScore = () => {},
// // // // // // // // //   setHeadPosition = () => {},
// // // // // // // // //   setExpression = () => {}
// // // // // // // // // }) => {

// // // // // // // // //   const videoRef = useRef(null);
// // // // // // // // //   const canvasRef = useRef(null);

// // // // // // // // //   const faceMeshRef = useRef(null);
// // // // // // // // //   const cameraRef = useRef(null);

// // // // // // // // //   const blinkTimes = useRef([]);
// // // // // // // // //   const eyeClosed = useRef(false);
// // // // // // // // //   const lastBlinkTime = useRef(0);

// // // // // // // // //   const eyeHistory = useRef([]);
// // // // // // // // //   const rednessHistory = useRef([]);

// // // // // // // // //   const expressionRef = useRef("focused");
// // // // // // // // //   const distanceRef = useRef("optimal");
// // // // // // // // //   const headRef = useRef("aligned");

// // // // // // // // //   const smoothedScore = useRef(100);
// // // // // // // // //   const eyeCloseStart = useRef(null);
// // // // // // // // //   const redState = useRef("normal");

// // // // // // // // //   const smooth = (prev, current) => prev * 0.9 + current * 0.1;

// // // // // // // // //   const loadScript = (src) => {
// // // // // // // // //     return new Promise((resolve, reject) => {
// // // // // // // // //       if (document.querySelector(`script[src="${src}"]`)) return resolve();

// // // // // // // // //       const script = document.createElement("script");
// // // // // // // // //       script.src = src;
// // // // // // // // //       script.async = true;
// // // // // // // // //       script.onload = resolve;
// // // // // // // // //       script.onerror = reject;
// // // // // // // // //       document.body.appendChild(script);
// // // // // // // // //     });
// // // // // // // // //   };

// // // // // // // // //   const detectRedness = (imageData) => {
// // // // // // // // //     let redPixels = 0, total = 0;
// // // // // // // // //     const data = imageData.data;

// // // // // // // // //     for (let i = 0; i < data.length; i += 4) {
// // // // // // // // //       const r = data[i], g = data[i + 1], b = data[i + 2];
// // // // // // // // //       if (r > g * 1.15 && r > b * 1.15) redPixels++;
// // // // // // // // //       total++;
// // // // // // // // //     }
// // // // // // // // //     return redPixels / total;
// // // // // // // // //   };

// // // // // // // // //   useEffect(() => {

// // // // // // // // //     let interval;

// // // // // // // // //     const init = async () => {
// // // // // // // // //       try {
// // // // // // // // //         await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/face_mesh.js");
// // // // // // // // //         await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");

// // // // // // // // //         const faceMesh = new window.FaceMesh({
// // // // // // // // //           locateFile: (file) =>
// // // // // // // // //             `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`
// // // // // // // // //         });

// // // // // // // // //         faceMesh.setOptions({
// // // // // // // // //           maxNumFaces: 1,
// // // // // // // // //           refineLandmarks: true,
// // // // // // // // //           minDetectionConfidence: 0.5,
// // // // // // // // //           minTrackingConfidence: 0.5
// // // // // // // // //         });

// // // // // // // // //         faceMesh.onResults((results) => {

// // // // // // // // //           const canvas = canvasRef.current;
// // // // // // // // //           if (!canvas) return;

// // // // // // // // //           const ctx = canvas.getContext("2d");
// // // // // // // // //           ctx.clearRect(0, 0, canvas.width, canvas.height);
// // // // // // // // //           ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

// // // // // // // // //           if (!results.multiFaceLandmarks?.length) return;

// // // // // // // // //           const lm = results.multiFaceLandmarks[0];

// // // // // // // // //           // 👁️ BLINK
// // // // // // // // //           const raw = Math.abs(lm[159].y - lm[145].y);
// // // // // // // // //           eyeHistory.current.push(raw);
// // // // // // // // //           if (eyeHistory.current.length > 5) eyeHistory.current.shift();

// // // // // // // // //           const eyeDistance =
// // // // // // // // //             eyeHistory.current.reduce((a, b) => a + b, 0) /
// // // // // // // // //             eyeHistory.current.length;

// // // // // // // // //           if (eyeDistance < 0.025 && !eyeClosed.current)
// // // // // // // // //             eyeClosed.current = true;

// // // // // // // // //           if (eyeDistance > 0.03 && eyeClosed.current) {
// // // // // // // // //             const now = Date.now();
// // // // // // // // //             if (now - lastBlinkTime.current > 150) {
// // // // // // // // //               blinkTimes.current.push(now);
// // // // // // // // //               lastBlinkTime.current = now;
// // // // // // // // //             }
// // // // // // // // //             eyeClosed.current = false;
// // // // // // // // //           }

// // // // // // // // //           // 📏 DISTANCE
// // // // // // // // //           const z = lm[1].z;
// // // // // // // // //           distanceRef.current =
// // // // // // // // //             z < -0.10 ? "too close" :
// // // // // // // // //             z > -0.07 ? "too far" : "optimal";
// // // // // // // // //           setDistance(distanceRef.current);

// // // // // // // // //           // 🧍 HEAD
// // // // // // // // //           const tilt = (lm[263].y - lm[33].y) / (lm[263].x - lm[33].x);
// // // // // // // // //           headRef.current = Math.abs(tilt) > 0.1 ? "tilted" : "aligned";
// // // // // // // // //           setHeadPosition(headRef.current);

// // // // // // // // //           // 😵 EXPRESSION (FIXED)
// // // // // // // // //           const now = Date.now();
// // // // // // // // //           let expression = "focused";

// // // // // // // // //           if (eyeDistance < 0.015) {
// // // // // // // // //             if (!eyeCloseStart.current) eyeCloseStart.current = now;
// // // // // // // // //             if (now - eyeCloseStart.current > 2000)
// // // // // // // // //               expression = "drowsy";
// // // // // // // // //           } else eyeCloseStart.current = null;

// // // // // // // // //           const mouthOpen = Math.abs(lm[13].y - lm[14].y);
// // // // // // // // //           const mouthWidth = Math.abs(lm[61].x - lm[291].x);

// // // // // // // // //           if (mouthOpen > 0.07) expression = "shocked";
// // // // // // // // //           else if (mouthWidth > 0.065 && eyeDistance > 0.02)
// // // // // // // // //             expression = "smile";

// // // // // // // // //           if (expressionRef.current !== expression) {
// // // // // // // // //             expressionRef.current = expression;
// // // // // // // // //             setExpression(expression);
// // // // // // // // //           }

// // // // // // // // //           // 👁️ REDNESS (STABLE)
// // // // // // // // //           const lx = lm[33].x * canvas.width;
// // // // // // // // //           const ly = lm[33].y * canvas.height;

// // // // // // // // //           if (lx > 20 && ly > 20 && lx < canvas.width - 20) {
// // // // // // // // //             const region = ctx.getImageData(lx - 10, ly - 10, 20, 20);
// // // // // // // // //             const red = detectRedness(region);

// // // // // // // // //             rednessHistory.current.push(red);
// // // // // // // // //             if (rednessHistory.current.length > 10)
// // // // // // // // //               rednessHistory.current.shift();

// // // // // // // // //             const avgRed =
// // // // // // // // //               rednessHistory.current.reduce((a, b) => a + b, 0) /
// // // // // // // // //               rednessHistory.current.length;

// // // // // // // // //             if (avgRed > 0.45) redState.current = "high";
// // // // // // // // //             else if (avgRed > 0.30) redState.current = "moderate";

// // // // // // // // //             setRedness(redState.current);
// // // // // // // // //           }
// // // // // // // // //         });

// // // // // // // // //         faceMeshRef.current = faceMesh;

// // // // // // // // //         const camera = new window.Camera(videoRef.current, {
// // // // // // // // //           onFrame: async () => {
// // // // // // // // //             try {
// // // // // // // // //               if (videoRef.current && videoRef.current.readyState === 4) {
// // // // // // // // //                 await faceMeshRef.current.send({
// // // // // // // // //                   image: videoRef.current,
// // // // // // // // //                 });
// // // // // // // // //               }
// // // // // // // // //             } catch {
// // // // // // // // //               console.warn("Frame skipped");
// // // // // // // // //             }
// // // // // // // // //           },
// // // // // // // // //           width: 640,
// // // // // // // // //           height: 480
// // // // // // // // //         });

// // // // // // // // //         camera.start();
// // // // // // // // //         cameraRef.current = camera;

// // // // // // // // //         // 🧠 STRESS ENGINE
// // // // // // // // //         interval = setInterval(() => {

// // // // // // // // //           const now = Date.now();
// // // // // // // // //           blinkTimes.current =
// // // // // // // // //             blinkTimes.current.filter(t => now - t < 60000);

// // // // // // // // //           const rate = blinkTimes.current.length;
// // // // // // // // //           setBlinkRate(rate);

// // // // // // // // //           let score = 100;

// // // // // // // // //           if (rate < 15) score -= 5;
// // // // // // // // //           if (rate < 10) score -= 10;
// // // // // // // // //           if (rate < 6) score -= 15;

// // // // // // // // //           if (distanceRef.current === "too close") score -= 12;
// // // // // // // // //           if (distanceRef.current === "too far") score -= 6;

// // // // // // // // //           if (headRef.current === "tilted") score -= 10;

// // // // // // // // //           if (expressionRef.current === "drowsy") score -= 25;
// // // // // // // // //           else if (expressionRef.current === "shocked") score -= 8;

// // // // // // // // //           const redness =
// // // // // // // // //             rednessHistory.current.reduce((a, b) => a + b, 0) /
// // // // // // // // //             (rednessHistory.current.length || 1);

// // // // // // // // //           if (redness > 0.45) score -= 12;
// // // // // // // // //           else if (redness > 0.30) score -= 6;

// // // // // // // // //           score = Math.max(20, Math.min(100, score));

// // // // // // // // //           smoothedScore.current = smooth(smoothedScore.current, score);
// // // // // // // // //           setStressScore(Math.round(smoothedScore.current));

// // // // // // // // //         }, 1000);

// // // // // // // // //       } catch (err) {
// // // // // // // // //         console.error("INIT FAILED:", err);
// // // // // // // // //       }
// // // // // // // // //     };

// // // // // // // // //     init();

// // // // // // // // //     return () => {
// // // // // // // // //       clearInterval(interval);
// // // // // // // // //       cameraRef.current?.stop();
// // // // // // // // //       faceMeshRef.current?.close();
// // // // // // // // //     };

// // // // // // // // //   }, []);

// // // // // // // // //   return (
// // // // // // // // //     <div className="w-full h-full">
// // // // // // // // //       <video ref={videoRef} className="hidden" />
// // // // // // // // //       <canvas
// // // // // // // // //         ref={canvasRef}
// // // // // // // // //         width="640"
// // // // // // // // //         height="480"
// // // // // // // // //         className="rounded-lg w-full h-full object-cover scale-x-[-1]"
// // // // // // // // //       />
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // // export default WebcamFeed;
// // // // // // // // // import { useEffect, useRef } from "react";

// // // // // // // // // const WebcamFeed = ({
// // // // // // // // //   setBlinkRate = () => {},
// // // // // // // // //   setDistance = () => {},
// // // // // // // // //   setRedness = () => {},
// // // // // // // // //   setStressScore = () => {},
// // // // // // // // //   setHeadPosition = () => {},
// // // // // // // // //   setExpression = () => {}
// // // // // // // // // }) => {

// // // // // // // // //   const videoRef = useRef(null);
// // // // // // // // //   const canvasRef = useRef(null);

// // // // // // // // //   const faceMeshRef = useRef(null);
// // // // // // // // //   const cameraRef = useRef(null);

// // // // // // // // //   const blinkTimes = useRef([]);
// // // // // // // // //   const eyeClosed = useRef(false);
// // // // // // // // //   const lastBlinkTime = useRef(0);

// // // // // // // // //   const eyeHistory = useRef([]);
// // // // // // // // //   const rednessHistory = useRef([]);

// // // // // // // // //   const expressionRef = useRef("focused");
// // // // // // // // //   const distanceRef = useRef("optimal");
// // // // // // // // //   const headRef = useRef("aligned");

// // // // // // // // //   const smoothedScore = useRef(100);
// // // // // // // // //   const eyeCloseStart = useRef(null);
// // // // // // // // //   const redState = useRef("normal");

// // // // // // // // //   // 🔥 UPDATED SMOOTHING HERE
// // // // // // // // //   const smooth = (prev, current) => prev *0.6 + current * 0.4;

// // // // // // // // //   const loadScript = (src) => {
// // // // // // // // //     return new Promise((resolve, reject) => {
// // // // // // // // //       if (document.querySelector(`script[src="${src}"]`)) return resolve();

// // // // // // // // //       const script = document.createElement("script");
// // // // // // // // //       script.src = src;
// // // // // // // // //       script.async = true;
// // // // // // // // //       script.onload = resolve;
// // // // // // // // //       script.onerror = reject;
// // // // // // // // //       document.body.appendChild(script);
// // // // // // // // //     });
// // // // // // // // //   };

// // // // // // // // //   const detectRedness = (imageData) => {
// // // // // // // // //     let redPixels = 0, total = 0;
// // // // // // // // //     const data = imageData.data;

// // // // // // // // //     for (let i = 0; i < data.length; i += 4) {
// // // // // // // // //       const r = data[i], g = data[i + 1], b = data[i + 2];
// // // // // // // // //       if (r > g * 1.15 && r > b * 1.15) redPixels++;
// // // // // // // // //       total++;
// // // // // // // // //     }
// // // // // // // // //     return redPixels / total;
// // // // // // // // //   };

// // // // // // // // //   useEffect(() => {

// // // // // // // // //     let interval;

// // // // // // // // //     const init = async () => {
// // // // // // // // //       try {
// // // // // // // // //         await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/face_mesh.js");
// // // // // // // // //         await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");

// // // // // // // // //         const faceMesh = new window.FaceMesh({
// // // // // // // // //           locateFile: (file) =>
// // // // // // // // //             `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`
// // // // // // // // //         });

// // // // // // // // //         faceMesh.setOptions({
// // // // // // // // //           maxNumFaces: 1,
// // // // // // // // //           refineLandmarks: true,
// // // // // // // // //           minDetectionConfidence: 0.5,
// // // // // // // // //           minTrackingConfidence: 0.5
// // // // // // // // //         });

// // // // // // // // //         faceMesh.onResults((results) => {

// // // // // // // // //           const canvas = canvasRef.current;
// // // // // // // // //           if (!canvas) return;

// // // // // // // // //           const ctx = canvas.getContext("2d");
// // // // // // // // //           ctx.clearRect(0, 0, canvas.width, canvas.height);
// // // // // // // // //           ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

// // // // // // // // //           if (!results.multiFaceLandmarks?.length) return;

// // // // // // // // //           const lm = results.multiFaceLandmarks[0];

// // // // // // // // //           const raw = Math.abs(lm[159].y - lm[145].y);
// // // // // // // // //           eyeHistory.current.push(raw);
// // // // // // // // //           if (eyeHistory.current.length > 5) eyeHistory.current.shift();

// // // // // // // // //           const eyeDistance =
// // // // // // // // //             eyeHistory.current.reduce((a, b) => a + b, 0) /
// // // // // // // // //             eyeHistory.current.length;

// // // // // // // // //           if (eyeDistance < 0.025 && !eyeClosed.current)
// // // // // // // // //             eyeClosed.current = true;

// // // // // // // // //           if (eyeDistance > 0.03 && eyeClosed.current) {
// // // // // // // // //             const now = Date.now();
// // // // // // // // //             if (now - lastBlinkTime.current > 150) {
// // // // // // // // //               blinkTimes.current.push(now);
// // // // // // // // //               lastBlinkTime.current = now;
// // // // // // // // //             }
// // // // // // // // //             eyeClosed.current = false;
// // // // // // // // //           }

// // // // // // // // //           const z = lm[1].z;
// // // // // // // // //           distanceRef.current =
// // // // // // // // //             z < -0.10 ? "too close" :
// // // // // // // // //             z > -0.07 ? "too far" : "optimal";
// // // // // // // // //           setDistance(distanceRef.current);

// // // // // // // // //           const tilt = (lm[263].y - lm[33].y) / (lm[263].x - lm[33].x);
// // // // // // // // //           headRef.current = Math.abs(tilt) > 0.1 ? "tilted" : "aligned";
// // // // // // // // //           setHeadPosition(headRef.current);

// // // // // // // // //           const now = Date.now();
// // // // // // // // //           let expression = "focused";

// // // // // // // // //           if (eyeDistance < 0.015) {
// // // // // // // // //             if (!eyeCloseStart.current) eyeCloseStart.current = now;
// // // // // // // // //             if (now - eyeCloseStart.current > 2000)
// // // // // // // // //               expression = "drowsy";
// // // // // // // // //           } else eyeCloseStart.current = null;

// // // // // // // // //           const mouthOpen = Math.abs(lm[13].y - lm[14].y);
// // // // // // // // //           const mouthWidth = Math.abs(lm[61].x - lm[291].x);

// // // // // // // // //           if (mouthOpen > 0.07) expression = "shocked";
// // // // // // // // //           else if (mouthWidth > 0.065 && eyeDistance > 0.02)
// // // // // // // // //             expression = "smile";

// // // // // // // // //           if (expressionRef.current !== expression) {
// // // // // // // // //             expressionRef.current = expression;
// // // // // // // // //             setExpression(expression);
// // // // // // // // //           }

// // // // // // // // //           const lx = lm[33].x * canvas.width;
// // // // // // // // //           const ly = lm[33].y * canvas.height;

// // // // // // // // //           if (lx > 20 && ly > 20 && lx < canvas.width - 20) {
// // // // // // // // //             const region = ctx.getImageData(lx - 10, ly - 10, 20, 20);
// // // // // // // // //             const red = detectRedness(region);

// // // // // // // // //             rednessHistory.current.push(red);
// // // // // // // // //             if (rednessHistory.current.length > 10)
// // // // // // // // //               rednessHistory.current.shift();

// // // // // // // // //             const avgRed =
// // // // // // // // //               rednessHistory.current.reduce((a, b) => a + b, 0) /
// // // // // // // // //               rednessHistory.current.length;

// // // // // // // // //             if (avgRed > 0.45) redState.current = "high";
// // // // // // // // //             else if (avgRed > 0.30) redState.current = "moderate";

// // // // // // // // //             setRedness(redState.current);
// // // // // // // // //           }
// // // // // // // // //         });

// // // // // // // // //         faceMeshRef.current = faceMesh;

// // // // // // // // //         const camera = new window.Camera(videoRef.current, {
// // // // // // // // //           onFrame: async () => {
// // // // // // // // //             try {
// // // // // // // // //               if (videoRef.current && videoRef.current.readyState === 4) {
// // // // // // // // //                 await faceMeshRef.current.send({
// // // // // // // // //                   image: videoRef.current,
// // // // // // // // //                 });
// // // // // // // // //               }
// // // // // // // // //             } catch {
// // // // // // // // //               console.warn("Frame skipped");
// // // // // // // // //             }
// // // // // // // // //           },
// // // // // // // // //           width: 640,
// // // // // // // // //           height: 480
// // // // // // // // //         });

// // // // // // // // //         camera.start();
// // // // // // // // //         cameraRef.current = camera;

// // // // // // // // //         interval = setInterval(() => {

// // // // // // // // //           const now = Date.now();
// // // // // // // // //           blinkTimes.current =
// // // // // // // // //             blinkTimes.current.filter(t => now - t < 60000);

// // // // // // // // //           const rate = blinkTimes.current.length;
// // // // // // // // //           setBlinkRate(rate);

// // // // // // // // //           let score = 100;

// // // // // // // // //           if (rate < 15) score -= 5;
// // // // // // // // //           if (rate < 10) score -= 10;
// // // // // // // // //           if (rate < 6) score -= 15;

// // // // // // // // //           if (distanceRef.current === "too close") score -= 12;
// // // // // // // // //           if (distanceRef.current === "too far") score -= 6;

// // // // // // // // //           if (headRef.current === "tilted") score -= 10;

// // // // // // // // //           if (expressionRef.current === "drowsy") score -= 25;
// // // // // // // // //           else if (expressionRef.current === "shocked") score -= 8;

// // // // // // // // //           const redness =
// // // // // // // // //             rednessHistory.current.reduce((a, b) => a + b, 0) /
// // // // // // // // //             (rednessHistory.current.length || 1);

// // // // // // // // //           if (redness > 0.45) score -= 12;
// // // // // // // // //           else if (redness > 0.30) score -= 6;

// // // // // // // // //           score = Math.max(20, Math.min(100, score));

// // // // // // // // //           // 🔥 SMOOTHING APPLIED HERE
// // // // // // // // //           smoothedScore.current = smooth(smoothedScore.current, score);

// // // // // // // // //           setStressScore(Math.round(smoothedScore.current));

// // // // // // // // //         }, 1000);

// // // // // // // // //       } catch (err) {
// // // // // // // // //         console.error("INIT FAILED:", err);
// // // // // // // // //       }
// // // // // // // // //     };

// // // // // // // // //     init();

// // // // // // // // //     return () => {
// // // // // // // // //       clearInterval(interval);
// // // // // // // // //       cameraRef.current?.stop();
// // // // // // // // //       faceMeshRef.current?.close();
// // // // // // // // //     };

// // // // // // // // //   }, []);

// // // // // // // // //   return (
// // // // // // // // //     <div className="w-full h-full">
// // // // // // // // //       <video ref={videoRef} className="hidden" />
// // // // // // // // //       <canvas
// // // // // // // // //         ref={canvasRef}
// // // // // // // // //         width="640"
// // // // // // // // //         height="480"
// // // // // // // // //         className="rounded-lg w-full h-full object-cover scale-x-[-1]"
// // // // // // // // //       />
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default WebcamFeed;
// // // // // // // // import { useEffect, useRef } from "react";

// // // // // // // // const WebcamFeed = ({
// // // // // // // //   setBlinkRate = () => {},
// // // // // // // //   setDistance = () => {},
// // // // // // // //   setRedness = () => {},
// // // // // // // //   setStressScore = () => {},
// // // // // // // //   setHeadPosition = () => {},
// // // // // // // //   setExpression = () => {}
// // // // // // // // }) => {

// // // // // // // //   const videoRef = useRef(null);
// // // // // // // //   const canvasRef = useRef(null);

// // // // // // // //   const faceMeshRef = useRef(null);
// // // // // // // //   const cameraRef = useRef(null);

// // // // // // // //   const blinkTimes = useRef([]);
// // // // // // // //   const eyeClosed = useRef(false);
// // // // // // // //   const lastBlinkTime = useRef(0);

// // // // // // // //   const eyeHistory = useRef([]);
// // // // // // // //   const rednessHistory = useRef([]);

// // // // // // // //   const expressionRef = useRef("focused");
// // // // // // // //   const distanceRef = useRef("optimal");
// // // // // // // //   const headRef = useRef("aligned");

// // // // // // // //   const smoothedScore = useRef(100);
// // // // // // // //   const eyeCloseStart = useRef(null);
// // // // // // // //   const redState = useRef("normal");

// // // // // // // //   // 🔥 FINAL SMOOTHING (balanced)
// // // // // // // //   const smooth = (prev, current) => prev * 0.6 + current * 0.4;

// // // // // // // //   const detectRedness = (imageData) => {
// // // // // // // //     let redPixels = 0, total = 0;
// // // // // // // //     const data = imageData.data;

// // // // // // // //     for (let i = 0; i < data.length; i += 4) {
// // // // // // // //       const r = data[i], g = data[i + 1], b = data[i + 2];
// // // // // // // //       if (r > g * 1.15 && r > b * 1.15) redPixels++;
// // // // // // // //       total++;
// // // // // // // //     }
// // // // // // // //     return redPixels / total;
// // // // // // // //   };

// // // // // // // //   useEffect(() => {

// // // // // // // //     let interval;

// // // // // // // //     const init = async () => {

// // // // // // // //       // ✅ IMPORTANT: Use ONLY global scripts (from index.html)
// // // // // // // //       if (!window.FaceMesh || !window.Camera) {
// // // // // // // //         console.error("MediaPipe not loaded properly");
// // // // // // // //         return;
// // // // // // // //       }

// // // // // // // //       const faceMesh = new window.FaceMesh({
// // // // // // // //         locateFile: (file) =>
// // // // // // // //           `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`
// // // // // // // //       });

// // // // // // // //       faceMesh.setOptions({
// // // // // // // //         maxNumFaces: 1,
// // // // // // // //         refineLandmarks: true,
// // // // // // // //         minDetectionConfidence: 0.5,
// // // // // // // //         minTrackingConfidence: 0.5
// // // // // // // //       });

// // // // // // // //       faceMesh.onResults((results) => {

// // // // // // // //         const canvas = canvasRef.current;
// // // // // // // //         if (!canvas) return;

// // // // // // // //         const ctx = canvas.getContext("2d");
// // // // // // // //         ctx.clearRect(0, 0, canvas.width, canvas.height);
// // // // // // // //         ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

// // // // // // // //         if (!results.multiFaceLandmarks?.length) return;

// // // // // // // //         const lm = results.multiFaceLandmarks[0];

// // // // // // // //         /* ---------- 👁️ BLINK ---------- */
// // // // // // // //         const raw = Math.abs(lm[159].y - lm[145].y);

// // // // // // // //         eyeHistory.current.push(raw);
// // // // // // // //         if (eyeHistory.current.length > 5) eyeHistory.current.shift();

// // // // // // // //         const eyeDistance =
// // // // // // // //           eyeHistory.current.reduce((a, b) => a + b, 0) /
// // // // // // // //           eyeHistory.current.length;

// // // // // // // //         if (eyeDistance < 0.025 && !eyeClosed.current)
// // // // // // // //           eyeClosed.current = true;

// // // // // // // //         if (eyeDistance > 0.03 && eyeClosed.current) {
// // // // // // // //           const now = Date.now();
// // // // // // // //           if (now - lastBlinkTime.current > 150) {
// // // // // // // //             blinkTimes.current.push(now);
// // // // // // // //             lastBlinkTime.current = now;
// // // // // // // //           }
// // // // // // // //           eyeClosed.current = false;
// // // // // // // //         }

// // // // // // // //         /* ---------- 📏 DISTANCE ---------- */
// // // // // // // //         const z = lm[1].z;
// // // // // // // //         distanceRef.current =
// // // // // // // //           z < -0.10 ? "too close" :
// // // // // // // //           z > -0.07 ? "too far" : "optimal";

// // // // // // // //         setDistance(distanceRef.current);

// // // // // // // //         /* ---------- 🧍 HEAD ---------- */
// // // // // // // //         const tilt = (lm[263].y - lm[33].y) / (lm[263].x - lm[33].x);
// // // // // // // //         headRef.current = Math.abs(tilt) > 0.1 ? "tilted" : "aligned";

// // // // // // // //         setHeadPosition(headRef.current);

// // // // // // // //         /* ---------- 😵 EXPRESSION ---------- */
// // // // // // // //         const now = Date.now();
// // // // // // // //         let expression = "focused";

// // // // // // // //         if (eyeDistance < 0.015) {
// // // // // // // //           if (!eyeCloseStart.current) eyeCloseStart.current = now;
// // // // // // // //           if (now - eyeCloseStart.current > 2000)
// // // // // // // //             expression = "drowsy";
// // // // // // // //         } else {
// // // // // // // //           eyeCloseStart.current = null;
// // // // // // // //         }

// // // // // // // //         const mouthOpen = Math.abs(lm[13].y - lm[14].y);
// // // // // // // //         const mouthWidth = Math.abs(lm[61].x - lm[291].x);

// // // // // // // //         if (mouthOpen > 0.07) expression = "shocked";
// // // // // // // //         else if (mouthWidth > 0.065 && eyeDistance > 0.02)
// // // // // // // //           expression = "smile";

// // // // // // // //         if (expressionRef.current !== expression) {
// // // // // // // //           expressionRef.current = expression;
// // // // // // // //           setExpression(expression);
// // // // // // // //         }

// // // // // // // //         /* ---------- 👁️ REDNESS ---------- */
// // // // // // // //         const lx = lm[33].x * canvas.width;
// // // // // // // //         const ly = lm[33].y * canvas.height;

// // // // // // // //         if (lx > 20 && ly > 20 && lx < canvas.width - 20) {
// // // // // // // //           const region = ctx.getImageData(lx - 10, ly - 10, 20, 20);
// // // // // // // //           const red = detectRedness(region);

// // // // // // // //           rednessHistory.current.push(red);
// // // // // // // //           if (rednessHistory.current.length > 10)
// // // // // // // //             rednessHistory.current.shift();

// // // // // // // //           const avgRed =
// // // // // // // //             rednessHistory.current.reduce((a, b) => a + b, 0) /
// // // // // // // //             rednessHistory.current.length;

// // // // // // // //           // ✅ FIXED (no stuck state)
// // // // // // // //           if (avgRed > 0.45) redState.current = "high";
// // // // // // // //           else if (avgRed > 0.30) redState.current = "moderate";
// // // // // // // //           else redState.current = "normal";

// // // // // // // //           setRedness(redState.current);
// // // // // // // //         }

// // // // // // // //       });

// // // // // // // //       faceMeshRef.current = faceMesh;

// // // // // // // //       const camera = new window.Camera(videoRef.current, {
// // // // // // // //         onFrame: async () => {
// // // // // // // //           try {
// // // // // // // //             if (videoRef.current?.readyState === 4) {
// // // // // // // //               await faceMeshRef.current.send({
// // // // // // // //                 image: videoRef.current,
// // // // // // // //               });
// // // // // // // //             }
// // // // // // // //           } catch {
// // // // // // // //             // silent skip (important for stability)
// // // // // // // //           }
// // // // // // // //         },
// // // // // // // //         width: 640,
// // // // // // // //         height: 480
// // // // // // // //       });

// // // // // // // //       camera.start();
// // // // // // // //       cameraRef.current = camera;

// // // // // // // //       /* ---------- 🧠 STRESS ENGINE ---------- */
// // // // // // // //       interval = setInterval(() => {

// // // // // // // //         const now = Date.now();

// // // // // // // //         blinkTimes.current =
// // // // // // // //           blinkTimes.current.filter(t => now - t < 60000);

// // // // // // // //         const rate = blinkTimes.current.length;
// // // // // // // //         setBlinkRate(rate);

// // // // // // // //         let score = 100;

// // // // // // // //         // Blink
// // // // // // // //         if (rate < 15) score -= 5;
// // // // // // // //         if (rate < 10) score -= 10;
// // // // // // // //         if (rate < 6) score -= 15;

// // // // // // // //         // Distance
// // // // // // // //         if (distanceRef.current === "too close") score -= 12;
// // // // // // // //         if (distanceRef.current === "too far") score -= 6;

// // // // // // // //         // Head
// // // // // // // //         if (headRef.current === "tilted") score -= 10;

// // // // // // // //         // Expression
// // // // // // // //         if (expressionRef.current === "drowsy") score -= 25;
// // // // // // // //         else if (expressionRef.current === "shocked") score -= 8;

// // // // // // // //         // Redness
// // // // // // // //         const redness =
// // // // // // // //           rednessHistory.current.reduce((a, b) => a + b, 0) /
// // // // // // // //           (rednessHistory.current.length || 1);

// // // // // // // //         if (redness > 0.45) score -= 12;
// // // // // // // //         else if (redness > 0.30) score -= 6;

// // // // // // // //         score = Math.max(20, Math.min(100, score));

// // // // // // // //         // 🔥 SMOOTHING
// // // // // // // //         smoothedScore.current = smooth(smoothedScore.current, score);

// // // // // // // //         setStressScore(Math.round(smoothedScore.current));

// // // // // // // //       }, 1000);

// // // // // // // //     };

// // // // // // // //     init();

// // // // // // // //     return () => {
// // // // // // // //       clearInterval(interval);
// // // // // // // //       cameraRef.current?.stop();
// // // // // // // //       faceMeshRef.current?.close();
// // // // // // // //     };

// // // // // // // //   }, []);

// // // // // // // //   return (
// // // // // // // //     <div className="w-full h-full">
// // // // // // // //       <video ref={videoRef} className="hidden" />
// // // // // // // //       <canvas
// // // // // // // //         ref={canvasRef}
// // // // // // // //         width="640"
// // // // // // // //         height="480"
// // // // // // // //         className="rounded-lg w-full h-full object-cover scale-x-[-1]"
// // // // // // // //       />
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // export default WebcamFeed;




// // // // // // // import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

// // // // // // // const WebcamFeed = forwardRef(({
// // // // // // //   setBlinkRate = () => {},
// // // // // // //   setDistance = () => {},
// // // // // // //   setRedness = () => {},
// // // // // // //   setStressScore = () => {},
// // // // // // //   setHeadPosition = () => {},
// // // // // // //   setExpression = () => {}
// // // // // // // }, ref) => {

// // // // // // //   const videoRef = useRef(null);
// // // // // // //   const canvasRef = useRef(null);

// // // // // // //   const faceMeshRef = useRef(null);
// // // // // // //   const cameraRef = useRef(null);

// // // // // // //   const blinkTimes = useRef([]);
// // // // // // //   const eyeClosed = useRef(false);
// // // // // // //   const lastBlinkTime = useRef(0);

// // // // // // //   const eyeHistory = useRef([]);
// // // // // // //   const rednessHistory = useRef([]);

// // // // // // //   const expressionRef = useRef("focused");
// // // // // // //   const distanceRef = useRef("optimal");
// // // // // // //   const headRef = useRef("aligned");

// // // // // // //   const smoothedScore = useRef(100);
// // // // // // //   const eyeCloseStart = useRef(null);
// // // // // // //   const redState = useRef("normal");

// // // // // // //   const smooth = (prev, current) => prev * 0.6 + current * 0.4;

// // // // // // //   /* 🔥 PiP FUNCTION */
// // // // // // //   const enablePiP = async () => {
// // // // // // //     try {
// // // // // // //       const video = videoRef.current;
// // // // // // //       if (!video) return;

// // // // // // //       if (!document.pictureInPictureEnabled) {
// // // // // // //         alert("PiP not supported");
// // // // // // //         return;
// // // // // // //       }

// // // // // // //       if (document.pictureInPictureElement) {
// // // // // // //         await document.exitPictureInPicture();
// // // // // // //       } else {
// // // // // // //         await video.requestPictureInPicture();
// // // // // // //       }
// // // // // // //     } catch (err) {
// // // // // // //       console.error("PiP error:", err);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   useImperativeHandle(ref, () => ({
// // // // // // //     enablePiP
// // // // // // //   }));

// // // // // // //   const detectRedness = (imageData) => {
// // // // // // //     let redPixels = 0, total = 0;
// // // // // // //     const data = imageData.data;

// // // // // // //     for (let i = 0; i < data.length; i += 4) {
// // // // // // //       const r = data[i], g = data[i + 1], b = data[i + 2];
// // // // // // //       if (r > g * 1.15 && r > b * 1.15) redPixels++;
// // // // // // //       total++;
// // // // // // //     }
// // // // // // //     return redPixels / total;
// // // // // // //   };

// // // // // // //   useEffect(() => {
// // // // // // //     let interval;

// // // // // // //     const init = async () => {

// // // // // // //       if (!window.FaceMesh || !window.Camera) return;

// // // // // // //       const faceMesh = new window.FaceMesh({
// // // // // // //         locateFile: (file) =>
// // // // // // //           `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`
// // // // // // //       });

// // // // // // //       faceMesh.setOptions({
// // // // // // //         maxNumFaces: 1,
// // // // // // //         refineLandmarks: true,
// // // // // // //         minDetectionConfidence: 0.5,
// // // // // // //         minTrackingConfidence: 0.5
// // // // // // //       });

// // // // // // //       faceMesh.onResults((results) => {

// // // // // // //         const canvas = canvasRef.current;
// // // // // // //         if (!canvas) return;

// // // // // // //         const ctx = canvas.getContext("2d");
// // // // // // //         ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

// // // // // // //         if (!results.multiFaceLandmarks?.length) return;

// // // // // // //         const lm = results.multiFaceLandmarks[0];

// // // // // // //         const raw = Math.abs(lm[159].y - lm[145].y);

// // // // // // //         eyeHistory.current.push(raw);
// // // // // // //         if (eyeHistory.current.length > 5) eyeHistory.current.shift();

// // // // // // //         const eyeDistance =
// // // // // // //           eyeHistory.current.reduce((a, b) => a + b, 0) /
// // // // // // //           eyeHistory.current.length;

// // // // // // //         if (eyeDistance < 0.025 && !eyeClosed.current)
// // // // // // //           eyeClosed.current = true;

// // // // // // //         if (eyeDistance > 0.03 && eyeClosed.current) {
// // // // // // //           const now = Date.now();
// // // // // // //           if (now - lastBlinkTime.current > 150) {
// // // // // // //             blinkTimes.current.push(now);
// // // // // // //             lastBlinkTime.current = now;
// // // // // // //           }
// // // // // // //           eyeClosed.current = false;
// // // // // // //         }

// // // // // // //         const z = lm[1].z;
// // // // // // //         distanceRef.current =
// // // // // // //           z < -0.10 ? "too close" :
// // // // // // //           z > -0.07 ? "too far" : "optimal";

// // // // // // //         setDistance(distanceRef.current);

// // // // // // //         const tilt = (lm[263].y - lm[33].y) / (lm[263].x - lm[33].x);
// // // // // // //         headRef.current = Math.abs(tilt) > 0.1 ? "tilted" : "aligned";

// // // // // // //         setHeadPosition(headRef.current);

// // // // // // //         const now = Date.now();
// // // // // // //         let expression = "focused";

// // // // // // //         if (eyeDistance < 0.015) {
// // // // // // //           if (!eyeCloseStart.current) eyeCloseStart.current = now;
// // // // // // //           if (now - eyeCloseStart.current > 2000)
// // // // // // //             expression = "drowsy";
// // // // // // //         } else {
// // // // // // //           eyeCloseStart.current = null;
// // // // // // //         }

// // // // // // //         if (expressionRef.current !== expression) {
// // // // // // //           expressionRef.current = expression;
// // // // // // //           setExpression(expression);
// // // // // // //         }

// // // // // // //         const lx = lm[33].x * canvas.width;
// // // // // // //         const ly = lm[33].y * canvas.height;

// // // // // // //         if (lx > 20 && ly > 20 && lx < canvas.width - 20) {
// // // // // // //           const region = ctx.getImageData(lx - 10, ly - 10, 20, 20);
// // // // // // //           const red = detectRedness(region);

// // // // // // //           rednessHistory.current.push(red);
// // // // // // //           if (rednessHistory.current.length > 10)
// // // // // // //             rednessHistory.current.shift();

// // // // // // //           const avgRed =
// // // // // // //             rednessHistory.current.reduce((a, b) => a + b, 0) /
// // // // // // //             rednessHistory.current.length;

// // // // // // //           if (avgRed > 0.45) redState.current = "high";
// // // // // // //           else if (avgRed > 0.30) redState.current = "moderate";
// // // // // // //           else redState.current = "normal";

// // // // // // //           setRedness(redState.current);
// // // // // // //         }
// // // // // // //       });

// // // // // // //       faceMeshRef.current = faceMesh;

// // // // // // //       const camera = new window.Camera(videoRef.current, {
// // // // // // //         onFrame: async () => {
// // // // // // //           if (videoRef.current?.readyState === 4) {
// // // // // // //             await faceMeshRef.current.send({
// // // // // // //               image: videoRef.current,
// // // // // // //             });
// // // // // // //           }
// // // // // // //         },
// // // // // // //         width: 640,
// // // // // // //         height: 480
// // // // // // //       });

// // // // // // //       camera.start();
// // // // // // //       cameraRef.current = camera;

// // // // // // //       interval = setInterval(() => {
// // // // // // //         const now = Date.now();

// // // // // // //         blinkTimes.current =
// // // // // // //           blinkTimes.current.filter(t => now - t < 60000);

// // // // // // //         const rate = blinkTimes.current.length;
// // // // // // //         setBlinkRate(rate);

// // // // // // //         let score = 100;

// // // // // // //         if (rate < 15) score -= 5;
// // // // // // //         if (rate < 10) score -= 10;
// // // // // // //         if (rate < 6) score -= 15;

// // // // // // //         if (distanceRef.current === "too close") score -= 12;
// // // // // // //         if (distanceRef.current === "too far") score -= 6;

// // // // // // //         if (headRef.current === "tilted") score -= 10;

// // // // // // //         const redness =
// // // // // // //           rednessHistory.current.reduce((a, b) => a + b, 0) /
// // // // // // //           (rednessHistory.current.length || 1);

// // // // // // //         if (redness > 0.45) score -= 12;
// // // // // // //         else if (redness > 0.30) score -= 6;

// // // // // // //         score = Math.max(20, Math.min(100, score));

// // // // // // //         smoothedScore.current = smooth(smoothedScore.current, score);

// // // // // // //         setStressScore(Math.round(smoothedScore.current));

// // // // // // //       }, 1000);
// // // // // // //     };

// // // // // // //     init();

// // // // // // //     return () => {
// // // // // // //       clearInterval(interval);
// // // // // // //       cameraRef.current?.stop();
// // // // // // //       faceMeshRef.current?.close();
// // // // // // //     };

// // // // // // //   }, []);

// // // // // // //   return (
// // // // // // //     <div className="w-full h-full">
// // // // // // //       <video
// // // // // // //         ref={videoRef}
// // // // // // //         autoPlay
// // // // // // //         playsInline
// // // // // // //         muted
// // // // // // //         className="absolute w-0 h-0 opacity-0"
// // // // // // //       />
// // // // // // //       <canvas
// // // // // // //         ref={canvasRef}
// // // // // // //         width="640"
// // // // // // //         height="480"
// // // // // // //         className="rounded-lg w-full h-full object-cover scale-x-[-1]"
// // // // // // //       />
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // });

// // // // // // // export default WebcamFeed;



// // // // // // import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

// // // // // // const WebcamFeed = forwardRef(({
// // // // // //   setBlinkRate = () => {},
// // // // // //   setDistance = () => {},
// // // // // //   setRedness = () => {},
// // // // // //   setStressScore = () => {},
// // // // // //   setHeadPosition = () => {},
// // // // // //   setExpression = () => {}
// // // // // // }, ref) => {

// // // // // //   const videoRef = useRef(null);
// // // // // //   const canvasRef = useRef(null);

// // // // // //   const faceMeshRef = useRef(null);
// // // // // //   const cameraRef = useRef(null);

// // // // // //   const blinkTimes = useRef([]);
// // // // // //   const eyeClosed = useRef(false);
// // // // // //   const lastBlinkTime = useRef(0);

// // // // // //   const eyeHistory = useRef([]);
// // // // // //   const rednessHistory = useRef([]);

// // // // // //   const expressionRef = useRef("focused");
// // // // // //   const distanceRef = useRef("optimal");
// // // // // //   const headRef = useRef("aligned");

// // // // // //   const smoothedScore = useRef(100);
// // // // // //   const eyeCloseStart = useRef(null);
// // // // // //   const redState = useRef("normal");

// // // // // //   /* 🔥 ALERT SYSTEM */
// // // // // //   const tooCloseStart = useRef(null);
// // // // // //   const fatigueStart = useRef(null);
// // // // // //   const sleepStart = useRef(null);

// // // // // //   const smooth = (prev, current) => prev * 0.6 + current * 0.4;

// // // // // //   /* 🔥 PiP FIXED */
// // // // // //   const enablePiP = async () => {
// // // // // //     try {
// // // // // //       const video = videoRef.current;
// // // // // //       if (!video) return;

// // // // // //       await video.play();

// // // // // //       if (video.readyState < 2) {
// // // // // //         alert("Camera loading...");
// // // // // //         return;
// // // // // //       }

// // // // // //       if (!document.pictureInPictureEnabled) {
// // // // // //         alert("PiP not supported");
// // // // // //         return;
// // // // // //       }

// // // // // //       if (document.pictureInPictureElement) {
// // // // // //         await document.exitPictureInPicture();
// // // // // //       } else {
// // // // // //         await video.requestPictureInPicture();
// // // // // //       }

// // // // // //     } catch (err) {
// // // // // //       console.error(err);
// // // // // //     }
// // // // // //   };

// // // // // //   useImperativeHandle(ref, () => ({ enablePiP }));

// // // // // //   /* 🔥 ALERT CHECKS */
// // // // // //   const checkDistance = () => {
// // // // // //     if (distanceRef.current === "too close") {
// // // // // //       if (!tooCloseStart.current) tooCloseStart.current = Date.now();
// // // // // //       return Date.now() - tooCloseStart.current > 5000;
// // // // // //     }
// // // // // //     tooCloseStart.current = null;
// // // // // //     return false;
// // // // // //   };

// // // // // //   const checkFatigue = () => {
// // // // // //     if (smoothedScore.current < 40) {
// // // // // //       if (!fatigueStart.current) fatigueStart.current = Date.now();
// // // // // //       return Date.now() - fatigueStart.current > 600000;
// // // // // //     }
// // // // // //     fatigueStart.current = null;
// // // // // //     return false;
// // // // // //   };

// // // // // //   const checkSleep = () => {
// // // // // //     if (expressionRef.current === "drowsy") {
// // // // // //       if (!sleepStart.current) sleepStart.current = Date.now();
// // // // // //       return Date.now() - sleepStart.current > 300000;
// // // // // //     }
// // // // // //     sleepStart.current = null;
// // // // // //     return false;
// // // // // //   };

// // // // // //   useEffect(() => {
// // // // // //     let interval;

// // // // // //     const init = async () => {

// // // // // //       const faceMesh = new window.FaceMesh({
// // // // // //         locateFile: (file) =>
// // // // // //           `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`
// // // // // //       });

// // // // // //       faceMesh.setOptions({
// // // // // //         maxNumFaces: 1,
// // // // // //         refineLandmarks: true
// // // // // //       });

// // // // // //       faceMesh.onResults((results) => {

// // // // // //         const canvas = canvasRef.current;
// // // // // //         const ctx = canvas.getContext("2d");

// // // // // //         ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

// // // // // //         /* 🌑 DARK OVERLAY */
// // // // // //         ctx.fillStyle = "rgba(11,18,32,0.3)";
// // // // // //         ctx.fillRect(0, 0, canvas.width, canvas.height);

// // // // // //         /* 📊 STRESS UI */
// // // // // //         let color = "#22C55E";
// // // // // //         if (smoothedScore.current < 70) color = "#facc15";
// // // // // //         if (smoothedScore.current < 40) color = "#ef4444";

// // // // // //         ctx.fillStyle = "rgba(0,0,0,0.6)";
// // // // // //         ctx.fillRect(10, 10, 160, 50);

// // // // // //         ctx.fillStyle = color;
// // // // // //         ctx.font = "bold 16px sans-serif";
// // // // // //         ctx.fillText(`Stress: ${Math.round(smoothedScore.current)}`, 20, 40);

// // // // // //         /* 🔴 ALERTS */
// // // // // //         let y = 70;

// // // // // //         const drawAlert = (msg) => {
// // // // // //           ctx.fillStyle = "rgba(0,0,0,0.7)";
// // // // // //           ctx.fillRect(10, y, 220, 40);
// // // // // //           ctx.fillStyle = "#EC4899";
// // // // // //           ctx.fillText(msg, 20, y + 25);
// // // // // //           y += 45;
// // // // // //         };

// // // // // //         if (checkDistance()) drawAlert("Too Close");
// // // // // //         if (checkFatigue()) drawAlert("Take a Break");
// // // // // //         if (checkSleep()) drawAlert("Inactive");

// // // // // //         if (!results.multiFaceLandmarks?.length) return;

// // // // // //         const lm = results.multiFaceLandmarks[0];

// // // // // //         const raw = Math.abs(lm[159].y - lm[145].y);

// // // // // //         eyeHistory.current.push(raw);
// // // // // //         if (eyeHistory.current.length > 5) eyeHistory.current.shift();

// // // // // //         const eyeDistance =
// // // // // //           eyeHistory.current.reduce((a, b) => a + b, 0) /
// // // // // //           eyeHistory.current.length;

// // // // // //         if (eyeDistance < 0.025 && !eyeClosed.current)
// // // // // //           eyeClosed.current = true;

// // // // // //         if (eyeDistance > 0.03 && eyeClosed.current) {
// // // // // //           blinkTimes.current.push(Date.now());
// // // // // //           eyeClosed.current = false;
// // // // // //         }

// // // // // //         const z = lm[1].z;
// // // // // //         distanceRef.current =
// // // // // //           z < -0.10 ? "too close" :
// // // // // //           z > -0.07 ? "too far" : "optimal";

// // // // // //         setDistance(distanceRef.current);
// // // // // //       });

// // // // // //       faceMeshRef.current = faceMesh;

// // // // // //       const camera = new window.Camera(videoRef.current, {
// // // // // //         onFrame: async () => {
// // // // // //           if (videoRef.current?.readyState === 4) {
// // // // // //             await faceMeshRef.current.send({
// // // // // //               image: videoRef.current,
// // // // // //             });
// // // // // //           }
// // // // // //         },
// // // // // //         width: 640,
// // // // // //         height: 480
// // // // // //       });

// // // // // //       camera.start();

// // // // // //       setTimeout(() => {
// // // // // //         videoRef.current.play().catch(()=>{});
// // // // // //       }, 500);

// // // // // //       interval = setInterval(() => {
// // // // // //         const now = Date.now();

// // // // // //         blinkTimes.current =
// // // // // //           blinkTimes.current.filter(t => now - t < 60000);

// // // // // //         const rate = blinkTimes.current.length;
// // // // // //         setBlinkRate(rate);

// // // // // //         let score = 100;

// // // // // //         if (rate < 10) score -= 10;
// // // // // //         if (distanceRef.current === "too close") score -= 12;

// // // // // //         smoothedScore.current = smooth(smoothedScore.current, score);

// // // // // //         setStressScore(Math.round(smoothedScore.current));

// // // // // //       }, 1000);
// // // // // //     };

// // // // // //     init();

// // // // // //     return () => {
// // // // // //       clearInterval(interval);
// // // // // //       cameraRef.current?.stop();
// // // // // //       faceMeshRef.current?.close();
// // // // // //     };

// // // // // //   }, []);

// // // // // //   return (
// // // // // //     <div className="w-full h-full">
// // // // // //       <video
// // // // // //         ref={videoRef}
// // // // // //         autoPlay
// // // // // //         playsInline
// // // // // //         muted
// // // // // //         className="fixed bottom-4 right-4 w-40 h-28 opacity-0"
// // // // // //       />
// // // // // //       <canvas
// // // // // //         ref={canvasRef}
// // // // // //         width="640"
// // // // // //         height="480"
// // // // // //         className="rounded-xl w-full h-full object-cover"
// // // // // //       />
// // // // // //     </div>
// // // // // //   );
// // // // // // });

// // // // // // export default WebcamFeed;





// // // // // import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

// // // // // const WebcamFeed = forwardRef(({
// // // // //   setBlinkRate = () => {},
// // // // //   setDistance = () => {},
// // // // //   setRedness = () => {},
// // // // //   setStressScore = () => {},
// // // // //   setHeadPosition = () => {},
// // // // //   setExpression = () => {}
// // // // // }, ref) => {

// // // // //   const videoRef = useRef(null);
// // // // //   const canvasRef = useRef(null);
// // // // //   const pipVideoRef = useRef(null); // 🔥 NEW

// // // // //   const faceMeshRef = useRef(null);
// // // // //   const cameraRef = useRef(null);

// // // // //   const blinkTimes = useRef([]);
// // // // //   const eyeClosed = useRef(false);

// // // // //   const eyeHistory = useRef([]);

// // // // //   const distanceRef = useRef("optimal");
// // // // //   const smoothedScore = useRef(100);

// // // // //   const tooCloseStart = useRef(null);

// // // // //   const smooth = (prev, current) => prev * 0.6 + current * 0.4;

// // // // //   /* 🔥 FIXED PiP (CANVAS STREAM) */
// // // // //   const enablePiP = async () => {
// // // // //     try {
// // // // //       const canvas = canvasRef.current;
// // // // //       if (!canvas) return;

// // // // //       const stream = canvas.captureStream(30);

// // // // //       if (!pipVideoRef.current) {
// // // // //         pipVideoRef.current = document.createElement("video");
// // // // //         pipVideoRef.current.muted = true;
// // // // //         pipVideoRef.current.playsInline = true;
// // // // //       }

// // // // //       pipVideoRef.current.srcObject = stream;
// // // // //       await pipVideoRef.current.play();

// // // // //       if (document.pictureInPictureElement) {
// // // // //         await document.exitPictureInPicture();
// // // // //       } else {
// // // // //         await pipVideoRef.current.requestPictureInPicture();
// // // // //       }

// // // // //     } catch (err) {
// // // // //       console.error("PiP error:", err);
// // // // //     }
// // // // //   };

// // // // //   useImperativeHandle(ref, () => ({ enablePiP }));

// // // // //   useEffect(() => {
// // // // //     let interval;

// // // // //     const init = async () => {

// // // // //       const faceMesh = new window.FaceMesh({
// // // // //         locateFile: (file) =>
// // // // //           `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`
// // // // //       });

// // // // //       faceMesh.setOptions({
// // // // //         maxNumFaces: 1,
// // // // //         refineLandmarks: true
// // // // //       });

// // // // //       faceMesh.onResults((results) => {

// // // // //         const canvas = canvasRef.current;
// // // // //         const ctx = canvas.getContext("2d");

// // // // //         ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

// // // // //         /* 🌑 DARK THEME OVERLAY */
// // // // //         ctx.fillStyle = "rgba(11,18,32,0.25)";
// // // // //         ctx.fillRect(0, 0, canvas.width, canvas.height);

// // // // //         /* 📊 STRESS UI */
// // // // //         let color = "#22C55E";
// // // // //         if (smoothedScore.current < 70) color = "#facc15";
// // // // //         if (smoothedScore.current < 40) color = "#ef4444";

// // // // //         ctx.fillStyle = "rgba(0,0,0,0.6)";
// // // // //         ctx.fillRect(10, 10, 160, 50);

// // // // //         ctx.fillStyle = color;
// // // // //         ctx.font = "bold 16px sans-serif";
// // // // //         ctx.fillText(`Stress: ${Math.round(smoothedScore.current)}`, 20, 40);

// // // // //         /* ⚠️ TOO CLOSE ALERT */
// // // // //         if (distanceRef.current === "too close") {
// // // // //           if (!tooCloseStart.current) tooCloseStart.current = Date.now();

// // // // //           if (Date.now() - tooCloseStart.current > 5000) {
// // // // //             ctx.fillStyle = "rgba(0,0,0,0.7)";
// // // // //             ctx.fillRect(10, 70, 200, 40);
// // // // //             ctx.fillStyle = "#EC4899";
// // // // //             ctx.fillText("Too Close to Screen", 20, 95);
// // // // //           }
// // // // //         } else {
// // // // //           tooCloseStart.current = null;
// // // // //         }

// // // // //         if (!results.multiFaceLandmarks?.length) return;

// // // // //         const lm = results.multiFaceLandmarks[0];

// // // // //         const raw = Math.abs(lm[159].y - lm[145].y);

// // // // //         eyeHistory.current.push(raw);
// // // // //         if (eyeHistory.current.length > 5) eyeHistory.current.shift();

// // // // //         const eyeDistance =
// // // // //           eyeHistory.current.reduce((a, b) => a + b, 0) /
// // // // //           eyeHistory.current.length;

// // // // //         if (eyeDistance < 0.025 && !eyeClosed.current)
// // // // //           eyeClosed.current = true;

// // // // //         if (eyeDistance > 0.03 && eyeClosed.current) {
// // // // //           blinkTimes.current.push(Date.now());
// // // // //           eyeClosed.current = false;
// // // // //         }

// // // // //         const z = lm[1].z;
// // // // //         distanceRef.current =
// // // // //           z < -0.10 ? "too close" :
// // // // //           z > -0.07 ? "too far" : "optimal";

// // // // //         setDistance(distanceRef.current);
// // // // //       });

// // // // //       faceMeshRef.current = faceMesh;

// // // // //       const camera = new window.Camera(videoRef.current, {
// // // // //         onFrame: async () => {
// // // // //           if (videoRef.current?.readyState === 4) {
// // // // //             await faceMeshRef.current.send({
// // // // //               image: videoRef.current,
// // // // //             });
// // // // //           }
// // // // //         },
// // // // //         width: 640,
// // // // //         height: 480
// // // // //       });

// // // // //       camera.start();

// // // // //       setTimeout(() => {
// // // // //         videoRef.current.play().catch(()=>{});
// // // // //       }, 500);

// // // // //       interval = setInterval(() => {
// // // // //         const now = Date.now();

// // // // //         blinkTimes.current =
// // // // //           blinkTimes.current.filter(t => now - t < 60000);

// // // // //         const rate = blinkTimes.current.length;
// // // // //         setBlinkRate(rate);

// // // // //         let score = 100;

// // // // //         if (rate < 10) score -= 10;
// // // // //         if (distanceRef.current === "too close") score -= 12;

// // // // //         smoothedScore.current = smooth(smoothedScore.current, score);

// // // // //         setStressScore(Math.round(smoothedScore.current));

// // // // //       }, 1000);
// // // // //     };

// // // // //     init();

// // // // //     return () => {
// // // // //       clearInterval(interval);
// // // // //       cameraRef.current?.stop();
// // // // //       faceMeshRef.current?.close();
// // // // //     };

// // // // //   }, []);

// // // // //   return (
// // // // //     <div className="w-full h-full">
// // // // //       <video
// // // // //         ref={videoRef}
// // // // //         autoPlay
// // // // //         playsInline
// // // // //         muted
// // // // //         className="fixed bottom-4 right-4 w-40 h-28 opacity-0"
// // // // //       />
// // // // //       <canvas
// // // // //         ref={canvasRef}
// // // // //         width="640"
// // // // //         height="480"
// // // // //         className="rounded-xl w-full h-full object-cover"
// // // // //       />
// // // // //     </div>
// // // // //   );
// // // // // });

// // // // // export default WebcamFeed;






// // // // import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

// // // // const WebcamFeed = forwardRef(({
// // // //   setBlinkRate = () => {},
// // // //   setDistance = () => {},
// // // //   setRedness = () => {},
// // // //   setStressScore = () => {},
// // // //   setHeadPosition = () => {},
// // // //   setExpression = () => {}
// // // // }, ref) => {

// // // //   const videoRef = useRef(null);
// // // //   const canvasRef = useRef(null);
// // // //   const pipVideoRef = useRef(null);

// // // //   const faceMeshRef = useRef(null);

// // // //   const blinkTimes = useRef([]);
// // // //   const eyeClosed = useRef(false);
// // // //   const eyeHistory = useRef([]);

// // // //   const distanceRef = useRef("optimal");
// // // //   const smoothedScore = useRef(100);

// // // //   const tooCloseStart = useRef(null);
// // // //   const alertCooldown = useRef(0);
// // // //   const activeAlerts = useRef([]);

// // // //   const lastFrameTime = useRef(0);

// // // //   const smooth = (prev, current) => prev * 0.6 + current * 0.4;

// // // //   /* 🔥 PiP USING CANVAS STREAM */
 
// // // import { useEffect, useRef } from "react";

// // // const WebcamFeed = ({
// // //   setBlinkRate = () => {},
// // //   setDistance = () => {},
// // //   setRedness = () => {},
// // //   setStressScore = () => {},
// // //   setHeadPosition = () => {},
// // //   setExpression = () => {}
// // // }) => {

// // //   const videoRef = useRef(null);
// // //   const canvasRef = useRef(null);

// // //   const faceMeshRef = useRef(null);
// // //   const cameraRef = useRef(null);

// // //   const blinkTimes = useRef([]);
// // //   const eyeClosed = useRef(false);
// // //   const lastBlinkTime = useRef(0);

// // //   const eyeHistory = useRef([]);
// // //   const rednessHistory = useRef([]);

// // //   const expressionRef = useRef("focused");
// // //   const distanceRef = useRef("optimal");
// // //   const headRef = useRef("aligned");

// // //   const smoothedScore = useRef(100);
// // //   const eyeCloseStart = useRef(null);
// // //   const redState = useRef("normal");

// // //   const smooth = (prev, current) => prev * 0.9 + current * 0.1;

// // //   const loadScript = (src) => {
// // //     return new Promise((resolve, reject) => {
// // //       if (document.querySelector(`script[src="${src}"]`)) return resolve();

// // //       const script = document.createElement("script");
// // //       script.src = src;
// // //       script.async = true;
// // //       script.onload = resolve;
// // //       script.onerror = reject;
// // //       document.body.appendChild(script);
// // //     });
// // //   };

// // //   const detectRedness = (imageData) => {
// // //     let redPixels = 0, total = 0;
// // //     const data = imageData.data;

// // //     for (let i = 0; i < data.length; i += 4) {
// // //       const r = data[i], g = data[i + 1], b = data[i + 2];
// // //       if (r > g * 1.15 && r > b * 1.15) redPixels++;
// // //       total++;
// // //     }
// // //     return redPixels / total;
// // //   };

// // //   useEffect(() => {
// // //     let interval;

// // //     const init = async () => {
// // //       try {
// // //         await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/face_mesh.js");
// // //         await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");

// // //         if (!window.FaceMesh || !window.Camera) {
// // //           console.error("MediaPipe failed to load");
// // //           return;
// // //         }

// // //         const faceMesh = new window.FaceMesh({
// // //           locateFile: (file) =>
// // //             `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`
// // //         });

// // //         faceMesh.setOptions({
// // //           maxNumFaces: 1,
// // //           refineLandmarks: true,
// // //           minDetectionConfidence: 0.5,
// // //           minTrackingConfidence: 0.5
// // //         });

// // //         faceMesh.onResults((results) => {
// // //           const canvas = canvasRef.current;
// // //           if (!canvas) return;

// // //           const ctx = canvas.getContext("2d");
// // //           ctx.clearRect(0, 0, canvas.width, canvas.height);
// // //           ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

// // //           if (!results.multiFaceLandmarks?.length) return;

// // //           const lm = results.multiFaceLandmarks[0];

// // //           // BLINK
// // //           const raw = Math.abs(lm[159].y - lm[145].y);
// // //           eyeHistory.current.push(raw);
// // //           if (eyeHistory.current.length > 5) eyeHistory.current.shift();

// // //           const eyeDistance =
// // //             eyeHistory.current.reduce((a, b) => a + b, 0) /
// // //             eyeHistory.current.length;

// // //           if (eyeDistance < 0.025 && !eyeClosed.current)
// // //             eyeClosed.current = true;

// // //           if (eyeDistance > 0.03 && eyeClosed.current) {
// // //             const now = Date.now();
// // //             if (now - lastBlinkTime.current > 150) {
// // //               blinkTimes.current.push(now);
// // //               lastBlinkTime.current = now;
// // //             }
// // //             eyeClosed.current = false;
// // //           }

// // //           // DISTANCE
// // //           const z = lm[1].z;
// // //           distanceRef.current =
// // //             z < -0.10 ? "too close" :
// // //             z > -0.07 ? "too far" : "optimal";

// // //           setDistance(distanceRef.current);

// // //           // HEAD
// // //           const tilt = (lm[263].y - lm[33].y) / (lm[263].x - lm[33].x);
// // //           headRef.current = Math.abs(tilt) > 0.1 ? "tilted" : "aligned";
// // //           setHeadPosition(headRef.current);

// // //           // EXPRESSION
// // //           const now = Date.now();
// // //           let expression = "focused";

// // //           if (eyeDistance < 0.015) {
// // //             if (!eyeCloseStart.current) eyeCloseStart.current = now;
// // //             if (now - eyeCloseStart.current > 2000)
// // //               expression = "drowsy";
// // //           } else {
// // //             eyeCloseStart.current = null;
// // //           }

// // //           const mouthOpen = Math.abs(lm[13].y - lm[14].y);
// // //           const mouthWidth = Math.abs(lm[61].x - lm[291].x);

// // //           if (mouthOpen > 0.07) expression = "shocked";
// // //           else if (mouthWidth > 0.065 && eyeDistance > 0.02)
// // //             expression = "smile";

// // //           if (expressionRef.current !== expression) {
// // //             expressionRef.current = expression;
// // //             setExpression(expression);
// // //           }

// // //           // REDNESS
// // //           const lx = lm[33].x * canvas.width;
// // //           const ly = lm[33].y * canvas.height;

// // //           if (lx > 20 && ly > 20 && lx < canvas.width - 20) {
// // //             const region = ctx.getImageData(lx - 10, ly - 10, 20, 20);
// // //             const red = detectRedness(region);

// // //             rednessHistory.current.push(red);
// // //             if (rednessHistory.current.length > 10)
// // //               rednessHistory.current.shift();

// // //             const avgRed =
// // //               rednessHistory.current.reduce((a, b) => a + b, 0) /
// // //               rednessHistory.current.length;

// // //             if (avgRed > 0.45) redState.current = "high";
// // //             else if (avgRed > 0.30) redState.current = "moderate";
// // //             else redState.current = "normal";

// // //             setRedness(redState.current);
// // //           }
// // //         });

// // //         faceMeshRef.current = faceMesh;

// // //         const camera = new window.Camera(videoRef.current, {
// // //           onFrame: async () => {
// // //             try {
// // //               if (videoRef.current?.readyState === 4) {
// // //                 await faceMeshRef.current.send({
// // //                   image: videoRef.current,
// // //                 });
// // //               }
// // //             } catch {
// // //               console.warn("Frame skipped");
// // //             }
// // //           },
// // //           width: 640,
// // //           height: 480
// // //         });

// // //         camera.start();
// // //         cameraRef.current = camera;

// // //         // STRESS ENGINE
// // //         interval = setInterval(() => {
// // //           const now = Date.now();

// // //           blinkTimes.current =
// // //             blinkTimes.current.filter(t => now - t < 60000);

// // //           const rate = blinkTimes.current.length;
// // //           setBlinkRate(rate);

// // //           let score = 100;

// // //           if (rate < 15) score -= 5;
// // //           if (rate < 10) score -= 10;
// // //           if (rate < 6) score -= 15;

// // //           if (distanceRef.current === "too close") score -= 12;
// // //           if (distanceRef.current === "too far") score -= 6;

// // //           if (headRef.current === "tilted") score -= 10;

// // //           if (expressionRef.current === "drowsy") score -= 25;
// // //           else if (expressionRef.current === "shocked") score -= 8;

// // //           const redness =
// // //             rednessHistory.current.reduce((a, b) => a + b, 0) /
// // //             (rednessHistory.current.length || 1);

// // //           if (redness > 0.45) score -= 12;
// // //           else if (redness > 0.30) score -= 6;

// // //           score = Math.max(20, Math.min(100, score));

// // //           smoothedScore.current = smooth(smoothedScore.current, score);
// // //           setStressScore(Math.round(smoothedScore.current));

// // //         }, 1000);

// // //       } catch (err) {
// // //         console.error("INIT FAILED:", err);
// // //       }
// // //     };

// // //     init();

// // //     return () => {
// // //       clearInterval(interval);
// // //       cameraRef.current?.stop();
// // //       faceMeshRef.current?.close();
// // //     };

// // //   }, []);

// // //   return (
// // //     <div className="w-full h-full">
// // //       <video ref={videoRef} className="hidden" />
// // //       <canvas
// // //         ref={canvasRef}
// // //         width="640"
// // //         height="480"
// // //         className="rounded-lg w-full h-full object-cover scale-x-[-1]"
// // //       />
// // //     </div>
// // //   );
// // // };

// // // export default WebcamFeed;











// // import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

// // const WebcamFeed = forwardRef(({
// //   setBlinkRate = () => {},
// //   setDistance = () => {},
// //   setRedness = () => {},
// //   setStressScore = () => {},
// //   setHeadPosition = () => {},
// //   setExpression = () => {}
// // }, ref) => {

// //   const videoRef = useRef(null);
// //   const canvasRef = useRef(null);
// //   const pipVideoRef = useRef(null);

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
// //   const eyeCloseStart = useRef(null);
// //   const redState = useRef("normal");

// //   const tooCloseStart = useRef(null);
// //   const lastRun = useRef(0);

// //   const smooth = (prev, current) => prev * 0.85 + current * 0.15;

// //   /* 🔥 PiP (CANVAS STREAM) */
// //   const enablePiP = async () => {
// //     try {
// //       const canvas = canvasRef.current;
// //       if (!canvas) return;

// //       const stream = canvas.captureStream(30);

// //       if (!pipVideoRef.current) {
// //         pipVideoRef.current = document.createElement("video");
// //         pipVideoRef.current.muted = true;
// //         pipVideoRef.current.playsInline = true;
// //       }

// //       pipVideoRef.current.srcObject = stream;
// //       await pipVideoRef.current.play();

// //       if (document.pictureInPictureElement) {
// //         await document.exitPictureInPicture();
// //       } else {
// //         await pipVideoRef.current.requestPictureInPicture();
// //       }

// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   useImperativeHandle(ref, () => ({ enablePiP }));

// //   const loadScript = (src) => {
// //     return new Promise((resolve, reject) => {
// //       if (document.querySelector(`script[src="${src}"]`)) return resolve();

// //       const script = document.createElement("script");
// //       script.src = src;
// //       script.async = true;
// //       script.onload = resolve;
// //       script.onerror = reject;
// //       document.body.appendChild(script);
// //     });
// //   };

// //   const detectRedness = (imageData) => {
// //     let redPixels = 0, total = 0;
// //     const data = imageData.data;

// //     for (let i = 0; i < data.length; i += 4) {
// //       const r = data[i], g = data[i + 1], b = data[i + 2];
// //       if (r > g * 1.15 && r > b * 1.15) redPixels++;
// //       total++;
// //     }
// //     return redPixels / total;
// //   };

// //   /* 🎯 UI DRAW (BOTTOM CENTER) */
// //   const drawStress = (ctx, canvas) => {
// //     const text = `Stress: ${Math.round(smoothedScore.current)}`;
// //     ctx.font = "bold 28px sans-serif";

// //     const textWidth = ctx.measureText(text).width;
// //     const x = canvas.width / 2 - textWidth / 2;
// //     const y = canvas.height - 20;

// //     let color = "#22C55E";
// //     if (smoothedScore.current < 70) color = "#facc15";
// //     if (smoothedScore.current < 40) color = "#ef4444";

// //     ctx.fillStyle = "rgba(0,0,0,0.7)";
// //     ctx.fillRect(x - 20, y - 30, textWidth + 40, 40);

// //     ctx.fillStyle = color;
// //     ctx.fillText(text, x, y);
// //   };

// //   const drawAlert = (ctx, canvas, message, index) => {
// //     ctx.font = "bold 18px sans-serif";
// //     const w = ctx.measureText(message).width;

// //     const x = canvas.width / 2 - w / 2;
// //     const y = canvas.height - 80 - index * 45;

// //     ctx.fillStyle = "rgba(0,0,0,0.8)";
// //     ctx.fillRect(x - 15, y - 25, w + 30, 35);

// //     ctx.fillStyle = "#EC4899";
// //     ctx.fillText(message, x, y);
// //   };

// //   useEffect(() => {
// //     let interval;

// //     const init = async () => {
// //       try {
// //         await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/face_mesh.js");
// //         await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");

// //         const faceMesh = new window.FaceMesh({
// //           locateFile: (file) =>
// //             `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`
// //         });

// //         faceMesh.setOptions({
// //           maxNumFaces: 1,
// //           refineLandmarks: true
// //         });

// //         faceMesh.onResults((results) => {

// //           const canvas = canvasRef.current;
// //           const ctx = canvas.getContext("2d");

// //           ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

// //           /* 🌑 DARK OVERLAY */
// //           ctx.fillStyle = "rgba(11,18,32,0.25)";
// //           ctx.fillRect(0, 0, canvas.width, canvas.height);

// //           /* UI */
// //           drawStress(ctx, canvas);

// //           let alertIndex = 0;

// //           if (distanceRef.current === "too close") {
// //             if (!tooCloseStart.current) tooCloseStart.current = Date.now();

// //             if (Date.now() - tooCloseStart.current > 5000) {
// //               drawAlert(ctx, canvas, "Too Close to Screen", alertIndex++);
// //             }
// //           } else {
// //             tooCloseStart.current = null;
// //           }

// //           if (!results.multiFaceLandmarks?.length) return;

// //           const lm = results.multiFaceLandmarks[0];

// //           const raw = Math.abs(lm[159].y - lm[145].y);

// //           eyeHistory.current.push(raw);
// //           if (eyeHistory.current.length > 4) eyeHistory.current.shift();

// //           const eyeDistance =
// //             eyeHistory.current.reduce((a, b) => a + b, 0) /
// //             eyeHistory.current.length;

// //           if (eyeDistance < 0.023 && !eyeClosed.current)
// //             eyeClosed.current = true;

// //           if (eyeDistance > 0.03 && eyeClosed.current) {
// //             const now = Date.now();
// //             if (now - lastBlinkTime.current > 120) {
// //               blinkTimes.current.push(now);
// //               lastBlinkTime.current = now;
// //             }
// //             eyeClosed.current = false;
// //           }

// //           const z = lm[1].z;
// //           distanceRef.current =
// //             z < -0.10 ? "too close" :
// //             z > -0.07 ? "too far" : "optimal";

// //           setDistance(distanceRef.current);
// //         });

// //         faceMeshRef.current = faceMesh;

// //         const camera = new window.Camera(videoRef.current, {
// //           onFrame: async () => {
// //             const now = Date.now();

// //             if (now - lastRun.current > 70) {
// //               lastRun.current = now;

// //               if (videoRef.current?.readyState === 4) {
// //                 await faceMeshRef.current.send({
// //                   image: videoRef.current,
// //                 });
// //               }
// //             }
// //           },
// //           width: 640,
// //           height: 480
// //         });

// //         camera.start();
// //         cameraRef.current = camera;

// //         interval = setInterval(() => {
// //           const now = Date.now();

// //           blinkTimes.current =
// //             blinkTimes.current.filter(t => now - t < 60000);

// //           const rate = blinkTimes.current.length;
// //           setBlinkRate(rate);

// //           let score = 100;

// //           if (rate < 15) score -= 5;
// //           if (rate < 10) score -= 10;
// //           if (rate < 6) score -= 15;

// //           if (distanceRef.current === "too close") score -= 12;

// //           score = Math.max(20, Math.min(100, score));

// //           smoothedScore.current = smooth(smoothedScore.current, score);
// //           setStressScore(Math.round(smoothedScore.current));

// //         }, 1000);

// //       } catch (err) {
// //         console.error(err);
// //       }
// //     };

// //     init();

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
// // });

// // export default WebcamFeed;






// import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

// const WebcamFeed = forwardRef(({
//   setBlinkRate = () => {},
//   setDistance = () => {},
//   setRedness = () => {},
//   setStressScore = () => {},
//   setHeadPosition = () => {},
//   setExpression = () => {}
// }, ref) => {

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const pipVideoRef = useRef(null);

//   const faceMeshRef = useRef(null);
//   const cameraRef = useRef(null);

//   const blinkTimes = useRef([]);
//   const eyeClosed = useRef(false);

//   const eyeHistory = useRef([]);

//   const distanceRef = useRef("optimal");
//   const smoothedScore = useRef(100);

//   const tooCloseStart = useRef(null);
//   const lastRun = useRef(0); // ⚡ performance

//   const smooth = (prev, current) => prev * 0.7 + current * 0.3;

//   /* 🔥 PiP (CANVAS STREAM) */
//   const enablePiP = async () => {
//     try {
//       const canvas = canvasRef.current;
//       const stream = canvas.captureStream(30);

//       if (!pipVideoRef.current) {
//         pipVideoRef.current = document.createElement("video");
//         pipVideoRef.current.muted = true;
//         pipVideoRef.current.playsInline = true;
//       }

//       pipVideoRef.current.srcObject = stream;
//       await pipVideoRef.current.play();

//       if (document.pictureInPictureElement) {
//         await document.exitPictureInPicture();
//       } else {
//         await pipVideoRef.current.requestPictureInPicture();
//       }

//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useImperativeHandle(ref, () => ({ enablePiP }));

//   /* 🎯 DRAW UI (BOTTOM CENTER FIX) */
//   const drawStress = (ctx, canvas) => {
//     const text = `Stress: ${Math.round(smoothedScore.current)}`;

//     ctx.font = "bold 28px sans-serif";
//     const width = ctx.measureText(text).width;

//     const x = canvas.width / 2 - width / 2;
//     const y = canvas.height - 20;

//     let color = "#22C55E";
//     if (smoothedScore.current < 70) color = "#facc15";
//     if (smoothedScore.current < 40) color = "#ef4444";

//     ctx.fillStyle = "rgba(0,0,0,0.7)";
//     ctx.fillRect(x - 20, y - 30, width + 40, 40);

//     ctx.fillStyle = color;
//     ctx.fillText(text, x, y);
//   };

//   const drawAlert = (ctx, canvas, msg, index) => {
//     ctx.font = "bold 18px sans-serif";
//     const w = ctx.measureText(msg).width;

//     const x = canvas.width / 2 - w / 2;
//     const y = canvas.height - 80 - index * 45;

//     ctx.fillStyle = "rgba(0,0,0,0.8)";
//     ctx.fillRect(x - 15, y - 25, w + 30, 35);

//     ctx.fillStyle = "#EC4899";
//     ctx.fillText(msg, x, y);
//   };

//   useEffect(() => {
//     let interval;

//     const init = async () => {

//       const faceMesh = new window.FaceMesh({
//         locateFile: (file) =>
//           `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`
//       });

//       faceMesh.setOptions({
//         maxNumFaces: 1,
//         refineLandmarks: true
//       });

//       faceMesh.onResults((results) => {

//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext("2d");

//         ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

//         /* 🌑 overlay */
//         ctx.fillStyle = "rgba(11,18,32,0.25)";
//         ctx.fillRect(0, 0, canvas.width, canvas.height);

//         /* 🎯 UI */
//         drawStress(ctx, canvas);

//         let index = 0;

//         if (distanceRef.current === "too close") {
//           if (!tooCloseStart.current) tooCloseStart.current = Date.now();

//           if (Date.now() - tooCloseStart.current > 5000) {
//             drawAlert(ctx, canvas, "Too Close to Screen", index++);
//           }
//         } else {
//           tooCloseStart.current = null;
//         }

//         if (!results.multiFaceLandmarks?.length) return;

//         const lm = results.multiFaceLandmarks[0];

//         const raw = Math.abs(lm[159].y - lm[145].y);

//         eyeHistory.current.push(raw);
//         if (eyeHistory.current.length > 4) eyeHistory.current.shift();

//         const eyeDistance =
//           eyeHistory.current.reduce((a, b) => a + b, 0) /
//           eyeHistory.current.length;

//         /* ⚡ FAST BLINK FIX */
//         if (eyeDistance < 0.023 && !eyeClosed.current)
//           eyeClosed.current = true;

//         if (eyeDistance > 0.03 && eyeClosed.current) {
//           blinkTimes.current.push(Date.now());
//           eyeClosed.current = false;
//         }

//         const z = lm[1].z;
//         distanceRef.current =
//           z < -0.10 ? "too close" :
//           z > -0.07 ? "too far" : "optimal";

//         setDistance(distanceRef.current);
//       });

//       faceMeshRef.current = faceMesh;

//       const camera = new window.Camera(videoRef.current, {
//         onFrame: async () => {

//           const now = Date.now();

//           /* ⚡ PERFORMANCE THROTTLE */
//           if (now - lastRun.current > 70) {
//             lastRun.current = now;

//             if (videoRef.current?.readyState === 4) {
//               await faceMeshRef.current.send({
//                 image: videoRef.current,
//               });
//             }
//           }
//         },
//         width: 640,
//         height: 480
//       });

//       camera.start();

//       setTimeout(() => {
//         videoRef.current.play().catch(()=>{});
//       }, 500);

//       interval = setInterval(() => {
//         const now = Date.now();

//         blinkTimes.current =
//           blinkTimes.current.filter(t => now - t < 60000);

//         const rate = blinkTimes.current.length;
//         setBlinkRate(rate);

//         let score = 100;

//         if (rate < 10) score -= 10;
//         if (distanceRef.current === "too close") score -= 12;

//         smoothedScore.current = smooth(smoothedScore.current, score);

//         setStressScore(Math.round(smoothedScore.current));

//       }, 1000);
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
//       <video
//         ref={videoRef}
//         autoPlay
//         playsInline
//         muted
//         className="fixed bottom-4 right-4 w-40 h-28 opacity-0"
//       />
//       <canvas
//         ref={canvasRef}
//         width="640"
//         height="480"
//         className="rounded-xl w-full h-full object-cover"
//       />
//     </div>
//   );
// });

// export default WebcamFeed;



















import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

const WebcamFeed = forwardRef(({
  setBlinkRate = () => {},
  setDistance = () => {},
  setRedness = () => {},
  setStressScore = () => {},
  setHeadPosition = () => {},
  setExpression = () => {}
}, ref) => {

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const pipVideoRef = useRef(null);

  const faceMeshRef = useRef(null);
  const cameraRef = useRef(null);

  const blinkTimes = useRef([]);
  const eyeClosed = useRef(false);
  const lastBlinkTime = useRef(0);

  const eyeHistory = useRef([]);

  const distanceRef = useRef("optimal");
  const smoothedScore = useRef(100);

  const tooCloseStart = useRef(null);
  const lastRun = useRef(0);

  const smooth = (prev, current) => prev * 0.75 + current * 0.25;

  /* 🔥 PiP (Canvas Stream - Stable) */
  const enablePiP = async () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const stream = canvas.captureStream(30);

      if (!pipVideoRef.current) {
        pipVideoRef.current = document.createElement("video");
        pipVideoRef.current.muted = true;
        pipVideoRef.current.playsInline = true;
      }

      pipVideoRef.current.srcObject = stream;
      await pipVideoRef.current.play();

      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await pipVideoRef.current.requestPictureInPicture();
      }

    } catch (err) {
      console.error("PiP Error:", err);
    }
  };

  useImperativeHandle(ref, () => ({ enablePiP }));

  /* 🎯 UI DRAW (BOTTOM CENTER + CLEAN) */
  const drawStress = (ctx, canvas) => {
    const text = `Stress: ${Math.round(smoothedScore.current)}`;

    ctx.font = "bold 30px sans-serif";
    const w = ctx.measureText(text).width;

    const x = canvas.width / 2 - w / 2;
    const y = canvas.height - 25;

    let color = "#22C55E";
    if (smoothedScore.current < 70) color = "#facc15";
    if (smoothedScore.current < 40) color = "#ef4444";

    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(x - 25, y - 35, w + 50, 50);

    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  };

  const drawAlert = (ctx, canvas, msg, index) => {
    ctx.font = "bold 18px sans-serif";
    const w = ctx.measureText(msg).width;

    const x = canvas.width / 2 - w / 2;
    const y = canvas.height - 90 - index * 45;

    ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.fillRect(x - 20, y - 28, w + 40, 38);

    ctx.fillStyle = "#EC4899";
    ctx.fillText(msg, x, y);
  };

  useEffect(() => {
    let interval;

    const init = async () => {

      const faceMesh = new window.FaceMesh({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true
      });

      faceMesh.onResults((results) => {

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        /* 🎥 DRAW FRAME */
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        /* 🌑 DARK OVERLAY */
        ctx.fillStyle = "rgba(11,18,32,0.25)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        /* 🎯 UI */
        drawStress(ctx, canvas);

        let alertIndex = 0;

        if (distanceRef.current === "too close") {
          if (!tooCloseStart.current) tooCloseStart.current = Date.now();

          if (Date.now() - tooCloseStart.current > 5000) {
            drawAlert(ctx, canvas, "Too Close to Screen", alertIndex++);
          }
        } else {
          tooCloseStart.current = null;
        }

        if (!results.multiFaceLandmarks?.length) return;

        const lm = results.multiFaceLandmarks[0];

        /* 👁️ BLINK DETECTION (FAST FIX) */
        const raw = Math.abs(lm[159].y - lm[145].y);

        eyeHistory.current.push(raw);
        if (eyeHistory.current.length > 3) eyeHistory.current.shift();

        const eyeDistance =
          eyeHistory.current.reduce((a, b) => a + b, 0) /
          eyeHistory.current.length;

        if (eyeDistance < 0.022 && !eyeClosed.current)
          eyeClosed.current = true;

        if (eyeDistance > 0.028 && eyeClosed.current) {
          const now = Date.now();

          if (now - lastBlinkTime.current > 120) {
            blinkTimes.current.push(now);
            lastBlinkTime.current = now;
          }

          eyeClosed.current = false;
        }

        /* 📏 DISTANCE */
        const z = lm[1].z;
        distanceRef.current =
          z < -0.10 ? "too close" :
          z > -0.07 ? "too far" : "optimal";

        setDistance(distanceRef.current);
      });

      faceMeshRef.current = faceMesh;

      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          const now = Date.now();

          /* ⚡ PERFORMANCE OPTIMIZATION */
          if (now - lastRun.current > 60) {
            lastRun.current = now;

            if (videoRef.current?.readyState === 4) {
              await faceMeshRef.current.send({
                image: videoRef.current,
              });
            }
          }
        },
        width: 640,
        height: 480
      });

      camera.start();
      cameraRef.current = camera;

      setTimeout(() => {
        videoRef.current.play().catch(() => {});
      }, 300);

      interval = setInterval(() => {
        const now = Date.now();

        blinkTimes.current =
          blinkTimes.current.filter(t => now - t < 60000);

        const rate = blinkTimes.current.length;
        setBlinkRate(rate);

        let score = 100;

        if (rate < 15) score -= 5;
        if (rate < 10) score -= 10;
        if (rate < 6) score -= 15;

        if (distanceRef.current === "too close") score -= 12;

        score = Math.max(20, Math.min(100, score));

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
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="fixed bottom-4 right-4 w-40 h-28 opacity-0"
      />
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        className="rounded-xl w-full h-full object-cover"
      />
    </div>
  );
});

export default WebcamFeed;
