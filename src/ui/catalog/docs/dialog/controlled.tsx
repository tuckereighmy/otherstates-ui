'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Dialog, Field, Input } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-2'], justifyItems: 'center' },
  status: { margin: 0, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], color: tokens['--os-color-fg-muted'] },
});

export default function DialogControlled() {
  const [isOpen, setOpen] = useState(false);
  const [name, setName] = useState('Atlas');

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setName(String(new FormData(event.currentTarget).get('name')));
    setOpen(false);
  };

  return (
    <div {...stylex.props(s.root)}>
      <Button appearance="tertiary" onClick={() => setOpen(true)}>Rename project</Button>
      <p {...stylex.props(s.status)}>Project: {name}</p>
      <Dialog
        isOpen={isOpen}
        onOpenChange={setOpen}
        title="Rename project"
        footer={<Button form="rename-project" type="submit">Save</Button>}
      >
        <form id="rename-project" onSubmit={save}>
          <Field label="Name">
            <Input name="name" defaultValue={name} required />
          </Field>
        </form>
      </Dialog>
    </div>
  );
}
