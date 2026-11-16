import * as stylex from '@stylexjs/stylex';
import { Card, CardPanel, Table, TableBody, TableCell, TableColumnHeader, TableHead, TableRow } from '../../../components';

const invoices = [
  { id: 'INV-041', project: 'Office redesign', amount: '$1,240.00' },
  { id: 'INV-042', project: 'Spring campaign', amount: '$380.00' },
  { id: 'INV-043', project: 'Website audit', amount: '$2,015.50' },
];

const s = stylex.create({
  root: { width: 480, maxWidth: '100%' },
});

export default function TableInCard() {
  return (
    <div {...stylex.props(s.root)}>
      <Card heading="Recent invoices" description="Issued in the last 30 days">
        <CardPanel>
          <Table aria-label="Recent invoices" variant="plain">
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
        </CardPanel>
      </Card>
    </div>
  );
}
