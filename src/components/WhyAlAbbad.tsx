import { Zap, ShieldCheck, MapPin, Send } from "lucide-react";
import { motion } from "motion/react";

export function WhyAlAbbad() {
  const features = [
    {
      icon: <Zap className="size-5" />,
      title: "سرعة الاستجابة",
      desc: "تواصل مباشر وسريع مع فريق المكتب.",
    },
    {
      icon: <ShieldCheck className="size-5" />,
      title: "متابعة مباشرة",
      desc: "نساعدك في معرفة الخطوات ومتابعة طلبك بسهولة.",
    },
    {
      icon: <MapPin className="size-5" />,
      title: "خدمات سفر متعددة",
      desc: "تأشيرات، موافقات، عمرة وتذاكر في مكان واحد.",
    }
  ];

  return (
    <section id="about" className="relative overflow-hidden bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      {/* Paper-plane subtle background watermark */}
      <div className="pointer-events-none absolute -left-20 top-20 opacity-[0.02]">
        <Send className="size-[400px] -rotate-12 text-[#0D2742]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-16">
          
          {/* Header Area */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 lg:col-span-5 lg:mb-0"
          >
            <div className="mb-4 inline-flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Send className="size-4" />
              </span>
              <span className="text-sm font-bold uppercase tracking-wider text-primary">لماذا نحن؟</span>
            </div>
            
            <h2 className="text-3xl font-bold text-[#0D2742] sm:text-4xl lg:text-5xl lg:leading-tight">
              لماذا العباد؟
            </h2>
            <p className="mt-4 max-w-md text-lg font-medium leading-relaxed text-muted-foreground lg:mt-6 lg:text-xl">
              خدمات سفر واضحة، متابعة مباشرة، وتجربة أسهل من أول خطوة.
            </p>
          </motion.div>

          {/* Trust Items Area */}
          <div className="relative lg:col-span-7">
            {/* Subtle route line connecting items */}
            <div className="absolute right-10 top-10 bottom-10 w-px border-r-2 border-dashed border-primary/15 hidden lg:block" />
            
            <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
              {features.map((item, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: idx * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  key={idx} 
                  className="group relative z-10 flex items-start gap-4 rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(13,39,66,0.02)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(13,39,66,0.06)] sm:p-5 lg:items-center lg:gap-5 lg:p-6"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF6FB] text-primary transition-colors group-hover:bg-[#0D2742] group-hover:text-white lg:size-14 relative">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0D2742] sm:text-lg">{item.title}</h3>
                    <p className="mt-1 text-sm font-medium text-muted-foreground sm:text-base">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
