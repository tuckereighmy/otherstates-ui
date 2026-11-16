import * as stylex from '@stylexjs/stylex';
import { Table, TableBody, TableCell, TableColumnHeader, TableFooter, TableHead, TableRow } from '../../../components';

const items = [
  { name: 'Design review', hours: 6, amount: '$540.00' },
  { name: 'Prototype', hours: 14, amount: '$1,260.00' },
  { name: 'Usability tests', hours: 8, amount: '$720.00' },
];

const s = stylex.create({
  root: { width: 440, maxWidth: '100%' },
});

export default function TableWithFooter() {
  return (
    <div {...stylex.props(s.root)}>
      <Table caption="Hours billed for the office redesign in May.">
        <TableHead>
          <TableRow>
            <TableColumnHeader>Item</TableColumnHeader>
            <TableColumnHeader alignEnd>Hours</TableColumnHeader>
            <TableColumnHeader alignEnd>Amount</TableColumnHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map(item => (
            <TableRow key={item.name}>
              <TableCell>{item.name}</TableCell>
              <TableCell alignEnd>{item.hours}</TableCell>
              <TableCell alignEnd>{item.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell alignEnd>28</TableCell>
            <TableCell alignEnd>$2,520.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
