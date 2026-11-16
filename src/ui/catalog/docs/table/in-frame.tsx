import * as stylex from '@stylexjs/stylex';
import { Frame, Table, TableBody, TableCell, TableColumnHeader, TableHead, TableRow } from '../../../components';

const domains = [
  { name: 'notes.example.com', status: 'Verified' },
  { name: 'docs.example.com', status: 'Pending' },
];

const s = stylex.create({
  root: { width: 480, maxWidth: '100%' },
});

export default function TableInFrame() {
  return (
    <div {...stylex.props(s.root)}>
      <Frame title="Domains" description="Point a CNAME record at your project to add one.">
        <Table aria-label="Domains" variant="plain">
          <TableHead>
            <TableRow>
              <TableColumnHeader>Domain</TableColumnHeader>
              <TableColumnHeader alignEnd>Status</TableColumnHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {domains.map(domain => (
              <TableRow key={domain.name}>
                <TableCell>{domain.name}</TableCell>
                <TableCell alignEnd>{domain.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Frame>
    </div>
  );
}
