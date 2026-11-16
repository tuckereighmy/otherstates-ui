import { Icon, SegmentedControl } from '../../../components';

const themes = [
  { value: 'light', label: 'Light', icon: <Icon name="sun" size={16} /> },
  { value: 'dark', label: 'Dark', icon: <Icon name="moon" size={16} /> },
  { value: 'system', label: 'System', icon: <Icon name="monitor" size={16} /> },
];

export default function SegmentedControlWithIcons() {
  return <SegmentedControl label="Theme" defaultValue="system" options={themes} />;
}
