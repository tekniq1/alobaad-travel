import { Plane } from "lucide-react";
import { useTranslation } from "react-i18next";

const actions = [
  { id: "ksa",      key: "destinations.ksa.name",       flagImg: "/flag-ksa.jpg", isDestination: true  },
  { id: "egypt",    key: "destinations.egypt.name",     flagImg: "/flag-egypt.jpg", isDestination: true  },
  { id: "oman",     key: "destinations.oman.name",      flagImg: "/flag-oman.jpg", isDestination: true  },
  { id: "india",    key: "destinations.india.name",     flagImg: "/flag-india.jpg", isDestination: true  },
  { id: "socotra",  key: "destinations.socotra.name",   flagImg: "/flag-yemen.jpg", isDestination: true  },
  { id: "malaysia", key: "destinations.malaysia.name",  flagImg: "/flag-malaysia.jpg", isDestination: true  },
  { id: "flights",  key: "nav.flights",                 isDestination: false },
];

export function QuickActionsBar() {
  const { t } = useTranslation();

  const trigger = (action: typeof actions[0]) => {
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
      {/* Mobile & Tablet: Native smooth touch-scroll bar */}
      <div className="lg:hidden">
        <div
          aria-label="Quick Actions"
          className="flex overflow-x-auto py-3 px-4 gap-3 no-scrollbar scroll-smooth"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => trigger(action)}
              aria-label={t(action.key)}
              className="flex shrink-0 items-center justify-center gap-2.5 rounded-2xl border border-[#0D2742]/10 bg-white px-4 py-3 shadow-[0_2px_12px_rgba(13,39,66,0.06)] active:scale-95 transition-transform"
            >
              <span className={`flex size-7 shrink-0 items-center justify-center rounded-full overflow-hidden ${
                action.isDestination
                  ? "bg-[#EAF6FB]"
                  : "bg-[#159DD3] text-white"
              }`}>
                {action.flagImg ? (
                  <img src={action.flagImg} alt={t(action.key)} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <Plane className="size-3.5" />
                )}
              </span>
              <span className="text-xs font-bold text-[#0D2742] whitespace-nowrap">
                {t(action.key)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Bar */}
      <div className="hidden lg:block">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 xl:px-12">
          <div className="grid grid-cols-7 gap-3 rounded-2xl border border-[#0D2742]/10 bg-white/90 p-3 shadow-[0_8px_30px_rgba(13,39,66,0.08)] backdrop-blur-md">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => trigger(action)}
                className="group flex items-center justify-center gap-2.5 rounded-xl p-2.5 transition-all hover:bg-[#EAF6FB] active:scale-95"
              >
                <span className={`flex size-8 shrink-0 items-center justify-center rounded-full overflow-hidden transition-transform group-hover:scale-110 ${
                  action.isDestination
                    ? "bg-[#EAF6FB]"
                    : "bg-[#159DD3] text-white"
                }`}>
                  {action.flagImg ? (
                    <img src={action.flagImg} alt={t(action.key)} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <Plane className="size-4" />
                  )}
                </span>
                <span className="text-xs font-bold text-[#0D2742] group-hover:text-primary transition-colors whitespace-nowrap">
                  {t(action.key)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}