import { FC } from 'react';
import { TooltipProps as RcTooltipProps } from 'rc-tooltip/lib/Tooltip';
import RcTooltip from 'rc-tooltip';
import cx from 'classnames';

import 'rc-tooltip/assets/bootstrap_white.css';
import styles from './Tooltip.module.scss';

const Tooltip: FC<RcTooltipProps> = ({
  children,
  overlayClassName,
  ...props
}) => (
  <RcTooltip
    {...props}
    arrowContent={<></>}
    overlayClassName={cx(overlayClassName, styles['rc-tooltip-inner'])}
    getTooltipContainer={(triggerNode) => (triggerNode as any).parentNode}
  >
    {children}
  </RcTooltip>
);

export default Tooltip;
