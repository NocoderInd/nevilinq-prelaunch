export const PUBLISH_DELAY_MS = 15 * 60 * 1000;

export function scheduleTime(from: number = Date.now()) {
  return new Date(from + PUBLISH_DELAY_MS).toISOString();
}

export function isPublicVisible(status: "draft" | "scheduled" | "published", publishAt?: string) {
  if (status === "published") return true;
  if (status === "scheduled" && publishAt) {
    return Date.now() >= new Date(publishAt).getTime();
  }
  return false;
}
