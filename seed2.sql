
INSERT INTO destinations (slug, name_ar, name_en, description_ar, description_en, image_url, flag_url, sort_order)
VALUES ('oman', 'سلطنة عمان', 'سلطنة عمان', 'تأشيرات، موافقات، تذاكر طيران', 'تأشيرات، موافقات، تذاكر طيران', '/oman-destination.jpg', '/flag-oman.jpg', 1)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (destination_id, title_ar, title_en, wa_message_ar, wa_message_en, requires_passport, sort_order)
VALUES (
  (SELECT id FROM destinations WHERE slug = 'oman'), 
  'الموافقات الأمنية', 'الموافقات الأمنية', 'السلام عليكم، أرغب بالاستفسار عن الموافقات الأمنية لسلطنة عمان.', 'السلام عليكم، أرغب بالاستفسار عن الموافقات الأمنية لسلطنة عمان.', true, 1
);

INSERT INTO services (destination_id, title_ar, title_en, wa_message_ar, wa_message_en, requires_passport, sort_order)
VALUES (
  (SELECT id FROM destinations WHERE slug = 'oman'), 
  'تأشيرة عبور', 'تأشيرة عبور', 'السلام عليكم، أرغب بالاستفسار عن تأشيرة العبور لسلطنة عمان.', 'السلام عليكم، أرغب بالاستفسار عن تأشيرة العبور لسلطنة عمان.', true, 2
);

INSERT INTO services (destination_id, title_ar, title_en, wa_message_ar, wa_message_en, requires_passport, sort_order)
VALUES (
  (SELECT id FROM destinations WHERE slug = 'oman'), 
  'تأشيرة 20 يوم', 'تأشيرة 20 يوم', 'السلام عليكم، أرغب بالاستفسار عن تأشيرة سلطنة عمان لمدة 20 يوم.', 'السلام عليكم، أرغب بالاستفسار عن تأشيرة سلطنة عمان لمدة 20 يوم.', true, 3
);

INSERT INTO services (destination_id, title_ar, title_en, wa_message_ar, wa_message_en, requires_passport, sort_order)
VALUES (
  (SELECT id FROM destinations WHERE slug = 'oman'), 
  'تأشيرة 3 أشهر', 'تأشيرة 3 أشهر', 'السلام عليكم، أرغب بالاستفسار عن تأشيرة سلطنة عمان لمدة 3 أشهر.', 'السلام عليكم، أرغب بالاستفسار عن تأشيرة سلطنة عمان لمدة 3 أشهر.', true, 4
);

INSERT INTO services (destination_id, title_ar, title_en, wa_message_ar, wa_message_en, requires_passport, sort_order)
VALUES (
  (SELECT id FROM destinations WHERE slug = 'oman'), 
  'تذاكر الطيران', 'تذاكر الطيران', 'السلام عليكم، أرغب بالاستفسار عن أسعار تذاكر الطيران إلى سلطنة عمان.', 'السلام عليكم، أرغب بالاستفسار عن أسعار تذاكر الطيران إلى سلطنة عمان.', true, 5
);

INSERT INTO airports (service_id, name_ar, name_en, wa_message_ar, wa_message_en, sort_order)
VALUES (
  (SELECT id FROM services WHERE title_ar = 'تذاكر الطيران' AND destination_id = (SELECT id FROM destinations WHERE slug = 'oman') LIMIT 1),
  'مطار مسقط الدولي', 'مطار مسقط الدولي', 'السلام عليكم، أرغب بالاستفسار عن تذاكر الطيران إلى عُمان (مطار مسقط).', 'السلام عليكم، أرغب بالاستفسار عن تذاكر الطيران إلى عُمان (مطار مسقط).', 1
);

INSERT INTO airports (service_id, name_ar, name_en, wa_message_ar, wa_message_en, sort_order)
VALUES (
  (SELECT id FROM services WHERE title_ar = 'تذاكر الطيران' AND destination_id = (SELECT id FROM destinations WHERE slug = 'oman') LIMIT 1),
  'مطار صلالة', 'مطار صلالة', 'السلام عليكم، أرغب بالاستفسار عن تذاكر الطيران إلى عُمان (مطار صلالة).', 'السلام عليكم، أرغب بالاستفسار عن تذاكر الطيران إلى عُمان (مطار صلالة).', 2
);

INSERT INTO destinations (slug, name_ar, name_en, description_ar, description_en, image_url, flag_url, sort_order)
VALUES ('egypt', 'مصر', 'مصر', 'موافقات • تذاكر', 'موافقات • تذاكر', '/egypt-pyramids.jpg', '/flag-egypt.jpg', 2)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (destination_id, title_ar, title_en, wa_message_ar, wa_message_en, requires_passport, sort_order)
VALUES (
  (SELECT id FROM destinations WHERE slug = 'egypt'), 
  'الموافقات الأمنية', 'الموافقات الأمنية', 'السلام عليكم، أرغب بالاستفسار عن الموافقات الأمنية لجمهورية مصر.', 'السلام عليكم، أرغب بالاستفسار عن الموافقات الأمنية لجمهورية مصر.', true, 1
);

INSERT INTO services (destination_id, title_ar, title_en, wa_message_ar, wa_message_en, requires_passport, sort_order)
VALUES (
  (SELECT id FROM destinations WHERE slug = 'egypt'), 
  'تذاكر الطيران', 'تذاكر الطيران', 'السلام عليكم، أرغب بالاستفسار عن تذاكر الطيران إلى مصر.', 'السلام عليكم، أرغب بالاستفسار عن تذاكر الطيران إلى مصر.', true, 2
);

INSERT INTO airports (service_id, name_ar, name_en, wa_message_ar, wa_message_en, sort_order)
VALUES (
  (SELECT id FROM services WHERE title_ar = 'تذاكر الطيران' AND destination_id = (SELECT id FROM destinations WHERE slug = 'egypt') LIMIT 1),
  'مطار القاهرة الدولي', 'مطار القاهرة الدولي', 'السلام عليكم، أرغب بتذاكر طيران إلى مصر (مطار القاهرة).', 'السلام عليكم، أرغب بتذاكر طيران إلى مصر (مطار القاهرة).', 1
);

INSERT INTO airports (service_id, name_ar, name_en, wa_message_ar, wa_message_en, sort_order)
VALUES (
  (SELECT id FROM services WHERE title_ar = 'تذاكر الطيران' AND destination_id = (SELECT id FROM destinations WHERE slug = 'egypt') LIMIT 1),
  'مطار برج العرب (الإسكندرية)', 'مطار برج العرب (الإسكندرية)', 'السلام عليكم، أرغب بتذاكر طيران إلى مصر (مطار برج العرب - الإسكندرية).', 'السلام عليكم، أرغب بتذاكر طيران إلى مصر (مطار برج العرب - الإسكندرية).', 2
);

INSERT INTO destinations (slug, name_ar, name_en, description_ar, description_en, image_url, flag_url, sort_order)
VALUES ('ksa', 'السعودية', 'السعودية', 'عمرة • طيران', 'عمرة • طيران', '/ksa-destination.jpg', '/flag-ksa.jpg', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (destination_id, title_ar, title_en, wa_message_ar, wa_message_en, requires_passport, sort_order)
VALUES (
  (SELECT id FROM destinations WHERE slug = 'ksa'), 
  'العمرة', 'العمرة', 'السلام عليكم، أرغب بالاستفسار عن برامج وتأشيرات العمرة.', 'السلام عليكم، أرغب بالاستفسار عن برامج وتأشيرات العمرة.', true, 1
);

INSERT INTO airports (service_id, name_ar, name_en, wa_message_ar, wa_message_en, sort_order)
VALUES (
  (SELECT id FROM services WHERE title_ar = 'العمرة' AND destination_id = (SELECT id FROM destinations WHERE slug = 'ksa') LIMIT 1),
  'مطار الملك عبدالعزيز (جدة)', 'مطار الملك عبدالعزيز (جدة)', 'السلام عليكم، أرغب بالاستفسار عن برامج العمرة وتذاكر الطيران إلى جدة.', 'السلام عليكم، أرغب بالاستفسار عن برامج العمرة وتذاكر الطيران إلى جدة.', 1
);

INSERT INTO airports (service_id, name_ar, name_en, wa_message_ar, wa_message_en, sort_order)
VALUES (
  (SELECT id FROM services WHERE title_ar = 'العمرة' AND destination_id = (SELECT id FROM destinations WHERE slug = 'ksa') LIMIT 1),
  'مطار الأمير محمد بن عبدالعزيز (المدينة)', 'مطار الأمير محمد بن عبدالعزيز (المدينة)', 'السلام عليكم، أرغب بالاستفسار عن برامج العمرة وتذاكر الطيران إلى المدينة المنورة.', 'السلام عليكم، أرغب بالاستفسار عن برامج العمرة وتذاكر الطيران إلى المدينة المنورة.', 2
);

INSERT INTO services (destination_id, title_ar, title_en, wa_message_ar, wa_message_en, requires_passport, sort_order)
VALUES (
  (SELECT id FROM destinations WHERE slug = 'ksa'), 
  'تذاكر الطيران', 'تذاكر الطيران', 'السلام عليكم، أرغب بالاستفسار عن تذاكر الطيران إلى السعودية.', 'السلام عليكم، أرغب بالاستفسار عن تذاكر الطيران إلى السعودية.', true, 2
);

INSERT INTO airports (service_id, name_ar, name_en, wa_message_ar, wa_message_en, sort_order)
VALUES (
  (SELECT id FROM services WHERE title_ar = 'تذاكر الطيران' AND destination_id = (SELECT id FROM destinations WHERE slug = 'ksa') LIMIT 1),
  'مطار جدة', 'مطار جدة', 'السلام عليكم، أرغب بتذاكر طيران إلى السعودية (مطار جدة).', 'السلام عليكم، أرغب بتذاكر طيران إلى السعودية (مطار جدة).', 1
);

INSERT INTO airports (service_id, name_ar, name_en, wa_message_ar, wa_message_en, sort_order)
VALUES (
  (SELECT id FROM services WHERE title_ar = 'تذاكر الطيران' AND destination_id = (SELECT id FROM destinations WHERE slug = 'ksa') LIMIT 1),
  'مطار الرياض', 'مطار الرياض', 'السلام عليكم، أرغب بتذاكر طيران إلى السعودية (مطار الرياض).', 'السلام عليكم، أرغب بتذاكر طيران إلى السعودية (مطار الرياض).', 2
);

INSERT INTO airports (service_id, name_ar, name_en, wa_message_ar, wa_message_en, sort_order)
VALUES (
  (SELECT id FROM services WHERE title_ar = 'تذاكر الطيران' AND destination_id = (SELECT id FROM destinations WHERE slug = 'ksa') LIMIT 1),
  'مطار الدمام', 'مطار الدمام', 'السلام عليكم، أرغب بتذاكر طيران إلى السعودية (مطار الدمام).', 'السلام عليكم، أرغب بتذاكر طيران إلى السعودية (مطار الدمام).', 3
);

INSERT INTO airports (service_id, name_ar, name_en, wa_message_ar, wa_message_en, sort_order)
VALUES (
  (SELECT id FROM services WHERE title_ar = 'تذاكر الطيران' AND destination_id = (SELECT id FROM destinations WHERE slug = 'ksa') LIMIT 1),
  'مطار المدينة المنورة', 'مطار المدينة المنورة', 'السلام عليكم، أرغب بتذاكر طيران إلى السعودية (مطار المدينة المنورة).', 'السلام عليكم، أرغب بتذاكر طيران إلى السعودية (مطار المدينة المنورة).', 4
);

INSERT INTO destinations (slug, name_ar, name_en, description_ar, description_en, image_url, flag_url, sort_order)
VALUES ('tourism', 'الرحلات السياحية', 'الرحلات السياحية', 'رحلات وتجارب سياحية لوجهات متعددة', 'رحلات وتجارب سياحية لوجهات متعددة', '/tourism-destination.jpg', '', 4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (destination_id, title_ar, title_en, wa_message_ar, wa_message_en, requires_passport, sort_order)
VALUES (
  (SELECT id FROM destinations WHERE slug = 'tourism'), 
  'تركيا', 'تركيا', 'السلام عليكم، أرغب بالاستفسار عن الرحلات السياحية والتأشيرات إلى تركيا.', 'السلام عليكم، أرغب بالاستفسار عن الرحلات السياحية والتأشيرات إلى تركيا.', true, 1
);

INSERT INTO services (destination_id, title_ar, title_en, wa_message_ar, wa_message_en, requires_passport, sort_order)
VALUES (
  (SELECT id FROM destinations WHERE slug = 'tourism'), 
  'ماليزيا', 'ماليزيا', 'السلام عليكم، أرغب بالاستفسار عن الرحلات السياحية إلى ماليزيا.', 'السلام عليكم، أرغب بالاستفسار عن الرحلات السياحية إلى ماليزيا.', true, 2
);

INSERT INTO services (destination_id, title_ar, title_en, wa_message_ar, wa_message_en, requires_passport, sort_order)
VALUES (
  (SELECT id FROM destinations WHERE slug = 'tourism'), 
  'دبي', 'دبي', 'السلام عليكم، أرغب بالاستفسار عن تأشيرات ورحلات دبي.', 'السلام عليكم، أرغب بالاستفسار عن تأشيرات ورحلات دبي.', true, 3
);

INSERT INTO destinations (slug, name_ar, name_en, description_ar, description_en, image_url, flag_url, sort_order)
VALUES ('india', 'الهند', 'الهند', 'تأشيرات علاجية • تذاكر', 'تأشيرات علاجية • تذاكر', 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1200&auto=format&fit=crop', '/flag-india.jpg', 5)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (destination_id, title_ar, title_en, wa_message_ar, wa_message_en, requires_passport, sort_order)
VALUES (
  (SELECT id FROM destinations WHERE slug = 'india'), 
  'تأشيرات علاجية', 'تأشيرات علاجية', 'السلام عليكم، أرغب بالاستفسار عن التأشيرات العلاجية للهند.', 'السلام عليكم، أرغب بالاستفسار عن التأشيرات العلاجية للهند.', true, 1
);

INSERT INTO services (destination_id, title_ar, title_en, wa_message_ar, wa_message_en, requires_passport, sort_order)
VALUES (
  (SELECT id FROM destinations WHERE slug = 'india'), 
  'تذاكر السفر', 'تذاكر السفر', 'السلام عليكم، أرغب بالاستفسار عن تذاكر السفر إلى الهند.', 'السلام عليكم، أرغب بالاستفسار عن تذاكر السفر إلى الهند.', true, 2
);

INSERT INTO airports (service_id, name_ar, name_en, wa_message_ar, wa_message_en, sort_order)
VALUES (
  (SELECT id FROM services WHERE title_ar = 'تذاكر السفر' AND destination_id = (SELECT id FROM destinations WHERE slug = 'india') LIMIT 1),
  'مطار نيودلهي', 'مطار نيودلهي', 'السلام عليكم، أرغب بتذاكر طيران إلى الهند (مطار نيودلهي).', 'السلام عليكم، أرغب بتذاكر طيران إلى الهند (مطار نيودلهي).', 1
);

INSERT INTO airports (service_id, name_ar, name_en, wa_message_ar, wa_message_en, sort_order)
VALUES (
  (SELECT id FROM services WHERE title_ar = 'تذاكر السفر' AND destination_id = (SELECT id FROM destinations WHERE slug = 'india') LIMIT 1),
  'مطار مومباي', 'مطار مومباي', 'السلام عليكم، أرغب بتذاكر طيران إلى الهند (مطار مومباي).', 'السلام عليكم، أرغب بتذاكر طيران إلى الهند (مطار مومباي).', 2
);

INSERT INTO airports (service_id, name_ar, name_en, wa_message_ar, wa_message_en, sort_order)
VALUES (
  (SELECT id FROM services WHERE title_ar = 'تذاكر السفر' AND destination_id = (SELECT id FROM destinations WHERE slug = 'india') LIMIT 1),
  'مطار تشيناي / بنغالور', 'مطار تشيناي / بنغالور', 'السلام عليكم، أرغب بتذاكر طيران إلى الهند (مطار تشيناي/بنغالور للعلاج).', 'السلام عليكم، أرغب بتذاكر طيران إلى الهند (مطار تشيناي/بنغالور للعلاج).', 3
);

INSERT INTO destinations (slug, name_ar, name_en, description_ar, description_en, image_url, flag_url, sort_order)
VALUES ('socotra', 'سقطرى', 'سقطرى', 'رحلات متكاملة', 'رحلات متكاملة', '/socotra-destination.jpg', '/flag-yemen.jpg', 6)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (destination_id, title_ar, title_en, wa_message_ar, wa_message_en, requires_passport, sort_order)
VALUES (
  (SELECT id FROM destinations WHERE slug = 'socotra'), 
  'رحلات متكاملة', 'رحلات متكاملة', 'السلام عليكم، أرغب بالاستفسار عن الرحلات المتكاملة إلى سقطرى.', 'السلام عليكم، أرغب بالاستفسار عن الرحلات المتكاملة إلى سقطرى.', true, 1
);

INSERT INTO destinations (slug, name_ar, name_en, description_ar, description_en, image_url, flag_url, sort_order)
VALUES ('malaysia', 'ماليزيا', 'ماليزيا', 'تذاكر • منح دراسية • سياحة', 'تذاكر • منح دراسية • سياحة', '/malaysia-destination.jpg', '/flag-malaysia.jpg', 7)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (destination_id, title_ar, title_en, wa_message_ar, wa_message_en, requires_passport, sort_order)
VALUES (
  (SELECT id FROM destinations WHERE slug = 'malaysia'), 
  'تذاكر السفر', 'تذاكر السفر', 'السلام عليكم، أرغب بالاستفسار عن تذاكر السفر إلى ماليزيا.', 'السلام عليكم، أرغب بالاستفسار عن تذاكر السفر إلى ماليزيا.', true, 1
);

INSERT INTO airports (service_id, name_ar, name_en, wa_message_ar, wa_message_en, sort_order)
VALUES (
  (SELECT id FROM services WHERE title_ar = 'تذاكر السفر' AND destination_id = (SELECT id FROM destinations WHERE slug = 'malaysia') LIMIT 1),
  'مطار كوالالمبور (KLIA)', 'مطار كوالالمبور (KLIA)', 'السلام عليكم، أرغب بتذاكر طيران إلى ماليزيا (مطار كوالالمبور).', 'السلام عليكم، أرغب بتذاكر طيران إلى ماليزيا (مطار كوالالمبور).', 1
);

INSERT INTO services (destination_id, title_ar, title_en, wa_message_ar, wa_message_en, requires_passport, sort_order)
VALUES (
  (SELECT id FROM destinations WHERE slug = 'malaysia'), 
  'منح دراسية', 'منح دراسية', 'السلام عليكم، أرغب بالاستفسار عن المنح الدراسية في ماليزيا.', 'السلام عليكم، أرغب بالاستفسار عن المنح الدراسية في ماليزيا.', true, 2
);

INSERT INTO services (destination_id, title_ar, title_en, wa_message_ar, wa_message_en, requires_passport, sort_order)
VALUES (
  (SELECT id FROM destinations WHERE slug = 'malaysia'), 
  'رحلات سياحية', 'رحلات سياحية', 'السلام عليكم، أرغب بالاستفسار عن البرامج والرحلات السياحية إلى ماليزيا.', 'السلام عليكم، أرغب بالاستفسار عن البرامج والرحلات السياحية إلى ماليزيا.', true, 3
);
