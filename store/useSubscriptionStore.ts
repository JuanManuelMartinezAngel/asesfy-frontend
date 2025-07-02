import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface Subscription {
  subscription_status: string;
  price_id: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  payment_method_brand?: string;
  payment_method_last4?: string;
}

interface SubscriptionState {
  subscription: Subscription | null;
  isLoading: boolean;
  error: string | null;
  loadSubscription: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscription: null,
  isLoading: false,
  error: null,

  loadSubscription: async () => {
    set({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error loading subscription:', error);
        set({ error: error.message, isLoading: false });
        return;
      }

      set({ subscription: data, isLoading: false });
    } catch (error) {
      console.error('Error loading subscription:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error', 
        isLoading: false 
      });
    }
  },
}));