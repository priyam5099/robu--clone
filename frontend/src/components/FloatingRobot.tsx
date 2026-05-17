"use client";

import { useEffect, useState, useRef } from 'react';

export default function FloatingRobot() {
  const [position, setPosition] = useState({ x: 0, y: 0, tilt: 0 });
  const [mounted, setMounted] = useState(false);
  const currentX = useRef(0); // Tracks position silently to prevent re-renders

  // 1. Clean Hydration Fix (Silences the React warning)
  // 1. Clean Hydration Fix (Silences the React warning)
  useEffect(() => {
    // Pushing this to the next tick makes the strict linter happy!
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);
  // 2. The Roaming Logic
  useEffect(() => {
    if (!mounted) return;
    let isMounted = true;

    const roam = () => {
      if (!isMounted) return;
      
      // Calculate a random point anywhere on the screen
      const randomX = Math.floor(Math.random() * (window.innerWidth * 0.8)) - (window.innerWidth * 0.4);
      const randomY = Math.floor(Math.random() * (window.innerHeight * 0.8)) - (window.innerHeight * 0.4);

      // Tilt the robot in the direction it flies
      const newTilt = randomX > currentX.current ? 15 : -15;
      currentX.current = randomX; // Update the silent tracker

      // Trigger the CSS movement
      setPosition({ x: randomX, y: randomY, tilt: newTilt });

      // Stand up straight after the 3-second flight finishes
      setTimeout(() => {
        if (isMounted) setPosition(prev => ({ ...prev, tilt: 0 }));
      }, 3000);
    };

    // Wait 1 second before first flight
    const initialDelay = setTimeout(roam, 1000);
    
    // Fly to a new spot every 4.5 seconds
    const flightInterval = setInterval(roam, 4500);

    return () => {
      isMounted = false;
      clearTimeout(initialDelay);
      clearInterval(flightInterval);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[999] overflow-hidden">
      
      <style>{`
        @keyframes floatBob {
          0% { transform: translateY(-8px); }
          100% { transform: translateY(8px); }
        }
        .float-bob { animation: floatBob 2s ease-in-out infinite alternate; }

        @keyframes floatBlink {
          0%, 96% { transform: scaleY(1); }
          98% { transform: scaleY(0); }
          100% { transform: scaleY(1); }
        }
        .float-blink { animation: floatBlink 3.5s infinite; transform-origin: center; }

        @keyframes floatAntenna {
          0% { transform: translateX(-2px); }
          100% { transform: translateX(2px); }
        }
        .float-antenna { animation: floatAntenna 0.4s ease-in-out infinite alternate; }
      `}</style>

      <div
        className="absolute top-1/2 left-1/2 flex flex-col items-center drop-shadow-2xl float-bob"
        style={{
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) rotate(${position.tilt}deg)`,
          transition: 'transform 3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div className="float-antenna w-3 h-3 bg-[#c8102e] rounded-full -mb-[2px]"></div>
        <div className="float-antenna w-1 h-5 bg-slate-300"></div>

        <div className="w-20 h-[60px] bg-white border-4 border-slate-900 rounded-[30px] flex justify-evenly items-center shadow-md z-10">
          <div className="float-blink w-3.5 h-5 bg-slate-900 rounded-full"></div>
          <div className="float-blink w-3.5 h-5 bg-slate-900 rounded-full"></div>
        </div>

        <div className="w-5 h-2.5 bg-slate-400 border-l-4 border-r-4 border-slate-900"></div>

        <div className="w-[100px] h-20 bg-[#c8102e] border-4 border-slate-900 rounded-[20px] z-[5]" style={{ boxShadow: 'inset -5px -5px 0px rgba(0,0,0,0.3)' }}></div>

        <div className="w-[60px] h-5 bg-slate-900 rounded-lg -mt-2.5 z-0"></div>
      </div>
    </div>
  );
}