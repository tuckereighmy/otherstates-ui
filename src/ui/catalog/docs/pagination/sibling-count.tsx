import { Pagination } from '../../../components';

export default function PaginationSiblingCount() {
  return <Pagination aria-label="Project pages" totalPages={20} defaultPage={10} siblingCount={1} />;
}
