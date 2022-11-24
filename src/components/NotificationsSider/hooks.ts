import create from 'zustand';
import { ContentType } from './constants';

interface SiderState {
  isVisible: boolean;
  toggleVisibility: () => void;
  setVisibility: (nextValue: boolean) => void;
  contentType: ContentType;
  changeContentType: (nextState: ContentType) => void;
}

export const useNotificationsSider = create<SiderState>((set) => ({
  isVisible: false,
  contentType: ContentType.NOTIFICATIONS,
  toggleVisibility: () =>
    set((state) => {
      if (state.isVisible) {
        return {
          ...state,
          isVisible: !state.isVisible,
          contentType: ContentType.NOTIFICATIONS,
        };
      }
      return { ...state, isVisible: !state.isVisible };
    }),
  setVisibility: (nextValue) =>
    set((state) => {
      if (state.isVisible) {
        return {
          ...state,
          isVisible: nextValue,
          contentType: ContentType.NOTIFICATIONS,
        };
      }
      return { ...state, isVisible: nextValue };
    }),
  changeContentType: (nextState: ContentType) =>
    set((state) => ({ ...state, contentType: nextState })),
}));
