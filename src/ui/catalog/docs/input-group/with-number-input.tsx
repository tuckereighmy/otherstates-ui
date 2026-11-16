'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Field, Icon, Input, InputGroup, InputGroupButton } from '../../../components';

const s = stylex.create({
  root: { width: 200, maxWidth: '100%' },
});

export default function InputGroupWithNumberInput() {
  const [seats, setSeats] = useState(5);
  const update = (next: number) => setSeats(Math.min(50, Math.max(1, next)));

  return (
    <div {...stylex.props(s.root)}>
      <Field label="Seats" description="From 1 to 50.">
        <InputGroup>
          <InputGroupButton iconOnly aria-label="Remove a seat" isDisabled={seats <= 1} onPress={() => update(seats - 1)}>
            <Icon name="minus" />
          </InputGroupButton>
          <Input inputMode="numeric" value={seats} onChange={event => update(Number(event.currentTarget.value) || 1)} />
          <InputGroupButton iconOnly aria-label="Add a seat" isDisabled={seats >= 50} onPress={() => update(seats + 1)}>
            <Icon name="plus" />
          </InputGroupButton>
        </InputGroup>
      </Field>
    </div>
  );
}
