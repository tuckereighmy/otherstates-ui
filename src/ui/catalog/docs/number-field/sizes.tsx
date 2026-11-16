import * as stylex from '@stylexjs/stylex';
import { NumberField } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'], width: 240, maxWidth: '100%' },
});

const sizes = [
  { size: 'xs', label: 'Extra small' },
  { size: 'sm', label: 'Small' },
  { size: 'md', label: 'Medium' },
  { size: 'lg', label: 'Large' },
  { size: 'xl', label: 'Extra large' },
] as const;

export default function NumberFieldSizes() {
  return (
    <div {...stylex.props(s.root)}>
      {sizes.map(({ size, label }) => (
        <NumberField key={size} size={size} label={label} defaultValue={4} minValue={0} />
      ))}
    </div>
  );
}
