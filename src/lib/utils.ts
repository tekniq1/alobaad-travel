import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes any phone number into international WhatsApp format:
 * - Removes spaces, +, -, parentheses
 * - Removes leading 00
 * - If 8 digits (standard Oman mobile, e.g. 76652555 or 9xxxxxxx), prepends 968
 * - If 9 digits starting with 7 (standard Yemen mobile, e.g. 778383338), prepends 967
 * - If starting with 0, removes leading 0
 */
export function cleanWhatsAppPhone(rawPhone?: string, fallbackCountry: '968' | '967' = '968'): string {
  if (!rawPhone || !rawPhone.trim()) {
    return fallbackCountry === '968' ? '96876652555' : '967778383338';
  }

  let digits = rawPhone.toString().replace(/\D/g, '');

  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  }

  if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  // 8 digits -> Oman local mobile (e.g. 76652555 or 9xxxxxxx)
  if (digits.length === 8) {
    return `968${digits}`;
  }

  // 9 digits starting with 7 -> Yemen local mobile (e.g. 778383338)
  if (digits.length === 9 && digits.startsWith('7')) {
    return `967${digits}`;
  }

  return digits || (fallbackCountry === '968' ? '96876652555' : '967778383338');
}

/**
 * Builds a universal WhatsApp link that works reliably across all devices
 */
export function getWhatsAppUrl(rawPhone?: string, message?: string, fallbackCountry: '968' | '967' = '968'): string {
  const phone = cleanWhatsAppPhone(rawPhone, fallbackCountry);
  const textParam = message ? `&text=${encodeURIComponent(message)}` : '';
  return `https://api.whatsapp.com/send?phone=${phone}${textParam}`;
}
