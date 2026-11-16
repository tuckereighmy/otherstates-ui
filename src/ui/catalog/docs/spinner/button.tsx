import { Button, Spinner } from '../../../components';

export default function SpinnerInButton() {
  return (
    <Button appearance="secondary" aria-disabled leadingIcon={<Spinner size="sm" tone="current" />}>
      Generating report
    </Button>
  );
}
