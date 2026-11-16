'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Pagination } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const total = 86;
const perPage = 10;

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], justifyItems: 'center' },
  summary: { margin: 0, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-md'], color: tokens['--os-color-fg-muted'], fontVariantNumeric: 'tabular-nums' },
});

export default function PaginationControlled() {
  const [page, setPage] = useState(3);
  const first = (page - 1) * perPage + 1;
  const last = Math.min(page * perPage, total);

  return (
    <div {...stylex.props(s.root)}>
      <Pagination aria-label="Deployment pages" totalPages={Math.ceil(total / perPage)} page={page} onPageChange={setPage} />
      <p role="status" {...stylex.props(s.summary)}>Showing {first}–{last} of {total} deployments</p>
    </div>
  );
}
