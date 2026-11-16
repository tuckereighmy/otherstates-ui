'use client';

import * as stylex from '@stylexjs/stylex';
import { ChatThread, Composer, PromptSuggestions } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  frame: { height: 360 },
  greeting: { margin: 0, textAlign: 'center', fontSize: t['--os-font-size-xl'], fontWeight: t['--os-font-weight-medium'] },
});

export default function ChatThreadEmpty() {
  return (
    <ChatThread
      {...stylex.props(s.frame)}
      composer={<Composer fullWidth variant="outline" onSubmit={() => {}} />}
      empty={<h2 {...stylex.props(s.greeting)}>What should we work on?</h2>}
      suggestions={<PromptSuggestions onSelect={() => {}} suggestions={[
        { id: 'test', label: 'Fix a failing test', icon: 'code' },
        { id: 'notes', label: 'Write release notes', icon: 'edit' },
      ]} />}
    />
  );
}
