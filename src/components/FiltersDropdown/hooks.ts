import { useState } from 'react';

type UseFiltersModal = () => {
  visible: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const useFiltersModal: UseFiltersModal = () => {
  const [visible, setVisible] = useState<boolean>(false);

  return {
    visible,
    open: () => setVisible(true),
    close: () => setVisible(false),
    toggle: () => setVisible(!visible),
  };
};
