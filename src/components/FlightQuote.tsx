import { ArrowDownUp, Info, Minus, PlaneTakeoff, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";

export function FlightQuote() {
  const [tripType, setTripType] = useState<"ذهاب وعودة" | "ذهاب فقط">("ذهاب وعودة");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [travelers, setTravelers] = useState(1);

  const swapLocations = () => {
    setFrom(to);
    setTo(from);
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const hasEnoughInfo = from.length > 2 && to.length > 2 && date;

  const submit = () => {
    if (navigator.vibrate) navigator.vibrate(18);
    
    let message = `السلام عليكم،\nأرغب بالاستفسار عن تذكرة طيران لدى مكتب العباد للسفريات والسياحة.\n\nمن: ${from || "غير محدد"}\nإلى: ${to || "غير محدد"}\nنوع الرحلة: ${tripType}\nتاريخ المغادرة: ${date || "غير محدد"}\n`;
    
    if (tripType === "ذهاب وعودة" && returnDate) {
      message += `تاريخ العودة: ${returnDate}\n`;
    }
    
    message += `عدد المسافرين: ${travelers}`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="flights" className="relative overflow-hidden bg-[#F7FAFC] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      {/* Background Decor */}
      <div className="pointer-events-none absolute inset-0">
         <div className="absolute top-1/4 right-0 h-px w-full bg-gradient-to-r from-transparent via-[#0D2742]/5 to-transparent" />
         <div className="absolute bottom-1/3 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#0D2742]/5 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-12">
          
          {/* Desktop Left Side Context */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:col-span-5 lg:block lg:sticky lg:top-32"
          >
            <h2 className="text-4xl font-bold text-[#0D2742]">اعثر على رحلتك المناسبة</h2>
            <p className="mt-4 text-lg text-muted-foreground">أرسل تفاصيل رحلتك وسنتواصل معك بالخيارات المتاحة.</p>
            
            <div className="relative mt-12 rounded-3xl border border-white bg-white/60 p-8 shadow-sm">
               {/* Decorative route line */}
               <svg className="absolute -left-12 top-10 -z-10 h-32 w-24 opacity-40 text-primary" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M100 0 C60 0 40 40 40 100" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
               </svg>
               <PlaneTakeoff className="mb-6 size-16 text-primary opacity-20" />
               <h4 className="text-xl font-bold text-foreground">احجز بكل ثقة</h4>
               <ul className="mt-4 space-y-3 text-muted-foreground">
                  <li>• أفضل أسعار التذاكر المتاحة</li>
                  <li>• دعم مستمر قبل وأثناء الرحلة</li>
                  <li>• تغييرات وإلغاء مرن</li>
               </ul>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            
            {/* Mobile Header */}
            <div className="mb-8 lg:hidden">
              <h2 className="text-2xl font-bold text-[#0D2742]">اعثر على رحلتك المناسبة</h2>
              <p className="mt-2 text-sm text-muted-foreground">أرسل تفاصيل رحلتك وسنتواصل معك بالخيارات المتاحة.</p>
            </div>

            <div className="relative rounded-[2rem] border border-white bg-white p-5 shadow-xl sm:p-8">
              
              {/* 1. Trip Type Segmented Control */}
              <div className="mb-6 flex rounded-xl bg-surface p-1">
                <button
                  type="button"
                  onClick={() => setTripType("ذهاب فقط")}
                  className={`flex-1 rounded-lg py-3 text-sm font-bold transition-all ${tripType === "ذهاب فقط" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  ذهاب فقط
                </button>
                <button
                  type="button"
                  onClick={() => setTripType("ذهاب وعودة")}
                  className={`flex-1 rounded-lg py-3 text-sm font-bold transition-all ${tripType === "ذهاب وعودة" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  ذهاب وعودة
                </button>
              </div>

              {/* 2. From / To with Swap */}
              <div className="relative mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3">
                <div className="relative z-10 flex h-14 items-center gap-3 rounded-xl bg-surface px-4 focus-within:ring-1 focus-within:ring-primary">
                  <span className="w-8 text-xs font-bold text-muted-foreground">من</span>
                  <input
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="مدينة المغادرة"
                    className="w-full bg-transparent text-sm font-bold text-foreground outline-none placeholder:text-muted-foreground/50 placeholder:font-medium"
                  />
                </div>
                
                <div className="absolute right-6 top-1/2 z-20 -translate-y-1/2">
                   <button 
                     type="button"
                     onClick={swapLocations}
                     aria-label="تبديل الوجهات"
                     className="flex size-9 items-center justify-center rounded-full border border-border bg-white text-primary shadow-sm transition-transform hover:scale-105 active:scale-95"
                   >
                     <ArrowDownUp className="size-4" />
                   </button>
                </div>

                <div className="relative z-10 flex h-14 items-center gap-3 rounded-xl bg-surface px-4 focus-within:ring-1 focus-within:ring-primary">
                  <span className="w-8 text-xs font-bold text-muted-foreground">إلى</span>
                  <input
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="وجهة الوصول"
                    className="w-full bg-transparent text-sm font-bold text-foreground outline-none placeholder:text-muted-foreground/50 placeholder:font-medium"
                  />
                </div>
              </div>

              {/* 3. Dates */}
              <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4">
                <div className="flex h-16 flex-col justify-center rounded-xl border border-border bg-card px-4 focus-within:border-primary focus-within:ring-1">
                  <span className="text-[10px] font-bold text-muted-foreground">تاريخ المغادرة</span>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-0.5 w-full bg-transparent text-sm font-bold outline-none"
                  />
                </div>

                <AnimatePresence mode="popLayout">
                  {tripType === "ذهاب وعودة" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="flex h-16 flex-col justify-center rounded-xl border border-border bg-card px-4 focus-within:border-primary focus-within:ring-1"
                    >
                      <span className="text-[10px] font-bold text-muted-foreground">تاريخ العودة</span>
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="mt-0.5 w-full bg-transparent text-sm font-bold outline-none"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 4. Passengers */}
              <div className="mb-8 flex h-16 items-center justify-between rounded-xl border border-border bg-card px-5">
                <span className="text-sm font-bold text-foreground">عدد المسافرين</span>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    className="flex size-9 items-center justify-center rounded-full bg-surface text-foreground transition-colors hover:bg-muted active:scale-95"
                  >
                    <Minus className="size-4" />
                  </button>
                  <strong className="w-4 text-center text-lg">{travelers}</strong>
                  <button
                    type="button"
                    onClick={() => setTravelers(Math.min(9, travelers + 1))}
                    className="flex size-9 items-center justify-center rounded-full bg-surface text-foreground transition-colors hover:bg-muted active:scale-95"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>

              {/* 5. Summary & CTA */}
              <AnimatePresence>
                {hasEnoughInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 overflow-hidden"
                  >
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                      <div className="flex items-start gap-3">
                        <Info className="mt-0.5 size-5 shrink-0 text-primary" />
                        <div className="text-sm">
                          <strong className="mb-1.5 block text-foreground">رحلتك</strong>
                          <p className="leading-relaxed text-muted-foreground font-medium">
                            {from} <ArrowDownUp className="inline size-3 mx-1 rotate-90" /> {to} <br/>
                            {tripType} <br/>
                            {date} {tripType === "ذهاب وعودة" && returnDate ? ` ← ${returnDate}` : ""} <br/>
                            {travelers} {travelers > 2 && travelers < 11 ? "مسافرين" : "مسافر"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                size="lg"
                variant="primary"
                onClick={submit}
                className="h-14 w-full rounded-xl text-lg font-bold"
              >
                إرسال الطلب عبر واتساب
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
