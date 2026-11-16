import * as stylex from '@stylexjs/stylex';
import { Button, Icon } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-2'] },
});

export default function ButtonWithIcon() {
  return (
    <div {...stylex.props(s.row)}>
      <Button appearance="secondary" leadingIcon={<Icon name="download" />}>
        Export CSV
      </Button>
      <Button trailingIcon={<Icon name="arrow-right" />}>Continue</Button>
    </div>
  );
}
