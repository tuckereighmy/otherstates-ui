import * as stylex from '@stylexjs/stylex';
import { Empty, Icon } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const sizes = ['sm', 'md', 'lg'] as const;

const s = stylex.create({
  root: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    alignItems: 'center',
    gap: t['--os-space-4'],
    width: 720,
    maxWidth: '100%',
  },
});

export default function EmptySizes() {
  return (
    <div {...stylex.props(s.root)}>
      {sizes.map(size => (
        <Empty
          key={size}
          size={size}
          icon={<Icon name="inbox" />}
          heading="Inbox zero"
          description="New requests land here."
        />
      ))}
    </div>
  );
}
