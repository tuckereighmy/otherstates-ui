import * as stylex from '@stylexjs/stylex';
import { Combobox } from '../../../components';

const reviewers = [
  { id: 'amara', label: 'Amara' },
  { id: 'jonas', label: 'Jonas' },
  { id: 'priya', label: 'Priya' },
];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function ComboboxInvalid() {
  return (
    <div {...stylex.props(s.root)}>
      <Combobox
        label="Reviewer"
        placeholder="Choose a reviewer"
        description="They get a request when you publish."
        options={reviewers}
        errorMessage="Choose someone to review this change."
      />
    </div>
  );
}
