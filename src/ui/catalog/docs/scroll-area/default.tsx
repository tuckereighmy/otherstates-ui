import * as stylex from '@stylexjs/stylex';
import { Icon, ScrollArea } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const files = [
  'Project brief', 'Audience research', 'Interview notes', 'Journey maps',
  'Launch checklist', 'Visual references', 'Meeting notes', 'Budget overview',
];

const s = stylex.create({
  root: { width: 300, maxWidth: '100%' },
  list: { margin: 0, padding: 0, listStyle: 'none' },
  row: {
    display: 'flex', alignItems: 'center', gap: tokens['--os-space-2'], height: 36,
    paddingInline: tokens['--os-space-3'], fontSize: tokens['--os-font-size-sm'], lineHeight: tokens['--os-line-height-md'],
  },
  icon: { display: 'flex', color: tokens['--os-color-fg-muted'] },
});

export default function ScrollAreaDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <ScrollArea aria-label="Project files" maxHeight={180} padding={6}>
        <ul role="list" {...stylex.props(s.list)}>
          {files.map(file => (
            <li key={file} {...stylex.props(s.row)}>
              <span {...stylex.props(s.icon)}><Icon name="file" size={16} /></span>
              {file}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
