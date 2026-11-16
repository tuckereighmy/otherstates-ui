'use client';

import * as stylex from '@stylexjs/stylex';
import { ChatMessage, ChatThread, Composer, Markdown, MessageActions } from '../../../components';

const s = stylex.create({ frame: { height: 440 } });

export default function ChatThreadDefault() {
  return (
    <ChatThread
      {...stylex.props(s.frame)}
      composer={<Composer fullWidth variant="outline" onSubmit={() => {}} />}
      footnote="Agents can make mistakes. Check important changes."
    >
      <ChatMessage role="user">Summarize the churn calls from this week.</ChatMessage>
      <ChatMessage role="assistant" isLast actions={<MessageActions copyText="" onRetry={() => {}} />}>
        <Markdown>{'Fourteen calls, four themes:\n\n- **Onboarding** took longer than promised\n- **Pricing** felt unclear for small teams\n- **Exports** were missing CSV\n- **Support** replies were slow on weekends'}</Markdown>
      </ChatMessage>
    </ChatThread>
  );
}
