import { defineStore } from 'pinia';

interface Shortcut {
  label: string;
  value: string;
}

interface ShortcutsState {
  shortcuts: Record<string, Shortcut>;
}

export const useShortcutsStore = defineStore('shortcuts', {
  state: (): ShortcutsState => ({
    shortcuts: JSON.parse(localStorage.getItem('editorShortcuts') || 'null') || {
      run: { label: 'Run Query', value: 'Ctrl+Enter' },
      format: { label: 'Format SQL', value: 'Ctrl+Shift+F' },
      comment: { label: 'Toggle Comment', value: 'Ctrl+/' },
      save: { label: 'Save Query', value: 'Ctrl+S' },
      clear: { label: 'Clear Editor', value: 'Ctrl+L' }
    }
  }),

  actions: {
    updateShortcut(key: string, value: string) {
      this.shortcuts[key].value = value;
      this.saveToLocalStorage();
    },

    resetShortcuts() {
      this.shortcuts = {
        run: { label: 'Run Query', value: 'Ctrl+Enter' },
        format: { label: 'Format SQL', value: 'Ctrl+Shift+F' },
        comment: { label: 'Toggle Comment', value: 'Ctrl+/' },
        save: { label: 'Save Query', value: 'Ctrl+S' },
        clear: { label: 'Clear Editor', value: 'Ctrl+L' }
      };
      this.saveToLocalStorage();
    },

    saveToLocalStorage() {
      localStorage.setItem('editorShortcuts', JSON.stringify(this.shortcuts));
    }
  }
}); 