import * as stylex from '@stylexjs/stylex';
import { Icon, ToggleGroup, ToggleGroupItem } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  stack: { display: 'grid', justifyItems: 'center', gap: t['--os-space-4'] },
});

function Marks({ variant }: { variant: 'raised' | 'flush' }) {
  return (
    <ToggleGroup variant={variant} aria-label={`Text style, ${variant}`} defaultSelectedKeys={['italic']}>
      <ToggleGroupItem id="bold" aria-label="Bold"><Icon name="bold" size={16} /></ToggleGroupItem>
      <ToggleGroupItem id="italic" aria-label="Italic"><Icon name="italic" size={16} /></ToggleGroupItem>
      <ToggleGroupItem id="underline" aria-label="Underline"><Icon name="underline" size={16} /></ToggleGroupItem>
      <ToggleGroupItem id="strikethrough" aria-label="Strikethrough"><Icon name="strikethrough" size={16} /></ToggleGroupItem>
    </ToggleGroup>
  );
}

export default function ToggleGroupRaised() {
  return (
    <div {...stylex.props(s.stack)}>
      <Marks variant="raised" />
      <Marks variant="flush" />
    </div>
  );
}
