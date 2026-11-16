import * as stylex from '@stylexjs/stylex';
import { Card } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const sizes = [
  { size: 'sm', heading: 'Small', padding: '16 px padding' },
  { size: 'md', heading: 'Medium', padding: '20 px padding' },
  { size: 'lg', heading: 'Large', padding: '24 px padding' },
] as const;

const s = stylex.create({
  root: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    alignItems: 'start',
    gap: tokens['--os-space-4'],
    width: 640,
    maxWidth: '100%',
  },
});

export default function CardSizes() {
  return (
    <div {...stylex.props(s.root)}>
      {sizes.map(({ size, heading, padding }) => (
        <Card key={size} size={size} heading={heading}>
          {padding}
        </Card>
      ))}
    </div>
  );
}
