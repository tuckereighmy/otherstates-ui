import * as stylex from '@stylexjs/stylex';
import { Button, Input } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'flex', gap: t['--os-space-2'], width: 380, maxWidth: '100%' },
});

export default function InputWithButton() {
  return (
    <div {...stylex.props(s.root)}>
      <Input type="email" aria-label="Teammate email" placeholder="teammate@example.com" />
      <Button>Invite</Button>
    </div>
  );
}
