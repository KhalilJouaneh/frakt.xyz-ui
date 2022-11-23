import create from 'zustand';
import { ContentType } from './constants';

interface SiderState {
  isVisible: boolean;
  toggleVisibility: () => void;
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
  changeContentType: (nextState: ContentType) =>
    set((state) => ({ ...state, contentType: nextState })),
}));
