import { RadioGroup } from '../../../components';

const regions = [
  { value: 'eu', label: 'Frankfurt' },
  { value: 'us', label: 'Virginia' },
];

export default function RadioGroupReadOnly() {
  return <RadioGroup label="Data region" description="Set when the workspace was created." isReadOnly defaultValue="eu" options={regions} />;
}
