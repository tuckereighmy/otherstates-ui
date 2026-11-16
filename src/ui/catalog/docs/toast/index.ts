import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import WithStatus from './with-status';
import withStatusCode from './with-status.tsx?raw';
import Loading from './loading';
import loadingCode from './loading.tsx?raw';
import WithAction from './with-action';
import withActionCode from './with-action.tsx?raw';
import PromiseExample from './promise';
import promiseCode from './promise.tsx?raw';
import VaryingHeights from './varying-heights';
import varyingHeightsCode from './varying-heights.tsx?raw';
import Deduplicated from './deduplicated';
import deduplicatedCode from './deduplicated.tsx?raw';
import Stacked from './stacked';
import stackedCode from './stacked.tsx?raw';
import Placement from './placement';
import placementCode from './placement.tsx?raw';
import Anchored from './anchored';
import anchoredCode from './anchored.tsx?raw';
import SubmitError from './submit-error';
import submitErrorCode from './submit-error.tsx?raw';

export default defineDoc({
  id: 'toast',
  title: 'Toast',
  category: 'Feedback',
  description: 'Confirm an action without interrupting the current task.',
  source: [
    'components/toast.tsx',
    'components/Icon.tsx',
    'components/internal/overlay.tsx',
    'components/internal/spring.ts',
    'components/internal/states.ts',
    'tokens.stylex.ts',
  ],
  exports: ['ToastRegion', 'createToastQueue', 'ToastQueue', 'AnchoredToast', 'toastTimeouts'],
  usage: `import { Button, ToastRegion, createToastQueue } from '@/ui/components';

const queue = createToastQueue();

<>
  <Button onClick={() => queue.add({ title: 'Changes saved', kind: 'success' })}>
    Save
  </Button>
  <ToastRegion queue={queue} />
</>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'with-status',
      title: 'With status',
      description: '`kind` adds a status icon and picks the default timeout.',
      Component: WithStatus,
      code: withStatusCode,
    },
    {
      id: 'loading',
      title: 'Loading',
      description: 'A `loading` toast shows a spinner and stays; `queue.update()` turns it into the result in place.',
      Component: Loading,
      code: loadingCode,
    },
    {
      id: 'with-action',
      title: 'With action',
      description: 'One action button, such as Undo. Toasts with an action stay until they are used or dismissed.',
      Component: WithAction,
      code: withActionCode,
    },
    {
      id: 'promise',
      title: 'Promise',
      description: '`queue.promise()` shows a loading toast and replaces it with the success or error message.',
      Component: PromiseExample,
      code: promiseCode,
    },
    {
      id: 'varying-heights',
      title: 'Varying heights',
      description: 'Descriptions wrap to two lines; the stack measures each toast so they fan out without overlap.',
      Component: VaryingHeights,
      code: varyingHeightsCode,
    },
    {
      id: 'deduplicated',
      title: 'Deduplicated',
      description: 'Adding a toast with an `id` that is already showing updates that toast instead of stacking a new one.',
      Component: Deduplicated,
      code: deduplicatedCode,
    },
    {
      id: 'stacked',
      title: 'Stacked',
      description: 'Up to three toasts stack; hover or focus the stack to fan it out. `timeout: 0` keeps these on screen.',
      Component: Stacked,
      code: stackedCode,
    },
    {
      id: 'placement',
      title: 'Placement',
      description: 'The region sits on any corner or edge; top placements stack downward.',
      Component: Placement,
      code: placementCode,
    },
    {
      id: 'anchored',
      title: 'Anchored to a control',
      description: '`AnchoredToast` confirms an action next to the control that caused it, then closes itself.',
      Component: Anchored,
      code: anchoredCode,
      minHeight: 220,
    },
    {
      id: 'submit-error',
      title: 'Error after submit',
      description: 'A form reports a failed request with an error toast, which stays until it is dismissed.',
      Component: SubmitError,
      code: submitErrorCode,
    },
  ],
  api: [
    {
      name: 'createToastQueue',
      description: 'Creates the queue a `ToastRegion` shows. Keep one per app and add toasts from anywhere.',
      props: [
        { name: 'maxVisibleToasts', type: 'number', default: '3', description: 'How many toasts show at once; the rest wait in order.' },
      ],
    },
    {
      name: 'ToastQueue',
      description: 'The object `createToastQueue` returns: React Aria\'s queue with timeouts by kind, updates in place and promise toasts.',
      extends: 'React Aria ToastQueue',
      props: [
        { name: 'add', type: '(content: ToastMessage, options?: ToastAddOptions) => string', description: 'Shows a toast and returns its key. A `content.id` that is already queued updates that toast instead.' },
        { name: 'update', type: '(key: string, content: ToastMessage, options?: ToastAddOptions) => string', description: 'Replaces a toast\'s content in place and restarts its timeout; adds it again if it has closed.' },
        { name: 'promise', type: '<T>(promise: Promise<T>, messages: ToastPromiseMessages<T>, options?: ToastAddOptions) => Promise<T>', description: 'Shows `messages.loading`, then the success or error message, which can be functions of the result.' },
        { name: 'dismiss', type: '(key: string) => void', description: 'Closes a toast with its exit motion. `close(key)` removes it at once.' },
      ],
    },
    {
      name: 'ToastMessage',
      description: 'The content of one toast.',
      props: [
        { name: 'title', type: 'string', required: true, description: 'One line, 14/20 at weight 500.' },
        { name: 'description', type: 'ReactNode', description: 'Supporting text, 13/18 in `fg-muted`, up to two lines.' },
        { name: 'kind', type: "'success' | 'error' | 'warning' | 'info' | 'loading'", description: 'A status icon or spinner, and the default timeout.' },
        { name: 'action', type: '{ label: string; onAction: () => void }', description: 'One action button. The toast closes after it runs.' },
        { name: 'id', type: 'string', description: 'Deduplication key: a second toast with the same `id` updates the first.' },
      ],
    },
    {
      name: 'ToastAddOptions',
      description: 'The second argument of `add`, `update` and `promise`.',
      props: [
        { name: 'timeout', type: 'number', description: 'Milliseconds before the toast closes; 0 keeps it. Default from `toastTimeouts`: 5000, warning 8000, error and loading 0, and 0 for any toast with an action.' },
        { name: 'onClose', type: '() => void', description: 'Called when the toast closes for any reason.' },
      ],
    },
    {
      name: 'ToastRegion',
      description: 'The landmark that shows the queue as a stack. Render it once, near the root.',
      props: [
        { name: 'queue', type: 'ToastQueue', required: true, description: 'The queue from `createToastQueue()`.' },
        { name: 'label', type: 'string', default: "'Notifications'", description: 'Names the landmark.' },
        { name: 'placement', type: "'bottom-end' | 'bottom-start' | 'bottom' | 'top-end' | 'top-start' | 'top'", default: "'bottom-end'", description: 'The corner or edge of the viewport the stack sits on.' },
        { name: 'inline', type: 'boolean', default: 'false', description: 'Renders the region in its container instead of fixed to the viewport, as in these examples.' },
        { name: 'className', type: 'string', description: 'Added to the region element.' },
        { name: 'style', type: 'CSSProperties', description: 'Merged into the region\'s style, for example to change its width.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The region element.' },
      ],
    },
    {
      name: 'AnchoredToast',
      description: 'A short confirmation positioned next to a control, such as "Link copied".',
      props: [
        { name: 'triggerRef', type: 'RefObject<Element | null>', required: true, description: 'The element the toast points at.' },
        { name: 'isOpen', type: 'boolean', required: true, description: 'Shows the toast. Set it after the action; the toast sets it back when it times out.' },
        { name: 'onOpenChange', type: '(isOpen: boolean) => void', required: true, description: 'Called with false when the toast closes.' },
        { name: 'title', type: 'string', required: true, description: 'The message, 14/20 at weight 500.' },
        { name: 'description', type: 'ReactNode', description: 'A second line, 13/18 in `fg-muted`.' },
        { name: 'kind', type: "'success' | 'error' | 'warning' | 'info' | 'loading'", description: 'A status icon or spinner before the text.' },
        { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Side of the trigger; it flips when there is no room.' },
        { name: 'timeout', type: 'number', default: '2000', description: 'Milliseconds before it closes; 0 keeps it open. Hovering pauses it.' },
        { name: 'className', type: 'string', description: 'Added to the popup surface.' },
        { name: 'style', type: 'CSSProperties', description: 'Merged into the popup surface\'s style.' },
      ],
    },
  ],
  accessibility: [
    'The region is a landmark named "Notifications"; F6 moves focus into it and back, and focusing or hovering it pauses every timeout.',
    'Each toast is announced when it appears. Updating a toast in place announces the new content.',
    'Toasts with an action, errors and loading toasts do not time out by default, so nobody has to race a timer.',
    'Close buttons are named after the toast, for example "Dismiss Invite not sent". Actions are 28px with a 44px touch area.',
    '`AnchoredToast` announces its message through a polite status region and does not take focus.',
    'Under reduced motion toasts appear and leave without sliding or scaling.',
  ],
});
