import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(inputDate: Date | null | undefined) {
  if (!inputDate) {
    return 'now';
  }
  const now = new Date();
  const past = new Date(inputDate);

  // Zaman farkını milisaniye cinsinden hesapla
  const diffInMs = now.getTime() - past.getTime();

  // Zaman farkını saniye, dakika, saat, gün, hafta, ay ve yıl cinsinden hesapla
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30); // Ortalama 30 gün bir ay
  const diffInYears = Math.floor(diffInDays / 365); // Ortalama 365 gün bir yıl

  // Koşullara göre uygun sonucu döndür
  if (diffInSeconds < 60) {
    return diffInSeconds === 0 ? 'now' : `${diffInSeconds} sec `;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min `;
  } else if (diffInHours < 24) {
    return `${diffInHours} Hour `;
  } else if (diffInDays < 7) {
    return `${diffInDays} day `;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} Week `;
  } else if (diffInMonths < 12) {
    return diffInMonths === 1 ? '1 month ' : `${diffInMonths} month `;
  } else {
    return diffInYears === 1 ? '1 Year ' : `${diffInYears} Year `;
  }
}
