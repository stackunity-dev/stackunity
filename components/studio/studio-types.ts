import { ComputedRef, Ref } from "vue";

export interface StudioModeInjection {
  mode: Ref<string>;
  isDesignMode: ComputedRef<boolean>;
  isSEOMode: ComputedRef<boolean>;
  setMode: (mode: string) => void;
  toggleMode: () => void;
}