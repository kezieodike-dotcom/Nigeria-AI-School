import { supabase } from './supabase';

export const monthlySubscriptionPrice = 10000;

export type ActiveSubscription = {
  id: string;
  expires_at: string;
};

export async function fetchActiveSubscription(userId?: string | null) {
  if (!userId) return null;

  const { data, error } = await supabase
    .from('subscriptions')
    .select('id, expires_at')
    .eq('student_id', userId)
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())
    .order('expires_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.warn('Could not load active subscription:', error);
    return null;
  }

  return data as ActiveSubscription | null;
}

export async function startMonthlySubscriptionCheckout(callbackUrl: string) {
  const { data, error } = await supabase.functions.invoke('create-subscription-paystack-checkout', {
    body: { callback_url: callbackUrl },
  });

  if (error) throw error;
  if (!data?.authorization_url) {
    throw new Error('Paystack did not return a checkout link.');
  }

  return data.authorization_url as string;
}
