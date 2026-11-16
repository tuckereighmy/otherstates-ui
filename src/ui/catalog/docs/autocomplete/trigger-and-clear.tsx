import * as stylex from '@stylexjs/stylex';
import { Autocomplete } from '../../../components';

const units = ['Hours', 'Days', 'Weeks', 'Sprints'].map(unit => ({ id: unit.toLowerCase(), label: unit }));

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function AutocompleteTriggerAndClear() {
  return (
    <div {...stylex.props(s.root)}>
      <Autocomplete label="Estimate unit" placeholder="Type or choose" options={units} showTrigger isClearable />
    </div>
  );
}
