import { SegmentedControl } from '../../../components';

const sections = [
  { value: 'overview', label: 'Overview', href: '#' },
  { value: 'invoices', label: 'Invoices', href: '#' },
  { value: 'payouts', label: 'Payouts', href: '#' },
];

export default function SegmentedControlNavigation() {
  return <SegmentedControl label="Billing" defaultValue="invoices" options={sections} />;
}
