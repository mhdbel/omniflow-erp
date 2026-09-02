import Dexie, { Table } from 'dexie';

// Define local types for offline storage
export interface LocalItem {
  id: string;
  sku: string;
  name: string;
  updatedAt: number;
}

export interface QueuedAction {
  id?: number;
  action: string;
  payload: any;
  timestamp: number;
  retryCount: number;
}

class OfflineDatabase extends Dexie {
  items!: Table<LocalItem, string>;
  queue!: Table<QueuedAction, number>;

  constructor() {
    super('OmniFlowOfflineDB');
    this.version(1).stores({
      items: 'id, sku, updatedAt',
      queue: '++id, action, timestamp, retryCount'
    });
  }
}

export const db = new OfflineDatabase();