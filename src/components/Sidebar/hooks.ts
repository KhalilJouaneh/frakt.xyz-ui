import { useState } from 'react';

type UseSidebarVisible = () => {
  visible: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const useSidebarVisible: UseSidebarVisible = () => {
  const [visible, setVisible] = useState<boolean>(false);

  return {
    visible,
    open: () => setVisible(true),
    close: () => setVisible(false),
    toggle: () => setVisible(!visible),
  };
};
