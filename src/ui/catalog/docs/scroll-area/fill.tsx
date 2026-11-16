import * as stylex from '@stylexjs/stylex';
import { ScrollArea } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const events = Array.from({ length: 14 }, (_, i) => `Build ${120 - i} finished in ${38 + ((i * 7) % 20)} s`);

const s = stylex.create({
  panel: { display: 'flex', flexDirection: 'column', gap: tokens['--os-space-2'], width: 320, maxWidth: '100%', height: 240 },
  title: { margin: 0, fontSize: tokens['--os-font-size-sm'], lineHeight: tokens['--os-line-height-md'], fontWeight: tokens['--os-font-weight-medium'] },
  fill: { flexGrow: 1, minHeight: 0 },
  row: { paddingBlock: tokens['--os-space-2'], fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], fontVariantNumeric: 'tabular-nums' },
});

export default function ScrollAreaFill() {
  return (
    <section {...stylex.props(s.panel)}>
      <h3 {...stylex.props(s.title)}>Activity</h3>
      <ScrollArea aria-label="Activity" maxHeight="none" padding="4px 16px" {...stylex.props(s.fill)}>
        {events.map(event => <div key={event} {...stylex.props(s.row)}>{event}</div>)}
      </ScrollArea>
    </section>
  );
}
