import { motion } from "motion/react";
import { ArrowLeft, Send } from "lucide-react";
import { lazy, Suspense } from "react";

// Lazy-load the 3D scene so Three.js is never imported on the SSR server
const TravelScene3D = lazy(() =>
  import("./TravelScene3D").then((m) => ({ default: m.TravelScene3D }))
);

const WA_MSG = encodeURIComponent(
  "السلام عليكم، أرغب بالاستفسار عن خدمات العباد للسفريات والسياحة."
);

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12.04 2a9.84 9.84 0 0 0-8.5 14.8L2 22l5.34-1.5A9.98 9.98 0 1 0 12.04 2Zm0 17.98a8.1 8.1 0 0 1-4.12-1.13l-.3-.18-3.17.9.87-3.1-.2-.32a8 8 0 1 1 6.92 3.83Zm4.45-6.06c-.24-.12-1.44-.7-1.66-.79-.23-.08-.4-.12-.57.13-.16.24-.63.79-.78.95-.14.17-.28.19-.52.07-.24-.12-1.03-.38-1.95-1.2a7.3 7.3 0 0 1-1.35-1.68c-.14-.24-.01-.37.11-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.56-.42h-.48c-.16 0-.43.06-.65.3-.22.24-.86.84-.86 2.05s.88 2.38 1 2.54c.12.16 1.73 2.64 4.18 3.7.59.25 1.04.4 1.4.51.59.19 1.12.16 1.54.1.47-.07 1.44-.59 1.65-1.16.2-.56.2-1.04.14-1.15-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

export function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-[#EAF6FB] via-white to-white">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-28 right-[-10%] h-[500px] w-[500px] rounded-full bg-[#159DD3]/8 blur-[100px]" />
        <div className="absolute bottom-10 left-[-5%] h-80 w-80 rounded-full bg-[#0D2742]/4 blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* ── MOBILE / TABLET ── */}
        <div className="lg:hidden">
          {/* Text block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="pt-28 sm:pt-32"
          >
            {/* Eyebrow */}
            <div className="mb-5 inline-flex items-center gap-2">
              <Send className="size-4 -rotate-12 text-primary" aria-hidden="true" />
              <span className="text-sm font-bold text-primary">العباد للسفريات والسياحة</span>
            </div>

            {/* Headline */}
            <h1 className="text-[2.4rem] font-bold leading-[1.2] tracking-tight text-[#0D2742] sm:text-5xl">
              رحلتك تبدأ<br />من هنا
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-sm text-base font-medium leading-relaxed text-muted-foreground">
              تأشيرات، موافقات، عمرة وتذاكر سفر بخدمة سهلة ومباشرة.
            </p>

            {/* CTAs */}
            <div className="mt-7 flex flex-col gap-3">
              <a
                href="#destinations"
                className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#159DD3] text-base font-bold text-white shadow-[0_8px_24px_rgba(21,157,211,0.26)] transition-all hover:bg-[#3BAFE0] active:scale-[0.97]"
              >
                استكشف الوجهات <ArrowLeft className="size-5" />
              </a>
              <a
                href={`https://wa.me/?text=${WA_MSG}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-[#0D2742]/10 bg-white text-base font-bold text-[#0D2742] transition-all hover:border-[#0D2742]/20 hover:bg-[#F7FAFC] active:scale-[0.97]"
              >
                <WhatsAppIcon className="size-5 text-primary" />
                تواصل عبر واتساب
              </a>
            </div>
          </motion.div>

          {/* 3D Scene — Mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="relative"
          >
            <Suspense fallback={<div className="h-[320px] w-full sm:h-[380px]" />}>
              <TravelScene3D className="h-[320px] w-full sm:h-[380px]" />
            </Suspense>
            {/* Fade to white at bottom */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
          </motion.div>
        </div>

        {/* ── DESKTOP: editorial split ── */}
        <div className="hidden min-h-[88vh] items-center lg:flex">
          <div className="grid w-full grid-cols-2 items-center gap-12 py-20">
            {/* Right: Text */}
            <div>
              <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[#159DD3]/20 bg-[#EAF6FB] px-4 py-2">
                <Send className="size-4 -rotate-12 text-primary" aria-hidden="true" />
                <span className="text-sm font-bold text-primary">العباد للسفريات والسياحة</span>
              </div>

              <h1 className="text-[clamp(2.8rem,3.5vw,4.5rem)] font-bold leading-[1.18] tracking-tight text-[#0D2742]">
                رحلتك تبدأ<br />من هنا
              </h1>

              <p className="mt-6 max-w-md text-xl font-medium leading-relaxed text-muted-foreground">
                تأشيرات، موافقات، عمرة وتذاكر سفر بخدمة سهلة ومباشرة.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#destinations"
                  className="flex h-14 items-center gap-2.5 rounded-2xl bg-[#159DD3] px-8 text-base font-bold text-white shadow-[0_8px_24px_rgba(21,157,211,0.26)] transition-all hover:bg-[#3BAFE0] active:scale-[0.97]"
                >
                  استكشف الوجهات <ArrowLeft className="size-5" />
                </a>
                <a
                  href={`https://wa.me/?text=${WA_MSG}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-14 items-center gap-2.5 rounded-2xl border-2 border-[#0D2742]/10 bg-white/80 px-7 text-base font-bold text-[#0D2742] backdrop-blur-sm transition-all hover:bg-white active:scale-[0.97]"
                >
                  <WhatsAppIcon className="size-5 text-primary" />
                  تواصل عبر واتساب
                </a>
              </div>

              {/* Subtle drag hint */}
              <p className="mt-8 flex items-center gap-2 text-xs text-muted-foreground/60">
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
                </svg>
                اسحب للدوران
              </p>
            </div>

            {/* Left: 3D Scene */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0, delay: 0.15, ease: "easeOut" }}
              className="relative"
            >
              {/* Glow blob */}
              <div className="absolute inset-0 -z-10 rounded-full bg-[#159DD3]/6 blur-3xl scale-75" />
              <Suspense fallback={<div className="h-[560px] w-full" />}>
                <TravelScene3D className="h-[560px] w-full" />
              </Suspense>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
