import { SegmentedControl } from '../../../components';

const speeds = ['0.5×', '1×', '1.25×', '1.5×', '2×'];

export default function SegmentedControlElastic() {
  return (
    <SegmentedControl
      label="Playback speed"
      appearance="elastic"
      withSurface
      defaultValue="1×"
      options={speeds.map(speed => ({ value: speed, label: speed }))}
    />
  );
}
