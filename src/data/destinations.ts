export type Service = {
  title: string;
  whatsappMessage: string;
};

export type Destination = {
  id: string;
  name: string;
  image: string;
  description: string;
  services: Service[];
};

export const destinations: Destination[] = [
  {
    id: "oman",
    name: "سلطنة عُمان",
    image: "https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?q=80&w=1200&auto=format&fit=crop",
    description: "تأشيرات • موافقات • تذاكر",
    services: [
      { title: "الموافقات الأمنية", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن الموافقات الأمنية لسلطنة عمان لدى مكتب العباد للسفريات والسياحة." },
      { title: "تأشيرة عبور", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن تأشيرة العبور لسلطنة عمان لدى مكتب العباد للسفريات والسياحة." },
      { title: "تأشيرة 20 يوم", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن تأشيرة سلطنة عمان لمدة 20 يوم لدى مكتب العباد للسفريات والسياحة." },
      { title: "تأشيرة 3 أشهر", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن تأشيرة سلطنة عمان لمدة 3 أشهر لدى مكتب العباد للسفريات والسياحة." },
      { title: "تذاكر الطيران", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن أسعار تذاكر الطيران إلى سلطنة عمان لدى مكتب العباد للسفريات والسياحة." }
    ]
  },
  {
    id: "egypt",
    name: "مصر",
    image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=800&auto=format&fit=crop",
    description: "موافقات • تذاكر",
    services: [
      { title: "الموافقات الأمنية", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن الموافقات الأمنية لجمهورية مصر لدى مكتب العباد للسفريات والسياحة." },
      { title: "تذاكر الطيران", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن تذاكر الطيران إلى مصر لدى مكتب العباد للسفريات والسياحة." }
    ]
  },
  {
    id: "ksa",
    name: "السعودية",
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1200&auto=format&fit=crop",
    description: "عمرة • طيران",
    services: [
      { title: "العمرة", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن برامج وتأشيرات العمرة للسعودية لدى مكتب العباد للسفريات والسياحة." },
      { title: "تذاكر الطيران", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن تذاكر الطيران إلى السعودية لدى مكتب العباد للسفريات والسياحة." }
    ]
  },
  {
    id: "tourism",
    name: "الرحلات السياحية",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop",
    description: "رحلات وتجارب سياحية لوجهات متعددة",
    services: [
      { title: "تركيا", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن الرحلات السياحية والتأشيرات إلى تركيا لدى مكتب العباد." },
      { title: "ماليزيا", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن الرحلات السياحية إلى ماليزيا لدى مكتب العباد." },
      { title: "دبي", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن تأشيرات ورحلات دبي لدى مكتب العباد." }
    ]
  }
];
