import * as stylex from '@stylexjs/stylex';
import { ScrollArea } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 12 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
  grid: {
    display: 'grid', gridTemplateColumns: `56px repeat(${days.length}, 88px)`, gap: tokens['--os-space-0-5'],
    fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], fontVariantNumeric: 'tabular-nums',
  },
  head: { paddingBlock: tokens['--os-space-1'], color: tokens['--os-color-fg-muted'], fontWeight: tokens['--os-font-weight-medium'] },
  cell: { height: 32, borderRadius: tokens['--os-radius-sm'], backgroundColor: tokens['--os-color-bg-muted'] },
});

export default function ScrollAreaBoth() {
  return (
    <div {...stylex.props(s.root)}>
      <ScrollArea aria-label="Room bookings" orientation="both" maxHeight={220} padding={8}>
        <div {...stylex.props(s.grid)}>
          <span />
          {days.map(day => <span key={day} {...stylex.props(s.head)}>{day}</span>)}
          {hours.map(hour => [
            <span key={hour} {...stylex.props(s.head)}>{hour}</span>,
            ...days.map(day => <span key={hour + day} {...stylex.props(s.cell)} />),
          ])}
        </div>
      </ScrollArea>
    </div>
  );
}
