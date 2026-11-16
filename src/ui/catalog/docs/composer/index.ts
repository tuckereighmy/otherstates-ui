import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import MentionsAndCommands from './mentions-and-commands';
import mentionsAndCommandsCode from './mentions-and-commands.tsx?raw';
import CustomFiltering from './custom-filtering';
import customFilteringCode from './custom-filtering.tsx?raw';
import CustomControls from './custom-controls';
import customControlsCode from './custom-controls.tsx?raw';
import WithinForm from './within-form';
import withinFormCode from './within-form.tsx?raw';
import MaxRows from './max-rows';
import maxRowsCode from './max-rows.tsx?raw';
import KeyboardShortcuts from './keyboard-shortcuts';
import keyboardShortcutsCode from './keyboard-shortcuts.tsx?raw';
import Models from './models';
import modelsCode from './models.tsx?raw';
import Attachments from './attachments';
import attachmentsCode from './attachments.tsx?raw';
import Streaming from './streaming';
import streamingCode from './streaming.tsx?raw';
import RunControls from './run-controls';
import runControlsCode from './run-controls.tsx?raw';
import Loading from './loading';
import loadingCode from './loading.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';
import Invalid from './invalid';
import invalidCode from './invalid.tsx?raw';
import Disabled from './disabled';
import disabledCode from './disabled.tsx?raw';
import FullWidth from './full-width';
import fullWidthCode from './full-width.tsx?raw';

export default defineDoc({
  id: 'composer',
  title: 'Composer',
  category: 'Forms',
  description: 'Draft a message with a growing field, mentions and commands.',
  source: [
    'components/composer.tsx',
    'components/button.tsx',
    'components/Icon.tsx',
    'components/internal/class-name.ts',
    'components/internal/control.ts',
    'components/internal/overlay.tsx',
    'components/internal/platform.ts',
    'components/internal/size.ts',
    'components/internal/states.ts',
    'components/kbd.tsx',
    'tokens.stylex.ts',
  ],
  exports: ['Composer', 'ComposerProps', 'ComposerQueued', 'ComposerSuggestion', 'ComposerModel', 'ComposerAttachment', 'ComposerEffort', 'ComposerStatus'],
  usage: `import { Composer } from '@/ui/components';

<Composer onSubmit={message => console.log(message)} />`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode, minHeight: 300 },
    { id: 'mentions-and-commands', title: 'Mentions and commands', description: 'Typing `@` or `/` opens `mentions` or `commands` under the field; the arrows move, Enter inserts and Escape dismisses.', Component: MentionsAndCommands, code: mentionsAndCommandsCode, minHeight: 360 },
    { id: 'custom-filtering', title: 'Custom filtering', description: '`filter` decides which suggestions match the typed query; here people match by team as well as name.', Component: CustomFiltering, code: customFilteringCode, minHeight: 360 },
    { id: 'custom-controls', title: 'Submission and custom controls', description: '`actions` replaces the attach button with your own sm controls, and `submitLabel` names the send button.', Component: CustomControls, code: customControlsCode, minHeight: 260 },
    { id: 'within-form', title: 'Inside another form', description: 'With `withinForm` the composer renders no form of its own: Enter and the send button submit the enclosing form, and `name` carries the text.', Component: WithinForm, code: withinFormCode, minHeight: 300 },
    { id: 'max-rows', title: 'Input size', description: 'The field grows with its text up to `maxRows` lines, then scrolls.', Component: MaxRows, code: maxRowsCode, minHeight: 300 },
    { id: 'keyboard-shortcuts', title: 'Keyboard shortcuts', description: 'With `enterToSubmit={false}`, Enter adds a line and Cmd+Enter or Ctrl+Enter sends.', Component: KeyboardShortcuts, code: keyboardShortcutsCode, minHeight: 260 },
    { id: 'models', title: 'Models and effort', description: '`models`, `model` and `effort` drive the model picker and the effort control; both are hidden with `showModel` and `showEffort`.', Component: Models, code: modelsCode, minHeight: 360 },
    { id: 'attachments', title: 'Attachments', description: '`attachments` shows chips above the text; `onRemoveAttachment` adds a remove button to each.', Component: Attachments, code: attachmentsCode, minHeight: 280 },
    { id: 'streaming', title: 'Streaming', description: '`status="streaming"` turns the send button into a stop button and holds new messages until `onStop` ends the reply.', Component: Streaming, code: streamingCode, minHeight: 260 },
    { id: 'run-controls', title: 'Steer, queue and stop', description: 'While `status` is `streaming`, `onSteer` makes Enter send to the running agent, `onQueue` makes Option+Enter queue for later, and Escape calls `onStop`. `queued` lists what waits, with Send now and remove.', Component: RunControls, code: runControlsCode, minHeight: 320 },
    { id: 'loading', title: 'Loading', description: '`isLoading` shows a spinner on the send button and holds the message, for example while it uploads.', Component: Loading, code: loadingCode, minHeight: 260 },
    { id: 'controlled', title: 'Controlled', description: 'Pass `value` and `onChange` to keep the text in your own state.', Component: Controlled, code: controlledCode, minHeight: 260 },
    { id: 'invalid', title: 'Invalid', description: '`isInvalid` draws the inset error ring, and `errorMessage` replaces the description.', Component: Invalid, code: invalidCode, minHeight: 260 },
    { id: 'disabled', title: 'Disabled', description: '`isDisabled` swaps the surface and every control to the disabled colors.', Component: Disabled, code: disabledCode },
    { id: 'full-width', title: 'Full width', description: '`fullWidth` fills the container instead of the default 240 and 340 max widths.', Component: FullWidth, code: fullWidthCode, align: 'stretch' },
  ],
  api: [
    {
      name: 'Composer',
      description: 'A message field that grows from 240 × 48 to 340 × 116 as it takes focus or text, with tools, mentions and commands.',
      props: [
        { name: 'label', type: 'string', default: "'Message'", description: 'Accessible name of the text field; a surrounding Field’s label takes over.' },
        { name: 'placeholder', type: 'string', default: "'Ask anything…'", description: 'Shown in `fg-muted` while the field is empty.' },
        { name: 'value', type: 'string', description: 'The text (controlled).' },
        { name: 'defaultValue', type: 'string', default: "''", description: 'The text at first render (uncontrolled); a native form reset restores it.' },
        { name: 'onChange', type: '(value: string) => void', description: 'Called with the new text on every edit.' },
        { name: 'onSubmit', type: '(message: string) => void', description: 'Called with the trimmed text when the reader sends; not called with `withinForm`.' },
        { name: 'actions', type: 'ReactNode', description: 'Replaces the attach button with your own controls.' },
        { name: 'onAttach', type: '() => void', description: 'Called by the attach button.' },
        { name: 'onDictate', type: '() => void', description: 'Called by the microphone button, shown while the field is empty.' },
        { name: 'models', type: 'readonly ComposerModel[]', default: 'three built-in models', description: 'The options of the model picker.' },
        { name: 'model', type: 'string', description: 'The chosen model id (controlled).' },
        { name: 'defaultModel', type: 'string', default: 'the first model', description: 'The model chosen at first render (uncontrolled).' },
        { name: 'onModelChange', type: '(model: string) => void', description: 'Called with the id of the chosen model.' },
        { name: 'effort', type: 'ComposerEffort', description: 'The effort level (controlled): `Low`, `Medium` or `High`.' },
        { name: 'defaultEffort', type: 'ComposerEffort', default: "'Medium'", description: 'The effort level at first render (uncontrolled).' },
        { name: 'onEffortChange', type: '(effort: ComposerEffort) => void', description: 'Called when the effort control steps to the next level.' },
        { name: 'showModel', type: 'boolean', default: 'true', description: 'Shows the model picker once the composer expands.' },
        { name: 'showEffort', type: 'boolean', default: 'true', description: 'Shows the effort control once the composer expands.' },
        { name: 'mentions', type: 'readonly ComposerSuggestion[]', default: '[]', description: 'Suggestions after “@”.' },
        { name: 'commands', type: 'readonly ComposerSuggestion[]', default: '[]', description: 'Suggestions after “/”.' },
        { name: 'filter', type: "(item: ComposerSuggestion, query: string, trigger: '@' | '/') => boolean", default: 'id or label contains it, ignoring case', description: 'Decides which suggestions match the typed query.' },
        { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disables the field and every control.' },
        { name: 'disabled', type: 'boolean', description: 'Deprecated alias of `isDisabled`.' },
        { name: 'enterToSubmit', type: 'boolean', default: 'true', description: 'Enter sends and Shift+Enter adds a line; when false, Enter adds a line and Cmd/Ctrl+Enter sends.' },
        { name: 'submitLabel', type: 'string', default: "'Send message'", description: 'Accessible name of the send button.' },
        { name: 'dictateLabel', type: 'string', default: "'Dictate'", description: 'Accessible name of the microphone button.' },
        { name: 'stopLabel', type: 'string', default: "'Stop'", description: 'Accessible name of the stop button while streaming.' },
        { name: 'status', type: 'ComposerStatus', default: "'idle'", description: '`streaming` turns the send button into a stop button and holds new messages.' },
        { name: 'onSteer', type: '(message: string) => void', description: 'While streaming, Enter and the send button give the message to the running agent now.' },
        { name: 'onQueue', type: '(message: string) => void', description: 'While streaming, Option+Enter queues the message; with no `onSteer`, Enter queues too.' },
        { name: 'queued', type: 'readonly ComposerQueued[]', description: 'Messages waiting for the run to end, shown above the field.' },
        { name: 'onRemoveQueued', type: '(id: string) => void', description: 'Adds a remove button to each queued message.' },
        { name: 'onSendQueuedNow', type: '(id: string) => void', description: 'Adds Send now to each queued message while streaming.' },
        { name: 'steerLabel', type: 'string', default: "'Send to the running agent'", description: 'Accessible name of the send button while it steers.' },
        { name: 'variant', type: "'filled' | 'outline'", default: "'filled'", description: '`outline` adds a hairline and a soft shadow, for a white canvas such as a chat thread.' },
        { name: 'showRunHint', type: 'boolean', default: 'true', description: 'Shows the run keys under the field while streaming.' },
        { name: 'onStop', type: '() => void', description: 'Called by the stop button while `status` is `streaming`.' },
        { name: 'isLoading', type: 'boolean', default: 'false', description: 'Shows a spinner on the send button and holds new messages.' },
        { name: 'attachments', type: 'readonly ComposerAttachment[]', default: '[]', description: 'Files or items attached to the draft, shown as chips above the text.' },
        { name: 'onRemoveAttachment', type: '(id: string) => void', description: 'Adds a remove button to each attachment chip.' },
        { name: 'maxRows', type: 'number', default: '7', description: 'Lines the field grows to before it scrolls.' },
        { name: 'onKeyDown', type: '(event: KeyboardEvent<HTMLTextAreaElement>) => void', description: 'Runs before the composer’s own key handling; call `preventDefault()` to skip it.' },
        { name: 'name', type: 'string', description: 'Name of the text field, submitted with its form.' },
        { name: 'form', type: 'string', description: 'The id of the form the text field and send button belong to, with `withinForm`.' },
        { name: 'withinForm', type: 'boolean', default: 'false', description: 'Renders a `div` instead of a `form`, so Enter and the send button submit the enclosing form.' },
        { name: 'isRequired', type: 'boolean', description: 'Marks the text field required.' },
        { name: 'isInvalid', type: 'boolean', description: 'Shows the inset error ring, and `errorMessage` in place of `description`.' },
        { name: 'errorMessage', type: 'ReactNode', description: 'The error under the composer while it is invalid.' },
        { name: 'description', type: 'ReactNode', description: 'Help text under the composer.' },
        { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Fills the container instead of the default 240 and 340 max widths. Inside a ChatThread it defaults to true, so the composer spans the column.' },
        { name: 'className', type: 'string', description: 'Classes for the outer element.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the outer element.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The outer element.' },
        { name: 'inputRef', type: 'Ref<HTMLTextAreaElement>', description: 'The text field.' },
      ],
    },
    {
      name: 'ComposerSuggestion',
      description: 'One entry in `mentions` or `commands`.',
      props: [
        { name: 'id', type: 'string', required: true, description: 'The value; inserted as `@id` or `/id` by default.' },
        { name: 'label', type: 'string', required: true, description: 'The text in the list.' },
        { name: 'description', type: 'string', description: 'A second line in `fg-muted`.' },
        { name: 'insertText', type: 'string', default: '`@id` or `/id`', description: 'The text that replaces the typed token.' },
      ],
    },
    {
      name: 'ComposerModel',
      description: 'One option of the model picker.',
      props: [
        { name: 'id', type: 'string', required: true, description: 'The value passed to `onModelChange`.' },
        { name: 'label', type: 'string', required: true, description: 'The text on the picker and in its list.' },
      ],
    },
    {
      name: 'ComposerAttachment',
      description: 'One chip in `attachments`.',
      props: [
        { name: 'id', type: 'string', required: true, description: 'A unique key, passed to `onRemoveAttachment`.' },
        { name: 'name', type: 'string', required: true, description: 'The text on the 32 px chip, truncated at 200 px.' },
        { name: 'icon', type: 'ReactNode', description: 'Replaces the file icon; an `Icon` without a size renders at 16 px, like the built-in one.' },
      ],
    },
  ],
  accessibility: [
    'The field is a `textarea` named by `label` (default “Message”) or a surrounding Field; the description or error is linked with `aria-describedby`, and an invalid composer sets `aria-invalid`.',
    'Enter sends and Shift+Enter adds a line; with `enterToSubmit={false}`, Enter adds a line and Cmd+Enter or Ctrl+Enter sends.',
    'Typing `@` or `/` opens a `listbox` of suggestions while focus stays in the field (`aria-activedescendant`); the arrows move, Enter inserts and Escape dismisses.',
    'The send button is named for what it does: “Dictate” while empty, “Send message” with text, “Stop” while streaming; while loading it is `aria-busy`.',
    'The model picker is a React Aria Select with a listbox popup. The tools stay out of the tab order until the composer expands.',
    'With reduced motion the size changes and tool reveals happen without transitions.',
  ],
});
