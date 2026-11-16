import * as stylex from '@stylexjs/stylex';
import { ScrubStepper } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-6'] },
});

export default function NumberFieldScrubStepperStates() {
  return (
    <div {...stylex.props(s.root)}>
      <ScrubStepper label="Copies" hideLabel={false} size="sm" defaultValue={2} min={1} />
      <ScrubStepper label="Seats" hideLabel={false} defaultValue={12} isReadOnly />
      <ScrubStepper
        label="Guests"
        hideLabel={false}
        defaultValue={0}
        isInvalid
        errorMessage="Add at least one guest."
      />
    </div>
  );
}
