import * as stylex from '@stylexjs/stylex';
import { Textarea } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const sizes = [
  { size: 'sm', label: 'Small' },
  { size: 'md', label: 'Medium' },
  { size: 'lg', label: 'Large' },
] as const;

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'], width: 360, maxWidth: '100%' },
});

export default function TextareaSizes() {
  return (
    <div {...stylex.props(s.root)}>
      {sizes.map(({ size, label }) => (
        <Textarea key={size} size={size} label={label} placeholder="Add a comment" />
      ))}
    </div>
  );
}
