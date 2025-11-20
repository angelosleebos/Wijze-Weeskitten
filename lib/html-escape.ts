/**
 * HTML Escape Utility
 * Escapes HTML special characters to prevent XSS in email templates
 */

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

/**
 * Escapes HTML special characters in a string
 */
export function escapeHtml(text: string | null | undefined): string {
  if (!text) return '';
  return String(text).replace(/[&<>"'/]/g, (char) => HTML_ESCAPE_MAP[char]);
}

/**
 * Escapes HTML but preserves newlines for pre-wrap styling
 */
export function escapeHtmlPreserveNewlines(text: string | null | undefined): string {
  if (!text) return '';
  return escapeHtml(text).replace(/\n/g, '<br>');
}
