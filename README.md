<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/ec3039e2-433c-46bf-8414-64f8370d2159

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Paystack Setup

1. Apply the Supabase migration in `supabase/migrations/20260522231500_add_paystack_payments.sql`.
2. Set the server-only Edge Function secret:
   `supabase secrets set PAYSTACK_SECRET_KEY=sk_test_your_key`
3. Deploy the functions:
   `supabase functions deploy create-paystack-checkout`
   `supabase functions deploy verify-paystack-payment`
   `supabase functions deploy paystack-webhook`
4. In Paystack, set the webhook URL to:
   `https://your-project-ref.supabase.co/functions/v1/paystack-webhook`
