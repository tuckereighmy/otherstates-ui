import * as stylex from '@stylexjs/stylex';
import { Input } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const sizes = [
  { size: 'xs', label: 'Extra small, 24 px' },
  { size: 'sm', label: 'Small, 32 px' },
  { size: 'md', label: 'Medium, 40 px' },
  { size: 'lg', label: 'Large, 44 px' },
  { size: 'xl', label: 'Extra large, 48 px' },
] as const;

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-3'], width: 320, maxWidth: '100%' },
});

export default function InputSizes() {
  return (
    <div {...stylex.props(s.root)}>
      {sizes.map(({ size, label }) => (
        <Input key={size} size={size} aria-label={label} placeholder={label} />
      ))}
    </div>
  );
}
