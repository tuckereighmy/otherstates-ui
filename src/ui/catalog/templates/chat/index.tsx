'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState } from 'react';
import {
  ApprovalCard, Button, ChatMessage, ChatThread, CheckpointMarker, Composer, Icon, Markdown, Menu, MenuItem, MessageActions,
  PromptSuggestions, Reasoning, RunBlock, Sidebar, SidebarCollapseButton, SidebarContent, SidebarFooter, SidebarHeader,
  SidebarInset, SidebarItem, SidebarProvider, SidebarSection, SidebarTrigger, type ComposerQueued,
} from '../../../components';
import { tokens as t } from '../../../tokens.stylex';
import { conversations, deploySteps, initialMessages, replyFor, suggestions, type Message, type Reply } from './data';

// An agent chat: a person and an agent fixing a bug together. Every part is a library component; the
// streaming is simulated with timers so the screen behaves like the real thing.

const phone = '@media (max-width: 767px)';

let nextId = 100;
const id = () => `n${nextId++}`;

export default function ChatTemplate() {
  const [current, setCurrent] = useState('checkout');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [streaming, setStreaming] = useState(false);
  const [queued, setQueued] = useState<ComposerQueued[]>([]);
  const timers = useRef<number[]>([]);
  const live = useRef<string | null>(null);
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const update = (messageId: string, change: Partial<Reply>) =>
    setMessages(all => all.map(message => (message.id === messageId && message.role === 'assistant' ? { ...message, ...change } : message)));
  const later = (ms: number, run: () => void) => { timers.current.push(window.setTimeout(run, ms)); };

  // Thinks for a beat, then writes the answer a few words at a time.
  function respond(prompt: string) {
    const reply = replyFor(prompt);
    const replyId = id();
    live.current = replyId;
    setStreaming(true);
    setMessages(all => [...all, { id: id(), role: 'user', text: prompt }, { id: replyId, role: 'assistant', streaming: true, feedback: null, reasoning: { text: reply.thinking, streaming: true } }]);
    later(1400, () => {
      update(replyId, { reasoning: { text: reply.thinking, duration: 1400 } });
      const words = reply.text.split(/(\s+)/);
      words.forEach((_, index) => later(index * 28, () => {
        if (live.current !== replyId) return;
        update(replyId, { text: words.slice(0, index + 1).join('') });
        if (index === words.length - 1) finish(replyId);
      }));
    });
  }

  function finish(replyId: string) {
    update(replyId, { streaming: false });
    live.current = null;
    setStreaming(false);
    setQueued(all => {
      const [next, ...rest] = all;
      if (next) later(400, () => respond(next.text));
      return rest;
    });
  }

  function stop() {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    if (live.current) setMessages(all => all.map(message => (
      message.id === live.current && message.role === 'assistant'
        ? { ...message, streaming: false, stopped: true, reasoning: message.reasoning && { ...message.reasoning, streaming: false } }
        : message
    )));
    live.current = null;
    setStreaming(false);
  }

  function approve(messageId: string) {
    update(messageId, { approval: 'approved', run: { title: 'Deploying to staging', status: 'running', steps: deploySteps, elapsed: '41s' } });
    later(2600, () => update(messageId, {
      run: { title: 'Deployed to staging', status: 'done', elapsed: '58s', steps: deploySteps.map(step => ({ ...step, state: 'done', duration: step.duration ?? '17s', output: step.output ?? 'Live at staging.halden.example' })) },
      text: 'I will deploy the fix to staging. This runs a deploy, so it needs your go-ahead.\n\nDone. The fix is live on **staging**. Open the checkout with an empty cart to check it.',
    }));
  }

  const newChat = () => { stop(); setCurrent('new'); setMessages([]); setQueued([]); };
  const lastAssistant = [...messages].reverse().find(message => message.role === 'assistant')?.id;
  const title = current === 'new' ? 'New chat' : conversations.find(item => item.id === current)?.title;

  const composer = (
    <Composer
      fullWidth
      variant="outline"
      placeholder={streaming ? 'Steer the agent, or queue what is next…' : 'Ask the agent anything…'}
      status={streaming ? 'streaming' : 'idle'}
      onSubmit={respond}
      onSteer={text => setMessages(all => [...all.slice(0, -1), { id: id(), role: 'user', text }, all[all.length - 1]])}
      onQueue={text => setQueued(all => [...all, { id: id(), text }])}
      queued={queued}
      onRemoveQueued={queuedId => setQueued(all => all.filter(item => item.id !== queuedId))}
      onStop={stop}
    />
  );

  return (
    <SidebarProvider {...stylex.props(s.app)}>
      <Sidebar label="Halden">
        <SidebarHeader logo={<span {...stylex.props(s.logo)}><Icon name="sparkle" size={16} /></span>} title="Halden" description="Agent workspace" />
        <SidebarContent>
          <SidebarSection>
            <SidebarItem icon="plus" isCurrent={current === 'new'} onPress={newChat}>New chat</SidebarItem>
          </SidebarSection>
          {(['Today', 'Earlier'] as const).map(group => (
            <SidebarSection key={group} label={group}>
              {conversations.filter(item => item.group === group).map(item => (
                <SidebarItem key={item.id} icon={item.icon} isCurrent={current === item.id}
                  onPress={() => { stop(); setCurrent(item.id); setMessages(item.id === 'checkout' ? initialMessages : []); }}>
                  {item.title}
                </SidebarItem>
              ))}
            </SidebarSection>
          ))}
        </SidebarContent>
        <SidebarFooter><SidebarCollapseButton /></SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <div {...stylex.props(s.main)}>
          <header {...stylex.props(s.header)}>
            <SidebarTrigger />
            <h1 {...stylex.props(s.title)}>{title}</h1>
            <span {...stylex.props(s.tools)}>
              <Button size="sm" appearance="secondary" leadingIcon={<Icon name="share" />}>Share</Button>
              <Menu aria-label="Conversation" placement="bottom end" trigger={<Button size="sm" appearance="text" iconOnly aria-label="More"><Icon name="more-horizontal" /></Button>}>
                <MenuItem icon={<Icon name="edit" />}>Rename</MenuItem>
                <MenuItem icon={<Icon name="download" />}>Export</MenuItem>
                <MenuItem icon={<Icon name="trash" />}>Delete</MenuItem>
              </Menu>
            </span>
          </header>

          <ChatThread
            {...stylex.props(s.thread)}
            composer={composer}
            footnote="Agents can make mistakes. Check important changes before you approve them."
            empty={<h2 {...stylex.props(s.greeting)}>What should we work on?</h2>}
            suggestions={<PromptSuggestions suggestions={suggestions} onSelect={respond} />}
          >
            {messages.map(message => {
              if (message.role === 'checkpoint') return <CheckpointMarker key={message.id} checkpoint={{ id: message.id, label: message.label, time: message.time, undoes: { files: 0, messages: 2 } }} onRestore={() => {}} />;
              if (message.role === 'user') return (
                <ChatMessage key={message.id} role="user" actions={<MessageActions copyText={message.text} onEdit={() => {}} />}>{message.text}</ChatMessage>
              );
              return (
                <ChatMessage
                  key={message.id}
                  role="assistant"
                  isLast={message.id === lastAssistant}
                  actions={!message.streaming && (
                    <MessageActions copyText={message.text ?? ''} feedback={message.feedback ?? null} onFeedback={feedback => update(message.id, { feedback })} onRetry={() => {}} />
                  )}
                >
                  {message.reasoning && (
                    <Reasoning streaming={message.reasoning.streaming} duration={message.reasoning.duration}>{message.reasoning.text}</Reasoning>
                  )}
                  {message.run && <RunBlock {...message.run} />}
                  {message.text && <Markdown>{message.text}</Markdown>}
                  {message.stopped && <p {...stylex.props(s.note)}>Stopped.</p>}
                  {message.approval && message.approval !== 'approved' && (
                    <ApprovalCard
                      {...stylex.props(s.card)}
                      variant="outline"
                      title="Deploy to staging"
                      agent={{ name: 'Coder', icon: 'code' }}
                      askVerb="wants to run a command"
                      risk="medium"
                      tool="bash"
                      command="npm run deploy -- --env staging"
                      status={message.approval}
                      statusLabel="Denied. Nothing was deployed."
                      approveLabel="Deploy"
                      onApprove={() => approve(message.id)}
                      onDeny={() => update(message.id, { approval: 'denied' })}
                    />
                  )}
                </ChatMessage>
              );
            })}
          </ChatThread>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

const s = stylex.create({
  app: { backgroundColor: t['--os-color-bg-canvas'], color: t['--os-color-fg-base'], fontFamily: t['--os-font-family'] },
  logo: {
    display: 'grid', placeItems: 'center', width: t['--os-size-sm'], height: t['--os-size-sm'], borderRadius: t['--os-radius-md'],
    backgroundColor: t['--os-color-accent-moderate'], color: t['--os-color-accent-on-accent'],
  },
  main: { display: 'flex', flexDirection: 'column', height: '100dvh', minWidth: 0 },
  header: {
    display: 'flex', alignItems: 'center', gap: t['--os-space-2'], flexShrink: 0, minHeight: 56, boxSizing: 'border-box',
    paddingInline: { default: t['--os-space-4'], [phone]: t['--os-space-3'] },
  },
  title: {
    margin: 0, flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    fontSize: t['--os-font-size-sm'], fontWeight: t['--os-font-weight-medium'], lineHeight: t['--os-line-height-md'],
  },
  tools: { display: 'flex', alignItems: 'center', gap: t['--os-space-1'], flexShrink: 0 },
  thread: { flex: '1 1 auto' },
  greeting: { margin: 0, textAlign: 'center', fontSize: t['--os-font-size-xl'], fontWeight: t['--os-font-weight-medium'], letterSpacing: t['--os-tracking-tight'], lineHeight: 1.25 },
  note: { margin: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-sm'] },
  card: { maxWidth: 520 },
});
