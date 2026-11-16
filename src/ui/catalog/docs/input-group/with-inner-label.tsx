'use client';

import * as stylex from '@stylexjs/stylex';
import { useId } from 'react';
import { Input, InputGroup, InputGroupAddon, Label } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputGroupWithInnerLabel() {
  const id = useId();

  return (
    <div {...stylex.props(s.root)}>
      <InputGroup>
        <InputGroupAddon align="block-start">
          <Label htmlFor={id}>Recipient</Label>
        </InputGroupAddon>
        <Input id={id} type="email" placeholder="name@example.com" />
      </InputGroup>
    </div>
  );
}
