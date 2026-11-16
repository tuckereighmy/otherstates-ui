import { SegmentedControl } from '../../../components';

const quality = [
  { value: 'auto', label: 'Auto' },
  { value: 'high', label: 'High' },
  { value: 'saver', label: 'Data saver' },
];

export default function SegmentedControlWithSurface() {
  return <SegmentedControl label="Video quality" withSurface defaultValue="auto" options={quality} />;
}
