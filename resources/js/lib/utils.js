import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '-';
  }
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    const date = d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const time = d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `${date} ${time}`;
  } catch {
    return '-';
  }
}

export function isImage(filePath) {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);
}

export const STATUS_CONFIG = {
  accepted: 'bg-emerald-50 text-emerald-700 ring-emerald-300',
  reserve: 'bg-amber-50 text-amber-700 ring-amber-300',
  rejected: 'bg-red-50 text-red-700 ring-red-300',
  pending: 'bg-blue-50 text-blue-700 ring-blue-300',
  draft: 'bg-gray-100 text-gray-700 ring-gray-300',
};

export const STATUS_LABELS = {
  accepted: 'Passed',
  reserve: 'Reserve',
  rejected: 'Failed',
  pending: 'Pending',
  draft: 'Draft',
};
