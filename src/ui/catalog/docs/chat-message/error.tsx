'use client';

import * as stylex from '@stylexjs/stylex';
import { ChatMessage, Markdown } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 560, marginInline: 'auto' } });

export default function ChatMessageError() {
  return (
    <ChatMessage {...stylex.props(s.box)} role="assistant" error="The connection dropped before the reply finished." onRetry={() => {}}>
      <Markdown>{'Here is what I found so far: the crash starts in'}</Markdown>
    </ChatMessage>
  );
}
