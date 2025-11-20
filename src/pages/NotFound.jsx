import React, { useState, useEffect } from "react";
import { Search, Home, BookOpen, ArrowRight } from "lucide-react";

const NotFound = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const floatingElements = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    duration: `${15 + Math.random() * 10}s`,
    size: `${20 + Math.random() * 40}px`,
  }));

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements.map((el) => (
          <div
            key={el.id}
            className="absolute rounded-full bg-gradient-to-br from-blue-200/30 to-cyan-300/20 blur-xl animate-float"
            style={{
              left: el.left,
              top: "-10%",
              width: el.size,
              height: el.size,
              animationDelay: el.animationDelay,
              animationDuration: el.duration,
            }}
          />
        ))}
      </div>

      {/* Parallax effect overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 50%)`,
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* 404 Number with glassmorphism */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 blur-3xl opacity-50 animate-pulse" />
          <h1
            className="relative text-[180px] md:text-[280px] font-black leading-none bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent select-none animate-float"
            style={{ animationDuration: "3s" }}
          >
            404
          </h1>
        </div>

        {/* Glass card */}
        <div className="relative backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12 max-w-2xl w-full transform hover:scale-105 transition-all duration-500">
          {/* Shimmer effect */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
          </div>

          <div className="relative z-10">
            {/* Icon with animation */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-50 animate-ping" />
                <div className="relative bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full p-6 animate-bounce">
                  <Search className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>

            {/* Text content */}
            <h2 className="text-4xl md:text-5xl font-bold text-center pb-4 mb-8 bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
              Oops! Page Not Found
            </h2>
            <p className="text-lg md:text-xl text-blue-600/80 text-center mb-8 leading-relaxed">
              The page you're looking for seems to have vanished into thin air.
              Let's get you back on track with your English learning journey!
            </p>
          </div>
        </div>

        {/* Footer text */}
        <p className="mt-8 text-blue-500/60 text-sm">
          Lost in translation? We'll help you find your way! 🚀
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-100vh) rotate(180deg);
          }
        }

        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
