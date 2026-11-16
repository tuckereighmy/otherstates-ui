import * as stylex from '@stylexjs/stylex';
import { Button, Popover } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-2'] },
});

const placements = [
  { placement: 'top', label: 'Top' },
  { placement: 'right', label: 'Right' },
  { placement: 'bottom', label: 'Bottom' },
  { placement: 'left', label: 'Left' },
] as const;

export default function PopoverPlacement() {
  return (
    <div {...stylex.props(s.row)}>
      {placements.map(({ placement, label }) => (
        <Popover
          key={placement}
          placement={placement}
          width={200}
          trigger={<Button appearance="tertiary">{label}</Button>}
          title={`${label} placement`}
          description="It grows out of the trigger and moves away from it."
        />
      ))}
    </div>
  );
}
