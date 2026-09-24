export const NEWSLETTER_RESEND_INTERVAL_MS = 10 * 60 * 1000;

export type NewsletterSubscriber = {
  id: string;
  email: string;
  status: "pending" | "active" | "unsubscribed";
  unsubscribe_token: string;
  source: string;
  updated_at: string;
};

export function normalizeNewsletterEmail(value: unknown) {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

export function isValidNewsletterToken(value: string | null) {
  return Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value));
}

export function wasRecentlyUpdated(updatedAt: string) {
  const timestamp = Date.parse(updatedAt);
  return Number.isFinite(timestamp) && Date.now() - timestamp < NEWSLETTER_RESEND_INTERVAL_MS;
}
