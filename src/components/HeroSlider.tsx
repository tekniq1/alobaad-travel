import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Plane } from "lucide-react";

const slides = [
  {
    id: "oman",
    heading: "اكتشف سلطنة عُمان",
    subhead: "رحلتك تبدأ بخطوة… ونحن نهتم بالباقي.",
    description: "تأشيرات، موافقات وتذاكر سفر بخدمة سهلة ومباشرة.",
    cta: "استكشف خدمات عُمان",
    image: "https://images.unsplash.com/photo-1612255331613-2d2c129202bf?q=80&w=1920&auto=format&fit=crop",
    planeImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1920&auto=format&fit=crop", // Used as a fallback or layered composition
  },
  {
    id: "egypt",
    heading: "اكتشف مصر",
    subhead: "أرض الكنانة ترحب بك.",
    description: "موافقات أمنية وتذاكر طيران بأفضل الأسعار وبأسرع وقت.",
    cta: "استكشف خدمات مصر",
    image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=1920&auto=format&fit=crop",
  },
  {
    id: "ksa",
    heading: "رحلة روحانية للسعودية",
    subhead: "عمرة وتأشيرات ميسرة.",
    description: "برامج عمرة متميزة وحجوزات طيران تلبي كافة احتياجاتك.",
    cta: "استكشف خدمات السعودية",
    image: "https://images.unsplash.com/photo-1565552643983-c619b0ceb205?q=80&w=1920&auto=format&fit=crop",
  },
  {
    id: "tourism",
    heading: "العالم بين يديك",
    subhead: "وجهات سياحية مختارة بعناية.",
    description: "تركيا، ماليزيا، دبي، والمزيد من الوجهات السياحية العالمية.",
    cta: "اكتشف وجهتك القادمة",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1920&auto=format&fit=crop",
  }
];

function WhatsAppIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12.04 2a9.84 9.84 0 0 0-8.5 14.8L2 22l5.34-1.5A9.98 9.98 0 1 0 12.04 2Zm0 17.98a8.1 8.1 0 0 1-4.12-1.13l-.3-.18-3.17.9.87-3.1-.2-.32a8 8 0 1 1 6.92 3.83Zm4.45-6.06c-.24-.12-1.44-.7-1.66-.79-.23-.08-.4-.12-.57.13-.16.24-.63.79-.78.95-.14.17-.28.19-.52.07-.24-.12-1.03-.38-1.95-1.2a7.3 7.3 0 0 1-1.35-1.68c-.14-.24-.01-.37.11-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.56-.42h-.48c-.16 0-.43.06-.65.3-.22.24-.86.84-.86 2.05s.88 2.38 1 2.54c.12.16 1.73 2.64 4.18 3.7.59.25 1.04.4 1.4.51.59.19 1.12.16 1.54.1.47-.07 1.44-.59 1.65-1.16.2-.56.2-1.04.14-1.15-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const currentSlide = slides[currentIndex];

  return (
    <section 
      id="home"
      className="relative flex min-h-[88svh] w-full items-center overflow-hidden bg-[#0D2742] lg:min-h-[95svh]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src={currentSlide.image}
            alt={currentSlide.heading}
            className="h-full w-full object-cover"
          />
          {/* Cinematic overlay: bottom-heavy on mobile, side-heavy on desktop */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D2742] via-[#0D2742]/55 to-[#0D2742]/10 lg:bg-gradient-to-r lg:from-[#0D2742]/90 lg:via-[#0D2742]/40 lg:to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-24 sm:px-8 sm:pt-28 lg:px-12 lg:pt-32">
        <div className="grid lg:grid-cols-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentIndex}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.3 } }}
              transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
              className="text-white"
            >
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-md sm:mb-4 sm:px-4 sm:py-2">
                <Plane className="size-3.5" /> {currentSlide.subhead}
              </div>
              <h1 className="text-[clamp(2rem,7vw,4.5rem)] font-bold leading-[1.15] tracking-tight">
                {currentSlide.heading}
              </h1>
              <p className="mt-4 max-w-lg text-sm font-medium leading-relaxed text-white/80 sm:mt-6 sm:text-lg">
                {currentSlide.description}
              </p>
              
              <div className="mt-7 flex flex-wrap gap-3 sm:mt-10 sm:gap-4">
                <a 
                  href="#destinations"
                  className="flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-bright active:scale-[0.97] sm:h-14 sm:px-8 sm:text-base"
                >
                  {currentSlide.cta} <ArrowLeft className="size-4" />
                </a>
                <a 
                  href={`https://wa.me/?text=${encodeURIComponent("السلام عليكم، أرغب بالاستفسار عن خدمات العباد للسفريات والسياحة.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 active:scale-[0.97] sm:h-14 sm:px-8 sm:text-base"
                >
                  <WhatsAppIcon className="size-4 text-[#25D366]" /> تواصل عبر واتساب
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 gap-3 lg:bottom-12 lg:left-12 lg:translate-x-0">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`الذهاب إلى الشريحة ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
