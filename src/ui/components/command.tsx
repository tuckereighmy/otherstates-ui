'use client';

import * as stylex from '@stylexjs/stylex';
import { Fragment, useEffect } from 'react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { Autocomplete, Dialog, DialogTrigger, Input, Menu as AriaMenu, Modal, ModalOverlay, SearchField, useFilter } from 'react-aria-components';
import { Icon } from './Icon';
import { Kbd, KbdGroup } from './kbd';
import { MenuGroup, MenuItem, MenuSeparator } from './menu';
import { withClassName } from './internal/class-name';
import { loadingStyles } from './internal/states';
import { overlayItemStyles, overlayStyles, TriggerSlot, useOpenState, type OpenProps, type PortalProps } from './internal/overlay';
import { tokens as t } from '../tokens.stylex';

// Command (DESIGN_SPEC 1.9, 2.2 Command): a search field over a filtered list of actions, in a
// top-anchored modal window 480 wide, or standalone in the page. The list uses the Menu rows; the
// search field and the first row share the 16px text inset, and a hairline separates them.

const coarse = '@media (pointer: coarse)';

const s = stylex.create({
  overlay: { alignItems: 'start', paddingBlockStart: 'min(16vh, 128px)' },
  /** Spec 1.9 Widths: Command 480. The list scrolls; the search field and footer stay. */
  window: { display: 'flex', flexDirection: 'column', width: 'min(480px, 100%)', maxHeight: '75dvh', overflow: 'hidden' },
  /** Standalone: a page surface (bg-surface, opt-in hairline, no elevation). */
  inline: {
    boxSizing: 'border-box', display: 'flex', flexDirection: 'column', width: '100%', minWidth: 0, overflow: 'hidden',
    backgroundColor: t['--os-color-bg-surface'], color: t['--os-color-fg-base'], borderRadius: t['--os-radius-lg'],
    borderWidth: 1, borderStyle: 'solid', borderColor: t['--os-color-border-subtle'],
    fontFamily: t['--os-font-family'], fontSize: t['--os-font-size-sm'], fontWeight: t['--os-font-weight-regular'],
    lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
  },
  dialog: { display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 0, outline: 'none' },
  /** Padding 8 plus the row's 8 puts the icon 16px in, on the item icons' line (spec 2.2 Command). */
  search: {
    flexShrink: 0, padding: t['--os-space-2'],
    borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: t['--os-color-border-subtle'],
  },
  searchRow: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'], height: t['--os-size-md'], paddingInline: t['--os-space-2'], color: t['--os-color-fg-muted'] },
  searchIcon: { display: 'inline-flex', flexShrink: 0 },
  input: {
    flexGrow: 1, minWidth: 0, height: '100%', padding: 0, borderWidth: 0, outlineStyle: 'none',
    backgroundColor: 'transparent', color: t['--os-color-fg-base'], fontFamily: 'inherit',
    fontSize: { default: t['--os-font-size-sm'], [coarse]: t['--os-font-size-body'] },
    fontWeight: t['--os-font-weight-regular'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
    '::placeholder': { color: t['--os-color-fg-muted'], opacity: 1 },
    '::-webkit-search-cancel-button': { display: 'none' },
  },
  list: {
    gap: t['--os-space-0-5'], minWidth: 0, maxWidth: 'none', maxHeight: 'min(320px, 48dvh)', minHeight: 0,
    flexShrink: 1, boxSizing: 'border-box', overscrollBehavior: 'contain',
  },
  footer: {
    display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end', columnGap: t['--os-space-3'], rowGap: t['--os-space-1'],
    flexShrink: 0, paddingBlock: t['--os-space-2'], paddingInline: t['--os-space-4'], color: t['--os-color-fg-muted'],
    fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'], letterSpacing: 0,
  },
  hint: { display: 'inline-flex', alignItems: 'center', gap: t['--os-space-1-5'] },
});

export type CommandAction = {
  id: string;
  label: string;
  /** Extra words the search matches. */
  keywords?: string[];
  /** A 16px Icon before the label. */
  icon?: ReactNode;
  /** A shortcut shown as a Kbd `sm` at the end. */
  shortcut?: string;
  /** A secondary line under the label. */
  description?: string;
  /** A group label. Actions with the same group sit together under it, groups apart by a separator. */
  group?: string;
  isDisabled?: boolean;
  /** @deprecated Use `isDisabled`. */
  disabled?: boolean;
  onAction: () => void;
};

export type CommandProps = OpenProps & PortalProps & {
  /** The element that opens the palette. Leave it out to open it with `shortcutKey` or `isOpen`. */
  trigger?: ReactNode;
  /** The commands. Or pass MenuItem, MenuGroup and MenuSeparator as children. */
  actions?: CommandAction[];
  children?: ReactNode;
  /** Renders the palette in the page instead of a dialog. */
  standalone?: boolean;
  /** Names the dialog for assistive tech. */
  title?: string;
  placeholder?: string;
  /** Names the search field for assistive tech. */
  searchLabel?: string;
  /** Shown when nothing matches. */
  emptyMessage?: ReactNode;
  /** Opens and closes the palette with Cmd or Ctrl plus this key. */
  shortcutKey?: string;
  /** Replaces the key hints under the list. Pass `null` for no footer. */
  footer?: ReactNode;
  /** Shows a loading row in place of the results, for async search. */
  isLoading?: boolean;
  loadingLabel?: string;
  /** The search text, controlled. */
  inputValue?: string;
  defaultInputValue?: string;
  onInputChange?: (value: string) => void;
  /** Classes for the palette surface. */
  className?: string;
  /** Inline styles for the palette surface. */
  style?: CSSProperties;
  /** The palette surface element. */
  ref?: Ref<HTMLDivElement>;
};

function DefaultFooter() {
  return <>
    <span {...stylex.props(s.hint)}><KbdGroup size="sm"><Kbd aria-label="Up arrow">↑</Kbd><Kbd aria-label="Down arrow">↓</Kbd></KbdGroup>Navigate</span>
    <span {...stylex.props(s.hint)}><Kbd size="sm" aria-label="Enter">↵</Kbd>Run</span>
    <span {...stylex.props(s.hint)}><Kbd size="sm">Esc</Kbd>Close</span>
  </>;
}

function renderActions(actions: CommandAction[]) {
  const groups = new Map<string | undefined, CommandAction[]>();
  for (const action of actions) groups.set(action.group, [...(groups.get(action.group) ?? []), action]);
  const item = (action: CommandAction) => <MenuItem key={action.id} id={action.id}
    textValue={[action.label, action.description, ...(action.keywords ?? [])].filter(Boolean).join(' ')}
    icon={action.icon} shortcut={action.shortcut} description={action.description}
    isDisabled={action.isDisabled ?? action.disabled} onAction={action.onAction}>
    {action.label}
  </MenuItem>;
  if (groups.size === 1 && groups.has(undefined)) return actions.map(item);
  return [...groups].map(([label, list], index) => <Fragment key={label ?? `group-${index}`}>
    {index > 0 && <MenuSeparator />}
    <MenuGroup id={label ?? `group-${index}`} label={label} aria-label={label ?? 'Commands'}>{list.map(item)}</MenuGroup>
  </Fragment>);
}

export function Command({
  trigger, actions = [], children, standalone = false, title = 'Command palette', placeholder = 'Type a command…',
  searchLabel = 'Search commands', emptyMessage = 'No commands found.', shortcutKey, footer, isLoading = false,
  loadingLabel = 'Loading…', inputValue, defaultInputValue, onInputChange, portalContainer, isOpen, defaultOpen,
  onOpenChange, className, style, ref,
}: CommandProps) {
  const [open, setOpen] = useOpenState({ isOpen, defaultOpen, onOpenChange });
  const { contains } = useFilter({ sensitivity: 'base' });

  useEffect(() => {
    if (!shortcutKey || standalone) return;
    const handleShortcut = (event: KeyboardEvent) => {
      if ((!event.metaKey && !event.ctrlKey) || event.altKey || event.shiftKey || event.repeat || event.defaultPrevented || event.key.toLowerCase() !== shortcutKey.toLowerCase()) return;
      event.preventDefault();
      setOpen(!open);
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [shortcutKey, standalone, open, setOpen]);

  const body = (close?: () => void) => <Autocomplete filter={contains} inputValue={inputValue} defaultInputValue={defaultInputValue} onInputChange={onInputChange}>
    <SearchField aria-label={searchLabel} autoFocus={!standalone} {...stylex.props(s.search)}>
      <div {...stylex.props(s.searchRow)}>
        <span {...stylex.props(s.searchIcon)}><Icon name="search" size={16} /></span>
        <Input placeholder={placeholder} {...stylex.props(s.input)} />
      </div>
    </SearchField>
    <AriaMenu aria-label="Commands" onAction={close ? () => close() : undefined}
      renderEmptyState={() => isLoading
        ? <div role="status" {...stylex.props(overlayItemStyles.empty)}><span aria-hidden="true" {...stylex.props(loadingStyles.spinner, loadingStyles.spinnerSize(16))} />{loadingLabel}</div>
        : <div {...stylex.props(overlayItemStyles.empty)}>{emptyMessage}</div>}
      {...stylex.props(overlayStyles.menu, s.list)}>
      {isLoading ? null : children ?? renderActions(actions)}
    </AriaMenu>
    {footer === undefined ? <div {...stylex.props(s.footer)}><DefaultFooter /></div> : footer !== null && footer !== false && <div {...stylex.props(s.footer)}>{footer}</div>}
  </Autocomplete>;

  if (standalone) return <div ref={ref} style={style} className={withClassName(stylex.props(s.inline), className)}>{body()}</div>;

  const overlay = <ModalOverlay isDismissable UNSTABLE_portalContainer={portalContainer}
    {...(trigger ? {} : { isOpen: open, onOpenChange: setOpen })}
    className={({ isExiting }) => stylex.props(overlayStyles.overlay, s.overlay, overlayStyles.animateIn, isExiting && overlayStyles.exit).className ?? ''}>
    <Modal ref={ref} style={style} className={({ isExiting }) => withClassName(stylex.props(overlayStyles.surface, s.window, overlayStyles.windowMotionTop, isExiting && overlayStyles.exit), className)}>
      <Dialog aria-label={title} {...stylex.props(s.dialog)}>
        {({ close }) => body(close)}
      </Dialog>
    </Modal>
  </ModalOverlay>;

  if (!trigger) return overlay;
  return <DialogTrigger isOpen={open} onOpenChange={setOpen}>
    <TriggerSlot>{trigger}</TriggerSlot>
    {overlay}
  </DialogTrigger>;
}
