import * as stylex from '@stylexjs/stylex';
import { Button } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-2'] },
});

export default function ButtonDisabled() {
  return (
    <div {...stylex.props(s.row)}>
      <Button isDisabled>Publish</Button>
      <Button appearance="secondary" isDisabled>Duplicate</Button>
      <Button appearance="tertiary" isDisabled>Invite people</Button>
      <Button appearance="text" isDisabled>Skip for now</Button>
    </div>
  );
}
