// src/services/storageRouter.ts
import { Workspace } from '../types';

const SYNC_LIMIT = 100 * 1024; // 100KB limit for chrome.storage.sync

export const StorageRouter = {
  // Save workspace, automatically deciding where to store it
  async save(workspace: Workspace): Promise<void> {
    const data = JSON.stringify(workspace);
    const size = new Blob([data]).size;

    if (size > SYNC_LIMIT) {
      // Use local storage for large data (won't sync across devices)
      await chrome.storage.local.set({ [workspace.id]: workspace });
    } else {
      // Use sync storage for small data (syncs automatically)
      await chrome.storage.sync.set({ [workspace.id]: workspace });
    }
  },

  // Retrieve all workspaces from both local and sync
  async getAll(): Promise<Workspace[]> {
    return new Promise((resolve) => {
      chrome.storage.sync.get(null, (sync) => {
        chrome.storage.local.get(null, (local) => {
          const syncData = Object.values(sync || {});
          const localData = Object.values(local || {});
          resolve([...syncData, ...localData] as Workspace[]);
        });
      });
    });
  }
};
