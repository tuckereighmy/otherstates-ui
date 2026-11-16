'use client';

import { useRef, useState } from 'react';
import { AnchoredToast, Button, Icon } from '../../../components';

const link = 'https://notes.example.com/s/q3-plan';

export default function ToastAnchored() {
  const button = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(link).catch(() => undefined);
    setCopied(true);
  }

  return (
    <>
      <Button ref={button} appearance="secondary" leadingIcon={<Icon name="copy" />} onClick={copy}>
        Copy link
      </Button>
      <AnchoredToast triggerRef={button} isOpen={copied} onOpenChange={setCopied} kind="success" title="Link copied" />
    </>
  );
}
