import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import WithIcons from './with-icons';
import withIconsCode from './with-icons.tsx?raw';
import Descriptions from './descriptions';
import descriptionsCode from './descriptions.tsx?raw';
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
import OpenOnHover from './open-on-hover';
import openOnHoverCode from './open-on-hover.tsx?raw';
import KeepOpen from './keep-open';
import keepOpenCode from './keep-open.tsx?raw';
import OpenDialog from './open-dialog';
import openDialogCode from './open-dialog.tsx?raw';
import Disabled from './disabled';
import disabledCode from './disabled.tsx?raw';

const popupProps = [
  { name: 'placement', type: 'Placement', default: "'bottom start'", description: 'The side of the trigger the popup opens on. It flips and shifts to stay 12px inside the viewport.' },
  { name: 'offset', type: 'number', default: '6', description: 'Distance from the trigger in px.' },
  { name: 'crossOffset', type: 'number', description: 'Shift along the trigger’s edge, in px.' },
  { name: 'portalContainer', type: 'Element', default: 'document.body', description: 'Where the popup renders.' },
  { name: 'className', type: 'string', description: 'Classes for the popup surface.' },
  { name: 'style', type: 'CSSProperties', description: 'Inline styles for the popup surface.' },
  { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The popup surface element.' },
  { name: 'menuStyle', type: 'StyleXStyles', description: 'StyleX styles merged after the list’s own.' },
  { name: 'popoverStyle', type: 'StyleXStyles', description: 'StyleX styles merged after the surface’s own.' },
];

export default defineDoc({
  id: 'menu',
  title: 'Menu',
  category: 'Overlays',
  description: 'A list of actions in a popup, with keyboard navigation and typeahead.',
  source: [
    'components/menu.tsx',
    'components/Icon.tsx',
    'components/internal/choice.tsx',
    'components/internal/class-name.ts',
    'components/internal/control.ts',
    'components/internal/overlay.tsx',
    'components/internal/size.ts',
    'components/internal/spring.ts',
    'components/internal/states.ts',
    'components/kbd.tsx',
    'tokens.stylex.ts',
  ],
  exports: ['Menu', 'MenuItem', 'MenuGroup', 'MenuSeparator', 'MenuShortcut', 'MenuSubmenu', 'MenuPopup'],
  usage: `import { Button, Menu, MenuItem, MenuSeparator } from '@/ui/components';

<Menu aria-label="Project actions" trigger={<Button appearance="secondary">Actions</Button>}>
  <MenuItem onAction={() => renameProject()}>Rename</MenuItem>
  <MenuItem onAction={() => duplicateProject()}>Duplicate</MenuItem>
  <MenuSeparator />
  <MenuItem destructive onAction={() => deleteProject()}>Delete</MenuItem>
</Menu>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode, minHeight: 340 },
    { id: 'with-icons', title: 'With icons and shortcuts', description: 'Icons sit before the label in fg-muted; shortcuts end the row as small keys.', Component: WithIcons, code: withIconsCode, minHeight: 320 },
    { id: 'descriptions', title: 'With descriptions', description: 'A second line under the label explains the choice.', Component: Descriptions, code: descriptionsCode, minHeight: 340 },
    { id: 'group-labels', title: 'With group labels', description: 'Groups name related items; a separator sets them apart.', Component: GroupLabels, code: groupLabelsCode, minHeight: 400 },
    { id: 'checkbox-items', title: 'With checkbox items', description: 'With `selectionMode="multiple"` every item toggles, and the menu stays open.', Component: CheckboxItems, code: checkboxItemsCode, minHeight: 340 },
    { id: 'radio-group', title: 'With a radio group', description: 'A group with `selectionMode="single"` holds one choice, here controlled with state.', Component: RadioGroup, code: radioGroupCode, minHeight: 320 },
    { id: 'switch-items', title: 'With switch items', description: 'Set `indicator="switch"` for settings that turn on and off.', Component: SwitchItems, code: switchItemsCode, minHeight: 300 },
    { id: 'link-items', title: 'With link items', description: 'An item with `href` renders a link and follows it when chosen.', Component: LinkItems, code: linkItemsCode, minHeight: 320 },
    { id: 'nested', title: 'Nested menu', description: 'A submenu opens on hover, on press or with the arrow key toward the end.', Component: Nested, code: nestedCode, minHeight: 360 },
    { id: 'open-on-hover', title: 'Open on hover', description: 'The menu also opens while the pointer rests on the trigger, and closes when it leaves both.', Component: OpenOnHover, code: openOnHoverCode, minHeight: 300 },
    { id: 'keep-open', title: 'Keep open on select', description: 'Set `closeOnSelect={false}` for actions people repeat; one item can still close it.', Component: KeepOpen, code: keepOpenCode, minHeight: 300 },
    { id: 'open-dialog', title: 'Open a dialog', description: 'An item opens a controlled Dialog once the menu has closed.', Component: OpenDialog, code: openDialogCode, minHeight: 280 },
    { id: 'disabled', title: 'Disabled items', description: 'Disabled items keep their place, lose their hover and are skipped by the keyboard.', Component: Disabled, code: disabledCode, minHeight: 340 },
  ],
  api: [
    {
      name: 'Menu',
      description: 'A trigger and the popup list it opens.',
      extends: 'React Aria MenuProps',
      props: [
        { name: 'trigger', type: 'ReactNode', required: true, description: 'The element that opens the menu: a Button or any React Aria pressable.' },
        { name: 'openOn', type: "'press' | 'hover'", default: "'press'", description: 'With `hover` the menu also opens while the pointer rests on the trigger.' },
        { name: 'closeOnSelect', type: 'boolean', default: 'true', description: 'Close when an item is chosen. Checkbox menus stay open by default. Same as `shouldCloseOnSelect`.' },
        { name: 'isOpen', type: 'boolean', description: 'Whether the menu is open, controlled.' },
        { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Whether the menu starts open, uncontrolled.' },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the menu opens or closes.' },
        ...popupProps,
      ],
    },
    {
      name: 'MenuItem',
      description: 'One action: 36px tall, with an optional icon, description, shortcut and selection indicator.',
      extends: 'React Aria MenuItemProps',
      props: [
        { name: 'children', type: 'ReactNode', required: true, description: 'The label. A string also feeds typeahead.' },
        { name: 'icon', type: 'ReactNode', description: 'A 16px Icon before the label, in fg-muted.' },
        { name: 'description', type: 'ReactNode', description: 'A second line under the label, 13/18 in fg-muted.' },
        { name: 'shortcut', type: 'ReactNode', description: 'A shortcut at the end. A string renders as a Kbd `sm`.' },
        { name: 'destructive', type: 'boolean', default: 'false', description: 'Danger text, with an error tint on hover and focus.' },
        { name: 'indicator', type: "'check' | 'switch'", default: "'check'", description: 'How a selectable item shows its state.' },
        { name: 'closeOnSelect', type: 'boolean', description: 'Close the menu when this item is chosen. Defaults to the menu’s setting.' },
        { name: 'className', type: 'string', description: 'Classes for the item.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the item.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The item element.' },
      ],
    },
    {
      name: 'MenuGroup',
      description: 'Related items under a label. With `selectionMode` its items become checkboxes or radios.',
      extends: 'React Aria MenuSectionProps',
      props: [
        { name: 'label', type: 'string', description: 'The group label, 12/16 500 in fg-muted. It also names the group.' },
        { name: 'children', type: 'ReactNode', required: true, description: 'The items.' },
      ],
    },
    {
      name: 'MenuSeparator',
      description: 'A 1px rule with 4px above and below.',
      props: [
        { name: 'className', type: 'string', description: 'Classes for the rule.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the rule.' },
      ],
    },
    {
      name: 'MenuShortcut',
      description: 'A shortcut in a Kbd `sm`, linked to its item as a description, for a custom row.',
      props: [
        { name: 'children', type: 'ReactNode', required: true, description: 'The keys. A string renders as one Kbd.' },
        { name: 'className', type: 'string', description: 'Classes for the wrapper.' },
      ],
    },
    {
      name: 'MenuSubmenu',
      description: 'An item that opens a nested menu.',
      extends: 'React Aria MenuProps',
      props: [
        { name: 'label', type: 'string', required: true, description: 'The label of the item that opens the submenu.' },
        { name: 'icon', type: 'ReactNode', description: 'A 16px Icon before the label.' },
        { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disables the item, so the submenu cannot open.' },
        { name: 'delay', type: 'number', default: '200', description: 'Milliseconds of hover before the submenu opens.' },
        ...popupProps.map(prop => prop.name === 'placement' ? { ...prop, default: "'end top'" }
          : prop.name === 'offset' ? { ...prop, default: '13', description: 'Distance from the item in px; 13 leaves 6px between the two surfaces.' }
          : prop.name === 'crossOffset' ? { ...prop, default: '-7', description: 'Shift along the item’s edge; -7 lines the first item up with it.' } : prop),
      ],
    },
    {
      name: 'MenuPopup',
      description: 'The surface and list on their own, to compose with React Aria’s MenuTrigger or SubmenuTrigger.',
      extends: 'React Aria MenuProps',
      props: [
        ...popupProps.map(prop => prop.name === 'offset' ? { ...prop, default: '8' } : prop),
        { name: 'origin', type: "'trigger' | 'pointer'", default: "'trigger'", description: 'Where the popup grows from: the trigger side, or the pointer for context menus.' },
        { name: 'isNonModal', type: 'boolean', default: 'false', description: 'Leave the page interactive behind the popup; it closes on blur.' },
        { name: 'onPointerEnter', type: '(event: PointerEvent) => void', description: 'Pointer enters the surface.' },
        { name: 'onPointerLeave', type: '(event: PointerEvent) => void', description: 'Pointer leaves the surface.' },
      ],
    },
  ],
  accessibility: [
    'The trigger gets `aria-haspopup` and `aria-expanded`. Enter, Space and the arrow keys open the menu; Down focuses the first item and Up the last.',
    'Items are `menuitem`, `menuitemcheckbox` or `menuitemradio`. Arrow keys move, Home and End jump, typing a letter jumps to a matching item, Enter or Space chooses, Escape closes and returns focus to the trigger.',
    'Give the menu an `aria-label`, or let the trigger name it. An icon-only trigger needs its own `aria-label`.',
    'Shortcuts are linked to their item as a description; they are hints, so wire the keys up yourself.',
    'The keyboard highlight is the hover fill, with no ring. Under reduced motion the popup only fades.',
  ],
});
