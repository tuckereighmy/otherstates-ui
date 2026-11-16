import * as stylex from '@stylexjs/stylex';
import { Icon, Toolbar, ToolbarButton, ToolbarSeparator } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const sizes = [
  { size: 'sm', icon: 16 },
  { size: 'md', icon: 16 },
  { size: 'lg', icon: 18 },
] as const;

const s = stylex.create({
  stack: { display: 'grid', justifyItems: 'center', gap: t['--os-space-4'] },
});

export default function ToolbarSizes() {
  return (
    <div {...stylex.props(s.stack)}>
      {sizes.map(({ size, icon }) => (
        <Toolbar key={size} size={size} aria-label={`Editing, ${size}`}>
          <ToolbarButton aria-label="Undo"><Icon name="undo" size={icon} /></ToolbarButton>
          <ToolbarButton aria-label="Redo"><Icon name="redo" size={icon} /></ToolbarButton>
          <ToolbarSeparator />
          <ToolbarButton>Comment</ToolbarButton>
        </Toolbar>
      ))}
    </div>
  );
}
