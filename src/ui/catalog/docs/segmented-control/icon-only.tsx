import { Icon, SegmentedControl } from '../../../components';

const layouts = [
  { value: 'list', label: 'List', icon: <Icon name="list" size={16} />, hideLabel: true },
  { value: 'grid', label: 'Grid', icon: <Icon name="grid" size={16} />, hideLabel: true },
];

export default function SegmentedControlIconOnly() {
  return <SegmentedControl label="Layout" defaultValue="grid" options={layouts} />;
}
