import * as stylex from '@stylexjs/stylex';
import { ScrollArea } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const projects = ['Office redesign', 'Spring campaign', 'Website audit', 'Help center', 'Mobile app', 'Annual report'];

const s = stylex.create({
  root: { width: 420, maxWidth: '100%' },
  row: { display: 'flex', gap: tokens['--os-space-2'], width: 'max-content' },
  tile: {
    display: 'flex', alignItems: 'flex-end', width: 132, height: 88, padding: tokens['--os-space-3'],
    borderRadius: tokens['--os-radius-md'], backgroundColor: tokens['--os-color-bg-muted'],
    fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], fontWeight: tokens['--os-font-weight-medium'],
  },
});

export default function ScrollAreaHorizontal() {
  return (
    <div {...stylex.props(s.root)}>
      <ScrollArea aria-label="Recent projects" orientation="horizontal" padding={8}>
        <div {...stylex.props(s.row)}>
          {projects.map(project => <div key={project} {...stylex.props(s.tile)}>{project}</div>)}
        </div>
      </ScrollArea>
    </div>
  );
}
