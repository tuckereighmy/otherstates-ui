import * as stylex from '@stylexjs/stylex';
import { Badge, Field, Input, InputGroup, InputGroupAddon } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputGroupWithBadge() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Default branch">
        <InputGroup>
          <Input defaultValue="release/2.4" />
          <InputGroupAddon align="end">
            <Badge variant="secondary" size="sm">Protected</Badge>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  );
}
