import { SegmentedControl } from '../../../components';

const views = [
  { value: 'list', label: 'List' },
  { value: 'board', label: 'Board' },
  { value: 'timeline', label: 'Timeline' },
];

export default function SegmentedControlDefault() {
  return <SegmentedControl label="View" defaultValue="board" options={views} />;
}
