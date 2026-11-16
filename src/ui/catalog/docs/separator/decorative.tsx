import * as stylex from '@stylexjs/stylex';
import { Separator } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens['--os-space-2'],
    height: 16,
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-caption'],
  },
});

export default function SeparatorDecorative() {
  return (
    <div {...stylex.props(s.row)}>
      <span>Draft</span>
      <Separator orientation="vertical" decorative />
      <span>Edited 2 minutes ago</span>
      <Separator orientation="vertical" decorative />
      <span>3 comments</span>
    </div>
  );
}
