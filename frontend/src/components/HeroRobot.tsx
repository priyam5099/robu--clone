export default function HeroRobot() {
  return (
    <div className="flex flex-col items-center drop-shadow-xl hero-hover">
      {/* 1. Pure CSS Animations injected directly into the component */}
      <style>{`
        @keyframes heroHover {
          0% { transform: translateY(-12px); }
          100% { transform: translateY(12px); }
        }
        .hero-hover { animation: heroHover 2.5s ease-in-out infinite alternate; }

        @keyframes heroBlink {
          0%, 96% { transform: scaleY(1); }
          98% { transform: scaleY(0); }
          100% { transform: scaleY(1); }
        }
        .hero-blink { animation: heroBlink 3.5s infinite; transform-origin: center; }

        @keyframes heroTilt {
          0% { transform: rotate(-3deg); }
          100% { transform: rotate(3deg); }
        }
        .hero-tilt { animation: heroTilt 2s ease-in-out infinite alternate; transform-origin: bottom center; }

        @keyframes heroAntenna {
          0% { transform: translateX(-1.5px); }
          100% { transform: translateX(1.5px); }
        }
        .hero-antenna { animation: heroAntenna 0.4s ease-in-out infinite alternate; }
      `}</style>

      {/* 2. The Robot Body (with animation classes attached) */}
      <div className="hero-antenna w-3 h-3 bg-white rounded-full -mb-[2px]"></div>
      <div className="hero-antenna w-1 h-5 bg-slate-200 text-transparent overflow-hidden">|</div>
      
      <div className="hero-tilt w-20 h-[60px] bg-white border-4 border-slate-900 rounded-[30px] flex justify-evenly items-center shadow-md z-10">
        <div className="hero-blink w-3.5 h-5 bg-slate-900 rounded-full"></div>
        <div className="hero-blink w-3.5 h-5 bg-slate-900 rounded-full"></div>
      </div>
      
      <div className="w-5 h-2.5 bg-slate-400 border-l-4 border-r-4 border-slate-900"></div>
      
      <div className="w-[100px] h-20 bg-[#c8102e] border-4 border-slate-900 rounded-[20px] z-[5]" style={{ boxShadow: 'inset -5px -5px 0px rgba(0,0,0,0.3)' }}></div>
      
      <div className="w-[60px] h-5 bg-slate-900 rounded-lg -mt-2.5 z-0"></div>
    </div>
  );
}