import * as stylex from '@stylexjs/stylex';
import { CheckboxGroup } from '../../../components';

const s = stylex.create({
  root: { width: 380, maxWidth: '100%' },
});

const addons = [
  { id: 'analytics', label: 'Analytics', description: 'Page views and conversion funnels.' },
  { id: 'logs', label: 'Log retention', description: 'Keep request logs for 90 days.' },
  { id: 'support', label: 'Priority support', description: 'Replies within four business hours.' },
];

export default function CheckboxGroupCard() {
  return (
    <div {...stylex.props(s.root)}>
      <CheckboxGroup label="Add-ons" variant="card" defaultValue={['logs']} options={addons} />
    </div>
  );
}
