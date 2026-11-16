import { Select } from '../../../components';

const sortOptions = [
  { id: 'newest', label: 'Newest' },
  { id: 'oldest', label: 'Oldest' },
  { id: 'edited', label: 'Recently edited' },
  { id: 'title', label: 'Title' },
];

export default function SelectDefault() {
  return <Select label="Sort by" options={sortOptions} defaultValue="newest" />;
}
