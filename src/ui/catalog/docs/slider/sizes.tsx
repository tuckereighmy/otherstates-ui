import * as stylex from '@stylexjs/stylex';
import { Slider } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-5'], width: 280, maxWidth: '100%' },
});

export default function SliderSizes() {
  return (
    <div {...stylex.props(s.root)}>
      <Slider label="Small" size="sm" defaultValue={30} />
      <Slider label="Medium" defaultValue={50} />
      <Slider label="Large" size="lg" defaultValue={70} />
    </div>
  );
}
