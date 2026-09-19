import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, X, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { destinations, Destination } from "../data/destinations";

export function DestinationGrid() {
  const [selected, setSelected] = useState<Destination | null>(null);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [selected]);

  const openDestination = (destination: Destination) => {
    if (navigator.vibrate) navigator.vibrate(16);
    setSelected(destination);
  };

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      const dest = destinations.find(d => d.id === customEvent.detail.id);
      if (dest) {
        openDestination(dest);
      }
    };
    window.addEventListener("openDestinationModal", handleOpen);
    return () => window.removeEventListener("openDestinationModal", handleOpen);
  }, []);

  const closeDestination = () => {
    setSelected(null);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-12 lg:grid-rows-[260px_260px_auto] lg:gap-6">
        {destinations.map((destination, index) => {
          let layoutClass = "";
          let headingClass = "text-2xl";
          if (destination.id === "oman") {
            layoutClass = "col-span-2 lg:col-span-7 lg:row-span-2 min-h-[380px] lg:min-h-0";
            headingClass = "text-3xl lg:text-5xl";
          } else if (destination.id === "egypt") {
            layoutClass = "col-span-1 lg:col-span-5 lg:row-span-1 min-h-[200px] lg:min-h-0";
            headingClass = "text-2xl lg:text-3xl";
          } else if (destination.id === "ksa") {
            layoutClass = "col-span-1 lg:col-span-5 lg:row-span-1 min-h-[200px] lg:min-h-0";
            headingClass = "text-2xl lg:text-3xl";
          } else if (destination.id === "tourism") {
            layoutClass = "col-span-2 lg:col-span-12 lg:row-span-1 min-h-[220px] lg:min-h-[280px]";
            headingClass = "text-2xl lg:text-4xl";
          }

          return (
            <motion.button
              type="button"
              key={destination.id}
              onClick={() => openDestination(destination)}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: index * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative flex w-full flex-col justify-end overflow-hidden rounded-2xl text-start outline-hidden focus-visible:ring-3 focus-visible:ring-primary/60 lg:rounded-3xl ${layoutClass}`}
            >
              <div className="absolute inset-0">
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1B2E]/90 via-[#0A1B2E]/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
              
              {/* Subtle boarding pass style edge line */}
              <div className="absolute left-4 right-4 bottom-4 top-4 border border-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none hidden lg:block" />

              <div className="relative z-10 flex flex-col p-5 sm:p-6 lg:p-10 text-white transition-transform duration-500 group-hover:-translate-y-1">
                <h3 className={`font-bold tracking-wide ${headingClass}`}>{destination.name}</h3>
                <p className="mt-2 text-sm font-medium text-white/80 lg:text-lg">
                  {destination.description}
                </p>
                
                <div className="mt-5 flex items-center gap-3 overflow-hidden">
                  <span className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all group-hover:bg-primary">
                    <ArrowLeft className="size-5 transition-transform duration-300 group-hover:-translate-x-1" />
                  </span>
                  <span className="text-sm font-semibold opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 lg:text-base">
                    استكشف الخدمات
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-[#0D2742]/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onMouseDown={(event) => event.currentTarget === event.target && closeDestination()}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`خدمات ${selected.name}`}
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 30, mass: 1 }}
              className="relative flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[2rem] bg-white shadow-2xl md:max-h-[85vh] md:flex-row sm:rounded-[2rem]"
            >
              {/* Left Side (Desktop) / Top (Mobile) */}
              <div className="relative h-44 shrink-0 md:h-auto md:w-[45%] lg:w-[40%]">
                <img src={selected.image} alt={selected.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1B2E]/90 via-[#0A1B2E]/30 to-transparent" />
                
                {/* Decorative passport stamp overlay */}
                <div className="absolute top-10 right-10 rotate-12 opacity-10 pointer-events-none mix-blend-overlay">
                  <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="2" strokeDasharray="4 4"/>
                    <circle cx="50" cy="50" r="35" stroke="white" strokeWidth="1"/>
                    <text x="50" y="55" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="sans-serif">APPROVED</text>
                  </svg>
                </div>

                <Button 
                  variant="glass" 
                  size="icon" 
                  className="absolute left-4 top-4 z-10 size-9 rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40" 
                  onClick={closeDestination}
                >
                  <X className="size-4" />
                </Button>
                
                <div className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8">
                  <h3 className="text-3xl font-bold text-white sm:text-4xl">{selected.name}</h3>
                </div>
              </div>

              {/* Right Side (Desktop) / Bottom (Mobile) */}
              <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-10 sm:py-10">
                <h4 className="text-xl font-bold text-foreground">اختر الخدمة التي تحتاجها</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  سيتم تحويلك مباشرة لمحادثة واتساب مخصصة للاستفسار عن هذه الخدمة.
                </p>
                
                <div className="mt-8 grid gap-3">
                  {selected.services.map((item) => (
                    <button
                      key={item.title}
                      onClick={() => {
                        if (navigator.vibrate) navigator.vibrate(10);
                        window.open(`https://wa.me/?text=${encodeURIComponent(item.whatsappMessage)}`, "_blank", "noopener,noreferrer");
                      }}
                      className="group flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-start transition-all hover:border-primary/30 hover:bg-muted/40 hover:shadow-sm"
                    >
                      <span className="font-semibold text-foreground group-hover:text-primary">
                        {item.title}
                      </span>
                      <div className="flex size-8 items-center justify-center rounded-full bg-surface text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-white">
                        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

