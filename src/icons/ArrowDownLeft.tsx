import React from 'react';

const icon = (
  <path
    xmlns="http://www.w3.org/2000/svg"
    fillRule="evenodd"
    clipRule="evenodd"
    d="M0.832031 0.208252C1.17721 0.208252 1.45703 0.488074 1.45703 0.833252V7.6577L8.72342 0.39131C8.9675 0.147233 9.36323 0.147233 9.60731 0.39131C9.85138 0.635388 9.85138 1.03112 9.60731 1.27519L2.34091 8.54158H9.16536C9.51054 8.54158 9.79036 8.82141 9.79036 9.16658C9.79036 9.51176 9.51054 9.79158 9.16536 9.79158H0.832031C0.486853 9.79158 0.207031 9.51176 0.207031 9.16658V0.833252C0.207031 0.488074 0.486853 0.208252 0.832031 0.208252Z"
  />
);

export const ArrowDownLeft = ({
  className,
  width,
  height,
}: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    className={className || ''}
    width={width || '10'}
    height={height || '10'}
    viewBox="0 0 10 10"
  >
    {icon}
  </svg>
);
