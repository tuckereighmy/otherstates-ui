import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import KeyboardShortcut from './keyboard-shortcut';
import keyboardShortcutCode from './keyboard-shortcut.tsx?raw';
import Grouped from './grouped';
import groupedCode from './grouped.tsx?raw';
import Descriptions from './descriptions';
import descriptionsCode from './descriptions.tsx?raw';
import Standalone from './standalone';
import standaloneCode from './standalone.tsx?raw';
import Composed from './composed';
import composedCode from './composed.tsx?raw';
import Loading from './loading';
import loadingCode from './loading.tsx?raw';
import CustomFooter from './custom-footer';
import customFooterCode from './custom-footer.tsx?raw';

export default defineDoc({
  id: 'command',
  title: 'Command',
  category: 'Navigation',
  description: 'A searchable list of commands, in a palette window or in the page.',
  source: [
    'components/command.tsx',
    'components/Icon.tsx',
    'components/internal/choice.tsx',
    'components/internal/class-name.ts',
    'components/internal/control.ts',
    'components/internal/overlay.tsx',
    'components/internal/size.ts',
    'components/internal/spring.ts',
    'components/internal/states.ts',
    'components/kbd.tsx',
    'components/menu.tsx',
    'tokens.stylex.ts',
  ],
  exports: ['Command', 'CommandAction'],
  usage: `import { Button, Command } from '@/ui/components';

<Command
  trigger={<Button appearance="secondary">Search commands</Button>}
  shortcutKey="k"
  actions={[
    { id: 'settings', label: 'Open settings', keywords: ['preferences'], onAction: () => openSettings() },
  ]}
/>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    { id: 'keyboard-shortcut', title: 'With a keyboard shortcut', description: 'With `shortcutKey`, Cmd or Ctrl plus the key opens and closes the palette from anywhere.', Component: KeyboardShortcut, code: keyboardShortcutCode },
    { id: 'grouped', title: 'With grouped items', description: 'Actions with the same `group` sit under one label, and a separator divides the groups.', Component: Grouped, code: groupedCode },
    { id: 'descriptions', title: 'With icons and descriptions', description: 'A second line explains each command; search matches it too.', Component: Descriptions, code: descriptionsCode },
    { id: 'standalone', title: 'Standalone', description: 'With `standalone` the palette renders in the page, on a surface with a hairline.', Component: Standalone, code: standaloneCode, minHeight: 360 },
    { id: 'composed', title: 'Composed items', description: 'Pass MenuGroup, MenuItem and MenuSeparator as children instead of `actions`.', Component: Composed, code: composedCode },
    { id: 'loading', title: 'Async search', description: 'Control the search text and set `isLoading` while results load; a loading row takes the list’s place.', Component: Loading, code: loadingCode, minHeight: 320 },
    { id: 'custom-footer', title: 'Custom footer and empty message', description: 'Replace the key hints with `footer`, or pass `null` to drop them.', Component: CustomFooter, code: customFooterCode },
  ],
  api: [
    {
      name: 'Command',
      description: 'A search field over a filtered list of commands, in a top-anchored window 480 wide or standalone in the page.',
      props: [
        { name: 'trigger', type: 'ReactNode', description: 'The element that opens the palette. Leave it out to open it with `shortcutKey` or `isOpen`.' },
        { name: 'actions', type: 'CommandAction[]', default: '[]', description: 'The commands, as data.' },
        { name: 'children', type: 'ReactNode', description: 'MenuItem, MenuGroup and MenuSeparator, instead of `actions`.' },
        { name: 'standalone', type: 'boolean', default: 'false', description: 'Render the palette in the page instead of a dialog.' },
        { name: 'title', type: 'string', default: "'Command palette'", description: 'Names the dialog for assistive tech.' },
        { name: 'placeholder', type: 'string', default: "'Type a command…'", description: 'Placeholder of the search field.' },
        { name: 'searchLabel', type: 'string', default: "'Search commands'", description: 'Names the search field for assistive tech.' },
        { name: 'emptyMessage', type: 'ReactNode', default: "'No commands found.'", description: 'Shown when nothing matches.' },
        { name: 'shortcutKey', type: 'string', description: 'Cmd or Ctrl plus this key opens and closes the palette.' },
        { name: 'footer', type: 'ReactNode', description: 'Replaces the key hints under the list. `null` removes the footer.' },
        { name: 'isLoading', type: 'boolean', default: 'false', description: 'Shows a loading row in place of the results.' },
        { name: 'loadingLabel', type: 'string', default: "'Loading…'", description: 'Text of the loading row.' },
        { name: 'inputValue', type: 'string', description: 'The search text, controlled.' },
        { name: 'defaultInputValue', type: 'string', description: 'The starting search text, uncontrolled.' },
        { name: 'onInputChange', type: '(value: string) => void', description: 'Called as the search text changes.' },
        { name: 'isOpen', type: 'boolean', description: 'Whether the palette is open, controlled.' },
        { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Whether the palette starts open, uncontrolled.' },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the palette opens or closes.' },
        { name: 'portalContainer', type: 'Element', default: 'document.body', description: 'Where the dialog renders.' },
        { name: 'className', type: 'string', description: 'Classes for the palette surface.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the palette surface.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The palette surface element.' },
      ],
    },
    {
      name: 'CommandAction',
      description: 'One command in `actions`.',
      props: [
        { name: 'id', type: 'string', required: true, description: 'A unique key.' },
        { name: 'label', type: 'string', required: true, description: 'The command name.' },
        { name: 'onAction', type: '() => void', required: true, description: 'Runs the command. The palette closes after it.' },
        { name: 'keywords', type: 'string[]', description: 'Extra words the search matches.' },
        { name: 'icon', type: 'ReactNode', description: 'A 16px Icon before the label.' },
        { name: 'shortcut', type: 'string', description: 'A shortcut shown as a Kbd `sm` at the end.' },
        { name: 'description', type: 'string', description: 'A second line under the label.' },
        { name: 'group', type: 'string', description: 'A group label; actions with the same group sit together under it.' },
        { name: 'isDisabled', type: 'boolean', description: 'Shows the command but blocks it.' },
        { name: 'disabled', type: 'boolean', description: 'Deprecated: use `isDisabled`.' },
      ],
    },
  ],
  accessibility: [
    'The palette is a modal `dialog` named by `title`; focus moves to the search field and returns to the trigger on close.',
    'The search field controls a `menu` with virtual focus: arrow keys move the highlight while typing continues, Enter runs the highlighted command, Escape clears the text and then closes.',
    'The highlight is the hover fill, with no ring; the field itself shows no ring because the palette is the focus context.',
    'While loading, the loading row is a `status`, so screen readers announce it. Groups are labeled sections, announced with their first item.',
    'The window comes down 8px and settles over 280ms; under reduced motion it only fades.',
  ],
});
