import { Pagination } from '../../../components';

export default function PaginationDefault() {
  return <Pagination aria-label="Invoice pages" totalPages={9} defaultPage={2} />;
}
