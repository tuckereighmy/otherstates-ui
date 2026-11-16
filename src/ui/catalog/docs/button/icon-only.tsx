import * as stylex from '@stylexjs/stylex';
import { Button, Icon } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-2'] },
});

export default function ButtonIconOnly() {
  return (
    <div {...stylex.props(s.row)}>
      <Button iconOnly aria-label="New note">
        <Icon name="plus" />
      </Button>
      <Button iconOnly appearance="secondary" aria-label="Copy link">
        <Icon name="link" />
      </Button>
      <Button iconOnly appearance="tertiary" aria-label="Settings">
        <Icon name="settings" />
      </Button>
      <Button iconOnly appearance="text" aria-label="More actions">
        <Icon name="more-horizontal" />
      </Button>
    </div>
  );
}
