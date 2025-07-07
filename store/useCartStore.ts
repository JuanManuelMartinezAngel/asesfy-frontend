import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCartItems, saveCartItems, deleteCartItem } from '@/lib/supabase-functions';

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
  loadFromServer: () => Promise<void>;
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
          set({ isLoading: true });
          
          // Usar Edge Function de Supabase en lugar de API local
          await saveCartItems(
            get().items, 
            undefined, // userId - se obtiene automáticamente del token
            undefined  // sessionId - opcional
          );
        } catch (error) {
          console.warn('Cart sync error:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      loadFromServer: async () => {
        try {
          set({ isLoading: true });
          
          // Cargar items del servidor usando Edge Function
          const data = await getCartItems(
            undefined, // userId - se obtiene automáticamente del token
            undefined  // sessionId - opcional
          );
          
          if (data?.items) {
            set({ items: data.items });
          }
        } catch (error) {
          console.warn('Failed to load cart from server:', error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'cart-store',
    }
  )
);