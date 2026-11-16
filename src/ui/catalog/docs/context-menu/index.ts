import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import WithIcons from './with-icons';
import withIconsCode from './with-icons.tsx?raw';
import GroupLabels from './group-labels';
import groupLabelsCode from './group-labels.tsx?raw';
import CheckboxItems from './checkbox-items';
import checkboxItemsCode from './checkbox-items.tsx?raw';
import RadioGroup from './radio-group';
import radioGroupCode from './radio-group.tsx?raw';
import SwitchItems from './switch-items';
import switchItemsCode from './switch-items.tsx?raw';
import LinkItems from './link-items';
import linkItemsCode from './link-items.tsx?raw';
import Nested from './nested';
import nestedCode from './nested.tsx?raw';

export default defineDoc({
  id: 'context-menu',
  title: 'Context Menu',
  category: 'Overlays',
  description: 'A menu that opens at the pointer on right click or long press.',
  source: [
    'components/context-menu.tsx',
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
  exports: ['ContextMenu'],
  usage: `import { ContextMenu, MenuItem, MenuSeparator } from '@/ui/components';

<ContextMenu aria-label="File actions" trigger={<div role="button">Roadmap.md</div>}>
  <MenuItem onAction={() => renameFile()}>Rename</MenuItem>
  <MenuSeparator />
  <MenuItem destructive onAction={() => deleteFile()}>Delete</MenuItem>
</ContextMenu>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode, minHeight: 320 },
    { id: 'with-icons', title: 'With icons and shortcuts', description: 'Icons sit before the label in fg-muted; shortcuts end the row as small keys.', Component: WithIcons, code: withIconsCode, minHeight: 320 },
    { id: 'group-labels', title: 'With group labels', description: 'Groups name related items; a separator sets them apart.', Component: GroupLabels, code: groupLabelsCode, minHeight: 340 },
    { id: 'checkbox-items', title: 'With checkbox items', description: 'With `selectionMode="multiple"` every item toggles, and the menu stays open.', Component: CheckboxItems, code: checkboxItemsCode, minHeight: 300 },
    { id: 'radio-group', title: 'With a radio group', description: 'A group with `selectionMode="single"` holds one choice.', Component: RadioGroup, code: radioGroupCode, minHeight: 300 },
    { id: 'switch-items', title: 'With switch items', description: 'Set `indicator="switch"` on items that turn a setting on and off.', Component: SwitchItems, code: switchItemsCode, minHeight: 300 },
    { id: 'link-items', title: 'With link items', description: 'An item with `href` renders a link and follows it when chosen.', Component: LinkItems, code: linkItemsCode, minHeight: 300 },
    { id: 'nested', title: 'Nested menu', description: 'A submenu opens on hover, on press or with the arrow key toward the end.', Component: Nested, code: nestedCode, minHeight: 340 },
  ],
  api: [
    {
      name: 'ContextMenu',
      description: 'A trigger area and the menu it opens at the pointer. Items, groups, separators and submenus are the Menu parts.',
      extends: 'React Aria MenuProps',
      props: [
        { name: 'trigger', type: 'ReactNode', required: true, description: 'The element that takes the context menu. A native element or the library Button is made focusable and pressable for you.' },
        { name: 'closeOnSelect', type: 'boolean', default: 'true', description: 'Close when an item is chosen. Checkbox menus stay open by default. Same as `shouldCloseOnSelect`.' },
        { name: 'isOpen', type: 'boolean', description: 'Whether the menu is open, controlled.' },
        { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Whether the menu starts open, uncontrolled.' },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the menu opens or closes.' },
        { name: 'placement', type: 'Placement', default: "'bottom start'", description: 'The side of the pointer the menu opens on. It flips and shifts to stay 12px inside the viewport.' },
        { name: 'offset', type: 'number', default: '0', description: 'Distance from the pointer in px.' },
        { name: 'crossOffset', type: 'number', description: 'Shift along the cross axis, in px.' },
        { name: 'portalContainer', type: 'Element', default: 'document.body', description: 'Where the menu renders.' },
        { name: 'className', type: 'string', description: 'Classes for the popup surface.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the popup surface.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The popup surface element.' },
        { name: 'menuStyle', type: 'StyleXStyles', description: 'StyleX styles merged after the list’s own.' },
        { name: 'popoverStyle', type: 'StyleXStyles', description: 'StyleX styles merged after the surface’s own.' },
      ],
    },
  ],
  accessibility: [
    'Right click, long press on touch, Shift+F10 or the Menu key open the menu at the pointer, or at the trigger from the keyboard.',
    'The trigger must be focusable so keyboard users can reach it; a native element is given `tabIndex={0}`. Give it a role and a name that says what the menu acts on.',
    'Inside, the menu works like Menu: arrow keys, Home and End, typeahead, Enter or Space to choose, Escape to close and return focus.',
    'A context menu is a shortcut. Offer the same actions somewhere visible too, such as a Menu on the row.',
    'The menu grows from the pointer; under reduced motion it only fades.',
  ],
});
