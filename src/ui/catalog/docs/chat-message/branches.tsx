'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { ChatMessage, Markdown, MessageActions } from '../../../components';

const versions = ['Short and direct: the fix is ready.', 'The fix is ready, with two new tests.', 'Ready to ship: one guard, two tests, all green.'];
const s = stylex.create({ box: { width: '100%', maxWidth: 560, marginInline: 'auto' } });

export default function ChatMessageBranches() {
  const [index, setIndex] = useState(3);
  return (
    <ChatMessage {...stylex.props(s.box)} role="assistant" isLast actions={
      <MessageActions copyText={versions[index - 1]} onRetry={() => {}} branch={{ index, total: 3, onPrevious: () => setIndex(index - 1), onNext: () => setIndex(index + 1) }} />
    }>
      <Markdown>{versions[index - 1]}</Markdown>
    </ChatMessage>
  );
}
