import * as stylex from '@stylexjs/stylex';
import { Button, Frame, Icon } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { width: 400, maxWidth: '100%' },
  row: { display: 'flex', justifyContent: 'space-between', gap: tokens['--os-space-2'] },
  label: { color: tokens['--os-color-fg-muted'] },
  value: { fontVariantNumeric: 'tabular-nums' },
});

export default function FrameTitleAndDescription() {
  return (
    <div {...stylex.props(s.root)}>
      <Frame
        title="Usage this month"
        description="Resets on the first of each month"
        actions={
          <Button size="sm" appearance="text" leadingIcon={<Icon name="download" />}>
            Export
          </Button>
        }
      >
        <div {...stylex.props(s.row)}>
          <span {...stylex.props(s.label)}>Build minutes</span>
          <span {...stylex.props(s.value)}>1,284 of 3,000</span>
        </div>
      </Frame>
    </div>
  );
}
