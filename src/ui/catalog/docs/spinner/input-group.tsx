import * as stylex from '@stylexjs/stylex';
import { Input, InputGroup, InputGroupAddon, Spinner } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function SpinnerInputGroup() {
  return (
    <div {...stylex.props(s.root)}>
      <InputGroup>
        <Input defaultValue="maple-studio" aria-label="Workspace address" />
        <InputGroupAddon align="end">
          <Spinner size="sm" tone="muted" aria-label="Checking the address" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
