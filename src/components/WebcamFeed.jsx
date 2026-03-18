
// // // // import { useEffect, useRef } from "react";
// // // // import { saveSession } from "../utils/storage";

// // // // const WebcamFeed = ({
// // // //   setBlinkRate = () => {},
// // // //   setDistance = () => {},
// // // //   setRedness = () => {},
// // // //   setStressScore = () => {},
// // // //   setHeadPosition = () => {},
// // // //   setExpression = () => {}
// // // // }) => {

// // // //   const videoRef = useRef(null);
// // // //   const canvasRef = useRef(null);

// // // //   const faceMeshRef = useRef(null);
// // // //   const cameraRef = useRef(null);

// // // //   const blinkTimes = useRef([]);
// // // //   const eyeClosed = useRef(false);

// // // //   const rednessHistory = useRef([]);
// // // //   const lastRednessCheck = useRef(0);

// // // //   const sessionStart = useRef(Date.now());
// // // //   const breakCount = useRef(0);

// // // //   const expressionRef = useRef("focused");

// // // //   /* ---------- REDNESS DETECTION ---------- */

// // // //   const detectRedness = (imageData) => {

// // // //     let redPixels = 0;
// // // //     let total = 0;

// // // //     const data = imageData.data;

// // // //     for (let i = 0; i < data.length; i += 4) {

// // // //       const r = data[i];
// // // //       const g = data[i + 1];
// // // //       const b = data[i + 2];

// // // //       if (r > g * 1.15 && r > b * 1.15) redPixels++;

// // // //       total++;

// // // //     }

// // // //     return redPixels / total;

// // // //   };


// // // //   useEffect(() => {

// // // //     const faceMesh = new window.FaceMesh({
// // // //       locateFile: (file) =>
// // // //         `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
// // // //     });

// // // //     faceMesh.setOptions({
// // // //       maxNumFaces: 1,
// // // //       refineLandmarks: true,
// // // //       minDetectionConfidence: 0.5,
// // // //       minTrackingConfidence: 0.5
// // // //     });


// // // //     faceMesh.onResults((results) => {

// // // //       const canvasCtx = canvasRef.current.getContext("2d", {
// // // //         willReadFrequently: true
// // // //       });

// // // //       canvasCtx.clearRect(
// // // //         0,
// // // //         0,
// // // //         canvasRef.current.width,
// // // //         canvasRef.current.height
// // // //       );

// // // //       /* SHOW WEBCAM FRAME */

// // // //       canvasCtx.drawImage(
// // // //         results.image,
// // // //         0,
// // // //         0,
// // // //         canvasRef.current.width,
// // // //         canvasRef.current.height
// // // //       );

// // // //       if (!results.multiFaceLandmarks?.length) return;

// // // //       const landmarks = results.multiFaceLandmarks[0];


// // // //       /* ---------- BLINK DETECTION ---------- */

// // // //       const top = landmarks[159];
// // // //       const bottom = landmarks[145];

// // // //       const eyeDistance = Math.abs(top.y - bottom.y);

// // // //       if (eyeDistance < 0.02 && !eyeClosed.current)
// // // //         eyeClosed.current = true;

// // // //       if (eyeDistance > 0.035 && eyeClosed.current) {

// // // //         blinkTimes.current.push(Date.now());
// // // //         eyeClosed.current = false;

// // // //       }


// // // //       /* ---------- SCREEN DISTANCE ---------- */

// // // //       const nose = landmarks[1];

// // // //       if (nose) {

// // // //         const z = nose.z;

// // // //         if (z < -0.10) setDistance("too close");
// // // //         else if (z > -0.07) setDistance("too far");
// // // //         else setDistance("optimal");

// // // //       }


// // // //       /* ---------- HEAD TILT ---------- */

// // // //       const leftEye = landmarks[33];
// // // //       const rightEye = landmarks[263];

// // // //       const tilt =
// // // //         (rightEye.y - leftEye.y) /
// // // //         (rightEye.x - leftEye.x);

// // // //       if (Math.abs(tilt) > 0.1)
// // // //         setHeadPosition("tilted");
// // // //       else
// // // //         setHeadPosition("aligned");


// // // //       /* ---------- FACIAL EXPRESSION ---------- */

// // // //       const mouthTop = landmarks[13];
// // // //       const mouthBottom = landmarks[14];

// // // //       const mouthLeft = landmarks[61];
// // // //       const mouthRight = landmarks[291];

// // // //       const leftEyeTop = landmarks[159];
// // // //       const leftEyeBottom = landmarks[145];

// // // //       const browLeft = landmarks[65];
// // // //       const browRight = landmarks[295];

// // // //       const mouthOpen = Math.abs(mouthTop.y - mouthBottom.y);
// // // //       const mouthWidth = Math.abs(mouthLeft.x - mouthRight.x);
// // // //       const eyeOpen = Math.abs(leftEyeTop.y - leftEyeBottom.y);
// // // //       const browHeight = Math.abs(browLeft.y - browRight.y);

// // // //       let expression = "focused";

// // // //       if (mouthOpen > 0.04)
// // // //         expression = "talking";

// // // //       else if (mouthWidth > 0.07)
// // // //         expression = "smiling";

// // // //       else if (eyeOpen < 0.015)
// // // //         expression = "drowsy";

// // // //       else if (browHeight > 0.06)
// // // //         expression = "surprised";

// // // //       else
// // // //         expression = "focused";

// // // //       expressionRef.current = expression;

// // // //       setExpression(expression);


// // // //       /* ---------- REDNESS ---------- */

// // // //       const now = Date.now();

// // // //       if (now - lastRednessCheck.current > 800) {

// // // //         const lEye = landmarks[33];
// // // //         const rEye = landmarks[263];

// // // //         const lx = lEye.x * canvasRef.current.width;
// // // //         const ly = lEye.y * canvasRef.current.height;

// // // //         const rx = rEye.x * canvasRef.current.width;
// // // //         const ry = rEye.y * canvasRef.current.height;

// // // //         const leftRegion =
// // // //           canvasCtx.getImageData(lx - 15, ly - 15, 30, 30);

// // // //         const rightRegion =
// // // //           canvasCtx.getImageData(rx - 15, ry - 15, 30, 30);

// // // //         const rednessLeft = detectRedness(leftRegion);
// // // //         const rednessRight = detectRedness(rightRegion);

// // // //         const redness = (rednessLeft + rednessRight) / 2;

// // // //         rednessHistory.current.push(redness);

// // // //         if (rednessHistory.current.length > 15)
// // // //           rednessHistory.current.shift();

// // // //         const smooth =
// // // //           rednessHistory.current.reduce((a, b) => a + b) /
// // // //           rednessHistory.current.length;

// // // //         if (smooth > 0.45) setRedness("high");
// // // //         else if (smooth > 0.30) setRedness("moderate");
// // // //         else setRedness("normal");

// // // //         lastRednessCheck.current = now;

// // // //       }

// // // //     });


// // // //     faceMeshRef.current = faceMesh;


// // // //     /* ---------- CAMERA ---------- */

// // // //     const camera = new window.Camera(videoRef.current, {

// // // //       onFrame: async () => {

// // // //         try {
// // // //           await faceMeshRef.current.send({
// // // //             image: videoRef.current
// // // //           });
// // // //         } catch (err) {
// // // //           console.log("Frame error:", err);
// // // //         }

// // // //       },

// // // //       width: 640,
// // // //       height: 480

// // // //     });

// // // //     camera.start();

// // // //     cameraRef.current = camera;


// // // //     /* ---------- BLINK RATE + STRESS SCORE ---------- */

// // // //     const interval = setInterval(() => {

// // // //       const now = Date.now();

// // // //       blinkTimes.current =
// // // //         blinkTimes.current.filter(
// // // //           (t) => now - t < 60000
// // // //         );

// // // //       const rate = blinkTimes.current.length;

// // // //       setBlinkRate(rate);

// // // //       let score = 100;

// // // //       /* blink penalty */

// // // //       if (rate < 15) score -= 15;
// // // //       if (rate < 10) score -= 25;
// // // //       if (rate < 5) score -= 35;

// // // //       /* redness penalty */

// // // //       const redness =
// // // //         rednessHistory.current.length
// // // //           ? rednessHistory.current.reduce((a, b) => a + b) /
// // // //             rednessHistory.current.length
// // // //           : 0;

// // // //       if (redness > 0.30) score -= 10;
// // // //       if (redness > 0.45) score -= 20;

// // // //       /* expression penalty */

// // // //       if (expressionRef.current === "drowsy")
// // // //         score -= 15;

// // // //       if (expressionRef.current === "surprised")
// // // //         score -= 5;

// // // //       setStressScore(Math.max(score, 0));

// // // //     }, 1000);


// // // //     /* ---------- SAVE SESSION ---------- */

// // // //     const saveInterval = setInterval(() => {

// // // //       const screenMinutes =
// // // //         Math.floor(
// // // //           (Date.now() - sessionStart.current) / 60000
// // // //         );

// // // //       saveSession({
// // // //         blink: blinkTimes.current.length,
// // // //         screen: screenMinutes,
// // // //         breaks: breakCount.current
// // // //       });

// // // //     }, 300000);


// // // //     return () => {

// // // //       clearInterval(interval);
// // // //       clearInterval(saveInterval);

// // // //       if (cameraRef.current)
// // // //         cameraRef.current.stop();

// // // //       if (faceMeshRef.current)
// // // //         faceMeshRef.current.close();

// // // //     };

// // // //   }, []);


// // // //   return (

// // // //     <div className="w-full h-full">

// // // //       <video ref={videoRef} className="hidden" />

// // // //       <canvas
// // // //         ref={canvasRef}
// // // //         width="640"
// // // //         height="480"
// // // //         className="rounded-lg w-full h-full object-cover scale-x-[-1]"
// // // //       />

// // // //     </div>

// // // //   );

// // // // };

// // // // export default WebcamFeed;

// // // import { useEffect, useRef } from "react";
// // // import { saveSession } from "../utils/storage";

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

// // //   const rednessHistory = useRef([]);
// // //   const lastRednessCheck = useRef(0);

// // //   const sessionStart = useRef(Date.now());
// // //   const breakCount = useRef(0);

// // //   const expressionRef = useRef("focused");

// // //   /* ---------- REDNESS DETECTION ---------- */

// // //   const detectRedness = (imageData) => {

// // //     let redPixels = 0;
// // //     let total = 0;

// // //     const data = imageData.data;

// // //     for (let i = 0; i < data.length; i += 4) {

// // //       const r = data[i];
// // //       const g = data[i + 1];
// // //       const b = data[i + 2];

// // //       if (r > g * 1.15 && r > b * 1.15) redPixels++;

// // //       total++;

// // //     }

// // //     return redPixels / total;

// // //   };
// // //   const showAlert = (title, body) => {

// // //   if (Notification.permission === "granted") {

// // //     new Notification(title, {
// // //       body,
// // //       icon: "/favicon.svg"
// // //     });

// // //   }

// // // };


// // //   useEffect(() => {

// // //     const faceMesh = new window.FaceMesh({
// // //       locateFile: (file) =>
// // //         `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
// // //     });

// // //     faceMesh.setOptions({
// // //       maxNumFaces: 1,
// // //       refineLandmarks: true,
// // //       minDetectionConfidence: 0.5,
// // //       minTrackingConfidence: 0.5
// // //     });


// // //     faceMesh.onResults((results) => {

// // //       const canvasCtx = canvasRef.current.getContext("2d", {
// // //         willReadFrequently: true
// // //       });

// // //       canvasCtx.clearRect(
// // //         0,
// // //         0,
// // //         canvasRef.current.width,
// // //         canvasRef.current.height
// // //       );

// // //       /* SHOW WEBCAM FRAME */

// // //       canvasCtx.drawImage(
// // //         results.image,
// // //         0,
// // //         0,
// // //         canvasRef.current.width,
// // //         canvasRef.current.height
// // //       );

// // //       if (!results.multiFaceLandmarks?.length) return;

// // //       const landmarks = results.multiFaceLandmarks[0];


// // //       /* ---------- BLINK DETECTION ---------- */

// // //       const top = landmarks[159];
// // //       const bottom = landmarks[145];

// // //       const eyeDistance = Math.abs(top.y - bottom.y);

// // //       if (eyeDistance < 0.02 && !eyeClosed.current)
// // //         eyeClosed.current = true;

// // //       if (eyeDistance > 0.035 && eyeClosed.current) {

// // //         blinkTimes.current.push(Date.now());
// // //         eyeClosed.current = false;

// // //       }


// // //       /* ---------- SCREEN DISTANCE ---------- */

// // //       const nose = landmarks[1];

// // //       if (nose) {

// // //         const z = nose.z;

// // //         if (z < -0.10) {
// // //           {
// // //           setDistance("too close");
// // //           loseStart.current = Date.now();
// // //   }

// // //   if (Date.now() - closeStart.current > 10000) {

// // //     showAlert(
// // //       "⚠ Eye Distance Warning",
// // //       "You're too close to the screen. Move back!"
// // //     );

// // //     closeStart.current = null; // reset
// // //   }
// // //   }

// // //         else if (z > -0.07)
// // //           {
// // //              setDistance("too far");
// // //              loseStart.current = null;}
// // //         else 
// // //           {
// // //             setDistance("optimal");
// // //             loseStart.current = null;
// // //           }
        

// // //       }


// // //       /* ---------- HEAD TILT ---------- */

// // //       const leftEye = landmarks[33];
// // //       const rightEye = landmarks[263];

// // //       const tilt =
// // //         (rightEye.y - leftEye.y) /
// // //         (rightEye.x - leftEye.x);

// // //       if (Math.abs(tilt) > 0.1)
// // //         setHeadPosition("tilted");
// // //       else
// // //         setHeadPosition("aligned");


// // //       /* ---------- FACIAL EXPRESSION ---------- */

// // //       const mouthTop = landmarks[13];
// // //       const mouthBottom = landmarks[14];

// // //       const mouthLeft = landmarks[61];
// // //       const mouthRight = landmarks[291];

// // //       const leftEyeTop = landmarks[159];
// // //       const leftEyeBottom = landmarks[145];

// // //       const browLeft = landmarks[65];
// // //       const browRight = landmarks[295];

// // //       const mouthOpen = Math.abs(mouthTop.y - mouthBottom.y);
// // //       const mouthWidth = Math.abs(mouthLeft.x - mouthRight.x);
// // //       const eyeOpen = Math.abs(leftEyeTop.y - leftEyeBottom.y);
// // //       const browHeight = Math.abs(browLeft.y - browRight.y);

// // //       let expression = "focused";

// // //       if (mouthOpen > 0.04)
// // //         expression = "talking";

// // //       else if (mouthWidth > 0.07)
// // //         expression = "smiling";

// // //       else if (eyeOpen < 0.015)
// // //         expression = "drowsy";

// // //       else if (browHeight > 0.06)
// // //         expression = "surprised";

// // //       else
// // //         expression = "focused";

// // //       expressionRef.current = expression;

// // //       setExpression(expression);


// // //       /* ---------- REDNESS ---------- */

// // //       const now = Date.now();

// // //       if (now - lastRednessCheck.current > 800) {

// // //         const lEye = landmarks[33];
// // //         const rEye = landmarks[263];

// // //         const lx = lEye.x * canvasRef.current.width;
// // //         const ly = lEye.y * canvasRef.current.height;

// // //         const rx = rEye.x * canvasRef.current.width;
// // //         const ry = rEye.y * canvasRef.current.height;

// // //         const leftRegion =
// // //           canvasCtx.getImageData(lx - 15, ly - 15, 30, 30);

// // //         const rightRegion =
// // //           canvasCtx.getImageData(rx - 15, ry - 15, 30, 30);

// // //         const rednessLeft = detectRedness(leftRegion);
// // //         const rednessRight = detectRedness(rightRegion);

// // //         const redness = (rednessLeft + rednessRight) / 2;

// // //         rednessHistory.current.push(redness);

// // //         if (rednessHistory.current.length > 15)
// // //           rednessHistory.current.shift();

// // //         const smooth =
// // //           rednessHistory.current.reduce((a, b) => a + b) /
// // //           rednessHistory.current.length;

// // //         // if (smooth > 0.45) setRedness("high");
// // //         if (smooth >= 0.30) setRedness("moderate");
// // //         else setRedness("normal");

// // //         lastRednessCheck.current = now;

// // //       }

// // //     });


// // //     faceMeshRef.current = faceMesh;


// // //     /* ---------- CAMERA ---------- */

// // //     const camera = new window.Camera(videoRef.current, {

// // //       onFrame: async () => {

// // //         try {
// // //           await faceMeshRef.current.send({
// // //             image: videoRef.current
// // //           });
// // //         } catch (err) {
// // //           console.log("Frame error:", err);
// // //         }

// // //       },

// // //       width: 640,
// // //       height: 480

// // //     });

// // //     camera.start();

// // //     cameraRef.current = camera;


// // //     /* ---------- BLINK RATE + STRESS SCORE ---------- */

// // //     const interval = setInterval(() => {

// // //       const now = Date.now();

// // //       blinkTimes.current =
// // //         blinkTimes.current.filter(
// // //           (t) => now - t < 60000
// // //         );

// // //       const rate = blinkTimes.current.length;

// // //       setBlinkRate(rate);

// // //       let score = 100;

// // //       /* blink penalty */

// // //       if (rate < 15) score -= 15;
// // //       if (rate < 10) score -= 25;
// // //       if (rate < 5) score -= 35;

// // //       /* redness penalty */

// // //       const redness =
// // //         rednessHistory.current.length
// // //           ? rednessHistory.current.reduce((a, b) => a + b) /
// // //             rednessHistory.current.length
// // //           : 0;

// // //       if (redness > 0.30) score -= 10;
// // //       if (redness > 0.45) score -= 20;

// // //       /* expression penalty */

// // //       if (expressionRef.current === "drowsy")
// // //         score -= 15;

// // //       if (expressionRef.current === "surprised")
// // //         score -= 5;

// // //       setStressScore(Math.max(score, 0));

// // //     }, 1000);


// // //     /* ---------- SAVE SESSION ---------- */

// // //     const saveInterval = setInterval(() => {

// // //       const screenMinutes =
// // //         Math.floor(
// // //           (Date.now() - sessionStart.current) / 60000
// // //         );

// // //       saveSession({
// // //         blink: blinkTimes.current.length,
// // //         screen: screenMinutes,
// // //         breaks: breakCount.current
// // //       });

// // //     }, 300000);


// // //     return () => {

// // //       clearInterval(interval);
// // //       clearInterval(saveInterval);

// // //       if (cameraRef.current)
// // //         cameraRef.current.stop();

// // //       if (faceMeshRef.current)
// // //         faceMeshRef.current.close();

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

// // // export default WebcamFeed;.

// // import { useEffect, useRef } from "react";
// // import { saveSession } from "../utils/storage";

// // const WebcamFeed = ({
// //   setBlinkRate = () => {},
// //   setDistance = () => {},
// //   setRedness = () => {},
// //   setStressScore = () => {},
// //   setHeadPosition = () => {},
// //   setExpression = () => {}
// // }) => {

// //   const videoRef = useRef(null);
// //   const canvasRef = useRef(null);

// //   const faceMeshRef = useRef(null);
// //   const cameraRef = useRef(null);

// //   const blinkTimes = useRef([]);
// //   const eyeClosed = useRef(false);

// //   const rednessHistory = useRef([]);
// //   const lastRednessCheck = useRef(0);

// //   const sessionStart = useRef(Date.now());
// //   const breakCount = useRef(0);

// //   const expressionRef = useRef("focused");

// //   // 🔥 ALERT REFS
// //   const closeStart = useRef(null);
// //   const lastBreakAlert = useRef(0);
// //   const badStressStart = useRef(null);

// //   /* ---------- ALERT FUNCTION ---------- */

// //   const showAlert = (title, body) => {
// //     if (Notification.permission === "granted") {
// //       new Notification(title, {
// //         body,
// //         icon: "/favicon.svg"
// //       });
// //     }
// //   };

// //   /* ---------- REDNESS ---------- */

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

// //     const faceMesh = new window.FaceMesh({
// //       locateFile: (file) =>
// //         `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
// //     });

// //     faceMesh.setOptions({
// //       maxNumFaces: 1,
// //       refineLandmarks: true,
// //       minDetectionConfidence: 0.5,
// //       minTrackingConfidence: 0.5
// //     });

// //     faceMesh.onResults((results) => {

// //       const canvasCtx = canvasRef.current.getContext("2d", {
// //         willReadFrequently: true
// //       });

// //       canvasCtx.clearRect(0, 0, 640, 480);

// //       canvasCtx.drawImage(results.image, 0, 0, 640, 480);

// //       if (!results.multiFaceLandmarks?.length) return;

// //       const landmarks = results.multiFaceLandmarks[0];

// //       /* ---------- BLINK ---------- */

// //       const top = landmarks[159];
// //       const bottom = landmarks[145];

// //       const eyeDistance = Math.abs(top.y - bottom.y);

// //       if (eyeDistance < 0.02 && !eyeClosed.current)
// //         eyeClosed.current = true;

// //       if (eyeDistance > 0.035 && eyeClosed.current) {
// //         blinkTimes.current.push(Date.now());
// //         eyeClosed.current = false;
// //       }

// //       /* ---------- DISTANCE ALERT ---------- */

// //       const nose = landmarks[1];

// //       if (nose) {
// //         const z = nose.z;

// //         if (z < -0.10) {

// //           setDistance("too close");

// //           if (!closeStart.current)
// //             closeStart.current = Date.now();

// //           if (Date.now() - closeStart.current > 10000) {

// //             showAlert(
// //               "⚠ Eye Distance Warning",
// //               "You're too close to the screen. Move back!"
// //             );

// //             closeStart.current = null;
// //           }

// //         } else if (z > -0.07) {

// //           setDistance("too far");
// //           closeStart.current = null;

// //         } else {

// //           setDistance("optimal");
// //           closeStart.current = null;
// //         }
// //       }

// //       /* ---------- HEAD ---------- */

// //       const leftEye = landmarks[33];
// //       const rightEye = landmarks[263];

// //       const tilt =
// //         (rightEye.y - leftEye.y) /
// //         (rightEye.x - leftEye.x);

// //       setHeadPosition(Math.abs(tilt) > 0.1 ? "tilted" : "aligned");

// //       /* ---------- EXPRESSION ---------- */

// //       const mouthTop = landmarks[13];
// //       const mouthBottom = landmarks[14];

// //       const mouthOpen = Math.abs(mouthTop.y - mouthBottom.y);

// //       let expression = "focused";

// //       if (mouthOpen > 0.04) expression = "talking";
// //       else if (eyeDistance < 0.015) expression = "drowsy";

// //       expressionRef.current = expression;
// //       setExpression(expression);

// //       /* ---------- REDNESS ---------- */

// //       const now = Date.now();

// //       if (now - lastRednessCheck.current > 800) {

// //         const lEye = landmarks[33];
// //         const lx = lEye.x * 640;
// //         const ly = lEye.y * 480;

// //         const region = canvasCtx.getImageData(lx - 15, ly - 15, 30, 30);

// //         const redness = detectRedness(region);

// //         rednessHistory.current.push(redness);

// //         if (rednessHistory.current.length > 15)
// //           rednessHistory.current.shift();

// //         const avg =
// //           rednessHistory.current.reduce((a, b) => a + b, 0) /
// //           rednessHistory.current.length;

// //         setRedness(avg > 0.30 ? "moderate" : "normal");

// //         lastRednessCheck.current = now;
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

// //       if (rate < 15) score -= 15;
// //       if (rate < 10) score -= 25;
// //       if (rate < 5) score -= 35;

// //       const redness =
// //         rednessHistory.current.reduce((a, b) => a + b, 0) /
// //         (rednessHistory.current.length || 1);

// //       if (redness > 0.30) score -= 10;

// //       if (expressionRef.current === "drowsy")
// //         score -= 15;

// //       setStressScore(Math.max(score, 0));

// //       /* ---------- STRESS ALERT ---------- */

// //       if (score < 50) {

// //         if (!badStressStart.current)
// //           badStressStart.current = now;

// //         if (now - badStressStart.current > 120000) {

// //           showAlert(
// //             "🚨 Eye Strain Detected",
// //             "Your eye health is poor. Take a break or wash your eyes."
// //           );

// //           badStressStart.current = null;
// //         }

// //       } else {
// //         badStressStart.current = null;
// //       }

// //       /* ---------- BREAK ALERT ---------- */

// //       const minutes =
// //         Math.floor((now - sessionStart.current) / 60000);

// //       if (minutes >= 40 && now - lastBreakAlert.current > 600000) {

// //         showAlert(
// //           "⏳ Break Reminder",
// //           "20-20-20 rule: Look 20 feet away for 20 seconds."
// //         );

// //         lastBreakAlert.current = now;
// //       }

// //     }, 1000);

// //     return () => {
// //       clearInterval(interval);

// //       if (cameraRef.current) cameraRef.current.stop();
// //       if (faceMeshRef.current) faceMeshRef.current.close();
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
// // import { useEffect, useRef } from "react";
// // import { saveSession } from "../utils/storage";

// // const WebcamFeed = ({
// //   setBlinkRate = () => {},
// //   setDistance = () => {},
// //   setRedness = () => {},
// //   setStressScore = () => {},
// //   setHeadPosition = () => {},
// //   setExpression = () => {}
// // }) => {

// //   const videoRef = useRef(null);
// //   const canvasRef = useRef(null);

// //   const faceMeshRef = useRef(null);
// //   const cameraRef = useRef(null);

// //   const blinkTimes = useRef([]);
// //   const eyeClosed = useRef(false);

// //   const rednessHistory = useRef([]);
// //   const lastRednessCheck = useRef(0);

// //   const sessionStart = useRef(Date.now());
// //   const breakCount = useRef(0);

// //   const expressionRef = useRef("focused");

// //   /* 🔥 ALERT REFS */
// //   const closeStart = useRef(null);
// //   const lastDistanceAlert = useRef(0);
// //   const badStressStart = useRef(null);
// //   const lastBreakAlert = useRef(0);

// //   /* 🔔 ALERT FUNCTION */
// //   const showAlert = (title, body) => {
// //     if ("Notification" in window && Notification.permission === "granted") {
// //       new Notification(title, {
// //         body,
// //         icon: "/favicon.svg"
// //       });
// //     }
// //   };

// //   /* 🔴 REDNESS DETECTION */
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
// //       console.error("Mediapipe not loaded");
// //       return;
// //     }

// //     const faceMesh = new window.FaceMesh({
// //       locateFile: (file) =>
// //         `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
// //     });

// //     faceMesh.setOptions({
// //       maxNumFaces: 1,
// //       refineLandmarks: true,
// //       minDetectionConfidence: 0.5,
// //       minTrackingConfidence: 0.5
// //     });

// //     faceMesh.onResults((results) => {

// //       const canvas = canvasRef.current;
// //       if (!canvas) return;

// //       const ctx = canvas.getContext("2d");
// //       if (!ctx) return;

// //       ctx.clearRect(0, 0, canvas.width, canvas.height);

// //       ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

// //       if (!results.multiFaceLandmarks?.length) return;

// //       const landmarks = results.multiFaceLandmarks[0];

// //       /* ---------- BLINK ---------- */

// //       const top = landmarks[159];
// //       const bottom = landmarks[145];

// //       const eyeDistance = Math.abs(top.y - bottom.y);

// //       if (eyeDistance < 0.02 && !eyeClosed.current)
// //         eyeClosed.current = true;

// //       if (eyeDistance > 0.035 && eyeClosed.current) {
// //         blinkTimes.current.push(Date.now());
// //         eyeClosed.current = false;
// //       }

// //       /* ---------- DISTANCE ---------- */

// //       const nose = landmarks[1];

// //       if (nose) {

// //         const z = nose.z;

// //         if (z < -0.10) {

// //           setDistance("too close");

// //           if (!closeStart.current)
// //             closeStart.current = Date.now();

// //           const duration = Date.now() - closeStart.current;

// //           // 🔥 DEBUG
// //           console.log("Close duration:", duration);

// //           if (
// //             duration > 5000 && // 🔥 testing
// //             Date.now() - lastDistanceAlert.current > 10000
// //           ) {

// //             showAlert(
// //               "⚠ Eye Distance Warning",
// //               "You're too close to the screen. Move back!"
// //             );

// //             lastDistanceAlert.current = Date.now();
// //             closeStart.current = null;
// //           }

// //         } else {

// //           closeStart.current = null;

// //           if (z > -0.07)
// //             setDistance("too far");
// //           else
// //             setDistance("optimal");
// //         }
// //       }

// //       /* ---------- HEAD ---------- */

// //       const leftEye = landmarks[33];
// //       const rightEye = landmarks[263];

// //       const tilt =
// //         (rightEye.y - leftEye.y) /
// //         (rightEye.x - leftEye.x);

// //       setHeadPosition(Math.abs(tilt) > 0.1 ? "tilted" : "aligned");

// //       /* ---------- EXPRESSION ---------- */

// //       let expression = "focused";

// //       if (eyeDistance < 0.015)
// //         expression = "drowsy";

// //       expressionRef.current = expression;
// //       setExpression(expression);

// //       /* ---------- REDNESS ---------- */

// //       const now = Date.now();

// //       if (now - lastRednessCheck.current > 800) {

// //         const lEye = landmarks[33];
// //         const lx = lEye.x * canvas.width;
// //         const ly = lEye.y * canvas.height;

// //         const region =
// //           ctx.getImageData(lx - 15, ly - 15, 30, 30);

// //         const redness = detectRedness(region);

// //         rednessHistory.current.push(redness);

// //         if (rednessHistory.current.length > 15)
// //           rednessHistory.current.shift();

// //         const avg =
// //           rednessHistory.current.reduce((a, b) => a + b, 0) /
// //           rednessHistory.current.length;

// //         setRedness(avg > 0.30 ? "moderate" : "normal");

// //         lastRednessCheck.current = now;
// //       }

// //     });

// //     faceMeshRef.current = faceMesh;

// //     const camera = new window.Camera(videoRef.current, {
// //       onFrame: async () => {
// //         try {
// //           if (faceMeshRef.current) {
// //             await faceMeshRef.current.send({
// //               image: videoRef.current
// //             });
// //           }
// //         } catch (err) {
// //           console.log("Frame error:", err);
// //         }
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

// //       if (rate < 15) score -= 15;
// //       if (rate < 10) score -= 25;
// //       if (rate < 5) score -= 35;

// //       const redness =
// //         rednessHistory.current.reduce((a, b) => a + b, 0) /
// //         (rednessHistory.current.length || 1);

// //       if (redness > 0.30) score -= 10;

// //       if (expressionRef.current === "drowsy")
// //         score -= 15;

// //       setStressScore(Math.max(score, 0));

// //       /* ---------- STRESS ALERT ---------- */

// //       if (score < 90) { // 🔥 test

// //         if (!badStressStart.current)
// //           badStressStart.current = now;

// //         if (now - badStressStart.current > 5000) {

// //           showAlert(
// //             "🚨 Eye Strain Detected",
// //             "Your eye health is dropping. Take a break!"
// //           );

// //           badStressStart.current = null;
// //         }

// //       } else {
// //         badStressStart.current = null;
// //       }

// //       /* ---------- BREAK ALERT ---------- */

// //       const minutes =
// //         Math.floor((now - sessionStart.current) / 60000);

// //       if (minutes >= 1 && now - lastBreakAlert.current > 60000) {

// //         showAlert(
// //           "⏳ Break Reminder",
// //           "Follow 20-20-20 rule 👀"
// //         );

// //         lastBreakAlert.current = now;
// //       }

// //     }, 1000);

// //     return () => {
// //       clearInterval(interval);

// //       if (cameraRef.current) cameraRef.current.stop();
// //       if (faceMeshRef.current) faceMeshRef.current.close();
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

// // import { useEffect, useRef } from "react";
// // import { saveSession } from "../utils/storage";

// // const WebcamFeed = ({
// //   setBlinkRate = () => {},
// //   setDistance = () => {},
// //   setRedness = () => {},
// //   setStressScore = () => {},
// //   setHeadPosition = () => {},
// //   setExpression = () => {},
// //   triggerAlert = () => {} // 🔥 NEW
// // }) => {

// //   const videoRef = useRef(null);
// //   const canvasRef = useRef(null);

// //   const faceMeshRef = useRef(null);
// //   const cameraRef = useRef(null);

// //   const blinkTimes = useRef([]);
// //   const eyeClosed = useRef(false);

// //   const rednessHistory = useRef([]);
// //   const lastRednessCheck = useRef(0);

// //   const sessionStart = useRef(Date.now());

// //   const expressionRef = useRef("focused");
// //   const distanceRef = useRef("optimal");
// //   const headRef = useRef("aligned");

// //   /* 🔥 ALERT REFS */
// //   const closeStart = useRef(null);
// //   const lastDistanceAlert = useRef(0);
// //   const badStressStart = useRef(null);
// //   const lastBreakAlert = useRef(0);

// //   /* 🔴 REDNESS DETECTION */
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

// //     if (!window.FaceMesh || !window.Camera) return;

// //     const faceMesh = new window.FaceMesh({
// //       locateFile: (file) =>
// //         `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
// //     });

// //     faceMesh.setOptions({
// //       maxNumFaces: 1,
// //       refineLandmarks: true,
// //       minDetectionConfidence: 0.5,
// //       minTrackingConfidence: 0.5
// //     });

// //     faceMesh.onResults((results) => {

// //       const canvas = canvasRef.current;
// //       if (!canvas) return;

// //       const ctx = canvas.getContext("2d");
// //       if (!ctx) return;

// //       ctx.clearRect(0, 0, canvas.width, canvas.height);
// //       ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

// //       if (!results.multiFaceLandmarks?.length) return;

// //       const landmarks = results.multiFaceLandmarks[0];

// //       /* ---------- BLINK ---------- */

// //       const top = landmarks[159];
// //       const bottom = landmarks[145];

// //       const eyeDistance = Math.abs(top.y - bottom.y);

// //       if (eyeDistance < 0.02 && !eyeClosed.current)
// //         eyeClosed.current = true;

// //       if (eyeDistance > 0.035 && eyeClosed.current) {
// //         blinkTimes.current.push(Date.now());
// //         eyeClosed.current = false;
// //       }

// //       /* ---------- DISTANCE ---------- */

// //       const nose = landmarks[1];

// //       if (nose) {

// //         const z = nose.z;

// //         if (z < -0.10) {

// //           setDistance("too close");
// //           distanceRef.current = "too close";

// //           if (!closeStart.current)
// //             closeStart.current = Date.now();

// //           const duration = Date.now() - closeStart.current;

// //           if (
// //             duration > 5000 &&
// //             Date.now() - lastDistanceAlert.current > 10000
// //           ) {

// //             triggerAlert("⚠ You're too close to screen!");

// //             lastDistanceAlert.current = Date.now();
// //             closeStart.current = null;
// //           }

// //         } else {

// //           closeStart.current = null;

// //           if (z > -0.07) {
// //             setDistance("too far");
// //             distanceRef.current = "too far";
// //           } else {
// //             setDistance("optimal");
// //             distanceRef.current = "optimal";
// //           }
// //         }
// //       }

// //       /* ---------- HEAD ---------- */

// //       const leftEye = landmarks[33];
// //       const rightEye = landmarks[263];

// //       const tilt =
// //         (rightEye.y - leftEye.y) /
// //         (rightEye.x - leftEye.x);

// //       const headState = Math.abs(tilt) > 0.1 ? "tilted" : "aligned";

// //       setHeadPosition(headState);
// //       headRef.current = headState;

// //       /* ---------- EXPRESSION ---------- */

// //       let expression = "focused";

// //       if (eyeDistance < 0.015)
// //         expression = "drowsy";

// //       expressionRef.current = expression;
// //       setExpression(expression);

// //       /* ---------- REDNESS ---------- */

// //       const now = Date.now();

// //       if (now - lastRednessCheck.current > 800) {

// //         const lEye = landmarks[33];
// //         const lx = lEye.x * canvas.width;
// //         const ly = lEye.y * canvas.height;

// //         const region =
// //           ctx.getImageData(lx - 15, ly - 15, 30, 30);

// //         const redness = detectRedness(region);

// //         rednessHistory.current.push(redness);

// //         if (rednessHistory.current.length > 15)
// //           rednessHistory.current.shift();

// //         const avg =
// //           rednessHistory.current.reduce((a, b) => a + b, 0) /
// //           rednessHistory.current.length;

// //         setRedness(avg > 0.30 ? "moderate" : "normal");

// //         lastRednessCheck.current = now;
// //       }

// //     });

// //     faceMeshRef.current = faceMesh;

// //     const camera = new window.Camera(videoRef.current, {
// //       onFrame: async () => {
// //         try {
// //           await faceMeshRef.current.send({
// //             image: videoRef.current
// //           });
// //         } catch {}
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

// //       /* ---------- FULL STRESS MODEL ---------- */

// //       let score = 100;

// //       if (rate < 15) score -= 10;
// //       if (rate < 10) score -= 20;
// //       if (rate < 5) score -= 30;

// //       const redness =
// //         rednessHistory.current.reduce((a, b) => a + b, 0) /
// //         (rednessHistory.current.length || 1);

// //       if (redness > 0.30) score -= 10;
// //       if (redness > 0.45) score -= 20;

// //       if (distanceRef.current === "too close") score -= 10;
// //       if (distanceRef.current === "too far") score -= 5;

// //       if (headRef.current === "tilted") score -= 8;

// //       if (expressionRef.current === "drowsy") score -= 15;

// //       score = Math.max(score, 0);

// //       setStressScore(score);

// //       /* ---------- STRESS ALERT ---------- */

// //       if (score < 90) {

// //         if (!badStressStart.current)
// //           badStressStart.current = now;

// //         if (now - badStressStart.current > 5000) {

// //           triggerAlert("🚨 High eye strain detected!");

// //           badStressStart.current = null;
// //         }

// //       } else {
// //         badStressStart.current = null;
// //       }

// //       /* ---------- BREAK ALERT ---------- */

// //       const minutes =
// //         Math.floor((now - sessionStart.current) / 60000);

// //       if (minutes >= 1 && now - lastBreakAlert.current > 60000) {

// //         triggerAlert("👁 Follow 20-20-20 rule");

// //         lastBreakAlert.current = now;
// //       }

// //     }, 1000);

// //     return () => {
// //       clearInterval(interval);

// //       if (cameraRef.current) cameraRef.current.stop();
// //       if (faceMeshRef.current) faceMeshRef.current.close();
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
// import { saveSession } from "../utils/storage";

// const WebcamFeed = ({
//   setBlinkRate = () => {},
//   setDistance = () => {},
//   setRedness = () => {},
//   setStressScore = () => {},
//   setHeadPosition = () => {},
//   setExpression = () => {},
//   triggerAlert = () => {}
// }) => {

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   const faceMeshRef = useRef(null);
//   const cameraRef = useRef(null);

//   const blinkTimes = useRef([]);
//   const eyeClosed = useRef(false);
//   const lastBlinkTime = useRef(0);

//   const eyeHistory = useRef([]); // 🔥 smoothing

//   const rednessHistory = useRef([]);
//   const lastRednessCheck = useRef(0);

//   const sessionStart = useRef(Date.now());

//   const expressionRef = useRef("focused");
//   const distanceRef = useRef("optimal");
//   const headRef = useRef("aligned");

//   const closeStart = useRef(null);
//   const lastDistanceAlert = useRef(0);
//   const badStressStart = useRef(null);
//   const lastBreakAlert = useRef(0);

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

//     if (!window.FaceMesh || !window.Camera) return;

//     const faceMesh = new window.FaceMesh({
//       locateFile: (file) =>
//         `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
//     });

//     faceMesh.setOptions({
//       maxNumFaces: 1,
//       refineLandmarks: true,
//       minDetectionConfidence: 0.5,
//       minTrackingConfidence: 0.5
//     });

//     faceMesh.onResults((results) => {

//       const canvas = canvasRef.current;
//       if (!canvas) return;

//       const ctx = canvas.getContext("2d");
//       if (!ctx) return;

//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

//       if (!results.multiFaceLandmarks?.length) return;

//       const landmarks = results.multiFaceLandmarks[0];

//       /* ---------- BLINK (IMPROVED) ---------- */

//       const top = landmarks[159];
//       const bottom = landmarks[145];

//       const rawDistance = Math.abs(top.y - bottom.y);

//       // 🔥 smoothing
//       eyeHistory.current.push(rawDistance);
//       if (eyeHistory.current.length > 5)
//         eyeHistory.current.shift();

//       const eyeDistance =
//         eyeHistory.current.reduce((a, b) => a + b, 0) /
//         eyeHistory.current.length;

//       const CLOSE_THRESHOLD = 0.025;
//       const OPEN_THRESHOLD = 0.03;

//       if (eyeDistance < CLOSE_THRESHOLD && !eyeClosed.current) {
//         eyeClosed.current = true;
//       }

//       if (eyeDistance > OPEN_THRESHOLD && eyeClosed.current) {

//         const now = Date.now();

//         // 🔥 debounce
//         if (now - lastBlinkTime.current > 150) {
//           blinkTimes.current.push(now);
//           lastBlinkTime.current = now;
//         }

//         eyeClosed.current = false;
//       }

//       /* ---------- DISTANCE ---------- */

//       const nose = landmarks[1];

//       if (nose) {

//         const z = nose.z;

//         if (z < -0.10) {

//           setDistance("too close");
//           distanceRef.current = "too close";

//           if (!closeStart.current)
//             closeStart.current = Date.now();

//           const duration = Date.now() - closeStart.current;

//           if (
//             duration > 5000 &&
//             Date.now() - lastDistanceAlert.current > 10000
//           ) {
//             triggerAlert("⚠ You're too close to screen!");
//             lastDistanceAlert.current = Date.now();
//             closeStart.current = null;
//           }

//         } else {

//           closeStart.current = null;

//           if (z > -0.07) {
//             setDistance("too far");
//             distanceRef.current = "too far";
//           } else {
//             setDistance("optimal");
//             distanceRef.current = "optimal";
//           }
//         }
//       }

//       /* ---------- HEAD ---------- */

//       const leftEye = landmarks[33];
//       const rightEye = landmarks[263];

//       const tilt =
//         (rightEye.y - leftEye.y) /
//         (rightEye.x - leftEye.x);

//       const headState = Math.abs(tilt) > 0.1 ? "tilted" : "aligned";

//       setHeadPosition(headState);
//       headRef.current = headState;

//       /* ---------- EXPRESSION ---------- */

//       let expression = "focused";

//       if (eyeDistance < 0.015)
//         expression = "drowsy";

//       expressionRef.current = expression;
//       setExpression(expression);

//       /* ---------- REDNESS ---------- */

//       const now = Date.now();

//       if (now - lastRednessCheck.current > 800) {

//         const lEye = landmarks[33];
//         const lx = lEye.x * canvas.width;
//         const ly = lEye.y * canvas.height;

//         const region =
//           ctx.getImageData(lx - 15, ly - 15, 30, 30);

//         const redness = detectRedness(region);

//         rednessHistory.current.push(redness);

//         if (rednessHistory.current.length > 15)
//           rednessHistory.current.shift();

//         const avg =
//           rednessHistory.current.reduce((a, b) => a + b, 0) /
//           rednessHistory.current.length;

//         setRedness(avg > 0.30 ? "moderate" : "normal");

//         lastRednessCheck.current = now;
//       }

//     });

//     faceMeshRef.current = faceMesh;

//     const camera = new window.Camera(videoRef.current, {
//       onFrame: async () => {
//         try {
//           await faceMeshRef.current.send({
//             image: videoRef.current
//           });
//         } catch {}
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

//       if (rate < 15) score -= 10;
//       if (rate < 10) score -= 20;
//       if (rate < 5) score -= 30;

//       const redness =
//         rednessHistory.current.reduce((a, b) => a + b, 0) /
//         (rednessHistory.current.length || 1);

//       if (redness > 0.30) score -= 10;
//       if (redness > 0.45) score -= 20;

//       if (distanceRef.current === "too close") score -= 10;
//       if (distanceRef.current === "too far") score -= 5;

//       if (headRef.current === "tilted") score -= 8;

//       if (expressionRef.current === "drowsy") score -= 15;

//       score = Math.max(score, 0);

//       setStressScore(score);

//       if (score < 90) {

//         if (!badStressStart.current)
//           badStressStart.current = now;

//         if (now - badStressStart.current > 5000) {
//           triggerAlert("🚨 High eye strain detected!");
//           badStressStart.current = null;
//         }

//       } else {
//         badStressStart.current = null;
//       }

//       const minutes =
//         Math.floor((now - sessionStart.current) / 60000);

//       if (minutes >= 1 && now - lastBreakAlert.current > 60000) {
//         triggerAlert("👁 Follow 20-20-20 rule");
//         lastBreakAlert.current = now;
//       }

//     }, 1000);

//     return () => {
//       clearInterval(interval);

//       if (cameraRef.current) cameraRef.current.stop();
//       if (faceMeshRef.current) faceMeshRef.current.close();
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
  setExpression = () => {},
  triggerAlert = () => {}
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
  const lastRednessCheck = useRef(0);

  const sessionStart = useRef(Date.now());

  const expressionRef = useRef("focused");
  const distanceRef = useRef("optimal");
  const headRef = useRef("aligned");

  const badStressStart = useRef(null);
  const lastBreakAlert = useRef(0);

  /* ---------- REDNESS ---------- */
  const detectRedness = (imageData) => {
    let redPixels = 0;
    let total = 0;

    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (r > g * 1.15 && r > b * 1.15) redPixels++;
      total++;
    }

    return redPixels / total;
  };

  useEffect(() => {

    if (!window.FaceMesh || !window.Camera) {
      console.error("MediaPipe not loaded");
      return;
    }

    const faceMesh = new window.FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
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
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      if (!results.multiFaceLandmarks?.length) return;

      const lm = results.multiFaceLandmarks[0];

      /* ---------- BLINK ---------- */

      const top = lm[159];
      const bottom = lm[145];

      const raw = Math.abs(top.y - bottom.y);

      eyeHistory.current.push(raw);
      if (eyeHistory.current.length > 5)
        eyeHistory.current.shift();

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

      /* ---------- DISTANCE ---------- */

      const z = lm[1].z;

      if (z < -0.10) distanceRef.current = "too close";
      else if (z > -0.07) distanceRef.current = "too far";
      else distanceRef.current = "optimal";

      setDistance(distanceRef.current);

      /* ---------- HEAD ---------- */

      const tilt =
        (lm[263].y - lm[33].y) /
        (lm[263].x - lm[33].x);

      const headState = Math.abs(tilt) > 0.1 ? "tilted" : "aligned";
      setHeadPosition(headState);
      headRef.current = headState;

      /* ---------- 🔥 EXPRESSION (ADVANCED) ---------- */

      const mouthTop = lm[13];
      const mouthBottom = lm[14];
      const mouthLeft = lm[61];
      const mouthRight = lm[291];

      const browLeft = lm[65];
      const browRight = lm[295];

      const mouthOpen = Math.abs(mouthTop.y - mouthBottom.y);
      const mouthWidth = Math.abs(mouthLeft.x - mouthRight.x);
      const browHeight = Math.abs(browLeft.y - browRight.y);

      let expression = "focused";

      if (eyeDistance < 0.015) {
        expression = "drowsy";
      }
      else if (mouthOpen > 0.05) {
        expression = "surprised";
      }
      else if (mouthWidth > 0.07) {
        expression = "smiling";
      }
      else if (browHeight < 0.02 && eyeDistance < 0.02) {
        expression = "strained";
      }
      else {
        expression = "focused";
      }

      expressionRef.current = expression;
      setExpression(expression);

      /* ---------- REDNESS ---------- */

      const now = Date.now();

      if (now - lastRednessCheck.current > 800) {

        const lx = lm[33].x * canvas.width;
        const ly = lm[33].y * canvas.height;

        if (lx > 15 && ly > 15 && lx < 625 && ly < 465) {

          const region =
            ctx.getImageData(lx - 15, ly - 15, 30, 30);

          const redness = detectRedness(region);

          rednessHistory.current.push(redness);

          if (rednessHistory.current.length > 15)
            rednessHistory.current.shift();

          const avg =
            rednessHistory.current.reduce((a, b) => a + b, 0) /
            rednessHistory.current.length;

          setRedness(avg > 0.30 ? "moderate" : "normal");
        }

        lastRednessCheck.current = now;
      }

    });

    faceMeshRef.current = faceMesh;

    const camera = new window.Camera(videoRef.current, {
      onFrame: async () => {
        try {
          await faceMeshRef.current.send({
            image: videoRef.current
          });
        } catch {}
      },
      width: 640,
      height: 480
    });

    camera.start();
    cameraRef.current = camera;

    /* ---------- MAIN LOOP ---------- */

    const interval = setInterval(() => {

      const now = Date.now();

      blinkTimes.current =
        blinkTimes.current.filter(t => now - t < 60000);

      const rate = blinkTimes.current.length;
      setBlinkRate(rate);

      let score = 100;

      if (rate < 15) score -= 10;
      if (rate < 10) score -= 20;
      if (rate < 5) score -= 30;

      const redness =
        rednessHistory.current.reduce((a, b) => a + b, 0) /
        (rednessHistory.current.length || 1);

      if (redness > 0.30) score -= 10;
      if (redness > 0.45) score -= 20;

      if (distanceRef.current === "too close") score -= 10;
      if (distanceRef.current === "too far") score -= 5;

      if (headRef.current === "tilted") score -= 8;

      /* 🔥 EXPRESSION SCORING */
      if (expressionRef.current === "drowsy") score -= 20;
      if (expressionRef.current === "strained") score -= 15;
      if (expressionRef.current === "surprised") score -= 5;
      if (expressionRef.current === "smiling") score += 5;

      score = Math.max(Math.min(score, 100), 0);

      setStressScore(score);

      /* ALERTS */

      if (score < 60) {
        if (!badStressStart.current)
          badStressStart.current = now;

        if (now - badStressStart.current > 5000) {
          triggerAlert("🚨 Eye strain detected!");
          badStressStart.current = null;
        }
      } else {
        badStressStart.current = null;
      }

      const minutes =
        Math.floor((now - sessionStart.current) / 60000);

      if (minutes >= 1 && now - lastBreakAlert.current > 60000) {
        triggerAlert("👁 Follow 20-20-20 rule");
        lastBreakAlert.current = now;
      }

    }, 1000);

    return () => {
      clearInterval(interval);

      if (cameraRef.current) cameraRef.current.stop();
      if (faceMeshRef.current) faceMeshRef.current.close();
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