import * as stylex from '@stylexjs/stylex';
import { ScrollArea } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const columns = [
  { title: 'Backlog', tasks: ['Audit icons', 'Draft FAQ'] },
  { title: 'In progress', tasks: ['Billing page', 'Search filters'] },
  { title: 'Review', tasks: ['Invite flow'] },
  { title: 'Done', tasks: ['Dark theme', 'Export to CSV'] },
];

const s = stylex.create({
  root: { width: 420, maxWidth: '100%' },
  board: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: tokens['--os-space-2'], minWidth: 600 },
  column: { display: 'grid', alignContent: 'start', gap: tokens['--os-space-1-5'], fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'] },
  title: { margin: 0, color: tokens['--os-color-fg-muted'], fontSize: tokens['--os-font-size-xs'], lineHeight: tokens['--os-line-height-xs'], fontWeight: tokens['--os-font-weight-medium'] },
  task: { padding: tokens['--os-space-2'], borderRadius: tokens['--os-radius-md'], backgroundColor: tokens['--os-color-bg-muted'] },
});

export default function ScrollAreaContentMinWidth() {
  return (
    <div {...stylex.props(s.root)}>
      <ScrollArea aria-label="Task board" orientation="horizontal" padding={12}>
        <div {...stylex.props(s.board)}>
          {columns.map(column => (
            <div key={column.title} {...stylex.props(s.column)}>
              <h4 {...stylex.props(s.title)}>{column.title}</h4>
              {column.tasks.map(task => <div key={task} {...stylex.props(s.task)}>{task}</div>)}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
