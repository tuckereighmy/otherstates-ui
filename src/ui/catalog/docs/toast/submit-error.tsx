'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, ToastRegion, createToastQueue } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'center', gap: t['--os-space-2'], width: 300, maxWidth: '100%' },
});

export default function ToastSubmitError() {
  const [queue] = useState(() => createToastQueue());
  const [pending, setPending] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    window.setTimeout(() => {
      setPending(false);
      queue.add({ kind: 'error', title: 'Invite not sent', description: 'dele@example.com is already a member.' });
    }, 900);
  }

  return (
    <form onSubmit={submit} {...stylex.props(s.root)}>
      <ToastRegion queue={queue} inline />
      <Button type="submit" isLoading={pending}>Send invite</Button>
    </form>
  );
}
