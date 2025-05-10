import { defineStore } from 'pinia';
import { ApiRequest, ApiResponse } from './types';
export const useApiTestingStore = defineStore('apiTesting', {
  state: () => ({
    savedRequests: [] as ApiRequest[],
    history: [] as ApiResponse[],
    collections: [] as { id: string; name: string; requests: string[] }[],
  }),

  actions: {
    saveRequest(request: Omit<ApiRequest, 'id' | 'createdAt'>) {
      const newRequest: ApiRequest = {
        ...request,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
      this.savedRequests.push(newRequest);
      this.persistData();
      return newRequest;
    },

    updateRequest(id: string, request: Partial<ApiRequest>) {
      const index = this.savedRequests.findIndex(r => r.id === id);
      if (index !== -1) {
        this.savedRequests[index] = {
          ...this.savedRequests[index],
          ...request,
        };
        this.persistData();
      }
    },

    deleteRequest(id: string) {
      this.savedRequests = this.savedRequests.filter(r => r.id !== id);
      this.persistData();
    },

    addToHistory(response: Omit<ApiResponse, 'id' | 'createdAt'>) {
      const newResponse: ApiResponse = {
        ...response,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
      this.history.push(newResponse);
      this.persistData();
      return newResponse;
    },

    clearHistory() {
      this.history = [];
      this.persistData();
    },

    createCollection(name: string) {
      const newCollection = {
        id: crypto.randomUUID(),
        name,
        requests: [],
      };
      this.collections.push(newCollection);
      this.persistData();
      return newCollection;
    },

    addRequestToCollection(collectionId: string, requestId: string) {
      const collection = this.collections.find(c => c.id === collectionId);
      if (collection && !collection.requests.includes(requestId)) {
        collection.requests.push(requestId);
        this.persistData();
      }
    },

    removeRequestFromCollection(collectionId: string, requestId: string) {
      const collection = this.collections.find(c => c.id === collectionId);
      if (collection) {
        collection.requests = collection.requests.filter(id => id !== requestId);
        this.persistData();
      }
    },

    deleteCollection(id: string) {
      this.collections = this.collections.filter(c => c.id !== id);
      this.persistData();
    },

    persistData() {
      if (typeof window !== 'undefined') {
        localStorage.setItem('apiTesting_savedRequests', JSON.stringify(this.savedRequests));
        localStorage.setItem('apiTesting_history', JSON.stringify(this.history));
        localStorage.setItem('apiTesting_collections', JSON.stringify(this.collections));
      }
    },

    loadData() {
      if (typeof window !== 'undefined') {
        const savedRequests = localStorage.getItem('apiTesting_savedRequests');
        const history = localStorage.getItem('apiTesting_history');
        const collections = localStorage.getItem('apiTesting_collections');

        if (savedRequests) {
          this.savedRequests = JSON.parse(savedRequests).map((r: any) => ({
            ...r,
            createdAt: new Date(r.createdAt),
          }));
        }

        if (history) {
          this.history = JSON.parse(history).map((h: any) => ({
            ...h,
            createdAt: new Date(h.createdAt),
          }));
        }

        if (collections) {
          this.collections = JSON.parse(collections);
        }
      }
    },
  },

  getters: {
    getRequestById: (state) => (id: string) => {
      return state.savedRequests.find(r => r.id === id);
    },

    getCollectionById: (state) => (id: string) => {
      return state.collections.find(c => c.id === id);
    },

    getRequestsByCollection: (state) => (collectionId: string) => {
      const collection = state.collections.find(c => c.id === collectionId);
      if (!collection) return [];
      return state.savedRequests.filter(r => collection.requests.includes(r.id));
    },

    getRecentHistory: (state) => (limit: number = 10) => {
      return state.history
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, limit);
    },
  },
}); 