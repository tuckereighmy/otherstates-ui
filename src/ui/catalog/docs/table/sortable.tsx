'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableColumnHeader, TableHead, TableRow } from '../../../components';

type SortDirection = 'ascending' | 'descending';

const invoices = [
  { id: 'INV-012', status: 'Paid', amount: 48 },
  { id: 'INV-013', status: 'Open', amount: 120 },
  { id: 'INV-014', status: 'Paid', amount: 96 },
];

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const s = stylex.create({
  root: { width: 440, maxWidth: '100%' },
});

export default function TableSortable() {
  const [sort, setSort] = useState<SortDirection>();
  const rows = [...invoices].sort((a, b) => (sort === 'descending' ? b.amount - a.amount : sort ? a.amount - b.amount : 0));

  return (
    <div {...stylex.props(s.root)}>
      <Table aria-label="Invoices">
        <TableHead>
          <TableRow>
            <TableColumnHeader>Invoice</TableColumnHeader>
            <TableColumnHeader>Status</TableColumnHeader>
            <TableColumnHeader alignEnd sortDirection={sort} onSort={() => setSort(sort === 'ascending' ? 'descending' : 'ascending')}>
              Amount
            </TableColumnHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(invoice => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.id}</TableCell>
              <TableCell>{invoice.status}</TableCell>
              <TableCell alignEnd>{currency.format(invoice.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
