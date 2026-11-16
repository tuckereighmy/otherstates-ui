'use client';

import { Pagination } from '../../../components';

export default function PaginationLabels() {
  return (
    <Pagination
      totalPages={9}
      controls="text"
      labels={{
        navigation: 'Paginación',
        previousText: 'Anterior',
        nextText: 'Siguiente',
        page: page => `Página ${page}`,
      }}
    />
  );
}
