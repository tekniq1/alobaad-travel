import { supabase } from './supabase';
import { Destination, Service, Airport } from '../data/destinations'; // keep types from there for now

export async function fetchDestinations(): Promise<Destination[]> {
  const { data: dests, error: destsError } = await supabase
    .from('destinations')
    .select('*')
    .order('sort_order');
    
  if (destsError) throw destsError;
  
  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select('*')
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

export interface RecordRequestParams {
  department: 'tickets' | 'visas' | 'general';
  phone?: string;
  employeeName?: string;
  destination?: string;
  service?: string;
  message?: string;
  details?: Record<string, any>;
  customerName?: string;
  customerPhone?: string;
}

export async function recordWhatsAppRequest({
  department,
  phone,
  employeeName,
  destination,
  service,
  message,
  details,
  customerName,
  customerPhone,
}: RecordRequestParams) {
  try {
    const assignedPhone = phone || (department === 'tickets' ? '96876652555' : '967778383338');
    const defaultEmployee = department === 'tickets' ? 'مسؤول التذاكر' : 'مسؤول التأشيرات والموافقات';
    const finalEmployee = employeeName || defaultEmployee;

    const finalCustomerName = customerName?.trim() || (department === 'tickets' ? 'عميل حجز طيران' : 'عميل تأشيرات وموافقات');
    const finalCustomerPhone = customerPhone?.trim() || '';

    // Build structured full message containing customer and transaction specs
    let fullMessage = '';

    // Section 1: Customer Contact
    fullMessage += `[بيانات العميل المتواصل]:\n`;
    fullMessage += `• اسم العميل: ${finalCustomerName}\n`;
    fullMessage += `• رقم هاتف العميل: ${finalCustomerPhone || 'تحويل مباشر عبر الواتساب'}\n\n`;

    // Section 2: Assigned Staff
    fullMessage += `[الموظف المسؤول]:\n`;
    fullMessage += `• الموظف المستلم: ${finalEmployee}\n`;
    fullMessage += `• رقم الموظف: +${assignedPhone}\n`;
    fullMessage += `• القسم: ${department === 'tickets' ? 'تذاكر طيران' : 'تأشيرات وموافقات'}\n\n`;

    // Section 3: Extra Details
    if (details && Object.keys(details).length > 0) {
      const detailsText = Object.entries(details)
        .filter(([_, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `• ${k}: ${v}`)
        .join('\n');
      if (detailsText) {
        fullMessage += `[تفاصيل المعاملة]:\n${detailsText}\n\n`;
      }
    }

    // Section 4: WhatsApp Message
    if (message) {
      fullMessage += `[نص رسالة الواتساب]:\n${message}`;
    }

    const { data, error } = await supabase.from('contact_requests').insert([
      {
        type: department,
        name: finalCustomerName,
        phone: finalCustomerPhone || `مباشر (+${assignedPhone})`,
        destination: destination || (department === 'tickets' ? 'طيران عام' : 'تأشيرات عامة'),
        service: service || (department === 'tickets' ? 'طلب استفسار تذاكر طيران' : 'طلب استفسار تأشيرات وموافقات'),
        message: fullMessage.trim(),
        status: 'new',
      }
    ]).select();

    if (error) {
      console.warn("Could not record to contact_requests:", error);
    }
    return data;
  } catch (err) {
    console.error("Failed to record request:", err);
  }
}

export async function logWhatsAppClick(clickType: string, destinationId?: string, serviceId?: string, details?: any) {
  try {
    // Also record as a request if it makes sense
    await supabase.from('whatsapp_clicks').insert([
      {
        click_type: clickType,
        destination_id: destinationId,
        service_id: serviceId,
        details: details
      }
    ]);
  } catch (err) {
    // Non-blocking
  }
}
