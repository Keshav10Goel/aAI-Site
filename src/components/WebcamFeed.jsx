
// import { useEffect, useRef } from "react";
// import { saveSession } from "../utils/storage";

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

//   const rednessHistory = useRef([]);
//   const lastRednessCheck = useRef(0);

//   const sessionStart = useRef(Date.now());
//   const breakCount = useRef(0);

//   const expressionRef = useRef("focused");

//   /* ---------- REDNESS DETECTION ---------- */

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

//       const canvasCtx = canvasRef.current.getContext("2d", {
//         willReadFrequently: true
//       });

//       canvasCtx.clearRect(
//         0,
//         0,
//         canvasRef.current.width,
//         canvasRef.current.height
//       );

//       /* SHOW WEBCAM FRAME */

//       canvasCtx.drawImage(
//         results.image,
//         0,
//         0,
//         canvasRef.current.width,
//         canvasRef.current.height
//       );

//       if (!results.multiFaceLandmarks?.length) return;

//       const landmarks = results.multiFaceLandmarks[0];


//       /* ---------- BLINK DETECTION ---------- */

//       const top = landmarks[159];
//       const bottom = landmarks[145];

//       const eyeDistance = Math.abs(top.y - bottom.y);

//       if (eyeDistance < 0.02 && !eyeClosed.current)
//         eyeClosed.current = true;

//       if (eyeDistance > 0.035 && eyeClosed.current) {

//         blinkTimes.current.push(Date.now());
//         eyeClosed.current = false;

//       }


//       /* ---------- SCREEN DISTANCE ---------- */

//       const nose = landmarks[1];

//       if (nose) {

//         const z = nose.z;

//         if (z < -0.10) setDistance("too close");
//         else if (z > -0.07) setDistance("too far");
//         else setDistance("optimal");

//       }


//       /* ---------- HEAD TILT ---------- */

//       const leftEye = landmarks[33];
//       const rightEye = landmarks[263];

//       const tilt =
//         (rightEye.y - leftEye.y) /
//         (rightEye.x - leftEye.x);

//       if (Math.abs(tilt) > 0.1)
//         setHeadPosition("tilted");
//       else
//         setHeadPosition("aligned");


//       /* ---------- FACIAL EXPRESSION ---------- */

//       const mouthTop = landmarks[13];
//       const mouthBottom = landmarks[14];

//       const mouthLeft = landmarks[61];
//       const mouthRight = landmarks[291];

//       const leftEyeTop = landmarks[159];
//       const leftEyeBottom = landmarks[145];

//       const browLeft = landmarks[65];
//       const browRight = landmarks[295];

//       const mouthOpen = Math.abs(mouthTop.y - mouthBottom.y);
//       const mouthWidth = Math.abs(mouthLeft.x - mouthRight.x);
//       const eyeOpen = Math.abs(leftEyeTop.y - leftEyeBottom.y);
//       const browHeight = Math.abs(browLeft.y - browRight.y);

//       let expression = "focused";

//       if (mouthOpen > 0.04)
//         expression = "talking";

//       else if (mouthWidth > 0.07)
//         expression = "smiling";

//       else if (eyeOpen < 0.015)
//         expression = "drowsy";

//       else if (browHeight > 0.06)
//         expression = "surprised";

//       else
//         expression = "focused";

//       expressionRef.current = expression;

//       setExpression(expression);


//       /* ---------- REDNESS ---------- */

//       const now = Date.now();

//       if (now - lastRednessCheck.current > 800) {

//         const lEye = landmarks[33];
//         const rEye = landmarks[263];

//         const lx = lEye.x * canvasRef.current.width;
//         const ly = lEye.y * canvasRef.current.height;

//         const rx = rEye.x * canvasRef.current.width;
//         const ry = rEye.y * canvasRef.current.height;

//         const leftRegion =
//           canvasCtx.getImageData(lx - 15, ly - 15, 30, 30);

//         const rightRegion =
//           canvasCtx.getImageData(rx - 15, ry - 15, 30, 30);

//         const rednessLeft = detectRedness(leftRegion);
//         const rednessRight = detectRedness(rightRegion);

//         const redness = (rednessLeft + rednessRight) / 2;

//         rednessHistory.current.push(redness);

//         if (rednessHistory.current.length > 15)
//           rednessHistory.current.shift();

//         const smooth =
//           rednessHistory.current.reduce((a, b) => a + b) /
//           rednessHistory.current.length;

//         if (smooth > 0.45) setRedness("high");
//         else if (smooth > 0.30) setRedness("moderate");
//         else setRedness("normal");

//         lastRednessCheck.current = now;

//       }

//     });


//     faceMeshRef.current = faceMesh;


//     /* ---------- CAMERA ---------- */

//     const camera = new window.Camera(videoRef.current, {

//       onFrame: async () => {

//         try {
//           await faceMeshRef.current.send({
//             image: videoRef.current
//           });
//         } catch (err) {
//           console.log("Frame error:", err);
//         }

//       },

//       width: 640,
//       height: 480

//     });

//     camera.start();

//     cameraRef.current = camera;


//     /* ---------- BLINK RATE + STRESS SCORE ---------- */

//     const interval = setInterval(() => {

//       const now = Date.now();

//       blinkTimes.current =
//         blinkTimes.current.filter(
//           (t) => now - t < 60000
//         );

//       const rate = blinkTimes.current.length;

//       setBlinkRate(rate);

//       let score = 100;

//       /* blink penalty */

//       if (rate < 15) score -= 15;
//       if (rate < 10) score -= 25;
//       if (rate < 5) score -= 35;

//       /* redness penalty */

//       const redness =
//         rednessHistory.current.length
//           ? rednessHistory.current.reduce((a, b) => a + b) /
//             rednessHistory.current.length
//           : 0;

//       if (redness > 0.30) score -= 10;
//       if (redness > 0.45) score -= 20;

//       /* expression penalty */

//       if (expressionRef.current === "drowsy")
//         score -= 15;

//       if (expressionRef.current === "surprised")
//         score -= 5;

//       setStressScore(Math.max(score, 0));

//     }, 1000);


//     /* ---------- SAVE SESSION ---------- */

//     const saveInterval = setInterval(() => {

//       const screenMinutes =
//         Math.floor(
//           (Date.now() - sessionStart.current) / 60000
//         );

//       saveSession({
//         blink: blinkTimes.current.length,
//         screen: screenMinutes,
//         breaks: breakCount.current
//       });

//     }, 300000);


//     return () => {

//       clearInterval(interval);
//       clearInterval(saveInterval);

//       if (cameraRef.current)
//         cameraRef.current.stop();

//       if (faceMeshRef.current)
//         faceMeshRef.current.close();

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
import { saveSession } from "../utils/storage";

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

  const rednessHistory = useRef([]);
  const lastRednessCheck = useRef(0);

  const sessionStart = useRef(Date.now());
  const breakCount = useRef(0);

  const expressionRef = useRef("focused");

  /* ---------- REDNESS DETECTION ---------- */

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

      const canvasCtx = canvasRef.current.getContext("2d", {
        willReadFrequently: true
      });

      canvasCtx.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      /* SHOW WEBCAM FRAME */

      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      if (!results.multiFaceLandmarks?.length) return;

      const landmarks = results.multiFaceLandmarks[0];


      /* ---------- BLINK DETECTION ---------- */

      const top = landmarks[159];
      const bottom = landmarks[145];

      const eyeDistance = Math.abs(top.y - bottom.y);

      if (eyeDistance < 0.02 && !eyeClosed.current)
        eyeClosed.current = true;

      if (eyeDistance > 0.035 && eyeClosed.current) {

        blinkTimes.current.push(Date.now());
        eyeClosed.current = false;

      }


      /* ---------- SCREEN DISTANCE ---------- */

      const nose = landmarks[1];

      if (nose) {

        const z = nose.z;

        if (z < -0.10) setDistance("too close");
        else if (z > -0.07) setDistance("too far");
        else setDistance("optimal");

      }


      /* ---------- HEAD TILT ---------- */

      const leftEye = landmarks[33];
      const rightEye = landmarks[263];

      const tilt =
        (rightEye.y - leftEye.y) /
        (rightEye.x - leftEye.x);

      if (Math.abs(tilt) > 0.1)
        setHeadPosition("tilted");
      else
        setHeadPosition("aligned");


      /* ---------- FACIAL EXPRESSION ---------- */

      const mouthTop = landmarks[13];
      const mouthBottom = landmarks[14];

      const mouthLeft = landmarks[61];
      const mouthRight = landmarks[291];

      const leftEyeTop = landmarks[159];
      const leftEyeBottom = landmarks[145];

      const browLeft = landmarks[65];
      const browRight = landmarks[295];

      const mouthOpen = Math.abs(mouthTop.y - mouthBottom.y);
      const mouthWidth = Math.abs(mouthLeft.x - mouthRight.x);
      const eyeOpen = Math.abs(leftEyeTop.y - leftEyeBottom.y);
      const browHeight = Math.abs(browLeft.y - browRight.y);

      let expression = "focused";

      if (mouthOpen > 0.04)
        expression = "talking";

      else if (mouthWidth > 0.07)
        expression = "smiling";

      else if (eyeOpen < 0.015)
        expression = "drowsy";

      else if (browHeight > 0.06)
        expression = "surprised";

      else
        expression = "focused";

      expressionRef.current = expression;

      setExpression(expression);


      /* ---------- REDNESS ---------- */

      const now = Date.now();

      if (now - lastRednessCheck.current > 800) {

        const lEye = landmarks[33];
        const rEye = landmarks[263];

        const lx = lEye.x * canvasRef.current.width;
        const ly = lEye.y * canvasRef.current.height;

        const rx = rEye.x * canvasRef.current.width;
        const ry = rEye.y * canvasRef.current.height;

        const leftRegion =
          canvasCtx.getImageData(lx - 15, ly - 15, 30, 30);

        const rightRegion =
          canvasCtx.getImageData(rx - 15, ry - 15, 30, 30);

        const rednessLeft = detectRedness(leftRegion);
        const rednessRight = detectRedness(rightRegion);

        const redness = (rednessLeft + rednessRight) / 2;

        rednessHistory.current.push(redness);

        if (rednessHistory.current.length > 15)
          rednessHistory.current.shift();

        const smooth =
          rednessHistory.current.reduce((a, b) => a + b) /
          rednessHistory.current.length;

        if (smooth > 0.45) setRedness("high");
        else if (smooth > 0.30) setRedness("moderate");
        else setRedness("normal");

        lastRednessCheck.current = now;

      }

    });


    faceMeshRef.current = faceMesh;


    /* ---------- CAMERA ---------- */

    const camera = new window.Camera(videoRef.current, {

      onFrame: async () => {

        try {
          await faceMeshRef.current.send({
            image: videoRef.current
          });
        } catch (err) {
          console.log("Frame error:", err);
        }

      },

      width: 640,
      height: 480

    });

    camera.start();

    cameraRef.current = camera;


    /* ---------- BLINK RATE + STRESS SCORE ---------- */

    const interval = setInterval(() => {

      const now = Date.now();

      blinkTimes.current =
        blinkTimes.current.filter(
          (t) => now - t < 60000
        );

      const rate = blinkTimes.current.length;

      setBlinkRate(rate);

      let score = 100;

      /* blink penalty */

      if (rate < 15) score -= 15;
      if (rate < 10) score -= 25;
      if (rate < 5) score -= 35;

      /* redness penalty */

      const redness =
        rednessHistory.current.length
          ? rednessHistory.current.reduce((a, b) => a + b) /
            rednessHistory.current.length
          : 0;

      if (redness > 0.30) score -= 10;
      if (redness > 0.45) score -= 20;

      /* expression penalty */

      if (expressionRef.current === "drowsy")
        score -= 15;

      if (expressionRef.current === "surprised")
        score -= 5;

      setStressScore(Math.max(score, 0));

    }, 1000);


    /* ---------- SAVE SESSION ---------- */

    const saveInterval = setInterval(() => {

      const screenMinutes =
        Math.floor(
          (Date.now() - sessionStart.current) / 60000
        );

      saveSession({
        blink: blinkTimes.current.length,
        screen: screenMinutes,
        breaks: breakCount.current
      });

    }, 300000);


    return () => {

      clearInterval(interval);
      clearInterval(saveInterval);

      if (cameraRef.current)
        cameraRef.current.stop();

      if (faceMeshRef.current)
        faceMeshRef.current.close();

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
