import * as stylex from '@stylexjs/stylex';
import { Table, TableBody, TableCell, TableColumnHeader, TableHead, TableRow } from '../../../components';

const events = Array.from({ length: 12 }, (_, index) => ({
  id: `evt-${120 - index}`,
  action: index % 3 === 0 ? 'Deploy finished' : index % 3 === 1 ? 'Member invited' : 'Domain verified',
  time: `${9 + Math.floor(index / 2)}:${index % 2 ? '30' : '05'}`,
}));

const s = stylex.create({
  root: { width: 440, maxWidth: '100%' },
});

export default function TableStickyHeader() {
  return (
    <div {...stylex.props(s.root)}>
      <Table aria-label="Activity" stickyHeader maxHeight={232}>
        <TableHead>
          <TableRow>
            <TableColumnHeader>Event</TableColumnHeader>
            <TableColumnHeader>Action</TableColumnHeader>
            <TableColumnHeader alignEnd>Time</TableColumnHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map(event => (
            <TableRow key={event.id}>
              <TableCell>{event.id}</TableCell>
              <TableCell>{event.action}</TableCell>
              <TableCell alignEnd>{event.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
