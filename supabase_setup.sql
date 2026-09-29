-- ============================================================
-- سكريبت إعداد قاعدة البيانات الكاملة — العباد للسفريات
-- نفّذ هذا الملف كاملاً دفعة واحدة في Supabase > SQL Editor
-- ============================================================

-- 1. تفعيل UUID إن لم يكن مفعلاً
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ============================================================
-- 2. جدول الإعدادات العامة للموقع
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  whatsapp_number TEXT NOT NULL DEFAULT '96876652555',
  email_address   TEXT DEFAULT 'info@alobaad.com',
  address_ar      TEXT DEFAULT 'اليمن، إب | عُمان، مسقط',
  address_en      TEXT DEFAULT 'Yemen, Ibb | Oman, Muscat',
  facebook_url    TEXT DEFAULT '',
  instagram_url   TEXT DEFAULT '',
  updated_at      TIMESTAMP DEFAULT now()
);

-- إضافة الأعمدة إن كانت الجداول موجودة مسبقاً بدون هذه الأعمدة
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS address_ar TEXT DEFAULT 'اليمن، إب | عُمان، مسقط';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS address_en TEXT DEFAULT 'Yemen, Ibb | Oman, Muscat';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS facebook_url TEXT DEFAULT '';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS instagram_url TEXT DEFAULT '';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT now();

-- إدخال الإعدادات الافتراضية إن كان الجدول فارغاً
INSERT INTO site_settings (whatsapp_number, email_address, address_ar, address_en)
SELECT '96876652555', 'info@alobaad.com', 'اليمن، إب | عُمان، مسقط', 'Yemen, Ibb | Oman, Muscat'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);


-- ============================================================
-- 3. جدول الوجهات السياحية (موجود لكن نضيف ما قد يكون ناقصاً)
-- ============================================================
CREATE TABLE IF NOT EXISTS destinations (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug           TEXT UNIQUE NOT NULL,
  name_ar        TEXT NOT NULL,
  name_en        TEXT NOT NULL,
  description_ar TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  image_url      TEXT DEFAULT '',
  flag_url       TEXT DEFAULT '',
  sort_order     INT DEFAULT 99,
  is_active      BOOLEAN DEFAULT true,
  created_at     TIMESTAMP DEFAULT now()
);

ALTER TABLE destinations ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT now();


-- ============================================================
-- 4. جدول الخدمات (موجود لكن نضيف ما قد يكون ناقصاً)
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  destination_id   UUID REFERENCES destinations(id) ON DELETE CASCADE,
  title_ar         TEXT NOT NULL,
  title_en         TEXT NOT NULL,
  wa_message_ar    TEXT NOT NULL DEFAULT '',
  wa_message_en    TEXT NOT NULL DEFAULT '',
  requires_passport BOOLEAN DEFAULT true,
  sort_order       INT DEFAULT 99,
  is_active        BOOLEAN DEFAULT true
);

ALTER TABLE services ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;


-- ============================================================
-- 5. جدول المطارات (موجود لكن نضيف ما قد يكون ناقصاً)
-- ============================================================
CREATE TABLE IF NOT EXISTS airports (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id   UUID REFERENCES services(id) ON DELETE CASCADE,
  name_ar      TEXT NOT NULL,
  name_en      TEXT NOT NULL,
  wa_message_ar TEXT NOT NULL DEFAULT '',
  wa_message_en TEXT NOT NULL DEFAULT '',
  sort_order   INT DEFAULT 99
);


-- ============================================================
-- 6. جدول صفحات الموقع (عن المكتب، وغيرها)
-- ============================================================
CREATE TABLE IF NOT EXISTS pages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug       TEXT UNIQUE NOT NULL,
  title_ar   TEXT NOT NULL,
  title_en   TEXT NOT NULL,
  content_ar TEXT NOT NULL DEFAULT '',
  content_en TEXT NOT NULL DEFAULT '',
  vision_ar  TEXT DEFAULT '',
  vision_en  TEXT DEFAULT '',
  mission_ar TEXT DEFAULT '',
  mission_en TEXT DEFAULT '',
  updated_at TIMESTAMP DEFAULT now()
);

-- إدخال صفحة "عن المكتب" الافتراضية
INSERT INTO pages (slug, title_ar, title_en, content_ar, content_en, vision_ar, vision_en, mission_ar, mission_en)
SELECT
  'about',
  'عن العباد للسفريات',
  'About Al-Abbad Travel',
  'وكالة العباد للسفريات والسياحة وكالة متخصصة في تقديم خدمات السفر والسياحة المتكاملة. نعمل بخبرة واحترافية عالية لتلبية احتياجات عملائنا من تأشيرات وموافقات أمنية وتذاكر طيران وبرامج عمرة وسياحة.',
  'Al-Abbad Travel & Tourism is a specialized agency providing comprehensive travel and tourism services. We work with high expertise and professionalism to meet our clients needs.',
  'أن نكون الخيار الأول والمرجع الموثوق لكل من يرغب في السفر والسياحة في المنطقة.',
  'To be the first choice and trusted reference for everyone wishing to travel in the region.',
  'تقديم خدمات سفر متكاملة وموثوقة بأعلى معايير الجودة والاحترافية.',
  'Providing comprehensive and reliable travel services with the highest standards of quality and professionalism.'
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE slug = 'about');


-- ============================================================
-- 7. جدول طلبات التواصل / نقرات الواتساب
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_requests (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type         TEXT NOT NULL DEFAULT 'whatsapp', -- whatsapp | flight_quote | contact_form
  name         TEXT DEFAULT '',
  phone        TEXT DEFAULT '',
  destination  TEXT DEFAULT '',
  service      TEXT DEFAULT '',
  message      TEXT DEFAULT '',
  status       TEXT DEFAULT 'new', -- new | read | replied
  created_at   TIMESTAMP DEFAULT now()
);


-- ============================================================
-- 8. تعطيل حماية الصفوف (RLS) لجميع الجداول
--    (لمرحلة التطوير — يمكن تفعيل سياسات أكثر تحكماً لاحقاً)
-- ============================================================
ALTER TABLE site_settings    DISABLE ROW LEVEL SECURITY;
ALTER TABLE destinations     DISABLE ROW LEVEL SECURITY;
ALTER TABLE services         DISABLE ROW LEVEL SECURITY;
ALTER TABLE airports         DISABLE ROW LEVEL SECURITY;
ALTER TABLE pages            DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests DISABLE ROW LEVEL SECURITY;


-- ============================================================
-- 9. تحديث الإعدادات الحالية بالأعمدة الجديدة (إن وُجد صف)
-- ============================================================
UPDATE site_settings
SET
  address_ar    = COALESCE(address_ar, 'اليمن، إب | عُمان، مسقط'),
  address_en    = COALESCE(address_en, 'Yemen, Ibb | Oman, Muscat'),
  facebook_url  = COALESCE(facebook_url, ''),
  instagram_url = COALESCE(instagram_url, '')
WHERE id IS NOT NULL;


-- ============================================================
-- انتهى! كل الجداول جاهزة ✅
-- ============================================================
