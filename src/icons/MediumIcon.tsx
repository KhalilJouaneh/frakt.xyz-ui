import React from 'react';

const icon = (
  <path
    d="M0 0V24H24V0H0ZM19.9393 5.68393L18.6536 6.91607C18.5411 7.00179 18.4875 7.14107 18.5089 7.275V16.3446C18.4875 16.4839 18.5411 16.6232 18.6536 16.7036L19.9125 17.9357V18.2089H13.5911V17.9464L14.8929 16.6821C15.0214 16.5536 15.0214 16.5161 15.0214 16.3232V8.98929L11.4 18.1821H10.9125L6.69643 8.98929V15.15C6.65893 15.4071 6.75 15.6696 6.93214 15.8571L8.625 17.9089V18.1821H3.81429V17.9089L5.50714 15.8571C5.68929 15.6696 5.76964 15.4071 5.72679 15.15V8.025C5.74821 7.82679 5.67321 7.63393 5.52321 7.5L4.01786 5.68393V5.41071H8.69464L12.3054 13.3393L15.4821 5.41607H19.9393V5.68393Z"
    fill="white"
  />
);

export const MediumIcon = ({
  className,
  width,
}: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    className={className || ''}
    width={width || '24'}
    viewBox="0 0 24 24"
    fill="none"
  >
    {icon}
  </svg>
);
