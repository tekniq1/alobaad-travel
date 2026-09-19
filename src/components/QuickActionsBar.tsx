import { useRef, useEffect } from "react";
import { Plane, MapPin } from "lucide-react";

const actions = [
  { id: "oman",    label: "سلطنة عُمان",    isDestination: true  },
  { id: "egypt",   label: "مصر",             isDestination: true  },
  { id: "ksa",     label: "السعودية",        isDestination: true  },
  { id: "flights", label: "تذاكر الطيران",  isDestination: false },
];

export function QuickActionsBar() {
  const scrollRef  = useRef<HTMLDivElement>(null);
  const rafRef     = useRef<number>();
  const pausedRef  = useRef(false);
  const timerRef   = useRef<ReturnType<typeof setTimeout>>();
  const fractional = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // We wait a frame to ensure CSS layout has calculated widths
    const setup = setTimeout(() => {
      // Only auto-scroll if the items actually overflow the container
      if (el.scrollWidth > el.clientWidth) {
        // Start slightly scrolled right so we don't immediately wrap on the first frame
        el.scrollLeft = 30;
      }
    }, 100);

    let lastTime = performance.now();
    const SPEED = 22; // px per second, slow and elegant

    const tick = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (!pausedRef.current && el && el.scrollWidth > el.clientWidth) {
        fractional.current += SPEED * dt;
        
        if (fractional.current >= 1) {
          const pixels = Math.floor(fractional.current);
          fractional.current -= pixels;
          
          el.scrollLeft -= pixels; // move content right

          // Wrap right-most item to the left when it fully exits
          if (el.scrollLeft <= 0) {
            const last = el.lastElementChild as HTMLElement;
            if (last) {
              const style = window.getComputedStyle(last);
              const w = last.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
              el.prepend(last); // move DOM node
              el.scrollLeft += w; // adjust scroll so visual position is perfectly seamless
            }
          }
          
          // Wrap left-most item to the right (in case user swipes manually to the left)
          if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2) {
            const first = el.firstElementChild as HTMLElement;
            if (first) {
              const style = window.getComputedStyle(first);
              const w = first.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
              el.append(first); // move DOM node
              el.scrollLeft -= w; // adjust scroll
            }
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      clearTimeout(setup);
      if (rafRef.current)  cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const pause = () => {
    pausedRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const scheduleResume = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { 
      pausedRef.current = false; 
    }, 2000);
  };

  const trigger = (action: typeof actions[0]) => {
    if (navigator.vibrate) navigator.vibrate(10);
    if (action.isDestination) {
      window.dispatchEvent(
        new CustomEvent("openDestinationModal", { detail: { id: action.id } })
      );
    } else {
      document.getElementById("flights")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative z-20 -mt-3 sm:-mt-5">
      {/* ── MOBILE: cyclic DOM ticker ── */}
      <div className="lg:hidden">
        <div
          ref={scrollRef}
          dir="ltr"
          onTouchStart={pause}
          onTouchEnd={scheduleResume}
          onMouseEnter={pause}
          onMouseLeave={scheduleResume}
          aria-label="وجهات وخدمات سريعة"
          className="flex overflow-x-auto py-4 px-2 hide-scrollbar scroll-smooth-disabled"
          style={{ scrollBehavior: 'auto' }}
        >
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => trigger(action)}
              aria-label={action.label}
              className="mx-2 flex min-w-[135px] shrink-0 items-center justify-center gap-3 rounded-2xl border border-[#0D2742]/10 bg-white px-5 py-3.5 shadow-[0_4px_16px_rgba(13,39,66,0.05)] transition-transform active:scale-95"
            >
              <span className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                action.isDestination
                  ? "bg-[#EAF6FB] text-[#159DD3]"
                  : "bg-[#159DD3] text-white"
              }`}>
                {action.isDestination
                  ? <MapPin className="size-4" />
                  : <Plane  className="size-4" />
                }
              </span>
              <span className="whitespace-nowrap text-sm font-bold text-[#0D2742]">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── DESKTOP: stable grid ── */}
      <div className="hidden lg:block px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-3.5 shadow-[0_8px_30px_rgba(13,39,66,0.08)]">
          <div className="grid grid-cols-4 gap-4">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => trigger(action)}
                className="group flex items-center gap-3.5 rounded-2xl bg-[#F7FAFC] px-5 py-4 transition-all hover:bg-[#EAF6FB] hover:shadow-sm"
              >
                <span className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                  action.isDestination
                    ? "bg-[#EAF6FB] text-[#159DD3] group-hover:bg-[#0D2742] group-hover:text-white"
                    : "bg-[#159DD3] text-white group-hover:bg-[#0D2742]"
                }`}>
                  {action.isDestination
                    ? <MapPin className="size-5" />
                    : <Plane  className="size-5" />
                  }
                </span>
                <span className="font-bold text-[#0D2742]">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
