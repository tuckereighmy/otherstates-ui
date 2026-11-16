import * as stylex from '@stylexjs/stylex';
import { CheckboxGroup, Field } from '../../../components';

const events = [
  { id: 'deploys', label: 'Deployments' },
  { id: 'comments', label: 'New comments' },
  { id: 'invoices', label: 'Invoices' },
];

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldCheckboxGroup() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Notify me about" description="We send these to your work email.">
        <CheckboxGroup name="events" options={events} defaultValue={['deploys']} />
      </Field>
    </div>
  );
}
