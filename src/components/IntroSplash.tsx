import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

const ShatterLogo = ({ isShattered }: { isShattered: boolean }) => {
  const cols = 12; // High number of fragments for a cinematic shatter
  const rows = 8;
  
  const pieces = useMemo(() => {
    const arr = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const xPos = c * (100 / cols);
        const yPos = r * (100 / rows);
        const bgX = cols > 1 ? (c / (cols - 1)) * 100 : 0;
        const bgY = rows > 1 ? (r / (rows - 1)) * 100 : 0;

        // Disperse across the full screen
        const angle = Math.random() * Math.PI * 2;
        // 200 to 1200 pixels away ensures they fly off or near the edges
        const distance = Math.random() * 1000 + 200; 
        
        const randomX = Math.cos(angle) * distance;
        const randomY = Math.sin(angle) * distance;
        
        // Random spin
        const randomRot = (Math.random() - 0.5) * 720;
        // Depth variation: some pieces appear closer (larger), some further (smaller)
        const targetScale = Math.random() * 1.5 + 0.3; 

        arr.push(
          <motion.div
            key={`${r}-${c}`}
            className="absolute"
            style={{
              width: `${100 / cols}%`,
              height: `${100 / rows}%`,
              left: `${xPos}%`,
              top: `${yPos}%`,
              backgroundImage: "url('/logo-high-res.png')",
              backgroundSize: `${cols * 100}% ${rows * 100}%`,
              backgroundPosition: `${bgX}% ${bgY}%`,
              backgroundRepeat: "no-repeat",
              transformOrigin: "center center",
            }}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
            animate={isShattered ? {
              x: randomX,
              y: randomY,
              rotate: randomRot,
              opacity: 0, // Fades out slowly as it flies
              scale: targetScale
            } : {
              x: 0, y: 0, rotate: 0, opacity: 1, scale: 1
            }}
            transition={{ 
              duration: 2.0, 
              ease: [0.1, 0.9, 0.2, 1] // Explosive, energetic easing
            }}
          />
        );
      }
    }
    return arr;
  }, [isShattered]);

  return (
    <div className="relative z-30 w-full max-w-[260px] sm:max-w-[340px]">
      <img 
        src="/logo-high-res.png" 
        alt="Al-Abbad Logo" 
        className={`w-full h-auto object-contain drop-shadow-2xl transition-opacity duration-75 ${isShattered ? 'opacity-0' : 'opacity-100'}`} 
      />
      {isShattered && (
        <div className="absolute inset-0 pointer-events-none">
          {pieces}
        </div>
      )}
    </div>
  );
};

export function IntroSplash({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0); 

  useEffect(() => {
    // 0.0 - 0.7s: logo appears cleanly and settles
    // 0.7s: Plane enters and moves slowly
    const t1 = setTimeout(() => setStage(1), 700);
    // 2.85s: Impact moment. The plane animation is 2.3s, but since the logo is wide, 
    // the collision happens slightly before the plane reaches the absolute center.
    const t2 = setTimeout(() => setStage(2), 2850);
    // 4.3s: Fragments continue moving while homepage starts to reveal
    const t3 = setTimeout(() => setStage(3), 4300);
    // 5.0s: Full completion
    const t4 = setTimeout(() => onComplete(), 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
      animate={{ backgroundColor: stage >= 3 ? "rgba(255, 255, 255, 0)" : "rgba(255, 255, 255, 1)" }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden ${stage >= 3 ? 'pointer-events-none' : 'pointer-events-auto'}`}
    >
      {/* Plane and Route Line Container */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-40 flex items-center justify-center">
         <svg viewBox="0 0 100 100" className="w-full h-full max-w-[1000px] max-h-[1000px]" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#159DD3" stopOpacity="0" />
                <stop offset="100%" stopColor="#0D2742" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* The Flight Path Line (Fades out when stage >= 2) */}
            <motion.g 
              initial={{ opacity: 1 }}
              animate={stage >= 2 ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              {stage >= 1 && (
                <path 
                  id="flight-path"
                  d="M -10,80 C 20,80 80,10 50,50" 
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeWidth="0.5"
                  pathLength="100"
                  strokeDasharray="100"
                  strokeDashoffset="100"
                >
                  <animate 
                    attributeName="stroke-dashoffset" 
                    values="100;0" 
                    dur="2.3s" 
                    begin="0s" 
                    fill="freeze"
                    calcMode="spline"
                    keyTimes="0;1"
                    keySplines="0.5 0 1 1"
                  />
                </path>
              )}
            </motion.g>
            
            {/* The Airplane (Disappears exactly on impact) */}
            {stage >= 1 && stage < 2 && (
              <g>
                <image 
                  href="/airplane.png" 
                  x="-6" 
                  y="-6" 
                  width="12" 
                  height="12" 
                  transform="rotate(90)"
                />
                <animateMotion 
                  dur="2.3s" 
                  begin="0s" 
                  fill="freeze"
                  calcMode="spline"
                  keyTimes="0;1"
                  keySplines="0.5 0 1 1"
                  rotate="auto"
                >
                  <mpath href="#flight-path" />
                </animateMotion>
              </g>
            )}

            {/* Tiny Impact Flash */}
            {stage === 2 && (
              <motion.circle
                cx="50"
                cy="50"
                r="1"
                fill="#ffffff"
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 0, scale: 4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            )}
         </svg>
      </div>

      {/* Center Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-30"
      >
        <ShatterLogo isShattered={stage >= 2} />
      </motion.div>
    </motion.div>
  );
}
