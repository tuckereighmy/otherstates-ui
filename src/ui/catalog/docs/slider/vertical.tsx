import * as stylex from '@stylexjs/stylex';
import { Slider } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'flex', gap: t['--os-space-8'] },
});

export default function SliderVertical() {
  return (
    <div {...stylex.props(s.root)}>
      <Slider label="Bass" orientation="vertical" defaultValue={60} />
      <Slider label="Mid" orientation="vertical" defaultValue={45} />
      <Slider label="Treble" orientation="vertical" defaultValue={70} />
    </div>
  );
}
