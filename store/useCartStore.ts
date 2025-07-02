import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  syncWithServer: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find(i => i.id === item.id);

        if (existingItem) {
          set({
            items: items.map(i =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({
            items: [...items, { ...item, quantity: 1 }],
          });
        }

        // Sync with server
        get().syncWithServer();
      },

      removeItem: (id) => {
        set({
          items: get().items.filter(item => item.id !== id),
        });
        get().syncWithServer();
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map(item =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
        get().syncWithServer();
      },

      clearCart: () => {
        set({ items: [] });
        get().syncWithServer();
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      syncWithServer: async () => {
        try {
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: get().items }),
          });

          if (!response.ok) {
            console.warn('Failed to sync cart with server');
          }
        } catch (error) {
          console.warn('Cart sync error:', error);
        }
      },
    }),
    {
      name: 'cart-store',
    }
  )
);