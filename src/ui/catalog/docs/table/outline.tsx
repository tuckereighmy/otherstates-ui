import * as stylex from '@stylexjs/stylex';
import { Badge, Table, TableBody, TableCell, TableColumnHeader, TableHead, TableRow } from '../../../components';

const projects = [
  { name: 'Office redesign', owner: 'Lena', status: 'Active' },
  { name: 'Spring campaign', owner: 'Omar', status: 'Paused' },
  { name: 'Website audit', owner: 'Ines', status: 'Active' },
];

const s = stylex.create({
  root: { width: 440, maxWidth: '100%' },
});

export default function TableOutline() {
  return (
    <div {...stylex.props(s.root)}>
      <Table aria-label="Projects" variant="outline">
        <TableHead>
          <TableRow>
            <TableColumnHeader>Project</TableColumnHeader>
            <TableColumnHeader>Owner</TableColumnHeader>
            <TableColumnHeader>Status</TableColumnHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map(project => (
            <TableRow key={project.name}>
              <TableCell>{project.name}</TableCell>
              <TableCell>{project.owner}</TableCell>
              <TableCell>
                <Badge variant={project.status === 'Active' ? 'success' : 'secondary'} size="sm">{project.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
