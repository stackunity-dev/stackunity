<template>
  <div class="shortcuts-manager">
    <v-dialog v-model="showDialog" max-width="600px">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon color="primary" class="mr-2">mdi-keyboard</v-icon>
          {{ 'Keyboard Shortcuts' }}
        </v-card-title>
        <v-card-text>
          <v-table>
            <thead>
              <tr>
                <th>{{ 'Action' }}</th>
                <th>{{ 'Shortcut' }}</th>
                <th>{{ 'Edit' }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(shortcut, key) in shortcutsStore.shortcuts" :key="key">
                <td>{{ shortcut.label }}</td>
                <td>{{ shortcut.value }}</td>
                <td>
                  <v-btn icon size="small" @click="editShortcut(key)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="tonal" @click="resetShortcuts">
            {{ 'Reset All' }}
          </v-btn>
          <v-btn color="primary" @click="showDialog = false">
            {{ 'Close' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useShortcutsStore } from '../stores/shortcutsStore';

const shortcutsStore = useShortcutsStore();
const showDialog = ref(false);

const editShortcut = (key: string) => {
  const newValue = prompt(
    `Set new shortcut for ${shortcutsStore.shortcuts[key].label}:`,
    shortcutsStore.shortcuts[key].value
  );
  if (newValue) {
    shortcutsStore.updateShortcut(key, newValue);
  }
};

const resetShortcuts = () => {
  if (confirm('Are you sure you want to reset all shortcuts?')) {
    shortcutsStore.resetShortcuts();
  }
};

// Expose la méthode pour ouvrir le dialogue
defineExpose({
  open: () => showDialog.value = true
});
</script>