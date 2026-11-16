import * as stylex from '@stylexjs/stylex';
import { Button, Icon } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-2'] },
});

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export default function ButtonIconOnlySizes() {
  return (
    <div {...stylex.props(s.row)}>
      {sizes.map(size => (
        <Button key={size} size={size} iconOnly appearance="tertiary" aria-label="Edit">
          <Icon name="edit" />
        </Button>
      ))}
    </div>
  );
}
