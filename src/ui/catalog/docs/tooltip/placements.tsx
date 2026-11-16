import * as stylex from '@stylexjs/stylex';
import { Button, Tooltip } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ row: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-3'] } });
const sides = [
  { side: 'top', label: 'Top' },
  { side: 'right', label: 'Right' },
  { side: 'bottom', label: 'Bottom' },
  { side: 'left', label: 'Left' },
] as const;

export default function TooltipPlacements() {
  return (
    <div {...stylex.props(s.row)}>
      {sides.map(({ side, label }) => (
        <Tooltip key={side} placement={side} trigger={<Button appearance="secondary">{label}</Button>}>
          Opens on the {side}
        </Tooltip>
      ))}
    </div>
  );
}
