'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef } from 'react';
import { Icon, Input, InputGroup, InputGroupAddon, Kbd } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputGroupWithKeyboardShortcut() {
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const typing = event.target instanceof HTMLElement && event.target.closest('input, textarea, [contenteditable]');
      if (event.key !== '/' || typing) return;
      event.preventDefault();
      input.current?.focus();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div {...stylex.props(s.root)}>
      <InputGroup>
        <InputGroupAddon>
          <Icon name="search" />
        </InputGroupAddon>
        <Input ref={input} aria-label="Search notes" aria-keyshortcuts="/" placeholder="Search notes" />
        <InputGroupAddon align="end">
          <Kbd size="sm">/</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
