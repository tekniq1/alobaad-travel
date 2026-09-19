# Alobaad Voyage

Create a ultra-modern, world-class luxury travel agency website for "العباد للسفريات والسياحة (Alobaad Travel & Tourism)" focusing on a high-conversion, mobile-first design with smooth micro-interactions and interactive 3D elements.



### 1. Brand Identity & Visual Aesthetics

- **Color System:**

  - Deep Midnight Blue / Navy (`#0F1F2C` / `#162836`) as the dark luxurious base and deep elements[span_0](start_span)[span_0](end_span).

  - Sky Cyan / Aero Blue (`#5CA8DF` / `#6CB5E9`) as the primary brand accent for glows, primary CTA, badges, and focal points[span_1](start_span)[span_1](end_span).

  - Pure Snow White (`#FFFFFF`) & Subtle Slate Glass (`rgba(255, 255, 255, 0.05)`) with backdrop blur (Glassmorphism).

  - Clean WhatsApp Vivid Emerald (`#25D366`) dedicated strictly to WhatsApp deep-link conversion triggers.

- **Typography:** Arabic font 'IBM Plex Sans Arabic' or 'Readex Pro' with modern geometric proportions and clean line heights.

- **Mood & Feel:** Premium, airy, futuristic yet approachable, reminiscent of luxury airline interfaces and high-end digital travel concierges.



### 2. 3D Elements & Interactive Visuals

- **Hero 3D Experience:** Integrate an interactive, lightweight 3D canvas (using Three.js / React Three Fiber / Spline embed) featuring an elegant, stylized 3D passenger aircraft banking smoothly towards the viewer[span_2](start_span)[span_2](end_span), leaving soft cyan particle trails[span_3](start_span)[span_3](end_span). The plane subtly tilts in response to mouse movement/gyroscope.

- **Ambient Motifs:** Subtle floating 3D/vector chevron motifs (derived from the wings in the Alobaad logo) gently hovering in the background with soft parallax on scroll[span_4](start_span)[span_4](end_span).



### 3. Layout & Structure (Single-Page Fluid Flow)



- **Header / Navbar:**

  - Ultra-sleek floating glassmorphic bar (`backdrop-blur-md`).

  - Alobaad logo (vector typography with the iconic wing badge)[span_5](start_span)[span_5](end_span).

  - Navigation links (الرئيسية, الوجهات, تذاكر الطيران, عن المكتب, تواصل معنا).

  - Floating CTA Button: "تواصل مباشر" with an ambient pulsing ring.



- **Hero Section:**

  - Dynamic Arabic headline: "وجهتك القادمة تبدأ بضغطة زر — معاملات سفرك وتأشيراتك بأسرع وقت".

  - Subtitle: "خدمات التأشيرات السريعة، الموافقات الأمنية، رحلات العمرة، وأفضل أسعار تذاكر الطيران مع العباد للسفريات والسياحة.[span_6](start_span)"[span_6](end_span)

  - Smooth interactive CTA button that smoothly scrolls down to the destinations section.



- **Interactive Destinations Grid (The Core Experience):**

  - Render an interactive 3D Tilt Card Grid (using Framer Motion) for key destinations:

    1. **سلطنة عمان (Oman):** (Services: تأشيرة عبور, تأشيرة 20 يوم, تأشيرة 3 أشهر, موافقة أمنية).

    2. **مصر (Egypt):** (Services: موافقات أمنية سريعة, تذاكر طيران).

    3. **المملكة العربية السعودية (KSA):** (Services: برامج العمرة المتميزة, تأشيرات, طيران).

    4. **وجهات سياحية عالمية:** (تركيا، ماليزيا، دبي...).

    5. **حجز تذاكر الطيران المستقل:** Designed like an interactive luxury Boarding Pass ticket card[span_7](start_span)[span_7](end_span).

  - **Card Hover / Tap State:**

    - On Desktop: Hovering creates a 3D tilt perspective with an inner cyan border glow[span_8](start_span)[span_8](end_span).

    - On Click (Mobile & Desktop): Smoothly expands into a bottom-sheet (on mobile) or an elegant glass overlay modal (on desktop) listing the services as pill badges / chips.

    - Selecting any service instantly generates an active WhatsApp CTA button that links to `https://wa.me/` preloaded with the exact contextual inquiry text.



- **Interactive Flight Quotation Widget:**

  - Minimalistic, 4-step interactive bar: (مسار الرحلة: من / إلى, نوع التذكرة, التاريخ, عدد المسافرين).

  - Clicking "طلب عرض سعر" dynamically compiles the inputs and opens WhatsApp with a ready-to-send formatted flight query.



- **Trust & Value Matrix:**

  - 3-column micro-feature cards with glass reflections highlighting: سرعة إصدار الموافقات، أسعار طيران منافسة، ودعم مستمر عبر واتساب.



- **Footer & Sticky Action:**

  - Essential contact details, interactive map pinpoint, and business hours.

  - Floating Sticky WhatsApp CTA button at the bottom corner with a subtle breathing pulse animation and tooltip: "تواصل معنا مباشرة الآن".



### 4. Animations & Micro-Interactions (Framer Motion / Tailwind)

- Page load stagger transitions for all elements (`staggerChildren: 0.1`).

- Card entrance animations using smooth cubic-bezier easing (`easeOut`).

- Haptic-style feedback on tap for mobile devices.

- Smooth transitions when toggling between destinations and their sub-services.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://sky-path-glow.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a840532f-5189-450d-9e84-83e7210b35f8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
