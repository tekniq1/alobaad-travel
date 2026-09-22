import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const SplitLogo = ({ isSplit }: { isSplit: boolean }) => {
  return (
    <div className="relative z-30 w-full max-w-[260px] sm:max-w-[340px]">
      {/* Invisible placeholder for structural dimensions */}
      <img 
        src="/logo-high-res.png" 
        alt="" 
        className="w-full h-auto object-contain opacity-0 pointer-events-none" 
      />
      
      {/* Left Half */}
      <motion.div
        className="absolute inset-0 origin-right"
        style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }}
        initial={{ x: 0, scale: 1, opacity: 1 }}
        animate={isSplit ? { x: -180, scale: 1.6, opacity: 0 } : { x: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
      >
        <img 
          src="/logo-high-res.png" 
          alt="Al-Abbad Logo Left" 
          className="w-full h-full object-contain drop-shadow-2xl" 
        />
      </motion.div>

      {/* Right Half */}
      <motion.div
        className="absolute inset-0 origin-left"
        style={{ clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)" }}
        initial={{ x: 0, scale: 1, opacity: 1 }}
        animate={isSplit ? { x: 180, scale: 1.6, opacity: 0 } : { x: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
      >
        <img 
          src="/logo-high-res.png" 
          alt="Al-Abbad Logo Right" 
          className="w-full h-full object-contain drop-shadow-2xl" 
        />
      </motion.div>
    </div>
  );
};

export function IntroSplash({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0); 

  useEffect(() => {
    // 0.5s: Start Plane animation
    const t1 = setTimeout(() => setStage(1), 500);
    return () => clearTimeout(t1);
  }, []);

  const handleImpact = () => {
    // Exactly when plane hits center, split the logo!
    setStage(2);
    
    // After split finishes (1.2s), fade out screen
    setTimeout(() => setStage(3), 1200);
    
    // Complete completely
    setTimeout(() => onComplete(), 1800);
  };

  return (
    <motion.div
      initial={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
      animate={{ backgroundColor: stage >= 3 ? "rgba(255, 255, 255, 0)" : "rgba(255, 255, 255, 1)" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden ${stage >= 3 ? 'pointer-events-none' : 'pointer-events-auto'}`}
    >
      {/* The Dynamic Airplane */}
      <motion.div
        className="absolute z-40 pointer-events-none flex items-center justify-center"
        initial={{ x: "-60vw", y: "60vh", rotate: 45, opacity: 0, scale: 0.5 }}
        animate={
          stage === 1
            ? { x: "-2vw", y: "2vh", rotate: 35, opacity: 1, scale: 1.2 } // Swoop to center!
            : stage >= 2
            ? { x: "40vw", y: "-40vh", rotate: 25, opacity: 0, scale: 0.8 } // Fly through the split!
            : {}
        }
        transition={{
          duration: stage === 1 ? 1.2 : 0.8,
          ease: stage === 1 ? "easeIn" : "easeOut",
        }}
        onAnimationComplete={() => {
          if (stage === 1) handleImpact();
        }}
      >
        <img 
          src="/airplane.png" 
          alt="Flight" 
          className="w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-xl" 
        />
      </motion.div>

      {/* Impact Flash */}
      <AnimatePresence>
        {stage === 2 && (
          <motion.div
            className="absolute z-50 rounded-full bg-[#159DD3] mix-blend-screen"
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 600, height: 600, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Center Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-30"
      >
        <SplitLogo isSplit={stage >= 2} />
      </motion.div>
    </motion.div>
  );
}
