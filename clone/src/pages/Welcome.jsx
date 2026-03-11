import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import siteData from "../data/site-data.json";

const { welcome } = siteData.pages;
const studentName = siteData.students[0]?.name || "Student";
const heading = welcome.heading.replace("{studentName}", studentName);

export default function Welcome() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    // Draw a simple waveform placeholder
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const y = h / 2 + Math.sin(x * 0.05) * (h * 0.25) * Math.sin(x * 0.01);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, []);

  return (
    <div className="bg-starfield min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md border-y-[2px] border-white/20 bg-black/40 backdrop-blur-sm py-12 px-8 flex flex-col items-center text-center">
        <h1 className="text-4xl font-semibold text-white mb-3">{heading}</h1>
        <p className="text-slate-400 mb-8">{welcome.subtext}</p>

        {/* Audio waveform canvas */}
        <canvas
          ref={canvasRef}
          width={320}
          height={80}
          className="w-full max-w-xs h-20 mb-8 rounded-lg opacity-60"
        />

        <Link
          to="/students"
          className="w-full block rounded-lg border-4 border-white bg-transparent text-white hover:bg-white/10 px-4 py-3 font-semibold text-center no-underline transition-colors text-lg"
        >
          {welcome.ctaText}
        </Link>
      </div>
    </div>
  );
}
