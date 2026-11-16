import * as stylex from '@stylexjs/stylex';
import { ChatMessage, Markdown } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ column: { display: 'grid', gap: t['--os-space-8'], width: '100%', maxWidth: 560, marginInline: 'auto' } });

export default function ChatMessageSpeakers() {
  return (
    <div {...stylex.props(s.column)}>
      <ChatMessage role="assistant" speaker={{ name: 'Researcher', icon: 'search', color: 2 }}><Markdown>{'Three of five competitors charge per seat.'}</Markdown></ChatMessage>
      <ChatMessage role="assistant" speaker={{ name: 'Writer', icon: 'edit', color: 3 }} isLast><Markdown>{'I drafted the pricing page around per-seat plans.'}</Markdown></ChatMessage>
    </div>
  );
}
