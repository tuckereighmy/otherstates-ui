import * as stylex from '@stylexjs/stylex';
import { Select } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const statuses = [
  { id: 'draft', label: 'Draft' },
  { id: 'review', label: 'In review' },
  { id: 'published', label: 'Published' },
];

const sizes = [
  { size: 'sm', label: 'Small, 32 px' },
  { size: 'md', label: 'Medium, 40 px' },
  { size: 'lg', label: 'Large, 44 px' },
] as const;

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-3'], width: 280, maxWidth: '100%' },
});

export default function SelectSizes() {
  return (
    <div {...stylex.props(s.root)}>
      {sizes.map(({ size, label }) => (
        <Select key={size} appearance="field" size={size} label={label} hideLabel options={statuses} defaultValue="draft" />
      ))}
    </div>
  );
}
