import { Pagination } from '../../../components';

export default function PaginationDisabled() {
  return <Pagination aria-label="Report pages" totalPages={9} defaultPage={4} isDisabled />;
}
