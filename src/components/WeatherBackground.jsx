import React, { useEffect, useRef } from "react";

const WeatherBackground = ({ theme, isEffectsEnabled = true }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isEffectsEnabled || !canvasRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvasRef.current) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const type = theme?.type || "clear-day";
    const particles = [];
    const count =
      type === "rain" || type === "thunderstorm"
        ? 80
        : type === "snow"
        ? 60
        : type === "clear-night" || type === "clouds-night"
        ? 70
        : 25; // ambient floating dust/light particles for clear-day

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speedX:
          type === "rain" || type === "thunderstorm"
            ? -1 + Math.random() * 0.5
            : type === "snow"
            ? (Math.random() - 0.5) * 1.2
            : (Math.random() - 0.5) * 0.4,
        speedY:
          type === "rain" || type === "thunderstorm"
            ? 7 + Math.random() * 8
            : type === "snow"
            ? 1 + Math.random() * 2
            : type === "clear-night" || type === "clouds-night"
            ? 0
            : (Math.random() - 0.5) * 0.3,
        size:
          type === "rain" || type === "thunderstorm"
            ? 1.5 + Math.random() * 1.5
            : type === "snow"
            ? 2 + Math.random() * 3
            : type === "clear-night"
            ? 0.8 + Math.random() * 1.8
            : 1.5 + Math.random() * 2,
        length: type === "rain" || type === "thunderstorm" ? 12 + Math.random() * 16 : 0,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: 0.01 + Math.random() * 0.03,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        if (type === "rain" || type === "thunderstorm") {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(186, 230, 253, ${p.opacity * 0.6})`;
          ctx.lineWidth = p.size;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 2, p.y + p.length);
          ctx.stroke();

          p.y += p.speedY;
          p.x += p.speedX;
          if (p.y > height) {
            p.y = -p.length;
            p.x = Math.random() * width;
          }
        } else if (type === "snow") {
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.8})`;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.y += p.speedY;
          p.x += p.speedX;
          if (p.y > height) {
            p.y = -5;
            p.x = Math.random() * width;
          }
          if (p.x > width) p.x = 0;
          if (p.x < 0) p.x = width;
        } else if (type === "clear-night" || type === "clouds-night") {
          // Twinkling stars
          p.opacity += Math.sin(Date.now() * p.twinkleSpeed) * 0.01;
          const clampedOpacity = Math.max(0.1, Math.min(1, p.opacity));
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${clampedOpacity * 0.85})`;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Subtle warm sun-dappled or ambient particles
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.25})`;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.speedX;
          p.y += p.speedY;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, isEffectsEnabled]);

  const gradientClass = theme?.gradient || "from-slate-900 via-blue-950 to-indigo-950";

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-colors duration-1000 ease-in-out">
      {/* Dynamic Base Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} transition-all duration-1000`} />

      {/* Atmospheric Ambient Glowing Orbs */}
      <div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-35 animate-pulse-slow"
        style={{ backgroundColor: theme?.glow || "rgba(56, 189, 248, 0.4)" }}
      />
      <div
        className="absolute top-1/3 -right-32 w-80 h-80 rounded-full blur-3xl opacity-25 animate-pulse-slow"
        style={{
          backgroundColor: theme?.glow || "rgba(129, 140, 248, 0.4)",
          animationDelay: "2s",
        }}
      />
      <div
        className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse-slow"
        style={{
          backgroundColor: theme?.glow || "rgba(99, 102, 241, 0.3)",
          animationDelay: "3s",
        }}
      />

      {/* Particle Canvas */}
      {isEffectsEnabled && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70" />
      )}
    </div>
  );
};

export default WeatherBackground;
