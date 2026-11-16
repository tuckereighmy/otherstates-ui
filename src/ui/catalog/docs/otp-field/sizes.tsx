import * as stylex from '@stylexjs/stylex';
import { OtpField } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'start', gap: t['--os-space-5'] },
});

export default function OtpFieldSizes() {
  return (
    <div {...stylex.props(s.root)}>
      <OtpField label="Small" size="sm" length={4} />
      <OtpField label="Medium" length={4} />
    </div>
  );
}
