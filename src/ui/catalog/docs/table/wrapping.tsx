import * as stylex from '@stylexjs/stylex';
import { Table, TableBody, TableCell, TableColumnHeader, TableHead, TableRow } from '../../../components';

const notes = [
  { id: 'n-1', title: 'Kickoff', summary: 'Agreed on scope, owners and the review date for the first milestone.', updated: 'May 2' },
  { id: 'n-2', title: 'Pricing research', summary: 'Compared three plan structures and picked usage-based seats for the pilot.', updated: 'May 9' },
];

const s = stylex.create({
  root: { width: 480, maxWidth: '100%' },
});

export default function TableWrapping() {
  return (
    <div {...stylex.props(s.root)}>
      <Table aria-label="Notes">
        <TableHead>
          <TableRow>
            <TableColumnHeader>Note</TableColumnHeader>
            <TableColumnHeader>Summary</TableColumnHeader>
            <TableColumnHeader alignEnd>Updated</TableColumnHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {notes.map(note => (
            <TableRow key={note.id}>
              <TableCell>{note.title}</TableCell>
              <TableCell wrap="truncate">{note.summary}</TableCell>
              <TableCell alignEnd wrap="nowrap">{note.updated}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
