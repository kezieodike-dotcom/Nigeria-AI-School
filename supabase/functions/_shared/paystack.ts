export function getPaystackSecretKey() {
  const key = Deno.env.get("PAYSTACK_SECRET_KEY")?.trim();

  if (!key) {
    return {
      key: null,
      error: "Payment service is not configured",
    };
  }

  if (!key.startsWith("sk_live_")) {
    return {
      key: null,
      error: "Payment service is not configured for live payments",
    };
  }

  return { key, error: null };
}
