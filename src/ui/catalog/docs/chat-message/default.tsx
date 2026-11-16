'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { ChatMessage, Markdown, MessageActions } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ column: { display: 'grid', gap: t['--os-space-8'], width: '100%', maxWidth: 560, marginInline: 'auto' } });

export default function ChatMessageDefault() {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  return (
    <div {...stylex.props(s.column)}>
      <ChatMessage role="user" actions={<MessageActions copyText="Can we ship the fix today?" onEdit={() => {}} />}>Can we ship the fix today?</ChatMessage>
      <ChatMessage role="assistant" isLast actions={<MessageActions copyText="" feedback={feedback} onFeedback={setFeedback} onRetry={() => {}} />}>
        <Markdown>{'Yes. The tests pass and the change is small. I can deploy it to **staging** first, then production after you check it.'}</Markdown>
      </ChatMessage>
    </div>
  );
}
