import RcTooltip from 'rc-tooltip';
import { TooltipProps as RcTooltipProps } from 'rc-tooltip/lib/Tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';

export const Tooltip = ({
  children,
  ...props
}: RcTooltipProps): JSX.Element => (
  <RcTooltip {...props} arrowContent={<></>} transitionName="custom-animation">
    {children}
  </RcTooltip>
);

export default Tooltip;
