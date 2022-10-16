import { FC } from 'react';

export const BurgerClosed: FC = () => (
  <svg width="23" height="18" viewBox="0 0 23 18" fill="none">
    <ellipse cx="2.5" cy="2" rx="2" ry="2" fill="black" />
    <path
      d="M8.5 2L21.5 2"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <ellipse cx="2.5" cy="9" rx="2" ry="2" fill="black" />
    <path
      d="M8.5 9L21.5 9"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <ellipse cx="2.5" cy="16" rx="2" ry="2" fill="black" />
    <path
      d="M8.5 16L21.5 16"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
