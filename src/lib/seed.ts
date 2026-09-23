import { createClient } from '@supabase/supabase-js';
import { destinations } from '../data/destinations';
import fs from 'fs';
import path from 'path';

// Read .env manually since this is a Node script
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
let SUPABASE_URL = '';
let SUPABASE_KEY = '';

envContent.split('\n').forEach(line => {
  if (line.startsWith('VITE_SUPABASE_URL=')) SUPABASE_URL = line.split('=')[1].trim();
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) SUPABASE_KEY = line.split('=')[1].trim();
});

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seed() {
  console.log("Seeding started...");
  let destOrder = 1;
  for (const dest of destinations) {
    // 1. Insert Destination
    const { data: destData, error: destError } = await supabase
      .from('destinations')
      .insert({
        slug: dest.id,
        name_ar: dest.name,
        name_en: dest.name, // using same for now
        description_ar: dest.description,
        description_en: dest.description,
        image_url: dest.image,
        flag_url: dest.flagImg,
        sort_order: destOrder++
      })
      .select('id')
      .single();

    if (destError) {
      if (destError.code === '23505') {
        console.log(`Destination ${dest.name} already exists. Skipping...`);
        continue;
      }
      console.error("Error inserting destination:", destError);
      return;
    }

    const destId = destData.id;
    console.log(`Inserted destination: ${dest.name}`);

    // 2. Insert Services
    let serviceOrder = 1;
    for (const service of dest.services || []) {
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .insert({
          destination_id: destId,
          title_ar: service.title,
          title_en: service.title,
          wa_message_ar: service.whatsappMessage,
          wa_message_en: service.whatsappMessage,
          requires_passport: service.requiresPassport || false,
          sort_order: serviceOrder++
        })
        .select('id')
        .single();

      if (serviceError) {
        console.error("Error inserting service:", serviceError);
        continue;
      }

      const serviceId = serviceData.id;
      
      // 3. Insert Airports
      if (service.airports) {
        let airportOrder = 1;
        for (const airport of service.airports) {
          const { error: airportError } = await supabase
            .from('airports')
            .insert({
              service_id: serviceId,
              name_ar: airport.name,
              name_en: airport.name,
              wa_message_ar: airport.whatsappMessage,
              wa_message_en: airport.whatsappMessage,
              sort_order: airportOrder++
            });
            
          if (airportError) console.error("Error inserting airport:", airportError);
        }
      }
    }
  }
  console.log("Seeding finished successfully!");
}

seed();
