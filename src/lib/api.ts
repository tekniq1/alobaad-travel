import { supabase } from './supabase';
import { Destination, Service, Airport } from '../data/destinations'; // keep types from there for now

export async function fetchDestinations(): Promise<Destination[]> {
  const { data: dests, error: destsError } = await supabase
    .from('destinations')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
    
  if (destsError) throw destsError;
  
  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
    
  if (servicesError) throw servicesError;

  const { data: airports, error: airportsError } = await supabase
    .from('airports')
    .select('*')
    .order('sort_order');
    
  if (airportsError) throw airportsError;

  // Map everything together to match the existing frontend structure
  return dests.map(dest => {
    const destServices = services
      .filter(s => s.destination_id === dest.id)
      .map(service => {
        const serviceAirports = airports
          .filter(a => a.service_id === service.id)
          .map(airport => ({
            id: airport.id, // For tracking
            name_ar: airport.name_ar,
            name_en: airport.name_en,
            whatsappMessage_ar: airport.wa_message_ar,
            whatsappMessage_en: airport.wa_message_en,
          }));

        return {
          id: service.id, // For tracking
          title_ar: service.title_ar,
          title_en: service.title_en,
          whatsappMessage_ar: service.wa_message_ar,
          whatsappMessage_en: service.wa_message_en,
          requiresPassport: service.requires_passport,
          airports: serviceAirports.length > 0 ? serviceAirports : undefined,
        };
      });

    return {
      id: dest.id,
      slug: dest.slug, // Original ID string used for icons/images
      name_ar: dest.name_ar,
      name_en: dest.name_en,
      flagImg: dest.flag_url,
      image: dest.image_url,
      description_ar: dest.description_ar,
      description_en: dest.description_en,
      services: destServices,
    };
  });
}

export async function logWhatsAppClick(clickType: string, destinationId?: string, serviceId?: string, details?: any) {
  try {
    await supabase.from('whatsapp_clicks').insert([
      {
        click_type: clickType,
        destination_id: destinationId,
        service_id: serviceId,
        details: details
      }
    ]);
  } catch (err) {
    console.error("Failed to log click:", err);
  }
}
