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
