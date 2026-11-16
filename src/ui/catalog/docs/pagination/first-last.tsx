import { Pagination } from '../../../components';

export default function PaginationFirstLast() {
  return <Pagination aria-label="Activity pages" totalPages={12} defaultPage={6} showFirstLast />;
}
