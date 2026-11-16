import { Button, Icon } from '../../../components';

export default function ButtonWithLink() {
  return (
    <Button href="#" appearance="tertiary" trailingIcon={<Icon name="external-link" />}>
      Open invoice
    </Button>
  );
}
