'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Pagination } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], justifyItems: 'center' },
  url: { margin: 0, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-md'], color: tokens['--os-color-fg-muted'] },
});

export default function PaginationLinks() {
  const [page, setPage] = useState(1);
  const href = (value: number) => `/invoices?page=${value}`;

  return (
    <div {...stylex.props(s.root)} onClick={event => event.preventDefault()}>
      <Pagination aria-label="Invoice pages" totalPages={6} page={page} onPageChange={setPage} getPageHref={href} />
      <p {...stylex.props(s.url)}>Links to {href(page)}</p>
    </div>
  );
}
