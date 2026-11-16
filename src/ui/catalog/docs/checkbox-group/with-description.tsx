import * as stylex from '@stylexjs/stylex';
import { CheckboxGroup } from '../../../components';

const s = stylex.create({
  root: { width: 340, maxWidth: '100%' },
});

const reports = [
  { id: 'weekly', label: 'Weekly summary', description: 'Deployments, incidents and spend for the last 7 days.' },
  { id: 'invoices', label: 'Invoices', description: 'A copy of every invoice when it is issued.' },
];

export default function CheckboxGroupWithDescription() {
  return (
    <div {...stylex.props(s.root)}>
      <CheckboxGroup
        label="Reports"
        description="Sent to the billing contact."
        defaultValue={['weekly']}
        options={reports}
      />
    </div>
  );
}
