
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
    screenTime,
    setIsFaceVisible 
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

  if (!res.multiFaceLandmarks?.length) {
    setIsFaceVisible(false);
    return;
  }
  const lm = res.multiFaceLandmarks[0];
setIsFaceVisible(true);
lastFaceTime.current = Date.now();
const w = canvas.width;
const h = canvas.height;
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
        setIsFaceVisible(false);
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