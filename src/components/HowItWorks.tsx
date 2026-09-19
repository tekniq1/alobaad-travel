import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { MapPin, MessageCircle, HeadphonesIcon, Send } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: <MapPin className="size-5" />,
    title: "حدد وجهتك وخدمتك",
    desc: "اختر الدولة ثم الخدمة التي تحتاجها.",
  },
  {
    num: "02",
    icon: <MessageCircle className="size-5" />,
    title: "أرسل طلبك",
    desc: "يتم تجهيز طلبك وإرساله مباشرة عبر واتساب.",
  },
  {
    num: "03",
    icon: <HeadphonesIcon className="size-5" />,
    title: "نتابع معك",
    desc: "يتواصل معك فريق العباد لاستكمال تفاصيل الخدمة.",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="relative overflow-hidden bg-white px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
      {/* Subtle background paper-plane watermark */}
      <div className="pointer-events-none absolute -right-24 bottom-0 top-0 flex items-center opacity-[0.025]">
        <Send className="size-[520px] rotate-[-15deg] text-[#0D2742]" />
      </div>

      <div ref={ref} className="relative z-10 mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-bold text-[#0D2742] sm:text-4xl">
            رحلتك معنا في 3 خطوات
          </h2>
          <p className="mt-3 text-base font-medium text-muted-foreground">
            اختر خدمتك، أرسل طلبك، ونحن نتابع معك.
          </p>
        </motion.div>

        {/* ── MOBILE: vertical journey ── */}
        <div className="relative lg:hidden">
          {/* Vertical route line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }}
            style={{ originY: 0 }}
            className="absolute right-[22px] top-7 bottom-7 w-px bg-gradient-to-b from-[#159DD3]/40 via-[#159DD3]/20 to-transparent"
          />

          <div className="flex flex-col gap-0">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 18 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.2 + i * 0.15 }}
                className="relative flex gap-5 pb-10 last:pb-0"
              >
                {/* Step indicator */}
                <div className="relative z-10 flex flex-col items-center shrink-0">
                  <div className="flex size-11 items-center justify-center rounded-full border-2 border-[#159DD3]/30 bg-white shadow-sm">
                    <span className="text-sm font-black text-[#0D2742]">{step.num}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-1.5">
                  <div className="mb-2 flex items-center gap-2 text-primary">
                    {step.icon}
                    <h3 className="text-lg font-bold text-[#0D2742]">{step.title}</h3>
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-muted-foreground">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Plane at end */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.85 }}
            className="mt-2 flex items-center gap-2 pr-3"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Send className="size-5 -rotate-12" />
            </div>
            <span className="text-xs font-bold text-muted-foreground">رحلتك تبدأ الآن</span>
          </motion.div>
        </div>

        {/* ── DESKTOP: horizontal flow ── */}
        <div className="relative hidden lg:block">
          {/* Horizontal connecting line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.3, ease: "easeInOut" }}
            style={{ originX: 0 }}
            className="absolute left-[calc(50%/3)] right-[calc(50%/3)] top-[22px] h-px bg-gradient-to-r from-transparent via-[#159DD3]/30 to-transparent"
          />

          <div className="grid grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.25 + i * 0.15 }}
                className="group relative flex flex-col items-center text-center"
              >
                {/* Circle indicator */}
                <div className="relative z-10 mb-5 flex size-11 items-center justify-center rounded-full border-2 border-[#159DD3]/30 bg-white shadow-sm transition-all group-hover:border-primary group-hover:shadow-md">
                  <span className="text-sm font-black text-[#0D2742]">{step.num}</span>
                </div>

                {/* Icon + Title */}
                <div className="mb-2 flex items-center justify-center gap-2 text-primary">
                  {step.icon}
                  <h3 className="text-lg font-bold text-[#0D2742]">{step.title}</h3>
                </div>
                <p className="text-sm font-medium leading-relaxed text-muted-foreground">{step.desc}</p>

                {/* Plane at last step */}
                {i === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.9 }}
                    className="absolute -left-1 top-[18px] flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary"
                  >
                    <Send className="size-3.5 -rotate-12" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
