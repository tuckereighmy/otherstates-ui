import * as stylex from '@stylexjs/stylex';
import { Combobox } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const labels = [
  { id: 'bug', label: 'Bug' },
  { id: 'feature', label: 'Feature' },
  { id: 'docs', label: 'Documentation' },
];

const sizes = [
  { size: 'sm', label: 'Small, 32 px' },
  { size: 'md', label: 'Medium, 40 px' },
  { size: 'lg', label: 'Large, 44 px' },
] as const;

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-3'], width: 280, maxWidth: '100%' },
});

export default function ComboboxSizes() {
  return (
    <div {...stylex.props(s.root)}>
      {sizes.map(({ size, label }) => (
        <Combobox key={size} size={size} label={label} hideLabel placeholder={label} options={labels} />
      ))}
    </div>
  );
}
