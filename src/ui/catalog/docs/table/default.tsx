import * as stylex from '@stylexjs/stylex';
import { Table, TableBody, TableCell, TableColumnHeader, TableHead, TableRow } from '../../../components';

const invoices = [
  { id: 'INV-012', project: 'Office redesign', amount: '$480.00' },
  { id: 'INV-013', project: 'Spring campaign', amount: '$1,200.00' },
  { id: 'INV-014', project: 'Website audit', amount: '$960.00' },
];

const s = stylex.create({
  root: { width: 440, maxWidth: '100%' },
});

export default function TableDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Table aria-label="Invoices">
        <TableHead>
          <TableRow>
            <TableColumnHeader>Invoice</TableColumnHeader>
            <TableColumnHeader>Project</TableColumnHeader>
            <TableColumnHeader alignEnd>Amount</TableColumnHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map(invoice => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.id}</TableCell>
              <TableCell>{invoice.project}</TableCell>
              <TableCell alignEnd>{invoice.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
