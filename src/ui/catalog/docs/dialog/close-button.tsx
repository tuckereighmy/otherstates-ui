import { Button, Dialog, Field, Input } from '../../../components';

export default function DialogCloseButton() {
  return (
    <Dialog
      trigger={<Button appearance="tertiary">Share</Button>}
      title="Share project"
      description="Anyone with the link can view this project."
      showCloseButton
    >
      <Field label="Project link">
        <Input isReadOnly defaultValue="https://example.com/p/atlas" />
      </Field>
    </Dialog>
  );
}
