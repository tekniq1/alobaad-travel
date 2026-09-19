import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Send } from "lucide-react";

// WhatsApp SVG icon
function WhatsAppIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12.04 2a9.84 9.84 0 0 0-8.5 14.8L2 22l5.34-1.5A9.98 9.98 0 1 0 12.04 2Zm0 17.98a8.1 8.1 0 0 1-4.12-1.13l-.3-.18-3.17.9.87-3.1-.2-.32a8 8 0 1 1 6.92 3.83Zm4.45-6.06c-.24-.12-1.44-.7-1.66-.79-.23-.08-.4-.12-.57.13-.16.24-.63.79-.78.95-.14.17-.28.19-.52.07-.24-.12-1.03-.38-1.95-1.2a7.3 7.3 0 0 1-1.35-1.68c-.14-.24-.01-.37.11-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.56-.42h-.48c-.16 0-.43.06-.65.3-.22.24-.86.84-.86 2.05s.88 2.38 1 2.54c.12.16 1.73 2.64 4.18 3.7.59.25 1.04.4 1.4.51.59.19 1.12.16 1.54.1.47-.07 1.44-.59 1.65-1.16.2-.56.2-1.04.14-1.15-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

const WA_MESSAGE = encodeURIComponent(
  "السلام عليكم، أرغب بالاستفسار عن خدمات العباد للسفريات والسياحة."
);

export function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <section className="bg-[#F4F8FA] px-4 py-10 sm:px-8 sm:py-16 lg:px-12">
      <div ref={ref} className="mx-auto max-w-6xl">

        {/* ── MOBILE / TABLET: stacked cinematic card ── */}
        <div className="lg:hidden">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-[2rem] bg-[#0D2742] shadow-2xl"
          >
            {/* Image */}
            <div className="relative h-[260px] sm:h-[320px]">
              <img
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop"
                alt="سفر"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0D2742]/30 to-[#0D2742]" />
              {/* Subtle paper-plane in corner */}
              <div className="absolute left-5 top-5 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm">
                <Send className="size-5 -rotate-12" />
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-8 pt-2">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl font-bold text-white"
              >
                رحلتك تبدأ بخطوة
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="mt-3 text-base font-medium leading-relaxed text-white/70"
              >
                اختر وجهتك، ودع فريق العباد يساعدك في بقية التفاصيل.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 flex flex-col gap-3"
              >
                <a
                  href={`https://wa.me/?text=${WA_MESSAGE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-primary text-lg font-bold text-primary-foreground shadow-[0_8px_20px_var(--shadow-primary)] transition-all hover:-translate-y-0.5 hover:bg-primary-bright active:scale-[0.98]"
                >
                  <WhatsAppIcon className="size-5" />
                  تواصل عبر واتساب
                </a>
                <a
                  href="#destinations"
                  className="flex h-12 w-full items-center justify-center rounded-xl border border-white/20 text-sm font-bold text-white/80 transition-all hover:bg-white/10 hover:text-white"
                >
                  استكشف الوجهات
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ── DESKTOP: split cinematic layout ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="hidden overflow-hidden rounded-[2.5rem] bg-[#0D2742] shadow-2xl lg:grid lg:grid-cols-2"
        >
          {/* Image side */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop"
              alt="سفر"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-[#0D2742]/80 via-[#0D2742]/20 to-transparent" />
          </div>

          {/* Content side */}
          <div className="relative flex flex-col justify-center px-14 py-16">
            {/* Paper-plane brand detail */}
            <div className="mb-8 flex size-12 items-center justify-center rounded-full bg-white/10 text-white">
              <Send className="size-6 -rotate-12" />
            </div>

            <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
              رحلتك تبدأ<br />بخطوة
            </h2>
            <p className="mt-5 max-w-xs text-lg font-medium leading-relaxed text-white/70">
              اختر وجهتك، ودع فريق العباد يساعدك في بقية التفاصيل.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href={`https://wa.me/?text=${WA_MESSAGE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 items-center justify-center gap-3 rounded-xl bg-primary px-8 text-base font-bold text-primary-foreground shadow-[0_8px_20px_var(--shadow-primary)] transition-all hover:-translate-y-0.5 hover:bg-primary-bright active:scale-[0.98]"
              >
                <WhatsAppIcon className="size-5" />
                تواصل عبر واتساب
              </a>
              <a
                href="#destinations"
                className="flex h-14 items-center justify-center rounded-xl border border-white/20 px-8 text-sm font-bold text-white/80 transition-all hover:bg-white/10 hover:text-white"
              >
                استكشف الوجهات
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
