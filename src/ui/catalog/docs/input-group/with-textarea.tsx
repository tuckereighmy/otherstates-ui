import * as stylex from '@stylexjs/stylex';
import { Icon, InputGroup, InputGroupAddon, InputGroupButton, Textarea } from '../../../components';

const s = stylex.create({
  root: { width: 380, maxWidth: '100%' },
  spacer: { flexGrow: 1 },
});

export default function InputGroupWithTextarea() {
  return (
    <div {...stylex.props(s.root)}>
      <InputGroup>
        <Textarea aria-label="Reply" placeholder="Write a reply" minRows={2} maxRows={6} />
        <InputGroupAddon align="block-end">
          <InputGroupButton iconOnly aria-label="Attach a file">
            <Icon name="paperclip" />
          </InputGroupButton>
          <span {...stylex.props(s.spacer)} />
          <InputGroupButton variant="secondary">Send</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
