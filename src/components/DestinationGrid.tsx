import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, X, ShieldCheck, Plane, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { destinations, Destination, Service, Airport } from "../data/destinations";

export function DestinationGrid() {
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState<Destination | null>(null);
  const [step, setStep] = useState<"services" | "airports" | "security">("services");
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [whatsappMsg, setWhatsappMsg] = useState<string>("");

  const isRtl = i18n.dir() === "rtl";

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
    setStep("services");
    setActiveService(null);
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
    setTimeout(() => {
      setStep("services");
      setActiveService(null);
      setWhatsappMsg("");
    }, 300);
  };

  const handleServiceClick = (service: Service) => {
    if (navigator.vibrate) navigator.vibrate(10);
    
    if (service.airports && service.airports.length > 0) {
      setActiveService(service);
      setStep("airports");
    } else if (service.requiresPassport) {
      setWhatsappMsg(service.whatsappMessage);
      setStep("security");
    } else {
      window.open(`https://wa.me/967738883371?text=${encodeURIComponent(service.whatsappMessage)}`, "_blank", "noopener,noreferrer");
    }
  };

  const handleAirportClick = (airport: Airport, service: Service) => {
    if (navigator.vibrate) navigator.vibrate(10);
    if (service.requiresPassport) {
      setWhatsappMsg(airport.whatsappMessage);
      setStep("security");
    } else {
      window.open(`https://wa.me/967738883371?text=${encodeURIComponent(airport.whatsappMessage)}`, "_blank", "noopener,noreferrer");
    }
  };

  const proceedToWhatsApp = () => {
    window.open(`https://wa.me/967738883371?text=${encodeURIComponent(whatsappMsg)}`, "_blank", "noopener,noreferrer");
    closeDestination();
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-12 lg:grid-rows-[260px_260px_auto_260px_260px] lg:gap-6">
        {destinations.map((destination, index) => {
          let layoutClass = "";
          let headingClass = "text-2xl";
          if (destination.id === "oman" || destination.id === "india") {
            layoutClass = "col-span-2 lg:col-span-7 lg:row-span-2 min-h-[380px] lg:min-h-0";
            headingClass = "text-3xl lg:text-5xl";
          } else if (destination.id === "egypt" || destination.id === "socotra") {
            layoutClass = "col-span-1 lg:col-span-5 lg:row-span-1 min-h-[200px] lg:min-h-0";
            headingClass = "text-2xl lg:text-3xl";
          } else if (destination.id === "ksa" || destination.id === "malaysia") {
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
              
              {/* Country Flag Badge */}
              {destination.flagImg && (
                <div className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} z-10 size-10 rounded-full border-2 border-white/20 overflow-hidden shadow-lg`}>
                  <img src={destination.flagImg} alt={`${t("dest.flag_of")} ${destination.name}`} className="w-full h-full object-cover" />
                </div>
              )}
              
              {/* Subtle boarding pass style edge line */}
              <div className="absolute left-4 right-4 bottom-4 top-4 border border-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none hidden lg:block" />

              <div className="relative z-10 flex flex-col p-5 sm:p-6 lg:p-10 text-white transition-transform duration-500 group-hover:-translate-y-1">
                <h3 className={`font-bold tracking-wide ${headingClass}`}>{t(`destinations.${destination.id}.name`)}</h3>
                <p className="mt-2 text-sm font-medium text-white/80 lg:text-lg">
                  {t(`destinations.${destination.id}.desc`)}
                </p>
                
                <div className="mt-5 flex items-center gap-3 overflow-hidden">
                  <span className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all group-hover:bg-primary">
                    <ArrowLeft className={`size-5 transition-transform duration-300 ${isRtl ? 'group-hover:-translate-x-1' : 'rotate-180 group-hover:translate-x-1'}`} />
                  </span>
                  <span className={`text-sm font-semibold opacity-0 transition-all duration-300 group-hover:opacity-100 ${isRtl ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1'} lg:text-base`}>
                    {t("dest.explore_services")}
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
              aria-label={`${t("dest.services_of")} ${t(`destinations.${selected.id}.name`)}`}
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 30, mass: 1 }}
              className="relative flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[2rem] bg-white shadow-2xl md:max-h-[85vh] md:flex-row sm:rounded-[2rem]"
            >
              {/* Left Side (Desktop) / Top (Mobile) */}
              <div className="relative h-44 shrink-0 md:h-auto md:w-[45%] lg:w-[40%]">
                <img src={selected.image} alt={t(`destinations.${selected.id}.name`)} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1B2E]/90 via-[#0A1B2E]/30 to-transparent" />
                
                {/* Flag Badge inside Modal */}
                {selected.flagImg && (
                  <div className={`absolute top-5 ${isRtl ? 'right-5' : 'left-5'} z-20 size-12 rounded-full border-2 border-white/20 overflow-hidden shadow-xl`}>
                    <img src={selected.flagImg} alt={`${t("dest.flag_of")} ${t(`destinations.${selected.id}.name`)}`} className="w-full h-full object-cover" />
                  </div>
                )}
                
                {/* Decorative passport stamp overlay */}
                <div className={`absolute top-10 ${isRtl ? 'left-10 rotate-12' : 'right-10 -rotate-12'} opacity-10 pointer-events-none mix-blend-overlay`}>
                  <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="2" strokeDasharray="4 4"/>
                    <circle cx="50" cy="50" r="35" stroke="white" strokeWidth="1"/>
                    <text x="50" y="55" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="sans-serif">APPROVED</text>
                  </svg>
                </div>

                <Button 
                  variant="glass" 
                  size="icon" 
                  className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-4 z-10 size-9 rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40`} 
                  onClick={closeDestination}
                >
                  <X className="size-4" />
                </Button>
                
                <div className={`absolute bottom-5 ${isRtl ? 'right-5' : 'left-5'} sm:bottom-8 ${isRtl ? 'sm:right-8' : 'sm:left-8'}`}>
                  <h3 className="text-3xl font-bold text-white sm:text-4xl">{t(`destinations.${selected.id}.name`)}</h3>
                </div>
              </div>

              {/* Right Side (Desktop) / Bottom (Mobile) */}
              <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-10 sm:py-10 relative min-h-[400px]">
                <AnimatePresence mode="wait">
                  {step === "services" && (
                    <motion.div
                      key="services"
                      initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4 className="text-xl font-bold text-foreground">{t("dest.choose_service")}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {t("dest.choose_service_desc")}
                      </p>
                      
                      <div className="mt-8 grid gap-3">
                        {selected.services.map((item) => (
                          <button
                            key={item.title}
                            onClick={() => handleServiceClick(item)}
                            className="group flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-start transition-all hover:border-primary/30 hover:bg-muted/40 hover:shadow-sm"
                          >
                            <span className="font-semibold text-foreground group-hover:text-primary">
                              {item.title}
                            </span>
                            <div className="flex size-8 items-center justify-center rounded-full bg-surface text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-white">
                              <ArrowLeft className={`size-4 transition-transform ${isRtl ? 'group-hover:-translate-x-0.5' : 'rotate-180 group-hover:translate-x-0.5'}`} />
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === "airports" && activeService && (
                    <motion.div
                      key="airports"
                      initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <button 
                        onClick={() => setStep("services")}
                        className="mb-6 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ArrowLeft className={`size-4 ${isRtl ? 'rotate-180' : ''}`} />
                        {t("dest.back_to_services")}
                      </button>
                      
                      <h4 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Plane className={`size-6 text-primary ${isRtl ? '' : 'rotate-90'}`} />
                        {t("dest.select_airport")}
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {t("dest.select_airport_desc")}
                      </p>
                      
                      <div className="mt-8 grid gap-3">
                        {activeService.airports?.map((airport) => (
                          <button
                            key={airport.name}
                            onClick={() => handleAirportClick(airport, activeService)}
                            className="group flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-start transition-all hover:border-primary/30 hover:bg-muted/40 hover:shadow-sm"
                          >
                            <span className="font-semibold text-foreground group-hover:text-primary">
                              {airport.name}
                            </span>
                            <div className="flex size-8 items-center justify-center rounded-full bg-surface text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-white">
                              <CheckCircle2 className="size-4 transition-transform group-hover:scale-110" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === "security" && (
                    <motion.div
                      key="security"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center text-center pt-4 sm:pt-8"
                    >
                      <div className="relative mb-6 flex size-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <div className="absolute inset-0 animate-ping rounded-full bg-emerald-100 opacity-50"></div>
                        <ShieldCheck className="relative z-10 size-10" />
                      </div>
                      
                      <h4 className="text-2xl font-bold text-foreground">
                        {t("dest.secure_space")}
                      </h4>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base max-w-sm mx-auto" dangerouslySetInnerHTML={{__html: t("dest.secure_space_desc")}} />
                      
                      <Button 
                        size="lg" 
                        onClick={proceedToWhatsApp}
                        className="mt-8 w-full sm:w-auto h-12 px-8 text-base shadow-lg shadow-primary/20 bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        {t("dest.go_to_whatsapp")}
                      </Button>
                      
                      <button 
                        onClick={() => setStep(activeService?.airports ? "airports" : "services")}
                        className="mt-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {t("dest.cancel")}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
