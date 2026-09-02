import { db } from '@/lib/offline-db';
import { api } from '@/lib/api'; // Your Axios/TanStack query instance

export const useOfflineCart = () => {
  const addToCart = async (itemId: string, qty: number) => {
    try {
      // 1. Try to sync to backend immediately
      await api.post('/api/v1/cart', { itemId, qty });
    } catch (error) {
      // 2. If offline (or server error), queue for background sync
      await db.queue.add({
        action: 'ADD_TO_CART',
        payload: { itemId, qty },
        timestamp: Date.now(),
        retryCount: 0
      });
      console.log("Offline: Action queued for sync");
    }
    
    // 3. Update local UI state immediately (Optimistic UI)
    // (Implementation depends on your Zustand/React Query setup)
  };

  return { addToCart };
};