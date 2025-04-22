import { reactive } from "vue";

export const hoverStates = reactive<Record<string, boolean>>({});

export const getElevation = (elementId: string, defaultElevation: number = 2, hoverElevation: number = 8) => {
  return hoverStates[elementId] ? hoverElevation : defaultElevation;
};

export const setHoverOn = (elementId: string) => {
  hoverStates[elementId] = true;
};

export const setHoverOff = (elementId: string) => {
  hoverStates[elementId] = false;
};