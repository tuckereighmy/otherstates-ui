import * as stylex from '@stylexjs/stylex';
import { ScrollArea } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const releases = [
  { version: '2.4.0', date: 'Nov 10' }, { version: '2.3.2', date: 'Oct 28' }, { version: '2.3.1', date: 'Oct 21' },
  { version: '2.3.0', date: 'Oct 14' }, { version: '2.2.0', date: 'Sep 30' }, { version: '2.1.1', date: 'Sep 16' },
];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
  row: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 36, paddingInline: tokens['--os-space-3'],
    fontSize: tokens['--os-font-size-sm'], lineHeight: tokens['--os-line-height-md'], fontVariantNumeric: 'tabular-nums',
  },
  meta: { color: tokens['--os-color-fg-muted'] },
});

export default function ScrollAreaBordered() {
  return (
    <div {...stylex.props(s.root)}>
      <ScrollArea aria-label="Releases" bordered maxHeight={168} padding={6}>
        {releases.map(({ version, date }) => (
          <div key={version} {...stylex.props(s.row)}>
            Version {version}<span {...stylex.props(s.meta)}>{date}</span>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
