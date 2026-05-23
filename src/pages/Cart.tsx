import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Loader2, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { monthlySubscriptionPrice, startMonthlySubscriptionCheckout } from '../lib/subscription';

export default function Cart() {
  const navigate = useNavigate();
  const location = useLocation();
  const [checkoutLoading, setCheckoutLoading] = React.useState(false);
  const [verifying, setVerifying] = React.useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reference = params.get('payment_reference') || params.get('reference');
    if (!reference) return;

    let cancelled = false;

    const verifyPayment = async () => {
      setVerifying(true);
      try {
        const { data, error } = await supabase.functions.invoke('verify-paystack-payment', {
          body: { reference },
        });

        if (error) throw error;

        if (!cancelled && data?.status === 'success') {
          window.showToast?.('Subscription confirmed. You now have one month access to all courses.', 'success');
          navigate('/dashboard', { replace: true });
        } else if (!cancelled) {
          window.showToast?.('Payment was not confirmed. Please contact support if you were debited.', 'error');
        }
      } catch (error: any) {
        if (!cancelled) {
          window.showToast?.(error.message || 'Unable to verify payment right now.', 'error');
        }
      } finally {
        if (!cancelled) setVerifying(false);
      }
    };

    verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [location.search, navigate]);

  const handleCheckout = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate('/login?redirect=/cart');
      return;
    }

    setCheckoutLoading(true);
    try {
      window.location.href = await startMonthlySubscriptionCheckout(`${window.location.origin}/cart`);
    } catch (error: any) {
      window.showToast?.(error.message || 'Unable to start subscription checkout. Please try again.', 'error');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-surface-container-low px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-outline-variant/20 bg-white p-8 text-center shadow-sm md:p-12">
        <ShieldCheck className="mx-auto mb-5 text-secondary" size={54} />
        <h1 className="font-headline text-3xl font-black text-primary">Monthly All-Access</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-on-surface-variant">
          Course-by-course cart checkout has been replaced with one simple monthly subscription. Pay once and access every published course for one month.
        </p>
        <div className="mx-auto mt-8 max-w-sm rounded-2xl bg-surface-container-low p-6">
          <p className="text-xs font-black uppercase tracking-widest text-secondary">Subscription Price</p>
          <p className="mt-2 font-headline text-3xl font-black text-primary">₦{monthlySubscriptionPrice.toLocaleString()}</p>
          <p className="mt-1 text-xs font-bold text-on-surface-variant">One month access</p>
        </div>

        {verifying && (
          <div className="mt-6 rounded-2xl border border-outline-variant/20 bg-white p-4 text-sm font-bold text-primary">
            Verifying payment...
          </div>
        )}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading || verifying}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-black text-white hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {checkoutLoading ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
            Subscribe Now
          </button>
          <Link to="/courses" className="inline-flex items-center justify-center rounded-xl border border-outline-variant/20 px-6 py-3 text-sm font-black text-primary hover:bg-surface-container-low">
            Browse Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
