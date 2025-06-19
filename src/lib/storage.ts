// src/lib/storage.ts
import { Smartlink } from '@/types/smartlink';

const STORAGE_KEY = 'smartlinks';

export const storage = {
  getSmartlinks: (): Smartlink[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveSmartlink: (smartlink: Smartlink): void => {
    const smartlinks = storage.getSmartlinks();
    const existingIndex = smartlinks.findIndex(s => s.id === smartlink.id);
    
    if (existingIndex >= 0) {
      smartlinks[existingIndex] = { ...smartlink, updatedAt: new Date().toISOString() };
    } else {
      smartlinks.push(smartlink);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(smartlinks));
  },

  deleteSmartlink: (id: string): void => {
    const smartlinks = storage.getSmartlinks().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(smartlinks));
  },

  getSmartlinkById: (id: string): Smartlink | undefined => {
    return storage.getSmartlinks().find(s => s.id === id);
  },

  incrementViews: (id: string): void => {
    const smartlinks = storage.getSmartlinks();
    const smartlink = smartlinks.find(s => s.id === id);
    if (smartlink) {
      smartlink.views++;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(smartlinks));
    }
  },

  incrementClicks: (smartlinkId: string, platformId: string): void => {
    const smartlinks = storage.getSmartlinks();
    const smartlink = smartlinks.find(s => s.id === smartlinkId);
    if (smartlink) {
      smartlink.clicks[platformId] = (smartlink.clicks[platformId] || 0) + 1;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(smartlinks));
    }
  }
};