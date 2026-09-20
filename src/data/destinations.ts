export type Airport = {
  name: string;
  whatsappMessage: string;
};

export type Service = {
  title: string;
  whatsappMessage: string;
  requiresPassport?: boolean;
  airports?: Airport[];
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
      { title: "الموافقات الأمنية", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن الموافقات الأمنية لسلطنة عمان.", requiresPassport: true },
      { title: "تأشيرة عبور", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن تأشيرة العبور لسلطنة عمان.", requiresPassport: true },
      { title: "تأشيرة 20 يوم", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن تأشيرة سلطنة عمان لمدة 20 يوم.", requiresPassport: true },
      { title: "تأشيرة 3 أشهر", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن تأشيرة سلطنة عمان لمدة 3 أشهر.", requiresPassport: true },
      { 
        title: "تذاكر الطيران", 
        whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن أسعار تذاكر الطيران إلى سلطنة عمان.", 
        requiresPassport: true,
        airports: [
          { name: "مطار مسقط الدولي", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن تذاكر الطيران إلى عُمان (مطار مسقط)." },
          { name: "مطار صلالة", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن تذاكر الطيران إلى عُمان (مطار صلالة)." }
        ]
      }
    ]
  },
  {
    id: "egypt",
    name: "مصر",
    image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=800&auto=format&fit=crop",
    description: "موافقات • تذاكر",
    services: [
      { title: "الموافقات الأمنية", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن الموافقات الأمنية لجمهورية مصر.", requiresPassport: true },
      { 
        title: "تذاكر الطيران", 
        whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن تذاكر الطيران إلى مصر.", 
        requiresPassport: true,
        airports: [
          { name: "مطار القاهرة الدولي", whatsappMessage: "السلام عليكم، أرغب بتذاكر طيران إلى مصر (مطار القاهرة)." },
          { name: "مطار برج العرب (الإسكندرية)", whatsappMessage: "السلام عليكم، أرغب بتذاكر طيران إلى مصر (مطار برج العرب - الإسكندرية)." }
        ]
      }
    ]
  },
  {
    id: "ksa",
    name: "السعودية",
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1200&auto=format&fit=crop",
    description: "عمرة • طيران",
    services: [
      { 
        title: "العمرة", 
        whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن برامج وتأشيرات العمرة.", 
        requiresPassport: true,
        airports: [
          { name: "مطار الملك عبدالعزيز (جدة)", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن برامج العمرة وتذاكر الطيران إلى جدة." },
          { name: "مطار الأمير محمد بن عبدالعزيز (المدينة)", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن برامج العمرة وتذاكر الطيران إلى المدينة المنورة." }
        ]
      },
      { 
        title: "تذاكر الطيران", 
        whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن تذاكر الطيران إلى السعودية.", 
        requiresPassport: true,
        airports: [
          { name: "مطار جدة", whatsappMessage: "السلام عليكم، أرغب بتذاكر طيران إلى السعودية (مطار جدة)." },
          { name: "مطار الرياض", whatsappMessage: "السلام عليكم، أرغب بتذاكر طيران إلى السعودية (مطار الرياض)." },
          { name: "مطار الدمام", whatsappMessage: "السلام عليكم، أرغب بتذاكر طيران إلى السعودية (مطار الدمام)." },
          { name: "مطار المدينة المنورة", whatsappMessage: "السلام عليكم، أرغب بتذاكر طيران إلى السعودية (مطار المدينة المنورة)." }
        ]
      }
    ]
  },
  {
    id: "tourism",
    name: "الرحلات السياحية",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop",
    description: "رحلات وتجارب سياحية لوجهات متعددة",
    services: [
      { title: "تركيا", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن الرحلات السياحية والتأشيرات إلى تركيا.", requiresPassport: true },
      { title: "ماليزيا", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن الرحلات السياحية إلى ماليزيا.", requiresPassport: true },
      { title: "دبي", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن تأشيرات ورحلات دبي.", requiresPassport: true }
    ]
  },
  {
    id: "india",
    name: "الهند",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1200&auto=format&fit=crop",
    description: "تأشيرات علاجية • تذاكر",
    services: [
      { title: "تأشيرات علاجية", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن التأشيرات العلاجية للهند.", requiresPassport: true },
      { 
        title: "تذاكر السفر", 
        whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن تذاكر السفر إلى الهند.", 
        requiresPassport: true,
        airports: [
          { name: "مطار نيودلهي", whatsappMessage: "السلام عليكم، أرغب بتذاكر طيران إلى الهند (مطار نيودلهي)." },
          { name: "مطار مومباي", whatsappMessage: "السلام عليكم، أرغب بتذاكر طيران إلى الهند (مطار مومباي)." },
          { name: "مطار تشيناي / بنغالور", whatsappMessage: "السلام عليكم، أرغب بتذاكر طيران إلى الهند (مطار تشيناي/بنغالور للعلاج)." }
        ]
      }
    ]
  },
  {
    id: "socotra",
    name: "سقطرى",
    image: "https://images.unsplash.com/photo-1635338148948-4395df3d0a63?q=80&w=1200&auto=format&fit=crop",
    description: "رحلات متكاملة",
    services: [
      { title: "رحلات متكاملة", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن الرحلات المتكاملة إلى سقطرى.", requiresPassport: true }
    ]
  },
  {
    id: "malaysia",
    name: "ماليزيا",
    image: "https://images.unsplash.com/photo-1599423300746-b62533397364?q=80&w=1200&auto=format&fit=crop",
    description: "تذاكر • منح دراسية • سياحة",
    services: [
      { 
        title: "تذاكر السفر", 
        whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن تذاكر السفر إلى ماليزيا.", 
        requiresPassport: true,
        airports: [
          { name: "مطار كوالالمبور (KLIA)", whatsappMessage: "السلام عليكم، أرغب بتذاكر طيران إلى ماليزيا (مطار كوالالمبور)." }
        ]
      },
      { title: "منح دراسية", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن المنح الدراسية في ماليزيا.", requiresPassport: true },
      { title: "رحلات سياحية", whatsappMessage: "السلام عليكم، أرغب بالاستفسار عن البرامج والرحلات السياحية إلى ماليزيا.", requiresPassport: true }
    ]
  }
];
