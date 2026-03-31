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
// // // // //   const pipVideoRef = useRef(null);

// // // // //   const faceMeshRef = useRef(null);
// // // // //   const cameraRef = useRef(null);

// // // // //   const blinkTimes = useRef([]);
// // // // //   const eyeClosed = useRef(false);
// // // // //   const lastBlinkTime = useRef(0);

// // // // //   const eyeHistory = useRef([]);

// // // // //   const distanceRef = useRef("optimal");
// // // // //   const smoothedScore = useRef(100);

// // // // //   const tooCloseStart = useRef(null);
// // // // //   const lastRun = useRef(0);

// // // // //   const smooth = (prev, current) => prev * 0.75 + current * 0.25;

// // // // //   /* 🔥 PiP (Canvas Stream - Stable) */
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
// // // // //       console.error("PiP Error:", err);
// // // // //     }
// // // // //   };

// // // // //   useImperativeHandle(ref, () => ({ enablePiP }));

// // // // //   /* 🎯 UI DRAW (BOTTOM CENTER + CLEAN) */
// // // // //   const drawStress = (ctx, canvas) => {
// // // // //     const text = `Stress: ${Math.round(smoothedScore.current)}`;

// // // // //     ctx.font = "bold 30px sans-serif";
// // // // //     const w = ctx.measureText(text).width;

// // // // //     const x = canvas.width / 2 - w / 2;
// // // // //     const y = canvas.height - 25;

// // // // //     let color = "#22C55E";
// // // // //     if (smoothedScore.current < 70) color = "#facc15";
// // // // //     if (smoothedScore.current < 40) color = "#ef4444";

// // // // //     ctx.fillStyle = "rgba(0,0,0,0.75)";
// // // // //     ctx.fillRect(x - 25, y - 35, w + 50, 50);

// // // // //     ctx.fillStyle = color;
// // // // //     ctx.fillText(text, x, y);
// // // // //   };

// // // // //   const drawAlert = (ctx, canvas, msg, index) => {
// // // // //     ctx.font = "bold 18px sans-serif";
// // // // //     const w = ctx.measureText(msg).width;

// // // // //     const x = canvas.width / 2 - w / 2;
// // // // //     const y = canvas.height - 90 - index * 45;

// // // // //     ctx.fillStyle = "rgba(0,0,0,0.85)";
// // // // //     ctx.fillRect(x - 20, y - 28, w + 40, 38);

// // // // //     ctx.fillStyle = "#EC4899";
// // // // //     ctx.fillText(msg, x, y);
// // // // //   };

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

// // // // //         /* 🎥 DRAW FRAME */
// // // // //         ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

// // // // //         /* 🌑 DARK OVERLAY */
// // // // //         ctx.fillStyle = "rgba(11,18,32,0.25)";
// // // // //         ctx.fillRect(0, 0, canvas.width, canvas.height);

// // // // //         /* 🎯 UI */
// // // // //         drawStress(ctx, canvas);

// // // // //         let alertIndex = 0;

// // // // //         if (distanceRef.current === "too close") {
// // // // //           if (!tooCloseStart.current) tooCloseStart.current = Date.now();

// // // // //           if (Date.now() - tooCloseStart.current > 5000) {
// // // // //             drawAlert(ctx, canvas, "Too Close to Screen", alertIndex++);
// // // // //           }
// // // // //         } else {
// // // // //           tooCloseStart.current = null;
// // // // //         }

// // // // //         if (!results.multiFaceLandmarks?.length) return;

// // // // //         const lm = results.multiFaceLandmarks[0];

// // // // //         /* 👁️ BLINK DETECTION (FAST FIX) */
// // // // //         const raw = Math.abs(lm[159].y - lm[145].y);

// // // // //         eyeHistory.current.push(raw);
// // // // //         if (eyeHistory.current.length > 3) eyeHistory.current.shift();

// // // // //         const eyeDistance =
// // // // //           eyeHistory.current.reduce((a, b) => a + b, 0) /
// // // // //           eyeHistory.current.length;

// // // // //         if (eyeDistance < 0.022 && !eyeClosed.current)
// // // // //           eyeClosed.current = true;

// // // // //         if (eyeDistance > 0.028 && eyeClosed.current) {
// // // // //           const now = Date.now();

// // // // //           if (now - lastBlinkTime.current > 120) {
// // // // //             blinkTimes.current.push(now);
// // // // //             lastBlinkTime.current = now;
// // // // //           }

// // // // //           eyeClosed.current = false;
// // // // //         }

// // // // //         /* 📏 DISTANCE */
// // // // //         const z = lm[1].z;
// // // // //         distanceRef.current =
// // // // //           z < -0.10 ? "too close" :
// // // // //           z > -0.07 ? "too far" : "optimal";

// // // // //         setDistance(distanceRef.current);
// // // // //       });

// // // // //       faceMeshRef.current = faceMesh;

// // // // //       const camera = new window.Camera(videoRef.current, {
// // // // //         onFrame: async () => {
// // // // //           const now = Date.now();

// // // // //           /* ⚡ PERFORMANCE OPTIMIZATION */
// // // // //           if (now - lastRun.current > 60) {
// // // // //             lastRun.current = now;

// // // // //             if (videoRef.current?.readyState === 4) {
// // // // //               await faceMeshRef.current.send({
// // // // //                 image: videoRef.current,
// // // // //               });
// // // // //             }
// // // // //           }
// // // // //         },
// // // // //         width: 640,
// // // // //         height: 480
// // // // //       });

// // // // //       camera.start();
// // // // //       cameraRef.current = camera;

// // // // //       setTimeout(() => {
// // // // //         videoRef.current.play().catch(() => {});
// // // // //       }, 300);

// // // // //       interval = setInterval(() => {
// // // // //         const now = Date.now();

// // // // //         blinkTimes.current =
// // // // //           blinkTimes.current.filter(t => now - t < 60000);

// // // // //         const rate = blinkTimes.current.length;
// // // // //         setBlinkRate(rate);

// // // // //         let score = 100;

// // // // //         if (rate < 15) score -= 5;
// // // // //         if (rate < 10) score -= 10;
// // // // //         if (rate < 6) score -= 15;

// // // // //         if (distanceRef.current === "too close") score -= 12;

// // // // //         score = Math.max(20, Math.min(100, score));

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







// // // // import {
// // // //   useEffect,
// // // //   useRef,
// // // //   useImperativeHandle,
// // // //   forwardRef,
// // // //   useCallback,
// // // // } from "react";

// // // // // ----------------------------------------------------------------------
// // // // // Constants
// // // // // ----------------------------------------------------------------------
// // // // const BLINK_EAR_THRESHOLD = 0.2;      // EAR below this = eye closed
// // // // const BLINK_EAR_OPEN_THRESHOLD = 0.25; // EAR above this = eye open
// // // // const BLINK_DEBOUNCE_MS = 120;

// // // // const STRESS_UPDATE_INTERVAL_MS = 1000;
// // // // const DISTANCE_THROTTLE_MS = 500;
// // // // const HEAD_POSE_THROTTLE_MS = 500;
// // // // const EXPRESSION_THROTTLE_MS = 500;
// // // // const REDNESS_THROTTLE_MS = 1000;

// // // // const DISTANCE_CLOSE_THRESHOLD = 0.7;   // area ratio < 0.7 -> too far
// // // // const DISTANCE_FAR_THRESHOLD = 1.3;     // area ratio > 1.3 -> too close

// // // // const SMOOTHING_FACTOR = 0.75; // exponential smoothing for stress score

// // // // // ----------------------------------------------------------------------
// // // // // Helper: Eye Aspect Ratio (EAR)
// // // // // ----------------------------------------------------------------------
// // // // function computeEAR(landmarks, leftEyeIndices, rightEyeIndices) {
// // // //   const getDist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

// // // //   // Left eye: indices 33, 133, 157, 158, 159, 160, 161, 173 (simplified)
// // // //   const leftVdist = getDist(landmarks[159], landmarks[145]); // vertical
// // // //   const leftHdist = getDist(landmarks[33], landmarks[133]);  // horizontal
// // // //   const leftEAR = leftVdist / leftHdist;

// // // //   // Right eye: indices 362, 263, 387, 386, 385, 384, 398, 466 (simplified)
// // // //   const rightVdist = getDist(landmarks[386], landmarks[374]);
// // // //   const rightHdist = getDist(landmarks[263], landmarks[362]);
// // // //   const rightEAR = rightVdist / rightHdist;

// // // //   return (leftEAR + rightEAR) / 2;
// // // // }

// // // // // ----------------------------------------------------------------------
// // // // // Helper: Face bounding box area (normalised)
// // // // // ----------------------------------------------------------------------
// // // // function getFaceBoundingBoxArea(landmarks, imageWidth, imageHeight) {
// // // //   let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
// // // //   for (const lm of landmarks) {
// // // //     const x = lm.x * imageWidth;
// // // //     const y = lm.y * imageHeight;
// // // //     minX = Math.min(minX, x);
// // // //     minY = Math.min(minY, y);
// // // //     maxX = Math.max(maxX, x);
// // // //     maxY = Math.max(maxY, y);
// // // //   }
// // // //   const width = maxX - minX;
// // // //   const height = maxY - minY;
// // // //   return width * height;
// // // // }

// // // // // ----------------------------------------------------------------------
// // // // // Helper: Head pose (pitch, yaw, roll) from selected landmarks
// // // // // ----------------------------------------------------------------------
// // // // function computeHeadPose(landmarks, imageWidth, imageHeight) {
// // // //   // Use nose tip (1), chin (152), left eye corner (33), right eye corner (263)
// // // //   const nose = landmarks[1];
// // // //   const chin = landmarks[152];
// // // //   const leftEye = landmarks[33];
// // // //   const rightEye = landmarks[263];

// // // //   const dx = rightEye.x - leftEye.x;
// // // //   const dy = rightEye.y - leftEye.y;
// // // //   const roll = Math.atan2(dy, dx) * (180 / Math.PI);

// // // //   const noseToChinY = (chin.y - nose.y) * imageHeight;
// // // //   const eyeDistance = Math.hypot(dx * imageWidth, dy * imageHeight);
// // // //   const pitch = (noseToChinY / eyeDistance - 0.5) * 60; // approximate

// // // //   const faceCenterX = (leftEye.x + rightEye.x) / 2;
// // // //   const yaw = (faceCenterX - 0.5) * 60; // approximate

// // // //   return { pitch: Math.min(30, Math.max(-30, pitch)), yaw, roll };
// // // // }

// // // // // ----------------------------------------------------------------------
// // // // // Helper: Simple smile detection (mouth width / height ratio)
// // // // // ----------------------------------------------------------------------
// // // // function computeExpression(landmarks) {
// // // //   const leftMouth = landmarks[61];
// // // //   const rightMouth = landmarks[291];
// // // //   const topLip = landmarks[13];
// // // //   const bottomLip = landmarks[14];

// // // //   const mouthWidth = Math.hypot(leftMouth.x - rightMouth.x, leftMouth.y - rightMouth.y);
// // // //   const mouthHeight = Math.hypot(topLip.x - bottomLip.x, topLip.y - bottomLip.y);
// // // //   const ratio = mouthHeight / mouthWidth;

// // // //   if (ratio > 0.4) return "smiling";
// // // //   if (landmarks[107].y < landmarks[10].y) return "eyebrow_raised";
// // // //   return "neutral";
// // // // }

// // // // // ----------------------------------------------------------------------
// // // // // Helper: Average redness in face region (from canvas)
// // // // // ----------------------------------------------------------------------
// // // // function computeRedness(canvas, landmarks, imageWidth, imageHeight) {
// // // //   const ctx = canvas.getContext("2d");
// // // //   const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
// // // //   const data = imageData.data;

// // // //   let totalR = 0, totalG = 0, totalB = 0, count = 0;

// // // //   // Sample pixels inside the face bounding box (simplified)
// // // //   let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
// // // //   for (const lm of landmarks) {
// // // //     const x = lm.x * imageWidth;
// // // //     const y = lm.y * imageHeight;
// // // //     minX = Math.min(minX, x);
// // // //     minY = Math.min(minY, y);
// // // //     maxX = Math.max(maxX, x);
// // // //     maxY = Math.max(maxY, y);
// // // //   }

// // // //   const step = 5; // sample every 5th pixel for performance
// // // //   for (let y = minY; y < maxY; y += step) {
// // // //     for (let x = minX; x < maxX; x += step) {
// // // //       const idx = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
// // // //       if (idx >= 0 && idx + 2 < data.length) {
// // // //         totalR += data[idx];
// // // //         totalG += data[idx + 1];
// // // //         totalB += data[idx + 2];
// // // //         count++;
// // // //       }
// // // //     }
// // // //   }

// // // //   if (count === 0) return 50;
// // // //   const avgR = totalR / count;
// // // //   const avgG = totalG / count;
// // // //   const avgB = totalB / count;
// // // //   // Redness = how much red dominates over green/blue (normalised 0-100)
// // // //   let redness = ((avgR - (avgG + avgB) / 2) / 255) * 100;
// // // //   return Math.min(100, Math.max(0, redness + 50));
// // // // }

// // // // // ----------------------------------------------------------------------
// // // // // Main Component
// // // // // ----------------------------------------------------------------------
// // // // const WebcamFeed = forwardRef(
// // // //   (
// // // //     {
// // // //       setBlinkRate = () => {},
// // // //       setDistance = () => {},
// // // //       setRedness = () => {},
// // // //       setStressScore = () => {},
// // // //       setHeadPosition = () => {},
// // // //       setExpression = () => {},
// // // //     },
// // // //     ref
// // // //   ) => {
// // // //     // DOM refs
// // // //     const videoRef = useRef(null);
// // // //     const canvasRef = useRef(null);
// // // //     const pipVideoRef = useRef(null);

// // // //     // MediaPipe refs
// // // //     const faceMeshRef = useRef(null);
// // // //     const cameraRef = useRef(null);

// // // //     // Blink tracking
// // // //     const earHistory = useRef([]); // rolling EAR values
// // // //     const eyeClosed = useRef(false);
// // // //     const lastBlinkTime = useRef(0);
// // // //     const blinkTimes = useRef([]);

// // // //     // Distance calibration (reference face area)
// // // //     const referenceFaceArea = useRef(null);
// // // //     const distanceRef = useRef("optimal");
// // // //     const distanceThrottleRef = useRef(0);

// // // //     // Stress score smoothing
// // // //     const smoothedStress = useRef(100);

// // // //     // Too‑close alert timer
// // // //     const tooCloseStart = useRef(null);

// // // //     // Performance throttle for FaceMesh processing
// // // //     const lastProcessTime = useRef(0);

// // // //     // Calibration flag
// // // //     const calibrated = useRef(false);

// // // //     // ------------------------------------------------------------------
// // // //     // Throttled callbacks (avoid excessive parent updates)
// // // //     // ------------------------------------------------------------------
// // // //     const throttledSetDistance = useCallback((value) => {
// // // //       const now = Date.now();
// // // //       if (now - distanceThrottleRef.current >= DISTANCE_THROTTLE_MS) {
// // // //         distanceThrottleRef.current = now;
// // // //         setDistance(value);
// // // //       }
// // // //     }, [setDistance]);

// // // //     const throttledSetHeadPosition = useCallback((() => {
// // // //       let lastCall = 0;
// // // //       return (pose) => {
// // // //         const now = Date.now();
// // // //         if (now - lastCall >= HEAD_POSE_THROTTLE_MS) {
// // // //           lastCall = now;
// // // //           setHeadPosition(pose);
// // // //         }
// // // //       };
// // // //     })(), [setHeadPosition]);

// // // //     const throttledSetExpression = useCallback((() => {
// // // //       let lastCall = 0;
// // // //       return (expr) => {
// // // //         const now = Date.now();
// // // //         if (now - lastCall >= EXPRESSION_THROTTLE_MS) {
// // // //           lastCall = now;
// // // //           setExpression(expr);
// // // //         }
// // // //       };
// // // //     })(), [setExpression]);

// // // //     const throttledSetRedness = useCallback((() => {
// // // //       let lastCall = 0;
// // // //       return (value) => {
// // // //         const now = Date.now();
// // // //         if (now - lastCall >= REDNESS_THROTTLE_MS) {
// // // //           lastCall = now;
// // // //           setRedness(value);
// // // //         }
// // // //       };
// // // //     })(), [setRedness]);

// // // //     // ------------------------------------------------------------------
// // // //     // Drawing functions (canvas UI)
// // // //     // ------------------------------------------------------------------
// // // //     const drawStress = (ctx, canvas, score) => {
// // // //       const text = `Stress: ${Math.round(score)}`;
// // // //       ctx.font = "bold 30px sans-serif";
// // // //       const w = ctx.measureText(text).width;
// // // //       const x = canvas.width / 2 - w / 2;
// // // //       const y = canvas.height - 25;

// // // //       let color = "#22C55E";
// // // //       if (score < 70) color = "#facc15";
// // // //       if (score < 40) color = "#ef4444";

// // // //       ctx.fillStyle = "rgba(0,0,0,0.75)";
// // // //       ctx.fillRect(x - 25, y - 35, w + 50, 50);
// // // //       ctx.fillStyle = color;
// // // //       ctx.fillText(text, x, y);
// // // //     };

// // // //     const drawAlert = (ctx, canvas, msg, yOffset) => {
// // // //       ctx.font = "bold 18px sans-serif";
// // // //       const w = ctx.measureText(msg).width;
// // // //       const x = canvas.width / 2 - w / 2;
// // // //       const y = canvas.height - 90 - yOffset;
// // // //       ctx.fillStyle = "rgba(0,0,0,0.85)";
// // // //       ctx.fillRect(x - 20, y - 28, w + 40, 38);
// // // //       ctx.fillStyle = "#EC4899";
// // // //       ctx.fillText(msg, x, y);
// // // //     };

// // // //     // ------------------------------------------------------------------
// // // //     // Picture‑in‑Picture (stable, with cleanup)
// // // //     // ------------------------------------------------------------------
// // // //     const enablePiP = useCallback(async () => {
// // // //       try {
// // // //         const canvas = canvasRef.current;
// // // //         if (!canvas) return;
// // // //         const stream = canvas.captureStream(30);

// // // //         if (!pipVideoRef.current) {
// // // //           pipVideoRef.current = document.createElement("video");
// // // //           pipVideoRef.current.muted = true;
// // // //           pipVideoRef.current.playsInline = true;
// // // //         }
// // // //         pipVideoRef.current.srcObject = stream;
// // // //         await pipVideoRef.current.play();

// // // //         if (document.pictureInPictureElement) {
// // // //           await document.exitPictureInPicture();
// // // //         }
// // // //         await pipVideoRef.current.requestPictureInPicture();

// // // //         // Listen for PiP close to clean up
// // // //         pipVideoRef.current.addEventListener("leavepictureinpicture", () => {
// // // //           if (pipVideoRef.current) {
// // // //             pipVideoRef.current.srcObject = null;
// // // //           }
// // // //         });
// // // //       } catch (err) {
// // // //         console.error("PiP error:", err);
// // // //       }
// // // //     }, []);

// // // //     const disablePiP = useCallback(async () => {
// // // //       if (document.pictureInPictureElement) {
// // // //         await document.exitPictureInPicture();
// // // //       }
// // // //       if (pipVideoRef.current) {
// // // //         pipVideoRef.current.srcObject = null;
// // // //       }
// // // //     }, []);

// // // //     useImperativeHandle(ref, () => ({ enablePiP, disablePiP }));

// // // //     // ------------------------------------------------------------------
// // // //     // FaceMesh results handler (all analysis happens here)
// // // //     // ------------------------------------------------------------------
// // // //     const onFaceMeshResults = useCallback(
// // // //       (results) => {
// // // //         const canvas = canvasRef.current;
// // // //         const ctx = canvas.getContext("2d");
// // // //         if (!ctx) return;

// // // //         // Draw video frame
// // // //         ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
// // // //         // Dark overlay
// // // //         ctx.fillStyle = "rgba(11,18,32,0.25)";
// // // //         ctx.fillRect(0, 0, canvas.width, canvas.height);

// // // //         // Draw stress score
// // // //         drawStress(ctx, canvas, smoothedStress.current);

// // // //         // Show alerts
// // // //         let alertOffset = 0;
// // // //         if (distanceRef.current === "too close") {
// // // //           if (!tooCloseStart.current) tooCloseStart.current = Date.now();
// // // //           if (Date.now() - tooCloseStart.current > 5000) {
// // // //             drawAlert(ctx, canvas, "Too Close to Screen", alertOffset);
// // // //             alertOffset += 45;
// // // //           }
// // // //         } else {
// // // //           tooCloseStart.current = null;
// // // //         }

// // // //         if (!results.multiFaceLandmarks?.length) return;

// // // //         const landmarks = results.multiFaceLandmarks[0];
// // // //         const imageWidth = results.image.width;
// // // //         const imageHeight = results.image.height;

// // // //         // ---- 1. Blink detection (EAR) ----
// // // //         const ear = computeEAR(landmarks);
// // // //         earHistory.current.push(ear);
// // // //         if (earHistory.current.length > 5) earHistory.current.shift();
// // // //         const avgEAR = earHistory.current.reduce((a, b) => a + b, 0) / earHistory.current.length;

// // // //         if (avgEAR < BLINK_EAR_THRESHOLD && !eyeClosed.current) {
// // // //           eyeClosed.current = true;
// // // //         }
// // // //         if (avgEAR > BLINK_EAR_OPEN_THRESHOLD && eyeClosed.current) {
// // // //           const now = Date.now();
// // // //           if (now - lastBlinkTime.current > BLINK_DEBOUNCE_MS) {
// // // //             blinkTimes.current.push(now);
// // // //             lastBlinkTime.current = now;
// // // //           }
// // // //           eyeClosed.current = false;
// // // //         }

// // // //         // ---- 2. Distance estimation (face bounding box area) ----
// // // //         const currentArea = getFaceBoundingBoxArea(landmarks, imageWidth, imageHeight);
// // // //         if (!calibrated.current && currentArea > 0) {
// // // //           // Calibrate after 30 frames of stable area (simple: first valid area)
// // // //           referenceFaceArea.current = currentArea;
// // // //           calibrated.current = true;
// // // //         }

// // // //         let distanceState = "optimal";
// // // //         if (calibrated.current && referenceFaceArea.current) {
// // // //           const ratio = currentArea / referenceFaceArea.current;
// // // //           if (ratio > DISTANCE_CLOSE_THRESHOLD) distanceState = "too far";
// // // //           else if (ratio < DISTANCE_FAR_THRESHOLD) distanceState = "too close";
// // // //         }
// // // //         distanceRef.current = distanceState;
// // // //         throttledSetDistance(distanceState);

// // // //         // ---- 3. Head pose ----
// // // //         const headPose = computeHeadPose(landmarks, imageWidth, imageHeight);
// // // //         throttledSetHeadPosition(headPose);

// // // //         // ---- 4. Expression ----
// // // //         const expression = computeExpression(landmarks);
// // // //         throttledSetExpression(expression);

// // // //         // ---- 5. Redness (sample from canvas) ----
// // // //         const redness = computeRedness(canvas, landmarks, imageWidth, imageHeight);
// // // //         throttledSetRedness(redness);
// // // //       },
// // // //       [throttledSetDistance, throttledSetHeadPosition, throttledSetExpression, throttledSetRedness]
// // // //     );

// // // //     // ------------------------------------------------------------------
// // // //     // Stress score calculator (runs every second)
// // // //     // ------------------------------------------------------------------
// // // //     useEffect(() => {
// // // //       const interval = setInterval(() => {
// // // //         const now = Date.now();
// // // //         // Keep only blinks from last 60 seconds
// // // //         blinkTimes.current = blinkTimes.current.filter((t) => now - t < 60000);
// // // //         const blinkRate = blinkTimes.current.length;

// // // //         setBlinkRate(blinkRate);

// // // //         let stress = 100;

// // // //         // Blink rate penalties (low blink rate can indicate stress)
// // // //         if (blinkRate < 15) stress -= 5;
// // // //         if (blinkRate < 10) stress -= 10;
// // // //         if (blinkRate < 6) stress -= 15;

// // // //         // Distance penalty
// // // //         if (distanceRef.current === "too close") stress -= 15;
// // // //         if (distanceRef.current === "too far") stress -= 5;

// // // //         // Expression penalty (frowning not implemented, but smiling reduces stress)
// // // //         // (We don't have a frown detector here, so we rely on redness/head)

// // // //         stress = Math.max(20, Math.min(100, stress));
// // // //         smoothedStress.current = smoothedStress.current * SMOOTHING_FACTOR + stress * (1 - SMOOTHING_FACTOR);
// // // //         setStressScore(Math.round(smoothedStress.current));
// // // //       }, STRESS_UPDATE_INTERVAL_MS);

// // // //       return () => clearInterval(interval);
// // // //     }, [setBlinkRate, setStressScore]);

// // // //     // ------------------------------------------------------------------
// // // //     // Initialize MediaPipe FaceMesh and Camera
// // // //     // ------------------------------------------------------------------
// // // //     useEffect(() => {
// // // //       let isMounted = true;

// // // //       const init = async () => {
// // // //         try {
// // // //           // Load FaceMesh
// // // //           const FaceMesh = window.FaceMesh;
// // // //           if (!FaceMesh) throw new Error("MediaPipe FaceMesh not loaded");

// // // //           const faceMesh = new FaceMesh({
// // // //             locateFile: (file) =>
// // // //               `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`,
// // // //           });
// // // //           faceMesh.setOptions({
// // // //             maxNumFaces: 1,
// // // //             refineLandmarks: true,
// // // //             minDetectionConfidence: 0.5,
// // // //             minTrackingConfidence: 0.5,
// // // //           });
// // // //           faceMesh.onResults(onFaceMeshResults);
// // // //           faceMeshRef.current = faceMesh;

// // // //           // Start camera
// // // //           const camera = new window.Camera(videoRef.current, {
// // // //             onFrame: async () => {
// // // //               const now = Date.now();
// // // //               if (now - lastProcessTime.current > 60 && videoRef.current?.readyState === 4) {
// // // //                 lastProcessTime.current = now;
// // // //                 await faceMesh.send({ image: videoRef.current });
// // // //               }
// // // //             },
// // // //             width: 640,
// // // //             height: 480,
// // // //           });
// // // //           await camera.start();
// // // //           cameraRef.current = camera;

// // // //           // Ensure video plays
// // // //           await videoRef.current.play();
// // // //         } catch (err) {
// // // //           console.error("Failed to initialize camera or FaceMesh:", err);
// // // //           // Draw error on canvas
// // // //           const canvas = canvasRef.current;
// // // //           if (canvas) {
// // // //             const ctx = canvas.getContext("2d");
// // // //             ctx.fillStyle = "rgba(0,0,0,0.8)";
// // // //             ctx.fillRect(0, 0, canvas.width, canvas.height);
// // // //             ctx.fillStyle = "#ff4444";
// // // //             ctx.font = "18px sans-serif";
// // // //             ctx.fillText("Camera or FaceMesh error. Check permissions.", 20, 50);
// // // //             ctx.fillText("Please refresh and allow camera access.", 20, 90);
// // // //           }
// // // //         }
// // // //       };

// // // //       init();

// // // //       return () => {
// // // //         isMounted = false;
// // // //         if (cameraRef.current) cameraRef.current.stop();
// // // //         if (faceMeshRef.current) faceMeshRef.current.close();
// // // //         if (pipVideoRef.current) {
// // // //           pipVideoRef.current.srcObject = null;
// // // //           pipVideoRef.current = null;
// // // //         }
// // // //       };
// // // //     }, [onFaceMeshResults]);

// // // //     // ------------------------------------------------------------------
// // // //     // Render: hidden video + responsive canvas
// // // //     // ------------------------------------------------------------------
// // // //     return (
// // // //       <div className="w-full h-full relative">
// // // //         <video
// // // //           ref={videoRef}
// // // //           autoPlay
// // // //           playsInline
// // // //           muted
// // // //           className="absolute top-0 left-0 w-0 h-0 opacity-0 pointer-events-none"
// // // //         />
// // // //         <canvas
// // // //           ref={canvasRef}
// // // //           width="640"
// // // //           height="480"
// // // //           className="w-full h-full object-contain rounded-xl"
// // // //         />
// // // //       </div>
// // // //     );
// // // //   }
// // // // );

// // // // export default WebcamFeed;











// // // // import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from "react";

// // // // // ----------------------------------------------------------------------
// // // // // Constants
// // // // // ----------------------------------------------------------------------
// // // // const BLINK_EAR_THRESHOLD = 0.2;
// // // // const BLINK_EAR_OPEN_THRESHOLD = 0.25;
// // // // const BLINK_DEBOUNCE_MS = 120;
// // // // const STRESS_UPDATE_INTERVAL_MS = 1000;
// // // // const DISTANCE_THROTTLE_MS = 500;
// // // // const SMOOTHING_FACTOR = 0.75;

// // // // // ----------------------------------------------------------------------
// // // // // Helper: Eye Aspect Ratio (EAR) – works with MediaPipe 468 landmarks
// // // // // ----------------------------------------------------------------------
// // // // function computeEAR(landmarks) {
// // // //   // Left eye: indices 33, 133, 159, 145 (simplified but reliable)
// // // //   const leftEyeTop = landmarks[159];
// // // //   const leftEyeBottom = landmarks[145];
// // // //   const leftEyeLeft = landmarks[33];
// // // //   const leftEyeRight = landmarks[133];

// // // //   // Right eye: indices 362, 263, 386, 374
// // // //   const rightEyeTop = landmarks[386];
// // // //   const rightEyeBottom = landmarks[374];
// // // //   const rightEyeLeft = landmarks[263];
// // // //   const rightEyeRight = landmarks[362];

// // // //   const getDist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

// // // //   const leftVertical = getDist(leftEyeTop, leftEyeBottom);
// // // //   const leftHorizontal = getDist(leftEyeLeft, leftEyeRight);
// // // //   const leftEAR = leftVertical / leftHorizontal;

// // // //   const rightVertical = getDist(rightEyeTop, rightEyeBottom);
// // // //   const rightHorizontal = getDist(rightEyeLeft, rightEyeRight);
// // // //   const rightEAR = rightVertical / rightHorizontal;

// // // //   return (leftEAR + rightEAR) / 2;
// // // // }

// // // // // ----------------------------------------------------------------------
// // // // // Helper: Face bounding box area (normalised)
// // // // // ----------------------------------------------------------------------
// // // // function getFaceBoundingBoxArea(landmarks, imageWidth, imageHeight) {
// // // //   let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
// // // //   for (const lm of landmarks) {
// // // //     const x = lm.x * imageWidth;
// // // //     const y = lm.y * imageHeight;
// // // //     minX = Math.min(minX, x);
// // // //     minY = Math.min(minY, y);
// // // //     maxX = Math.max(maxX, x);
// // // //     maxY = Math.max(maxY, y);
// // // //   }
// // // //   return (maxX - minX) * (maxY - minY);
// // // // }

// // // // // ----------------------------------------------------------------------
// // // // // Main Component
// // // // // ----------------------------------------------------------------------
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
// // // //   const cameraRef = useRef(null);

// // // //   // Blink tracking
// // // //   const earHistory = useRef([]);
// // // //   const eyeClosed = useRef(false);
// // // //   const lastBlinkTime = useRef(0);
// // // //   const blinkTimes = useRef([]);

// // // //   // Distance calibration
// // // //   const referenceFaceArea = useRef(null);
// // // //   const distanceRef = useRef("optimal");
// // // //   const distanceThrottle = useRef(0);

// // // //   // Stress score smoothing
// // // //   const smoothedStress = useRef(100);
// // // //   const tooCloseStart = useRef(null);
// // // //   const lastProcessTime = useRef(0);
// // // //   const calibrated = useRef(false);

// // // //   // Throttled distance setter
// // // //   const throttledSetDistance = useCallback((value) => {
// // // //     const now = Date.now();
// // // //     if (now - distanceThrottle.current >= DISTANCE_THROTTLE_MS) {
// // // //       distanceThrottle.current = now;
// // // //       setDistance(value);
// // // //     }
// // // //   }, [setDistance]);

// // // //   // ------------------------------------------------------------------
// // // //   // Drawing functions
// // // //   // ------------------------------------------------------------------
// // // //   const drawStress = (ctx, canvas, score) => {
// // // //     const text = `Stress: ${Math.round(score)}`;
// // // //     ctx.font = "bold 30px sans-serif";
// // // //     const w = ctx.measureText(text).width;
// // // //     const x = canvas.width / 2 - w / 2;
// // // //     const y = canvas.height - 25;

// // // //     let color = "#22C55E";
// // // //     if (score < 70) color = "#facc15";
// // // //     if (score < 40) color = "#ef4444";

// // // //     ctx.fillStyle = "rgba(0,0,0,0.75)";
// // // //     ctx.fillRect(x - 25, y - 35, w + 50, 50);
// // // //     ctx.fillStyle = color;
// // // //     ctx.fillText(text, x, y);
// // // //   };

// // // //   const drawAlert = (ctx, canvas, msg, yOffset) => {
// // // //     ctx.font = "bold 18px sans-serif";
// // // //     const w = ctx.measureText(msg).width;
// // // //     const x = canvas.width / 2 - w / 2;
// // // //     const y = canvas.height - 90 - yOffset;
// // // //     ctx.fillStyle = "rgba(0,0,0,0.85)";
// // // //     ctx.fillRect(x - 20, y - 28, w + 40, 38);
// // // //     ctx.fillStyle = "#EC4899";
// // // //     ctx.fillText(msg, x, y);
// // // //   };

// // // //   // ------------------------------------------------------------------
// // // //   // Picture‑in‑Picture
// // // //   // ------------------------------------------------------------------
// // // //   const enablePiP = async () => {
// // // //     try {
// // // //       const canvas = canvasRef.current;
// // // //       if (!canvas) return;
// // // //       const stream = canvas.captureStream(30);
// // // //       if (!pipVideoRef.current) {
// // // //         pipVideoRef.current = document.createElement("video");
// // // //         pipVideoRef.current.muted = true;
// // // //         pipVideoRef.current.playsInline = true;
// // // //       }
// // // //       pipVideoRef.current.srcObject = stream;
// // // //       await pipVideoRef.current.play();
// // // //       if (document.pictureInPictureElement) {
// // // //         await document.exitPictureInPicture();
// // // //       }
// // // //       await pipVideoRef.current.requestPictureInPicture();
// // // //     } catch (err) {
// // // //       console.error("PiP error:", err);
// // // //     }
// // // //   };

// // // //   useImperativeHandle(ref, () => ({ enablePiP }));

// // // //   // ------------------------------------------------------------------
// // // //   // FaceMesh results handler (simplified, no missing arguments)
// // // //   // ------------------------------------------------------------------
// // // //   const onResults = useCallback((results) => {
// // // //     const canvas = canvasRef.current;
// // // //     const ctx = canvas.getContext("2d");
// // // //     if (!ctx) return;

// // // //     // Draw video frame
// // // //     ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
// // // //     ctx.fillStyle = "rgba(11,18,32,0.25)";
// // // //     ctx.fillRect(0, 0, canvas.width, canvas.height);
// // // //     drawStress(ctx, canvas, smoothedStress.current);

// // // //     let alertOffset = 0;
// // // //     if (distanceRef.current === "too close") {
// // // //       if (!tooCloseStart.current) tooCloseStart.current = Date.now();
// // // //       if (Date.now() - tooCloseStart.current > 5000) {
// // // //         drawAlert(ctx, canvas, "Too Close to Screen", alertOffset);
// // // //         alertOffset += 45;
// // // //       }
// // // //     } else {
// // // //       tooCloseStart.current = null;
// // // //     }

// // // //     if (!results.multiFaceLandmarks?.length) return;

// // // //     const landmarks = results.multiFaceLandmarks[0];
// // // //     const imgW = results.image.width;
// // // //     const imgH = results.image.height;

// // // //     // 1. Blink detection
// // // //     const ear = computeEAR(landmarks);
// // // //     earHistory.current.push(ear);
// // // //     if (earHistory.current.length > 5) earHistory.current.shift();
// // // //     const avgEAR = earHistory.current.reduce((a,b)=>a+b,0)/earHistory.current.length;

// // // //     if (avgEAR < BLINK_EAR_THRESHOLD && !eyeClosed.current) eyeClosed.current = true;
// // // //     if (avgEAR > BLINK_EAR_OPEN_THRESHOLD && eyeClosed.current) {
// // // //       const now = Date.now();
// // // //       if (now - lastBlinkTime.current > BLINK_DEBOUNCE_MS) {
// // // //         blinkTimes.current.push(now);
// // // //         lastBlinkTime.current = now;
// // // //       }
// // // //       eyeClosed.current = false;
// // // //     }

// // // //     // 2. Distance estimation (face bounding box)
// // // //     const currentArea = getFaceBoundingBoxArea(landmarks, imgW, imgH);
// // // //     if (!calibrated.current && currentArea > 0) {
// // // //       referenceFaceArea.current = currentArea;
// // // //       calibrated.current = true;
// // // //     }

// // // //     let distanceState = "optimal";
// // // //     if (calibrated.current && referenceFaceArea.current) {
// // // //       const ratio = currentArea / referenceFaceArea.current;
// // // //       if (ratio > 1.3) distanceState = "too close";
// // // //       else if (ratio < 0.7) distanceState = "too far";
// // // //     }
// // // //     distanceRef.current = distanceState;
// // // //     throttledSetDistance(distanceState);

// // // //     // 3. Simple head position (just for demo – you can expand)
// // // //     const nose = landmarks[1];
// // // //     const leftEye = landmarks[33];
// // // //     const rightEye = landmarks[263];
// // // //     const headYaw = (nose.x - 0.5) * 60; // -30..30
// // // //     const headPitch = (nose.y - 0.5) * 40;
// // // //     setHeadPosition({ yaw: headYaw, pitch: headPitch });

// // // //     // 4. Expression – basic smile detection
// // // //     const leftMouth = landmarks[61];
// // // //     const rightMouth = landmarks[291];
// // // //     const mouthWidth = Math.hypot(leftMouth.x - rightMouth.x, leftMouth.y - rightMouth.y);
// // // //     const topLip = landmarks[13];
// // // //     const bottomLip = landmarks[14];
// // // //     const mouthHeight = Math.hypot(topLip.x - bottomLip.x, topLip.y - bottomLip.y);
// // // //     const smileRatio = mouthHeight / mouthWidth;
// // // //     setExpression(smileRatio > 0.4 ? "smiling" : "neutral");

// // // //     // 5. Redness – approximate using skin sample
// // // //     const centerX = nose.x * canvas.width;
// // // //     const centerY = nose.y * canvas.height;
// // // //     const radius = 30;
// // // //     const imageData = ctx.getImageData(centerX - radius, centerY - radius, radius*2, radius*2);
// // // //     const data = imageData.data;
// // // //     let rSum = 0, gSum = 0, bSum = 0, count = 0;
// // // //     for (let i = 0; i < data.length; i += 4) {
// // // //       rSum += data[i];
// // // //       gSum += data[i+1];
// // // //       bSum += data[i+2];
// // // //       count++;
// // // //     }
// // // //     const avgR = rSum / count;
// // // //     const avgG = gSum / count;
// // // //     const avgB = bSum / count;
// // // //     const rednessScore = Math.min(100, Math.max(0, ((avgR - (avgG+avgB)/2) / 255) * 100 + 50));
// // // //     setRedness(Math.round(rednessScore));

// // // //   }, [throttledSetDistance, setHeadPosition, setExpression, setRedness]);

// // // //   // ------------------------------------------------------------------
// // // //   // Stress score calculator (every second)
// // // //   // ------------------------------------------------------------------
// // // //   useEffect(() => {
// // // //     const interval = setInterval(() => {
// // // //       const now = Date.now();
// // // //       blinkTimes.current = blinkTimes.current.filter(t => now - t < 60000);
// // // //       const rate = blinkTimes.current.length;
// // // //       setBlinkRate(rate);

// // // //       let stress = 100;
// // // //       if (rate < 15) stress -= 5;
// // // //       if (rate < 10) stress -= 10;
// // // //       if (rate < 6) stress -= 15;
// // // //       if (distanceRef.current === "too close") stress -= 12;

// // // //       stress = Math.max(20, Math.min(100, stress));
// // // //       smoothedStress.current = smoothedStress.current * SMOOTHING_FACTOR + stress * (1 - SMOOTHING_FACTOR);
// // // //       setStressScore(Math.round(smoothedStress.current));
// // // //     }, STRESS_UPDATE_INTERVAL_MS);
// // // //     return () => clearInterval(interval);
// // // //   }, [setBlinkRate, setStressScore]);

// // // //   // ------------------------------------------------------------------
// // // //   // Initialize MediaPipe
// // // //   // ------------------------------------------------------------------
// // // //   useEffect(() => {
// // // //     let mounted = true;
// // // //     const init = async () => {
// // // //       try {
// // // //         // Wait for MediaPipe to be available (ensure script is loaded in index.html)
// // // //         if (!window.FaceMesh) {
// // // //           throw new Error("MediaPipe FaceMesh not loaded. Add the script to index.html");
// // // //         }

// // // //         const faceMesh = new window.FaceMesh({
// // // //           locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`
// // // //         });
// // // //         faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true });
// // // //         faceMesh.onResults(onResults);
// // // //         faceMeshRef.current = faceMesh;

// // // //         const camera = new window.Camera(videoRef.current, {
// // // //           onFrame: async () => {
// // // //             const now = Date.now();
// // // //             if (now - lastProcessTime.current > 60 && videoRef.current?.readyState === 4) {
// // // //               lastProcessTime.current = now;
// // // //               await faceMesh.send({ image: videoRef.current });
// // // //             }
// // // //           },
// // // //           width: 640,
// // // //           height: 480
// // // //         });
// // // //         await camera.start();
// // // //         cameraRef.current = camera;
// // // //         await videoRef.current.play();
// // // //       } catch (err) {
// // // //         console.error("Init error:", err);
// // // //         const canvas = canvasRef.current;
// // // //         if (canvas) {
// // // //           const ctx = canvas.getContext("2d");
// // // //           ctx.fillStyle = "black";
// // // //           ctx.fillRect(0, 0, canvas.width, canvas.height);
// // // //           ctx.fillStyle = "red";
// // // //           ctx.font = "16px sans-serif";
// // // //           ctx.fillText("Camera / FaceMesh error. Check console & permissions.", 20, 50);
// // // //         }
// // // //       }
// // // //     };
// // // //     init();
// // // //     return () => {
// // // //       mounted = false;
// // // //       cameraRef.current?.stop();
// // // //       faceMeshRef.current?.close();
// // // //     };
// // // //   }, [onResults]);

// // // //   return (
// // // //     <div className="w-full h-full">
// // // //       <video ref={videoRef} autoPlay playsInline muted className="hidden" />
// // // //       <canvas ref={canvasRef} width="640" height="480" className="rounded-xl w-full h-full object-cover" />
// // // //     </div>
// // // //   );
// // // // });

// // // // export default WebcamFeed;


// // // import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from "react";

// // // /* CONSTANTS */
// // // const BLINK_EAR_THRESHOLD = 0.2;
// // // const BLINK_EAR_OPEN_THRESHOLD = 0.25;
// // // const BLINK_DEBOUNCE_MS = 120;
// // // const STRESS_UPDATE_INTERVAL_MS = 1000;
// // // const DISTANCE_THROTTLE_MS = 500;
// // // const SMOOTHING_FACTOR = 0.75;

// // // /* HELPERS */
// // // const dist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

// // // function computeEAR(lm) {
// // //   const left = dist(lm[159], lm[145]) / dist(lm[33], lm[133]);
// // //   const right = dist(lm[386], lm[374]) / dist(lm[263], lm[362]);
// // //   return (left + right) / 2;
// // // }

// // // function getFaceArea(lm, w, h) {
// // //   let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
// // //   for (let p of lm) {
// // //     const x = p.x * w;
// // //     const y = p.y * h;
// // //     minX = Math.min(minX, x);
// // //     minY = Math.min(minY, y);
// // //     maxX = Math.max(maxX, x);
// // //     maxY = Math.max(maxY, y);
// // //   }
// // //   return (maxX - minX) * (maxY - minY);
// // // }

// // // const WebcamFeed = forwardRef((props, ref) => {

// // //   const {
// // //     setBlinkRate,
// // //     setDistance,
// // //     setRedness,
// // //     setStressScore,
// // //     setHeadPosition,
// // //     setExpression
// // //   } = props;

// // //   const videoRef = useRef(null);
// // //   const canvasRef = useRef(null);
// // //   const pipVideoRef = useRef(null);

// // //   const faceMeshRef = useRef(null);
// // //   const cameraRef = useRef(null);

// // //   const blinkTimes = useRef([]);
// // //   const earHistory = useRef([]);
// // //   const eyeClosed = useRef(false);
// // //   const lastBlink = useRef(0);

// // //   const referenceFace = useRef(null);
// // //   const calibrated = useRef(false);
// // //   const distanceRef = useRef("optimal");
// // //   const throttle = useRef(0);

// // //   const smoothed = useRef(100);
// // //   const tooCloseStart = useRef(null);
// // //   const lastFrame = useRef(0);

// // //   /* PiP */
// // //   const enablePiP = async () => {
// // //     const canvas = canvasRef.current;
// // //     const stream = canvas.captureStream(30);

// // //     if (!pipVideoRef.current) {
// // //       pipVideoRef.current = document.createElement("video");
// // //       pipVideoRef.current.muted = true;
// // //     }

// // //     pipVideoRef.current.srcObject = stream;
// // //     await pipVideoRef.current.play();
// // //     await pipVideoRef.current.requestPictureInPicture();
// // //   };

// // //   useImperativeHandle(ref, () => ({ enablePiP }));

// // //   /* DRAW */
// // //   const drawUI = (ctx, canvas) => {

// // //     const score = Math.round(smoothed.current);

// // //     const text = `Stress: ${score}`;
// // //     ctx.font = "bold 30px sans-serif";

// // //     const w = ctx.measureText(text).width;
// // //     const x = canvas.width / 2 - w / 2;
// // //     const y = canvas.height - 20;

// // //     let color = "#22C55E";
// // //     if (score < 70) color = "#facc15";
// // //     if (score < 40) color = "#ef4444";

// // //     ctx.fillStyle = "rgba(0,0,0,0.7)";
// // //     ctx.fillRect(x - 25, y - 35, w + 50, 45);

// // //     ctx.fillStyle = color;
// // //     ctx.fillText(text, x, y);

// // //     if (distanceRef.current === "too close") {
// // //       if (!tooCloseStart.current) tooCloseStart.current = Date.now();

// // //       if (Date.now() - tooCloseStart.current > 5000) {
// // //         ctx.fillStyle = "#EC4899";
// // //         ctx.fillText("Too Close", x, y - 50);
// // //       }
// // //     } else {
// // //       tooCloseStart.current = null;
// // //     }
// // //   };

// // //   /* MAIN PROCESS */
// // //   const onResults = useCallback((res) => {

// // //     const canvas = canvasRef.current;
// // //     const ctx = canvas.getContext("2d");

// // //     ctx.drawImage(res.image, 0, 0, canvas.width, canvas.height);
// // //     drawUI(ctx, canvas);

// // //     if (!res.multiFaceLandmarks?.length) return;

// // //     const lm = res.multiFaceLandmarks[0];
// // //     const w = res.image.width;
// // //     const h = res.image.height;

// // //     /* BLINK */
// // //     const ear = computeEAR(lm);
// // //     earHistory.current.push(ear);
// // //     if (earHistory.current.length > 5) earHistory.current.shift();

// // //     const avg = earHistory.current.reduce((a,b)=>a+b,0)/earHistory.current.length;

// // //     if (avg < BLINK_EAR_THRESHOLD && !eyeClosed.current) eyeClosed.current = true;

// // //     if (avg > BLINK_EAR_OPEN_THRESHOLD && eyeClosed.current) {
// // //       const now = Date.now();
// // //       if (now - lastBlink.current > BLINK_DEBOUNCE_MS) {
// // //         blinkTimes.current.push(now);
// // //         lastBlink.current = now;
// // //       }
// // //       eyeClosed.current = false;
// // //     }

// // //     /* DISTANCE */
// // //     const area = getFaceArea(lm, w, h);

// // //     if (!calibrated.current) {
// // //       referenceFace.current = area;
// // //       calibrated.current = true;
// // //     }

// // //     let state = "optimal";
// // //     const ratio = area / referenceFace.current;

// // //     if (ratio > 1.3) state = "too close";
// // //     else if (ratio < 0.7) state = "too far";

// // //     distanceRef.current = state;

// // //     if (Date.now() - throttle.current > DISTANCE_THROTTLE_MS) {
// // //       setDistance(state);
// // //       throttle.current = Date.now();
// // //     }

// // //     /* HEAD POSITION */
// // //     const nose = lm[1];
// // //     const yaw = (nose.x - 0.5) * 60;
// // //     const pitch = (nose.y - 0.5) * 40;

// // //     setHeadPosition({ yaw, pitch });

// // //     /* EXPRESSION */
// // //     setExpression("neutral");

// // //     /* REDNESS */
// // //     setRedness("normal");

// // //   }, []);

// // //   /* STRESS LOOP */
// // //   useEffect(() => {

// // //     const interval = setInterval(() => {

// // //       const now = Date.now();
// // //       blinkTimes.current = blinkTimes.current.filter(t => now - t < 60000);

// // //       const rate = blinkTimes.current.length;
// // //       setBlinkRate(rate);

// // //       let score = 100;

// // //       if (rate < 15) score -= 5;
// // //       if (rate < 10) score -= 10;
// // //       if (rate < 6) score -= 15;

// // //       if (distanceRef.current === "too close") score -= 12;

// // //       score = Math.max(20, Math.min(100, score));

// // //       smoothed.current =
// // //         smoothed.current * SMOOTHING_FACTOR +
// // //         score * (1 - SMOOTHING_FACTOR);

// // //       setStressScore(Math.round(smoothed.current));

// // //     }, STRESS_UPDATE_INTERVAL_MS);

// // //     return () => clearInterval(interval);

// // //   }, []);

// // //   /* INIT */
// // //   useEffect(() => {

// // //     const init = async () => {

// // //       const faceMesh = new window.FaceMesh({
// // //         locateFile: file =>
// // //           `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`
// // //       });

// // //       faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true });
// // //       faceMesh.onResults(onResults);

// // //       faceMeshRef.current = faceMesh;

// // //       const camera = new window.Camera(videoRef.current, {
// // //         onFrame: async () => {
// // //           if (Date.now() - lastFrame.current > 60) {
// // //             lastFrame.current = Date.now();
// // //             await faceMesh.send({ image: videoRef.current });
// // //           }
// // //         },
// // //         width: 640,
// // //         height: 480
// // //       });

// // //       await camera.start();
// // //       cameraRef.current = camera;

// // //     };

// // //     init();

// // //     return () => {
// // //       cameraRef.current?.stop();
// // //       faceMeshRef.current?.close();
// // //     };

// // //   }, [onResults]);

// // //   return (
// // //     <div className="w-full h-full">
// // //       <video ref={videoRef} autoPlay muted playsInline className="hidden" />
// // //       <canvas ref={canvasRef} width="640" height="480" className="w-full h-full rounded-xl" />
// // //     </div>
// // //   );
// // // });

// // // export default WebcamFeed;




// // import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from "react";

// // /* CONSTANTS */
// // const BLINK_EAR_THRESHOLD = 0.2;
// // const BLINK_EAR_OPEN_THRESHOLD = 0.25;
// // const BLINK_DEBOUNCE_MS = 120;
// // const STRESS_UPDATE_INTERVAL_MS = 1000;
// // const DISTANCE_THROTTLE_MS = 500;
// // const SMOOTHING_FACTOR = 0.75;

// // /* HELPERS */
// // const dist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

// // function computeEAR(lm) {
// //   const left = dist(lm[159], lm[145]) / dist(lm[33], lm[133]);
// //   const right = dist(lm[386], lm[374]) / dist(lm[263], lm[362]);
// //   return (left + right) / 2;
// // }

// // function getFaceArea(lm, w, h) {
// //   let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
// //   for (let p of lm) {
// //     const x = p.x * w;
// //     const y = p.y * h;
// //     minX = Math.min(minX, x);
// //     minY = Math.min(minY, y);
// //     maxX = Math.max(maxX, x);
// //     maxY = Math.max(maxY, y);
// //   }
// //   return (maxX - minX) * (maxY - minY);
// // }

// // const WebcamFeed = forwardRef((props, ref) => {

// //   const {
// //     setBlinkRate,
// //     setDistance,
// //     setRedness,
// //     setStressScore,
// //     setHeadPosition,
// //     setExpression
// //   } = props;

// //   const videoRef = useRef(null);
// //   const canvasRef = useRef(null);
// //   const pipVideoRef = useRef(null);

// //   const faceMeshRef = useRef(null);
// //   const cameraRef = useRef(null);

// //   const blinkTimes = useRef([]);
// //   const earHistory = useRef([]);
// //   const eyeClosed = useRef(false);
// //   const lastBlink = useRef(0);

// //   const referenceFace = useRef(null);
// //   const calibrated = useRef(false);
// //   const distanceRef = useRef("optimal");
// //   const throttle = useRef(0);

// //   const smoothed = useRef(100);
// //   const tooCloseStart = useRef(null);
// //   const lastFrame = useRef(0);

// //   /* PiP */
// //   const enablePiP = async () => {
// //     const canvas = canvasRef.current;
// //     const stream = canvas.captureStream(30);

// //     if (!pipVideoRef.current) {
// //       pipVideoRef.current = document.createElement("video");
// //       pipVideoRef.current.muted = true;
// //     }

// //     pipVideoRef.current.srcObject = stream;
// //     await pipVideoRef.current.play();

// //     if (document.pictureInPictureElement) {
// //       await document.exitPictureInPicture();
// //     } else {
// //       await pipVideoRef.current.requestPictureInPicture();
// //     }
// //   };

// //   useImperativeHandle(ref, () => ({ enablePiP }));

// //   /* DRAW */
// //   const drawUI = (ctx, canvas) => {
// //     const score = Math.round(smoothed.current);

// //     const text = `Stress: ${score}`;
// //     ctx.font = "bold 30px sans-serif";

// //     const w = ctx.measureText(text).width;
// //     const x = canvas.width / 2 - w / 2;
// //     const y = canvas.height - 20;

// //     let color = "#22C55E";
// //     if (score < 70) color = "#facc15";
// //     if (score < 40) color = "#ef4444";

// //     ctx.fillStyle = "rgba(0,0,0,0.7)";
// //     ctx.fillRect(x - 25, y - 35, w + 50, 45);

// //     ctx.fillStyle = color;
// //     ctx.fillText(text, x, y);

// //     if (distanceRef.current === "too close") {
// //       if (!tooCloseStart.current) tooCloseStart.current = Date.now();

// //       if (Date.now() - tooCloseStart.current > 5000) {
// //         ctx.fillStyle = "#EC4899";
// //         ctx.fillText("Too Close", x, y - 50);
// //       }
// //     } else {
// //       tooCloseStart.current = null;
// //     }
// //   };

// //   /* MAIN */
// //   const onResults = useCallback((res) => {

// //     const canvas = canvasRef.current;
// //     const ctx = canvas.getContext("2d", { willReadFrequently: true });

// //     /* 🔥 MIRROR FIX */
// //     ctx.save();
// //     ctx.scale(-1, 1);
// //     ctx.drawImage(res.image, -canvas.width, 0, canvas.width, canvas.height);
// //     ctx.restore();

// //     drawUI(ctx, canvas);

// //     if (!res.multiFaceLandmarks?.length) return;

// //     const lm = res.multiFaceLandmarks[0];
// //     const w = res.image.width;
// //     const h = res.image.height;

// //     /* BLINK */
// //     const ear = computeEAR(lm);
// //     earHistory.current.push(ear);
// //     if (earHistory.current.length > 5) earHistory.current.shift();

// //     const avg = earHistory.current.reduce((a,b)=>a+b,0)/earHistory.current.length;

// //     if (avg < BLINK_EAR_THRESHOLD && !eyeClosed.current) eyeClosed.current = true;

// //     if (avg > BLINK_EAR_OPEN_THRESHOLD && eyeClosed.current) {
// //       const now = Date.now();
// //       if (now - lastBlink.current > BLINK_DEBOUNCE_MS) {
// //         blinkTimes.current.push(now);
// //         lastBlink.current = now;
// //       }
// //       eyeClosed.current = false;
// //     }

// //     /* DISTANCE */
// //     const area = getFaceArea(lm, w, h);

// //     if (!calibrated.current) {
// //       referenceFace.current = area;
// //       calibrated.current = true;
// //     }

// //     let state = "optimal";
// //     const ratio = area / referenceFace.current;

// //     if (ratio > 1.3) state = "too close";
// //     else if (ratio < 0.7) state = "too far";

// //     distanceRef.current = state;

// //     if (Date.now() - throttle.current > DISTANCE_THROTTLE_MS) {
// //       setDistance(state);
// //       throttle.current = Date.now();
// //     }

// //     /* HEAD POSITION */
// //     const nose = lm[1];
// //     const yaw = (nose.x - 0.5) * 60;
// //     const pitch = (nose.y - 0.5) * 40;

// //     setHeadPosition({ yaw, pitch });

// //     setExpression("neutral");
// //     setRedness("normal");

// //   }, [setDistance, setHeadPosition, setExpression, setRedness]);

// //   /* STRESS */
// //   useEffect(() => {
// //     const interval = setInterval(() => {

// //       const now = Date.now();
// //       blinkTimes.current = blinkTimes.current.filter(t => now - t < 60000);

// //       const rate = blinkTimes.current.length;
// //       setBlinkRate(rate);

// //       let score = 100;

// //       if (rate < 15) score -= 5;
// //       if (rate < 10) score -= 10;
// //       if (rate < 6) score -= 15;

// //       if (distanceRef.current === "too close") score -= 12;

// //       score = Math.max(20, Math.min(100, score));

// //       smoothed.current =
// //         smoothed.current * SMOOTHING_FACTOR +
// //         score * (1 - SMOOTHING_FACTOR);

// //       setStressScore(Math.round(smoothed.current));

// //     }, STRESS_UPDATE_INTERVAL_MS);

// //     return () => clearInterval(interval);

// //   }, [setBlinkRate, setStressScore]);

// //   /* INIT */
// //   useEffect(() => {

// //     const init = async () => {

// //       const faceMesh = new window.FaceMesh({
// //         locateFile: file =>
// //           `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`
// //       });

// //       faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true });
// //       faceMesh.onResults(onResults);

// //       faceMeshRef.current = faceMesh;

// //       const camera = new window.Camera(videoRef.current, {
// //         onFrame: async () => {
// //           if (Date.now() - lastFrame.current > 60) {
// //             lastFrame.current = Date.now();
// //             await faceMesh.send({ image: videoRef.current });
// //           }
// //         },
// //         width: 640,
// //         height: 480
// //       });

// //       await camera.start();
// //       cameraRef.current = camera;
// //     };

// //     init();

// //     return () => {
// //       cameraRef.current?.stop();
// //       faceMeshRef.current?.close();
// //     };

// //   }, [onResults]);

// //   return (
// //     <div className="w-full h-full">
// //       <video ref={videoRef} autoPlay muted playsInline className="hidden" />
// //       <canvas ref={canvasRef} width="640" height="480" className="w-full h-full rounded-xl" />
// //     </div>
// //   );
// // });

// // export default WebcamFeed;



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

import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from "react";

/* CONSTANTS */
const BLINK_EAR_THRESHOLD = 0.2;
const BLINK_EAR_OPEN_THRESHOLD = 0.25;
const BLINK_DEBOUNCE_MS = 120;
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

  const referenceFace = useRef(null);
  const calibrated = useRef(false);
  
  // Tracking Refs to prevent unnecessary re-renders
  const distanceRef = useRef("unknown");
  const headStateRef = useRef({ yaw: 0, pitch: 0, aligned: true });
  const expressionRef = useRef("neutral");
  
  const throttle = useRef(0);
  const lastFaceTime = useRef(0);
  const sessionStart = useRef(Date.now());

  const smoothed = useRef(100);
  const tooCloseStart = useRef(null);
  const lastFrame = useRef(0);

  /* ---------------- PiP ---------------- */
  const enablePiP = async () => {
    const canvas = canvasRef.current;
    const stream = canvas.captureStream(30);

    if (!pipVideoRef.current) {
      pipVideoRef.current = document.createElement("video");
      pipVideoRef.current.muted = true;
    }

    pipVideoRef.current.srcObject = stream;
    await pipVideoRef.current.play();

    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else {
      await pipVideoRef.current.requestPictureInPicture();
    }
  };

  useImperativeHandle(ref, () => ({ enablePiP }));

  /* ---------------- DRAW UI ---------------- */
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

  /* ---------------- MAIN ---------------- */
  const onResults = useCallback((res) => {

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(res.image, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    drawUI(ctx, canvas);

    if (!res.multiFaceLandmarks?.length) return;

    // Face detected
    lastFaceTime.current = Date.now();
    const lm = res.multiFaceLandmarks[0];
    const w = res.image.width;
    const h = res.image.height;

    /* BLINK */
    const ear = computeEAR(lm);
    earHistory.current.push(ear);
    if (earHistory.current.length > 5) earHistory.current.shift();

    const avg = earHistory.current.reduce((a,b)=>a+b,0)/earHistory.current.length;

    if (avg < BLINK_EAR_THRESHOLD && !eyeClosed.current) eyeClosed.current = true;

    if (avg > BLINK_EAR_OPEN_THRESHOLD && eyeClosed.current) {
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

    let distState = "optimal";
    const ratio = area / referenceFace.current;

    if (ratio > 1.3) distState = "too close";
    else if (ratio < 0.7) distState = "too far";
    distanceRef.current = distState;

    /* HEAD POSITION */
    const nose = lm[1];
    const yaw = (nose.x - 0.5) * 60;
    const pitch = (nose.y - 0.5) * 40;
    const aligned = Math.abs(yaw) < 15 && Math.abs(pitch) < 15;
    headStateRef.current = { yaw, pitch, aligned };

    /* EXPRESSION DETECTOR */
    const mar = computeMAR(lm);
    const smileRatio = dist(lm[78], lm[308]) / dist(lm[234], lm[454]);
    const sleepyEyes = avg < 0.23 && avg > 0.15; 
    
    let exprState = "neutral";
    if (mar > 0.5) exprState = "yawning";
    else if (smileRatio > 0.40 && mar < 0.2) exprState = "smiling";
    else if (sleepyEyes) exprState = "sleepy";
    else if (aligned) exprState = "focused";

    expressionRef.current = exprState;

    /* THROTTLED STATE UPDATES (To keep React Fast) */
    if (Date.now() - throttle.current > STATE_THROTTLE_MS) {
      setDistance(distState);
      setHeadPosition({ yaw, pitch });
      setExpression(exprState);
      setRedness("normal"); // Required to keep UI intact, redness logic removed completely
      throttle.current = Date.now();
    }

  }, [setDistance, setHeadPosition, setExpression, setRedness]);

  /* ---------------- IMPROVED STRESS SCORING ENGINE ---------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const faceVisible = (now - lastFaceTime.current) < FACE_TIMEOUT_MS;

      // 🛑 RULE: NO FACE -> INSTANT RESET
      if (!faceVisible) {
        setBlinkRate(0);
        setDistance("unknown");
        setStressScore(0);
        smoothed.current = 0; // Hard reset smoothing
        return; 
      }

      /* BLINK OPTIMIZATION & RESPONSIVE SAMPLING */
      blinkTimes.current = blinkTimes.current.filter(t => now - t < 60000);
      
      const sessionLength = Math.max(1, (now - sessionStart.current) / 1000);
      let calculatedRate = blinkTimes.current.length;
      
      // If we haven't reached 60s yet, extrapolate to make it responsive
      if (sessionLength < 60) {
        calculatedRate = Math.round(calculatedRate * (60 / sessionLength));
      }
      setBlinkRate(calculatedRate);

      /* BASE SCORE START */
      let score = 100;

      // 👁️ Blink Contribution
      if (calculatedRate >= 15 && calculatedRate <= 20) score += 5;
      else if (calculatedRate < 10) score -= 20; // Strong penalty
      else if (calculatedRate > 25) score -= 10; // Mild penalty

      // 📏 Distance Contribution
      if (distanceRef.current === "too close") score -= 20;
      else if (distanceRef.current === "too far") score -= 10;
      else if (distanceRef.current === "unknown") score -= 5;

      // 🧍 Head Position Contribution
      if (headStateRef.current.aligned) score += 5;
      else score -= 15;

      // 😴 Facial Expression Contribution
      const expr = expressionRef.current;
      if (expr === "focused" || expr === "smiling") score += 10;
      else if (expr === "sleepy") score -= 25;
      else if (expr === "yawning") score -= 40;

      // ⏱️ Screen Time Impact
      if (screenTime > 60) {
        const extraPenalty = Math.floor(screenTime - 60) * 1;
        score -= extraPenalty;
      }

      // 🧮 Clamp & Smooth
      score = Math.max(0, Math.min(100, score)); // Strict clamp 0 to 100

      smoothed.current = 
        smoothed.current * SMOOTHING_FACTOR + 
        score * (1 - SMOOTHING_FACTOR);

      setStressScore(Math.round(smoothed.current));

    }, STRESS_UPDATE_INTERVAL_MS);

    return () => clearInterval(interval);

  }, [screenTime, setBlinkRate, setDistance, setStressScore]);

  /* ---------------- INIT ---------------- */
  useEffect(() => {

    const init = async () => {

      const faceMesh = new window.FaceMesh({
        locateFile: file =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });

      faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true });
      faceMesh.onResults(onResults);

      faceMeshRef.current = faceMesh;

      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (Date.now() - lastFrame.current > 50) { // Keep ~20 FPS efficiency
            lastFrame.current = Date.now();
            await faceMesh.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480
      });

      await camera.start();
      cameraRef.current = camera;
    };

    init();

    return () => {
      cameraRef.current?.stop();
      faceMeshRef.current?.close();
    };

  }, [onResults]);

  return (
    <div className="w-full h-full">
      <video ref={videoRef} autoPlay muted playsInline className="hidden" />
      <canvas ref={canvasRef} width="640" height="480" className="w-full h-full rounded-xl shadow-xl" />
    </div>
  );
});

export default WebcamFeed;