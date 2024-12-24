import { openDB, DBSchema } from 'idb';

export interface StoredMonitor {
  id: number;
  friendly_name: string;
  url: string;
  type: number;
  status: number;
  create_datetime: number;
  average_response_time?: number;
  lastUpdated: number;
}

interface MonitorDBSchema extends DBSchema {
  monitors: {
    key: number;
    value: StoredMonitor;
  };
}

const DB_NAME = 'sitepin';
const STORE_NAME = 'sites';

export const db = {
  async init() {
    return openDB<MonitorDBSchema>(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  },

  async getMonitors(): Promise<StoredMonitor[]> {
    const db = await this.init();
    return db.getAll(STORE_NAME);
  },

  async updateMonitors(monitors: StoredMonitor[]) {
    const db = await this.init();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    
    await Promise.all([
      ...monitors.map(monitor => tx.store.put(monitor)),
      tx.done
    ]);
  }
}; 