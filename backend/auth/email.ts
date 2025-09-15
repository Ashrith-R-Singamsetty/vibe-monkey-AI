import { secret } from "encore.dev/config";
import log from "encore.dev/log";

const emailProviderKey = secret("EmailProviderKey");

// Replace this with actual integration (SendGrid/Postmark/etc.)
export async function sendMagicLinkEmail(email: string, link: string): Promise<void> {
  // Example logging, replace with provider call via fetch.
  if (!emailProviderKey()) {
    log.warn("EmailProviderKey not set, logging magic link instead of sending email", { email, link });
    return;
  }

  // Example pseudo-call (commented out)
  // await fetch("https://api.postmarkapp.com/email/withTemplate", { ... })

  log.info("Magic link dispatched", { email, link });
}
