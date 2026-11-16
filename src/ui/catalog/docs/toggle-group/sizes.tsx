import * as stylex from '@stylexjs/stylex';
import { Icon, ToggleGroup, ToggleGroupItem } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const sizes = [
  { size: 'xs', icon: 14 },
  { size: 'sm', icon: 16 },
  { size: 'md', icon: 16 },
] as const;

const s = stylex.create({
  stack: { display: 'grid', justifyItems: 'center', gap: t['--os-space-4'] },
});

export default function ToggleGroupSizes() {
  return (
    <div {...stylex.props(s.stack)}>
      {sizes.map(({ size, icon }) => (
        <ToggleGroup key={size} size={size} aria-label={`Text style, ${size}`} defaultSelectedKeys={['bold']}>
          <ToggleGroupItem id="bold" aria-label="Bold"><Icon name="bold" size={icon} /></ToggleGroupItem>
          <ToggleGroupItem id="italic" aria-label="Italic"><Icon name="italic" size={icon} /></ToggleGroupItem>
          <ToggleGroupItem id="underline" aria-label="Underline"><Icon name="underline" size={icon} /></ToggleGroupItem>
        </ToggleGroup>
      ))}
    </div>
  );
}
