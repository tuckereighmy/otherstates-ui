# Composer

Draft a message with a growing field, mentions and commands.

Category: Forms · Exports: `Composer`, `ComposerProps`, `ComposerQueued`, `ComposerSuggestion`, `ComposerModel`, `ComposerAttachment`, `ComposerEffort`, `ComposerStatus`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Composer } from '@/ui/components';

<Composer onSubmit={message => console.log(message)} />
```

## Composer

A message field that grows from 240 × 48 to 340 × 116 as it takes focus or text, with tools, mentions and commands.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Message'` | Accessible name of the text field; a surrounding Field’s label takes over. |
| `placeholder` | `string` | `'Ask anything…'` | Shown in `fg-muted` while the field is empty. |
| `value` | `string` |  | The text (controlled). |
| `defaultValue` | `string` | `''` | The text at first render (uncontrolled); a native form reset restores it. |
| `onChange` | `(value: string) => void` |  | Called with the new text on every edit. |
| `onSubmit` | `(message: string) => void` |  | Called with the trimmed text when the reader sends; not called with `withinForm`. |
| `actions` | `ReactNode` |  | Replaces the attach button with your own controls. |
| `onAttach` | `() => void` |  | Called by the attach button. |
| `onDictate` | `() => void` |  | Called by the microphone button, shown while the field is empty. |
| `models` | `readonly ComposerModel[]` | `three built-in models` | The options of the model picker. |
| `model` | `string` |  | The chosen model id (controlled). |
| `defaultModel` | `string` | `the first model` | The model chosen at first render (uncontrolled). |
| `onModelChange` | `(model: string) => void` |  | Called with the id of the chosen model. |
| `effort` | `ComposerEffort` |  | The effort level (controlled): `Low`, `Medium` or `High`. |
| `defaultEffort` | `ComposerEffort` | `'Medium'` | The effort level at first render (uncontrolled). |
| `onEffortChange` | `(effort: ComposerEffort) => void` |  | Called when the effort control steps to the next level. |
| `showModel` | `boolean` | `true` | Shows the model picker once the composer expands. |
| `showEffort` | `boolean` | `true` | Shows the effort control once the composer expands. |
| `mentions` | `readonly ComposerSuggestion[]` | `[]` | Suggestions after “@”. |
| `commands` | `readonly ComposerSuggestion[]` | `[]` | Suggestions after “/”. |
| `filter` | `(item: ComposerSuggestion, query: string, trigger: '@' \| '/') => boolean` | `id or label contains it, ignoring case` | Decides which suggestions match the typed query. |
| `isDisabled` | `boolean` | `false` | Disables the field and every control. |
| `disabled` | `boolean` |  | Deprecated alias of `isDisabled`. |
| `enterToSubmit` | `boolean` | `true` | Enter sends and Shift+Enter adds a line; when false, Enter adds a line and Cmd/Ctrl+Enter sends. |
| `submitLabel` | `string` | `'Send message'` | Accessible name of the send button. |
| `dictateLabel` | `string` | `'Dictate'` | Accessible name of the microphone button. |
| `stopLabel` | `string` | `'Stop'` | Accessible name of the stop button while streaming. |
| `status` | `ComposerStatus` | `'idle'` | `streaming` turns the send button into a stop button and holds new messages. |
| `onSteer` | `(message: string) => void` |  | While streaming, Enter and the send button give the message to the running agent now. |
| `onQueue` | `(message: string) => void` |  | While streaming, Option+Enter queues the message; with no `onSteer`, Enter queues too. |
| `queued` | `readonly ComposerQueued[]` |  | Messages waiting for the run to end, shown above the field. |
| `onRemoveQueued` | `(id: string) => void` |  | Adds a remove button to each queued message. |
| `onSendQueuedNow` | `(id: string) => void` |  | Adds Send now to each queued message while streaming. |
| `steerLabel` | `string` | `'Send to the running agent'` | Accessible name of the send button while it steers. |
| `variant` | `'filled' \| 'outline'` | `'filled'` | `outline` adds a hairline and a soft shadow, for a white canvas such as a chat thread. |
| `showRunHint` | `boolean` | `true` | Shows the run keys under the field while streaming. |
| `onStop` | `() => void` |  | Called by the stop button while `status` is `streaming`. |
| `isLoading` | `boolean` | `false` | Shows a spinner on the send button and holds new messages. |
| `attachments` | `readonly ComposerAttachment[]` | `[]` | Files or items attached to the draft, shown as chips above the text. |
| `onRemoveAttachment` | `(id: string) => void` |  | Adds a remove button to each attachment chip. |
| `maxRows` | `number` | `7` | Lines the field grows to before it scrolls. |
| `onKeyDown` | `(event: KeyboardEvent<HTMLTextAreaElement>) => void` |  | Runs before the composer’s own key handling; call `preventDefault()` to skip it. |
| `name` | `string` |  | Name of the text field, submitted with its form. |
| `form` | `string` |  | The id of the form the text field and send button belong to, with `withinForm`. |
| `withinForm` | `boolean` | `false` | Renders a `div` instead of a `form`, so Enter and the send button submit the enclosing form. |
| `isRequired` | `boolean` |  | Marks the text field required. |
| `isInvalid` | `boolean` |  | Shows the inset error ring, and `errorMessage` in place of `description`. |
| `errorMessage` | `ReactNode` |  | The error under the composer while it is invalid. |
| `description` | `ReactNode` |  | Help text under the composer. |
| `fullWidth` | `boolean` | `false` | Fills the container instead of the default 240 and 340 max widths. Inside a ChatThread it defaults to true, so the composer spans the column. |
| `className` | `string` |  | Classes for the outer element. |
| `style` | `CSSProperties` |  | Inline styles for the outer element. |
| `ref` | `Ref<HTMLDivElement>` |  | The outer element. |
| `inputRef` | `Ref<HTMLTextAreaElement>` |  | The text field. |

## ComposerSuggestion

One entry in `mentions` or `commands`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` (required) | `string` |  | The value; inserted as `@id` or `/id` by default. |
| `label` (required) | `string` |  | The text in the list. |
| `description` | `string` |  | A second line in `fg-muted`. |
| `insertText` | `string` | ``@id` or `/id`` | The text that replaces the typed token. |

## ComposerModel

One option of the model picker.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` (required) | `string` |  | The value passed to `onModelChange`. |
| `label` (required) | `string` |  | The text on the picker and in its list. |

## ComposerAttachment

One chip in `attachments`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` (required) | `string` |  | A unique key, passed to `onRemoveAttachment`. |
| `name` (required) | `string` |  | The text on the 32 px chip, truncated at 200 px. |
| `icon` | `ReactNode` |  | Replaces the file icon; an `Icon` without a size renders at 16 px, like the built-in one. |

## Accessibility

- The field is a `textarea` named by `label` (default “Message”) or a surrounding Field; the description or error is linked with `aria-describedby`, and an invalid composer sets `aria-invalid`.
- Enter sends and Shift+Enter adds a line; with `enterToSubmit={false}`, Enter adds a line and Cmd+Enter or Ctrl+Enter sends.
- Typing `@` or `/` opens a `listbox` of suggestions while focus stays in the field (`aria-activedescendant`); the arrows move, Enter inserts and Escape dismisses.
- The send button is named for what it does: “Dictate” while empty, “Send message” with text, “Stop” while streaming; while loading it is `aria-busy`.
- The model picker is a React Aria Select with a listbox popup. The tools stay out of the tab order until the composer expands.
- With reduced motion the size changes and tool reveals happen without transitions.

## Examples

### Default

`src/ui/catalog/docs/composer/default.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Composer } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 340, maxWidth: '100%' },
  status: {
    margin: 0, minHeight: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center',
    fontSize: tokens['--os-font-size-xs'], lineHeight: tokens['--os-line-height-xs'], color: tokens['--os-color-fg-muted'],
  },
});

export default function ComposerDefault() {
  const [sent, setSent] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Composer onSubmit={message => setSent(`Sent “${message}”`)} />
      <p role="status" {...stylex.props(s.status)}>{sent}</p>
    </div>
  );
}
```

### Mentions and commands

Typing `@` or `/` opens `mentions` or `commands` under the field; the arrows move, Enter inserts and Escape dismisses.

`src/ui/catalog/docs/composer/mentions-and-commands.tsx`

```tsx
'use client';

import { Composer } from '../../../components';

const mentions = [
  { id: 'maya', label: 'Maya Chen', description: 'Design' },
  { id: 'omar', label: 'Omar Haddad', description: 'Engineering' },
  { id: 'lena', label: 'Lena Fischer', description: 'Finance' },
];

const commands = [
  { id: 'summarize', label: '/summarize', description: 'Summarize the thread' },
  { id: 'todo', label: '/todo', description: 'Turn the message into a task' },
  { id: 'remind', label: '/remind', description: 'Set a reminder for later' },
];

export default function ComposerMentionsAndCommands() {
  return <Composer placeholder="Try @ or /" mentions={mentions} commands={commands} onSubmit={() => {}} />;
}
```

### Custom filtering

`filter` decides which suggestions match the typed query; here people match by team as well as name.

`src/ui/catalog/docs/composer/custom-filtering.tsx`

```tsx
'use client';

import { Composer } from '../../../components';

const people = [
  { id: 'maya', label: 'Maya Chen', description: 'Design' },
  { id: 'theo', label: 'Theo Park', description: 'Design' },
  { id: 'omar', label: 'Omar Haddad', description: 'Engineering' },
  { id: 'lena', label: 'Lena Fischer', description: 'Finance' },
];

export default function ComposerCustomFiltering() {
  return (
    <Composer
      placeholder="Try @design"
      mentions={people}
      filter={(person, query) => `${person.label} ${person.description}`.toLowerCase().includes(query.toLowerCase())}
      onSubmit={() => {}}
    />
  );
}
```

### Submission and custom controls

`actions` replaces the attach button with your own sm controls, and `submitLabel` names the send button.

`src/ui/catalog/docs/composer/custom-controls.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Composer, Icon } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 340, maxWidth: '100%' },
  status: { margin: 0, minHeight: 16, textAlign: 'center', fontSize: tokens['--os-font-size-xs'], lineHeight: tokens['--os-line-height-xs'], color: tokens['--os-color-fg-muted'] },
});

export default function ComposerCustomControls() {
  const [status, setStatus] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Composer
        placeholder="Add a note"
        submitLabel="Post note"
        showModel={false}
        showEffort={false}
        actions={
          <>
            <Button appearance="text" size="sm" iconOnly aria-label="Add a photo" onClick={() => setStatus('Photo picker opened')}>
              <Icon name="image" />
            </Button>
            <Button appearance="text" size="sm" iconOnly aria-label="Insert a link" onClick={() => setStatus('Link field opened')}>
              <Icon name="link" />
            </Button>
          </>
        }
        onSubmit={note => setStatus(`Posted “${note}”`)}
      />
      <p role="status" {...stylex.props(s.status)}>{status}</p>
    </div>
  );
}
```

### Inside another form

With `withinForm` the composer renders no form of its own: Enter and the send button submit the enclosing form, and `name` carries the text.

`src/ui/catalog/docs/composer/within-form.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Checkbox, Composer, Form } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 340, maxWidth: '100%' },
  status: { margin: 0, minHeight: 20, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-md'], color: tokens['--os-color-fg-muted'] },
});

export default function ComposerWithinForm() {
  const [saved, setSaved] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setSaved(`Saved “${data.get('reply')}”${data.get('notify') ? ' and notified the team' : ''}.`);
        }}
      >
        <Composer withinForm name="reply" label="Reply" placeholder="Write a reply" showModel={false} showEffort={false} />
        <Checkbox name="notify" label="Notify the team" defaultChecked />
      </Form>
      <p role="status" {...stylex.props(s.status)}>{saved}</p>
    </div>
  );
}
```

### Input size

The field grows with its text up to `maxRows` lines, then scrolls.

`src/ui/catalog/docs/composer/max-rows.tsx`

```tsx
'use client';

import { Composer } from '../../../components';

const agenda = 'Agenda for Thursday:\n1. Review the launch checklist\n2. Confirm the room booking\n3. Assign follow-ups\n4. Share the notes';

export default function ComposerMaxRows() {
  return <Composer maxRows={3} defaultValue={agenda} onSubmit={() => {}} />;
}
```

### Keyboard shortcuts

With `enterToSubmit={false}`, Enter adds a line and Cmd+Enter or Ctrl+Enter sends.

`src/ui/catalog/docs/composer/keyboard-shortcuts.tsx`

```tsx
'use client';

import { Composer } from '../../../components';

export default function ComposerKeyboardShortcuts() {
  return (
    <Composer
      enterToSubmit={false}
      placeholder="Write a longer note"
      description="Enter adds a line. Cmd+Enter or Ctrl+Enter sends."
      onSubmit={() => {}}
    />
  );
}
```

### Models and effort

`models`, `model` and `effort` drive the model picker and the effort control; both are hidden with `showModel` and `showEffort`.

`src/ui/catalog/docs/composer/models.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Composer, type ComposerEffort } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const models = [
  { id: 'quick', label: 'Quick' },
  { id: 'balanced', label: 'Balanced' },
  { id: 'thorough', label: 'Thorough' },
];

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 340, maxWidth: '100%' },
  status: { margin: 0, textAlign: 'center', fontSize: tokens['--os-font-size-xs'], lineHeight: tokens['--os-line-height-xs'], color: tokens['--os-color-fg-muted'] },
});

export default function ComposerModels() {
  const [model, setModel] = useState('balanced');
  const [effort, setEffort] = useState<ComposerEffort>('Low');

  return (
    <div {...stylex.props(s.root)}>
      <Composer models={models} model={model} onModelChange={setModel} effort={effort} onEffortChange={setEffort} onSubmit={() => {}} />
      <p {...stylex.props(s.status)}>Model: {model}, effort: {effort.toLowerCase()}</p>
    </div>
  );
}
```

### Attachments

`attachments` shows chips above the text; `onRemoveAttachment` adds a remove button to each.

`src/ui/catalog/docs/composer/attachments.tsx`

```tsx
'use client';

import { useState } from 'react';
import { Composer, Icon, type ComposerAttachment } from '../../../components';

const initial: ComposerAttachment[] = [
  { id: 'budget', name: 'Q3 budget.xlsx' },
  { id: 'photos', name: 'Site photos.zip', icon: <Icon name="image" /> },
];

export default function ComposerAttachments() {
  const [files, setFiles] = useState(initial);

  return (
    <Composer
      placeholder="Add a message"
      attachments={files}
      onAttach={() => setFiles(list => [...list, { id: `notes-${list.length}`, name: 'Meeting notes.pdf' }])}
      onRemoveAttachment={id => setFiles(list => list.filter(file => file.id !== id))}
      onSubmit={() => setFiles([])}
    />
  );
}
```

### Streaming

`status="streaming"` turns the send button into a stop button and holds new messages until `onStop` ends the reply.

`src/ui/catalog/docs/composer/streaming.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Composer, type ComposerStatus } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 340, maxWidth: '100%' },
  status: { margin: 0, minHeight: 16, textAlign: 'center', fontSize: tokens['--os-font-size-xs'], lineHeight: tokens['--os-line-height-xs'], color: tokens['--os-color-fg-muted'] },
});

export default function ComposerStreaming() {
  const [status, setStatus] = useState<ComposerStatus>('streaming');

  return (
    <div {...stylex.props(s.root)}>
      <Composer status={status} onStop={() => setStatus('idle')} onSubmit={() => setStatus('streaming')} />
      <p role="status" {...stylex.props(s.status)}>{status === 'streaming' ? 'Writing a reply' : 'Reply stopped'}</p>
    </div>
  );
}
```

### Steer, queue and stop

While `status` is `streaming`, `onSteer` makes Enter send to the running agent, `onQueue` makes Option+Enter queue for later, and Escape calls `onStop`. `queued` lists what waits, with Send now and remove.

`src/ui/catalog/docs/composer/run-controls.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Composer, type ComposerQueued } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', gap: t['--os-space-3'], width: '100%', maxWidth: 440 },
  log: { margin: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'] },
});

export default function ComposerRunControls() {
  const [running, setRunning] = useState(true);
  const [queued, setQueued] = useState<ComposerQueued[]>([{ id: 'q1', text: 'Then update the changelog' }]);
  const [log, setLog] = useState('The agent is running.');
  return (
    <div {...stylex.props(s.column)}>
      <Composer
        fullWidth
        status={running ? 'streaming' : 'idle'}
        placeholder={running ? 'Steer the agent, or queue what is next…' : 'Ask anything…'}
        onSubmit={message => { setLog(`Sent: ${message}`); setRunning(true); }}
        onSteer={message => setLog(`Steered with: ${message}`)}
        onQueue={message => setQueued(all => [...all, { id: String(Date.now()), text: message }])}
        queued={queued}
        onRemoveQueued={id => setQueued(all => all.filter(item => item.id !== id))}
        onSendQueuedNow={id => { setLog(`Steered with: ${queued.find(item => item.id === id)?.text}`); setQueued(all => all.filter(item => item.id !== id)); }}
        onStop={() => { setRunning(false); setLog('Stopped.'); }}
      />
      <p role="status" {...stylex.props(s.log)}>{log}</p>
      {!running && <Button size="sm" appearance="secondary" onClick={() => setRunning(true)}>Start the run again</Button>}
    </div>
  );
}
```

### Loading

`isLoading` shows a spinner on the send button and holds the message, for example while it uploads.

`src/ui/catalog/docs/composer/loading.tsx`

```tsx
'use client';

import { Composer } from '../../../components';

export default function ComposerLoading() {
  return <Composer isLoading defaultValue="Draft the release notes" onSubmit={() => {}} />;
}
```

### Controlled

Pass `value` and `onChange` to keep the text in your own state.

`src/ui/catalog/docs/composer/controlled.tsx`

```tsx
'use client';

import { useState } from 'react';
import { Composer } from '../../../components';

export default function ComposerControlled() {
  const [text, setText] = useState('');

  return (
    <Composer
      value={text}
      onChange={setText}
      description={`${text.length} characters`}
      onSubmit={() => setText('')}
    />
  );
}
```

### Invalid

`isInvalid` draws the inset error ring, and `errorMessage` replaces the description.

`src/ui/catalog/docs/composer/invalid.tsx`

```tsx
'use client';

import { Composer } from '../../../components';

export default function ComposerInvalid() {
  return (
    <Composer
      isInvalid
      description="Replies are shared with the whole team."
      errorMessage="Write at least one sentence before you send."
      onSubmit={() => {}}
    />
  );
}
```

### Disabled

`isDisabled` swaps the surface and every control to the disabled colors.

`src/ui/catalog/docs/composer/disabled.tsx`

```tsx
import { Composer } from '../../../components';

export default function ComposerDisabled() {
  return <Composer isDisabled placeholder="Replies are closed" />;
}
```

### Full width

`fullWidth` fills the container instead of the default 240 and 340 max widths.

`src/ui/catalog/docs/composer/full-width.tsx`

```tsx
'use client';

import { Composer } from '../../../components';

export default function ComposerFullWidth() {
  return <Composer fullWidth placeholder="Ask about this project" onSubmit={() => {}} />;
}
```
