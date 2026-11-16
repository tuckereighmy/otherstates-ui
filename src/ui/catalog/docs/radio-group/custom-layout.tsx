import * as stylex from '@stylexjs/stylex';
import { Radio, RadioGroup } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: tokens['--os-space-4'], rowGap: tokens['--os-space-1'] },
  heading: {
    gridColumnStart: 1,
    gridColumnEnd: -1,
    marginBlockStart: tokens['--os-space-2'],
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-xs'],
    lineHeight: tokens['--os-line-height-xs'],
  },
});

export default function RadioGroupCustomLayout() {
  return (
    <RadioGroup label="Instance size" defaultValue="s">
      <div {...stylex.props(s.grid)}>
        <span {...stylex.props(s.heading)}>Shared</span>
        <Radio value="xs" label="Nano" description="0.5 vCPU" />
        <Radio value="s" label="Small" description="1 vCPU" />
        <span {...stylex.props(s.heading)}>Dedicated</span>
        <Radio value="m" label="Medium" description="2 vCPU" />
        <Radio value="l" label="Large" description="4 vCPU" />
      </div>
    </RadioGroup>
  );
}
