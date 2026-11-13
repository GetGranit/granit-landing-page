import type { PostHog } from "posthog-js";

/**
 * Purpose-built PostHog Logs emitter. Keep this module limited to records
 * intentionally exported by this integration; it does not wrap console logs.
 */
export type DemoFormLocation = "homepage" | "homepage_rappel" | "tarifs_rappel" | "silmo_landing" | "affiliation_landing" | "webinar_landing" | "outil_tri_marques" | "outil_heures_decembre";

export function logDemoRequestDelivered(
  posthog: PostHog,
  formLocation: DemoFormLocation,
  organizationType?: string,
) {
  posthog.logger.info("demo request delivered", {
    event: "demo_request_delivery",
    form_location: formLocation,
    delivery_status: "delivered",
    organization_type: organizationType,
  });
}

export function logDemoRequestDeliveryFailed(posthog: PostHog, formLocation: DemoFormLocation) {
  posthog.logger.error("demo request delivery failed", {
    event: "demo_request_delivery",
    form_location: formLocation,
    delivery_status: "failed",
  });
}
