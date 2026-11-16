import * as stylex from '@stylexjs/stylex';
import { Icon, Toggle } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-2'] },
});

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export default function ToggleSizes() {
  return (
    <div {...stylex.props(s.row)}>
      {sizes.map(size => (
        <Toggle key={size} size={size} variant="outline">
          <Icon name="bookmark" />
          Save
        </Toggle>
      ))}
    </div>
  );
}
