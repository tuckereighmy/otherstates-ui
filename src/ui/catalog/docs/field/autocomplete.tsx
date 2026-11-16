import * as stylex from '@stylexjs/stylex';
import { Autocomplete, Field } from '../../../components';

const zones = ['Auckland', 'Berlin', 'Chicago', 'Lagos', 'Lima', 'Mumbai', 'Seoul']
  .map(city => ({ id: city.toLowerCase(), label: city }));

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldAutocomplete() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Time zone" description="Type a city to find its zone.">
        <Autocomplete name="timezone" placeholder="Search cities" options={zones} />
      </Field>
    </div>
  );
}
