// apps/www/lib/validators.ts
import type { ListingRow, ValidateResult, EntityKind, Platform, BoostPlan } from "./types";

const ENTITY_KINDS: EntityKind[] = ["group", "channel", "business"];
const PLATFORMS: Platform[] = ["whatsapp", "telegram"];
const BOOSTS: BoostPlan[] = ["none", "daily", "weekly", "15days", "30days"];

// Basic link/number sanity checks
const RX_WHATSAPP_INVITE = /^https?:\/\/(chat\.whatsapp\.com|wa\.me)\/.+/i;
const RX_TELEGRAM_INVITE = /^https?:\/\/t\.me\/.+/i;
const RX_PHONE = /^\+?[0-9]{8,15}$/;

export function validateRow(row: ListingRow): ValidateResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!row.entity_kind || !ENTITY_KINDS.includes(row.entity_kind)) {
    errors.push("entity_kind must be one of: group | channel | business");
  }

  if (!row.platform || !PLATFORMS.includes(row.platform)) {
    errors.push("platform must be whatsapp | telegram");
  }

  if (!row.name || row.name.trim().length < 3) {
    errors.push("name is required (min 3 chars)");
  }

  if (!row.invite_or_number) {
    errors.push("invite_or_number is required");
  } else {
    // Validate by platform + kind
    if (row.entity_kind === "business") {
      // Business uses a phone number
      if (!RX_PHONE.test(row.invite_or_number.trim())) {
        errors.push("business listing requires a valid phone number (+CCXXXXXXXXXX)");
      }
    } else {
      // group/channel should use an invite link
      if (row.platform === "whatsapp" && !RX_WHATSAPP_INVITE.test(row.invite_or_number.trim())) {
        errors.push("whatsapp group/channel must use a valid invite link (chat.whatsapp.com / wa.me)");
      }
      if (row.platform === "telegram" && !RX_TELEGRAM_INVITE.test(row.invite_or_number.trim())) {
        errors.push("telegram group/channel must use a valid invite link (t.me/...)");
      }
    }
  }

  if (row.boosted && !BOOSTS.includes(row.boosted)) {
    errors.push("boosted must be one of: none | daily | weekly | 15days | 30days");
  }

  // Gentle nudges
  if (!row.category) warnings.push("category is empty (recommended for SEO)");
  if (!row.country) warnings.push("country is empty (recommended for pricing/routing)");

  return { valid: errors.length === 0, errors, warnings };
}
