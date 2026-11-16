'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Field, Icon, Input, InputGroup, InputGroupAddon, InputGroupButton } from '../../../components';

const link = 'https://example.com/invite/7hq2';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function InputGroupWithIconButton() {
  const [copied, setCopied] = useState(false);

  return (
    <div {...stylex.props(s.root)}>
      <Field label="Invite link" isReadOnly>
        <InputGroup>
          <Input defaultValue={link} />
          <InputGroupAddon align="end">
            <InputGroupButton
              iconOnly
              aria-label={copied ? 'Copied' : 'Copy link'}
              onPress={() => navigator.clipboard?.writeText(link).then(() => setCopied(true), () => {})}
            >
              <Icon name={copied ? 'check' : 'copy'} />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  );
}
