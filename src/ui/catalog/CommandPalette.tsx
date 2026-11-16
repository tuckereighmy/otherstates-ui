import { Autocomplete, Dialog, Header, Input, Menu, MenuItem, MenuSection, Modal, ModalOverlay, TextField, useFilter } from 'react-aria-components';
import { useState } from 'react';
import { DocsIcon } from './icons';
import { navGroups, type NavItem } from './nav';

type CommandPaletteProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called with the chosen page's hash path: "component/button". */
  onChoose: (path: string) => void;
};

/**
 * Search across every page and component. Type to filter, arrow keys to move, Enter to open.
 * The dialog owns focus while it is open and hands it back to whatever opened it.
 */
export function CommandPalette({ isOpen, onOpenChange, onChoose }: CommandPaletteProps) {
  return (
    <ModalOverlay className="docs-layer docs-palette-overlay" isOpen={isOpen} onOpenChange={onOpenChange} isDismissable>
      <Modal className="docs-palette">
        <Dialog className="docs-palette-dialog" aria-label="Search the docs">
          <PaletteBody onChoose={onChoose} onClose={() => onOpenChange(false)} />
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

// What a row is searched by. The category is searchable too: "forms" lists every form control.
const textOf = (item: NavItem) => (item.hint ? `${item.title} ${item.hint}` : item.title);

// Mounted only while the palette is open, so every visit starts with an empty query.
function PaletteBody({ onChoose, onClose }: Pick<CommandPaletteProps, 'onChoose'> & { onClose: () => void }) {
  const { contains } = useFilter({ sensitivity: 'base' });
  const [query, setQuery] = useState('');
  // Every word typed has to appear somewhere in the title or the category, in any order.
  const matches = (text: string, input: string) => input.trim().split(/\s+/).every(term => contains(text, term));
  // The same test the list runs, so the key hints can go when there is nothing to move to or open.
  const anyResult = !query.trim() || navGroups.some(group => group.items.some(item => matches(textOf(item), query)));
  return (
    <Autocomplete filter={matches} inputValue={query} onInputChange={setQuery}>
      <TextField className="docs-palette-field" aria-label="Search pages and components" autoFocus>
        <DocsIcon name="search" />
        <Input className="docs-palette-input" placeholder="Search pages and components" autoComplete="off" autoCorrect="off" spellCheck="false" enterKeyHint="go" />
        <button type="button" className="docs-kbd docs-palette-close" aria-label="Close search" onClick={onClose}>Esc</button>
      </TextField>
      {/* The first result is always marked, so Enter works without reaching for the arrow keys.
          Typing does that by itself; the key covers opening and clearing the field. */}
      <Menu
        key={query.trim() ? 'results' : 'everything'}
        className="docs-palette-list"
        aria-label="Results"
        autoFocus="first"
        onAction={key => onChoose(String(key))}
        renderEmptyState={() => <p className="docs-palette-empty">No pages or components match “{query.trim()}”.</p>}
      >
        {navGroups.map(group => (
          <MenuSection key={group.label} className="docs-palette-group">
            <Header className="docs-palette-label">{group.label}</Header>
            {group.items.map(item => (
              <MenuItem key={item.path} id={item.path} className="docs-palette-item" textValue={textOf(item)}>
                <span className="docs-palette-title">{item.title}</span>
                {item.hint && <span className="docs-palette-hint">{item.hint}</span>}
              </MenuItem>
            ))}
          </MenuSection>
        ))}
      </Menu>
      {anyResult && (
        <div className="docs-palette-foot" aria-hidden="true">
          <span><kbd className="docs-kbd">↑</kbd><kbd className="docs-kbd">↓</kbd>Move</span>
          <span><kbd className="docs-kbd">↵</kbd>Open</span>
        </div>
      )}
    </Autocomplete>
  );
}
