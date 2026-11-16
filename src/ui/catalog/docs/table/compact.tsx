import * as stylex from '@stylexjs/stylex';
import { Table, TableBody, TableCell, TableColumnHeader, TableHead, TableRow } from '../../../components';

const deployments = [
  { id: 'd-311', branch: 'main', duration: '48s' },
  { id: 'd-310', branch: 'pricing-copy', duration: '52s' },
  { id: 'd-309', branch: 'main', duration: '47s' },
  { id: 'd-308', branch: 'search-fix', duration: '1m 04s' },
];

const s = stylex.create({
  root: { width: 440, maxWidth: '100%' },
});

export default function TableCompact() {
  return (
    <div {...stylex.props(s.root)}>
      <Table aria-label="Deployments" density="compact">
        <TableHead>
          <TableRow>
            <TableColumnHeader>Deployment</TableColumnHeader>
            <TableColumnHeader>Branch</TableColumnHeader>
            <TableColumnHeader alignEnd>Duration</TableColumnHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {deployments.map(deployment => (
            <TableRow key={deployment.id}>
              <TableCell>{deployment.id}</TableCell>
              <TableCell>{deployment.branch}</TableCell>
              <TableCell alignEnd>{deployment.duration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
