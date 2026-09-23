import { destinations } from '../data/destinations';
import fs from 'fs';
import path from 'path';

let sql = '';
let destOrder = 1;
for (const dest of destinations) {
  sql += `
INSERT INTO destinations (slug, name_ar, name_en, description_ar, description_en, image_url, flag_url, sort_order)
VALUES ('${dest.id}', '${dest.name}', '${dest.name}', '${dest.description}', '${dest.description}', '${dest.image || ''}', '${dest.flagImg || ''}', ${destOrder++})
ON CONFLICT (slug) DO NOTHING;
`;

  let serviceOrder = 1;
  for (const service of dest.services || []) {
    sql += `
INSERT INTO services (destination_id, title_ar, title_en, wa_message_ar, wa_message_en, requires_passport, sort_order)
VALUES (
  (SELECT id FROM destinations WHERE slug = '${dest.id}'), 
  '${service.title}', '${service.title}', '${service.whatsappMessage}', '${service.whatsappMessage}', ${service.requiresPassport || false}, ${serviceOrder++}
);
`;

    if (service.airports) {
      let airportOrder = 1;
      for (const airport of service.airports) {
        sql += `
INSERT INTO airports (service_id, name_ar, name_en, wa_message_ar, wa_message_en, sort_order)
VALUES (
  (SELECT id FROM services WHERE title_ar = '${service.title}' AND destination_id = (SELECT id FROM destinations WHERE slug = '${dest.id}') LIMIT 1),
  '${airport.name}', '${airport.name}', '${airport.whatsappMessage}', '${airport.whatsappMessage}', ${airportOrder++}
);
`;
      }
    }
  }
}

fs.writeFileSync(path.resolve(process.cwd(), 'seed2.sql'), sql);
