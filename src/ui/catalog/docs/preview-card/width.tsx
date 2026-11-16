import * as stylex from '@stylexjs/stylex';
import { Avatar, PreviewCard } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  head: { display: 'flex', alignItems: 'center', gap: tokens['--os-space-3'] },
  name: { margin: 0, fontSize: tokens['--os-font-size-sm'], lineHeight: tokens['--os-line-height-md'], fontWeight: tokens['--os-font-weight-medium'] },
  role: { margin: 0, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], color: tokens['--os-color-fg-muted'] },
  bio: { margin: 0, marginBlockStart: tokens['--os-space-3'], fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], color: tokens['--os-color-fg-muted'] },
});

export default function PreviewCardWidth() {
  return (
    <PreviewCard href="#" trigger="Ines Moreau" width={320}>
      <div {...stylex.props(s.head)}>
        <Avatar name="Ines Moreau" fallback="gradient" />
        <div>
          <p {...stylex.props(s.name)}>Ines Moreau</p>
          <p {...stylex.props(s.role)}>Product designer, Platform</p>
        </div>
      </div>
      <p {...stylex.props(s.bio)}>Owns the settings redesign and the design review on Thursdays.</p>
    </PreviewCard>
  );
}
