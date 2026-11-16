import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Collapsed from './collapsed';
import collapsedCode from './collapsed.tsx?raw';
import Docked from './docked';
import dockedCode from './docked.tsx?raw';
import SectionsBadges from './sections-badges';
import sectionsBadgesCode from './sections-badges.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';
import Inset from './inset';
import insetCode from './inset.tsx?raw';
import Mobile from './mobile';
import mobileCode from './mobile.tsx?raw';

const partProps = [
  { name: 'children', type: 'ReactNode', description: 'The content of the part.' },
  { name: 'className', type: 'string', description: 'A class added to the element.' },
  { name: 'style', type: 'CSSProperties', description: 'Inline styles on the element.' },
  { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'A ref to the element.' },
];

export default defineDoc({
  id: 'sidebar',
  title: 'Sidebar',
  category: 'Navigation',
  description: 'A navigation panel that folds to its icons, and moves into a sheet on small screens.',
  source: [
    'components/sidebar.tsx',
    'components/button.tsx',
    'components/Icon.tsx',
    'components/internal/class-name.ts',
    'components/internal/overlay.tsx',
    'components/internal/platform.ts',
    'components/internal/size.ts',
    'components/internal/states.ts',
    'components/sheet.tsx',
    'components/tooltip.tsx',
    'tokens.stylex.ts',
  ],
  exports: [
    'SidebarProvider', 'Sidebar', 'SidebarHeader', 'SidebarContent', 'SidebarSection', 'SidebarItem',
    'SidebarFooter', 'SidebarCollapseButton', 'SidebarInset', 'SidebarTrigger', 'useSidebar',
  ],
  usage: `import {
  Sidebar, SidebarCollapseButton, SidebarContent, SidebarFooter, SidebarHeader,
  SidebarInset, SidebarItem, SidebarProvider, SidebarSection, SidebarTrigger,
} from '@/ui/components';

<SidebarProvider persistKey="app-sidebar">
  <Sidebar label="Workspace">
    <SidebarHeader logo={<Logo />} title="Quillo" />
    <SidebarContent>
      <SidebarSection label="Projects">
        <SidebarItem icon="home" href="/" isCurrent>Home</SidebarItem>
        <SidebarItem icon="inbox" href="/inbox" badge={4}>Inbox</SidebarItem>
      </SidebarSection>
    </SidebarContent>
    <SidebarFooter>
      <SidebarCollapseButton />
    </SidebarFooter>
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    <main>…</main>
  </SidebarInset>
</SidebarProvider>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode, align: 'stretch', minHeight: 540 },
    {
      id: 'collapsed',
      title: 'Collapsed by default',
      description: '`defaultCollapsed` starts on the icon column. Each icon shows its label in a tooltip on hover or keyboard focus, and a count becomes a dot.',
      Component: Collapsed,
      code: collapsedCode,
      align: 'stretch',
      minHeight: 460,
    },
    {
      id: 'docked',
      title: 'Docked',
      description: '`variant="docked"` runs the full height of the frame with a hairline on its inner edge and no radius.',
      Component: Docked,
      code: dockedCode,
      align: 'stretch',
      minHeight: 480,
      stage: 'canvas',
    },
    {
      id: 'sections-badges',
      title: 'Sections and badges',
      description: 'A `SidebarSection` with a `label` groups items under a heading, which becomes a hairline when collapsed. `badge` adds a count at the end of a row, and `isDisabled` keeps an item visible but out of reach.',
      Component: SectionsBadges,
      code: sectionsBadgesCode,
      align: 'stretch',
      minHeight: 580,
    },
    {
      id: 'controlled',
      title: 'Controlled',
      description: 'Pass `collapsed` and `onCollapsedChange` to fold the panel from elsewhere, here a button in the page.',
      Component: Controlled,
      code: controlledCode,
      align: 'stretch',
      minHeight: 420,
    },
    {
      id: 'inset',
      title: 'With page content',
      description: '`SidebarInset` is the page beside the panel: it takes the rest of the row and scrolls on its own. Put `SidebarTrigger` in its header for small screens.',
      Component: Inset,
      code: insetCode,
      align: 'stretch',
      minHeight: 500,
    },
    {
      id: 'mobile',
      title: 'Mobile',
      description: 'Below 768px the panel moves into a left `Sheet` that `SidebarTrigger` opens; choosing an item closes it. `mobile` forces that mode here so it shows on a wide screen.',
      Component: Mobile,
      code: mobileCode,
      minHeight: 420,
    },
  ],
  api: [
    {
      name: 'SidebarProvider',
      description: 'Holds the collapsed state and lays the sidebar and its SidebarInset out in a row. ⌘B (Ctrl+B outside Apple platforms) toggles the sidebar that holds focus, or the first on the page, unless focus is in a text field.',
      props: [
        { name: 'collapsed', type: 'boolean', description: 'Collapsed state (controlled).' },
        { name: 'defaultCollapsed', type: 'boolean', default: 'false', description: 'Collapsed state at first (uncontrolled). A value stored under `persistKey` wins.' },
        { name: 'onCollapsedChange', type: '(collapsed: boolean) => void', description: 'Called with the new state when the panel folds or unfolds.' },
        { name: 'persistKey', type: 'string', description: 'A localStorage key. The collapsed state is saved there and read back on the next visit; storage errors are ignored.' },
        { name: 'keyboardShortcut', type: 'boolean', default: 'true', description: 'Wires up ⌘B / Ctrl+B for this provider.' },
        { name: 'mobile', type: 'boolean', description: 'Forces the mobile sheet on or off. By default it follows a 768px media query.' },
        ...partProps,
      ],
    },
    {
      name: 'Sidebar',
      description: 'The navigation panel, a `nav` landmark. Below 768px it renders inside a left Sheet.',
      props: [
        { name: 'variant', type: "'floating' | 'docked'", default: "'floating'", description: '`floating`: a raised surface 8px from the frame. `docked`: full height with an edge hairline and no radius.' },
        { name: 'label', type: 'string', default: "'Navigation'", description: 'Names the navigation landmark and titles the mobile sheet.' },
        { name: 'children', type: 'ReactNode', description: 'SidebarHeader, SidebarContent and SidebarFooter.' },
        { name: 'className', type: 'string', description: 'A class added to the panel.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles on the panel. Set `--os-sidebar-width` to change the 240px expanded width.' },
        { name: 'ref', type: 'Ref<HTMLElement>', description: 'A ref to the `nav` element.' },
      ],
    },
    {
      name: 'SidebarHeader',
      description: 'The brand row on top. Its words fold away with the labels; extra children are inert while collapsed.',
      props: [
        { name: 'logo', type: 'ReactNode', description: 'An Avatar or logo of 24 to 32px, centered on the icon column.' },
        { name: 'title', type: 'ReactNode', description: 'The product or workspace name beside the logo.' },
        { name: 'description', type: 'ReactNode', description: 'A second line under the title, 12/16 in `fg-muted`.' },
        ...partProps,
      ],
    },
    {
      name: 'SidebarContent',
      description: 'The middle of the panel, which scrolls when the items do not fit.',
      props: partProps,
    },
    {
      name: 'SidebarSection',
      description: 'A list of items, optionally under a label.',
      props: [
        { name: 'label', type: 'ReactNode', description: 'A heading for the group, 12/16 500 in `fg-muted`. It names the group and becomes a hairline while collapsed.' },
        ...partProps,
      ],
    },
    {
      name: 'SidebarItem',
      description: 'One destination: a link when it has `href`, otherwise a button. 36px tall like a menu item (44 on touch screens), 14/20, `fg-muted` until hovered or current.',
      props: [
        { name: 'icon', type: 'IconName | ReactElement', required: true, description: 'The 16px glyph that stays visible while collapsed.' },
        { name: 'children', type: 'ReactNode', required: true, description: 'The label. Visually hidden while collapsed and shown in a tooltip then.' },
        { name: 'href', type: 'string', description: 'Renders a link to this URL.' },
        { name: 'target', type: 'string', description: 'The link target, with `href`.' },
        { name: 'rel', type: 'string', description: 'The link rel, with `href`.' },
        { name: 'onPress', type: '() => void', description: 'Called on click, tap or Enter. In the mobile sheet the sheet also closes.' },
        { name: 'isCurrent', type: 'boolean', default: 'false', description: 'Marks the current page: a `bg-interactive-primary` fill, weight 500 and `aria-current="page"`.' },
        { name: 'badge', type: 'ReactNode', description: 'A count at the end of the row. While collapsed it becomes a dot on the icon.' },
        { name: 'badgeLabel', type: 'string', description: 'Words read after the label in place of the bare count, such as "4 unread".' },
        { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Shows the item in `fg-disabled` and takes it out of the tab order.' },
        { name: 'className', type: 'string', description: 'A class added to the link or button.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles on the link or button.' },
        { name: 'ref', type: 'Ref<HTMLElement>', description: 'A ref to the link or button.' },
      ],
    },
    {
      name: 'SidebarFooter',
      description: 'The bottom of the panel under a hairline, for the collapse button, settings or an account.',
      props: partProps,
    },
    {
      name: 'SidebarCollapseButton',
      description: 'Folds and unfolds the panel, with `aria-expanded` and `aria-controls`. It shows the shortcut while expanded and is left out of the mobile sheet.',
      props: [
        { name: 'collapseLabel', type: 'string', default: "'Collapse'", description: 'The label and name while expanded.' },
        { name: 'expandLabel', type: 'string', default: "'Expand'", description: 'The name and tooltip while collapsed.' },
        { name: 'className', type: 'string', description: 'A class added to the button.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles on the button.' },
        { name: 'ref', type: 'Ref<HTMLButtonElement>', description: 'A ref to the button.' },
      ],
    },
    {
      name: 'SidebarInset',
      description: 'The page area beside the panel. It fills the rest of the row and scrolls on its own.',
      props: partProps,
    },
    {
      name: 'SidebarTrigger',
      description: 'A 32px icon button that opens the mobile sheet. It renders nothing at desktop widths.',
      props: [
        { name: 'label', type: 'string', default: "'Open navigation'", description: 'The accessible name of the button.' },
        { name: 'className', type: 'string', description: 'A class added to the button.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles on the button.' },
        { name: 'ref', type: 'Ref<HTMLButtonElement>', description: 'A ref to the button.' },
      ],
    },
    {
      name: 'useSidebar',
      description: 'Reads the nearest SidebarProvider from any component inside it. It returns the fields below and throws outside a provider.',
      props: [
        { name: 'collapsed', type: 'boolean', description: 'True while the desktop panel shows only its icons.' },
        { name: 'setCollapsed', type: '(collapsed: boolean) => void', description: 'Folds or unfolds the panel.' },
        { name: 'toggle', type: '() => void', description: 'Toggles the panel, or the sheet below the breakpoint.' },
        { name: 'isMobile', type: 'boolean', description: 'True while the panel lives in the mobile sheet.' },
        { name: 'mobileOpen', type: 'boolean', description: 'Whether the mobile sheet is open.' },
        { name: 'setMobileOpen', type: '(open: boolean) => void', description: 'Opens or closes the mobile sheet.' },
        { name: 'panelId', type: 'string', description: 'The id of the panel, for `aria-controls`.' },
        { name: 'keyboardShortcut', type: 'boolean', description: 'Whether ⌘B / Ctrl+B is active for this provider.' },
      ],
    },
  ],
  accessibility: [
    'The panel is a `nav` landmark named by `label`. Items are links (with `href`) or buttons in the normal tab order, and the current one carries `aria-current="page"`.',
    'Collapsed labels are visually hidden, not removed, so every item keeps its name; a tooltip shows the label on hover and at once on keyboard focus.',
    'A section label names its group (`role="group"`). A badge count is read with its item, or as `badgeLabel` when you give one.',
    'The collapse button has `aria-expanded`, `aria-controls` and `aria-keyshortcuts`. ⌘B or Ctrl+B toggles the panel, except while typing in a text field.',
    'Below 768px the panel opens in a modal Sheet: focus moves into it, Escape closes it and focus returns to the trigger.',
    'Items show the inset focus ring. With reduced motion the panel folds and unfolds at once.',
  ],
});
