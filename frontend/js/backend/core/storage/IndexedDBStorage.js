/**
 * IndexedDBStorage.js
 * Persistencia Local-First Zero-Knowledge utilizando IndexedDB
 */

import { CryptoKitManager } from '../security/CryptoKitManager.js';

export class IndexedDBStorage {
  constructor(dbName = 'PochirochoDB', version = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }

  async init() {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('profiles')) {
          db.createObjectStore('profiles', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('cycles')) {
          db.createObjectStore('cycles', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('daily_logs')) {
          db.createObjectStore('daily_logs', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('achievements')) {
          db.createObjectStore('achievements', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('inventory')) {
          db.createObjectStore('inventory', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('ai_conversations')) {
          db.createObjectStore('ai_conversations', { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('IndexedDBStorage Error al abrir la BD:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  async setItem(storeName, item, encrypt = false) {
    await this.init();
    return new Promise(async (resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      
      let payload = item;
      if (encrypt) {
        const encryptedDataStr = await CryptoKitManager.encryptData(item);
        payload = { id: item.id, payloadEncrypted: encryptedDataStr };
      }

      const request = store.put(payload);
      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async getItem(storeName, id, decrypt = false) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = async () => {
        const result = request.result;
        if (!result) return resolve(null);

        if (decrypt && result.payloadEncrypted) {
          const decrypted = await CryptoKitManager.decryptData(result.payloadEncrypted);
          return resolve(decrypted);
        }
        resolve(result);
      };

      request.onerror = (e) => reject(e.target.error);
    });
  }

  async getAllItems(storeName, decrypt = false) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = async () => {
        const results = request.result || [];
        if (!decrypt) return resolve(results);

        const decryptedPromises = results.map(async (item) => {
          if (item.payloadEncrypted) {
            return await CryptoKitManager.decryptData(item.payloadEncrypted);
          }
          return item;
        });

        const finalResults = await Promise.all(decryptedPromises);
        resolve(finalResults);
      };

      request.onerror = (e) => reject(e.target.error);
    });
  }

  async removeItem(storeName, id) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  }
}
