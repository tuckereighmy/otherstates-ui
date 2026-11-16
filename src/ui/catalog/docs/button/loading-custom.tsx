import { Button, Spinner } from '../../../components';

export default function ButtonLoadingCustom() {
  return (
    <Button appearance="secondary" aria-disabled leadingIcon={<Spinner size="sm" tone="current" />}>
      Uploading 3 files
    </Button>
  );
}
