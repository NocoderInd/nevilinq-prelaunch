// apps/www/lib/publish.ts
export const PUBLISH_DELAY_MS = 15 * 60 * 1000; // 15 minutes

export function scheduleTime(from: number = Date.now()) {
  return new Date(from + PUBLISH_DELAY_MS).toISOString();
}

export type PublishStatus = "draft" | "scheduled" | "published";

export function isPublicVisible(status: PublishStatus, publishAt?: string) {
  if (status === "published") return true;
  if (status === "scheduled" && publishAt) {
    return Date.now() >= new Date(publishAt).getTime();
  }
  return false;
}
