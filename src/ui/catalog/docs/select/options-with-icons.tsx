import { Icon, Select } from '../../../components';

const views = [
  { id: 'list', label: 'List', icon: <Icon name="list" size={16} /> },
  { id: 'board', label: 'Board', icon: <Icon name="grid" size={16} /> },
  { id: 'calendar', label: 'Calendar', icon: <Icon name="calendar" size={16} /> },
  { id: 'timeline', label: 'Timeline', icon: <Icon name="clock" size={16} /> },
];

export default function SelectOptionsWithIcons() {
  return <Select label="View" hideLabel options={views} defaultValue="board" />;
}
