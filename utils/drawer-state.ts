import { ref } from 'vue';

// État partagé pour le drawer mobile
const isDrawerOpen = ref(false);

// Fonctions pour manipuler l'état
export function useDrawerState() {
  const openDrawer = () => {
    isDrawerOpen.value = true;
  };

  const closeDrawer = () => {
    isDrawerOpen.value = false;
  };

  const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value;
  };

  return {
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer
  };
} 