import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plane } from "lucide-react";

export function IntroSplash({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 1: Plane enters and moves (0.3s)
    const t1 = setTimeout(() => setStage(1), 300);
    // Stage 2: Trail expands and transforms (1.2s)
    const t2 = setTimeout(() => setStage(2), 1200);
    // Stage 3: Logo reveals (2.2s)
    const t3 = setTimeout(() => setStage(3), 2200);
    // End: Complete intro and trigger fade out (3.4s)
    const t4 = setTimeout(() => onComplete(), 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-white via-white to-[#EAF6FB] overflow-hidden"
    >
      <div className="relative flex w-full max-w-sm flex-col items-center justify-center px-6 sm:max-w-md">
        
        {/* Airplane container */}
        <motion.div
          initial={{ x: "80vw", opacity: 0 }}
          animate={{ x: "-80vw", opacity: 1 }}
          transition={{
            duration: 3.0,
            ease: "easeOut",
            delay: 0.2
          }}
          className="absolute z-20 flex items-center"
        >
          <Plane className="size-10 -rotate-90 text-[#0D2742] sm:size-12" fill="currentColor" />
          
          {/* Flowing Trail */}
          <div className="absolute right-8 top-1/2 flex h-[2px] w-[200vw] -translate-y-1/2 items-center">
             {/* Base Trail Line */}
             <div className="h-full w-full bg-gradient-to-r from-transparent via-[#159DD3]/30 to-[#159DD3]/50 blur-[1px]" />
             
             {/* Passport/Visa Motif Particles in the trail */}
             {stage >= 1 && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ duration: 0.8 }}
                 className="absolute inset-0 flex items-center"
               >
                  {/* Subtle document/passport forms in the trail */}
                  <div className="absolute right-20 h-4 w-6 rounded-[2px] border border-[#159DD3]/30 bg-white/40 shadow-sm" />
                  <div className="absolute right-40 h-6 w-4 rotate-12 rounded-[2px] border border-[#0D2742]/10 bg-white/50" />
                  <div className="absolute right-60 h-3 w-5 -rotate-6 rounded-[1px] bg-[#159DD3]/20" />
                  <div className="absolute right-[22rem] h-5 w-4 rounded-[2px] border border-[#159DD3]/40 bg-white/30" />
                  
                  {/* Abstract stamp cues */}
                  <div className="absolute right-32 h-5 w-5 rounded-full border border-dashed border-[#0D2742]/20" />
                  <div className="absolute right-52 h-4 w-4 rounded-full border border-[#159DD3]/20" />
               </motion.div>
             )}
          </div>
        </motion.div>

        {/* Logo / Brand Reveal */}
        <AnimatePresence>
          {stage >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative z-30 flex flex-col items-center"
            >
              <h1 className="text-3xl font-bold tracking-tight text-[#0D2742] sm:text-4xl">
                العباد
              </h1>
              <span className="mt-2 text-sm font-semibold tracking-wider text-[#159DD3] sm:text-base">
                للسفريات والسياحة
              </span>
              <div className="mt-4 flex items-center justify-center text-[#159DD3]/40">
                <Plane className="size-6 -rotate-45" fill="currentColor" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
