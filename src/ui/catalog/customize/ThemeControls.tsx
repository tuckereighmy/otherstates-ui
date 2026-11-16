import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type Key } from 'react';
import {
  Alert, AnchoredToast, Button, Collapsible, Icon, Label, SegmentedControl, Select, Switch, TextField, ToggleGroup, ToggleGroupItem,
} from '../../components';
import {
  ACCENT_PRESETS, AVAILABILITY, CORNER_LADDERS, DEFAULT_RECIPE, NEUTRAL_FAMILIES, PRESETS, ROUND_CONTROL, TYPEFACES, deriveTheme, normalizeHex,
  parseImport, shareUrl, tintedAvailable,
  type AccentPreset, type CornerLadder, type DerivedTheme, type NeutralFamily, type PresetId, type Recipe, type Scheme, type Typeface,
} from '../../customize';
import { pageHref } from '../route';
import { BASE_VALUES, useRecipe } from './RecipeProvider';

// The builder's controls. `full` is the rail on the Customize page; `compact` is the
// header popover. Library components only; swatch colors come from derived data, never typed by hand.

const derived = new Map<string, DerivedTheme>();
/** deriveTheme against the docs' base values, cached: swatches derive a theme per option. */
export function derive(recipe: Recipe): DerivedTheme {
  const key = JSON.stringify(recipe);
  let theme = derived.get(key);
  if (!theme) {
    theme = deriveTheme(recipe, BASE_VALUES);
    derived.set(key, theme);
  }
  return theme;
}

const accentIds: AccentPreset[] = ['ink', 'harbor', 'lagoon', 'plum', 'orchid'];
const accentName = (id: AccentPreset) => (id === 'ink' ? 'Ink' : ACCENT_PRESETS[id].label);
const accentLabel = (id: AccentPreset) => (id === 'ink' ? 'Ink' : `${ACCENT_PRESETS[id].label}, ${ACCENT_PRESETS[id].hueName}`);
const neutralIds = Object.keys(NEUTRAL_FAMILIES) as NeutralFamily[];
const neutralHints: Record<NeutralFamily, string> = { paper: 'warm gray', pure: 'gray', slate: 'cool gray', sage: 'green gray', tinted: 'gray with the accent hue' };
const cornerIds = (Object.keys(CORNER_LADDERS) as CornerLadder[]).filter(id => id !== 'soft' || AVAILABILITY.soft);
const typefaceIds = Object.keys(TYPEFACES) as Typeface[];
const presetIds = (Object.keys(PRESETS) as PresetId[]).filter(id => id !== 'atelier' || AVAILABILITY.soft);
const cap = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const accentOf = (theme: DerivedTheme, scheme: Scheme) => theme[scheme]['--os-color-accent-moderate'];
const paint = (color: string | undefined) => ({ '--cz-color': color } as CSSProperties);

function Dot({ color }: { color: string | undefined }) {
  return <span className="cz-dot" style={paint(color)} aria-hidden="true" />;
}

function Chip({ family, accent, scheme }: { family: NeutralFamily; accent: Recipe['accent']; scheme: Scheme }) {
  const map = derive({ ...DEFAULT_RECIPE, accent: family === 'tinted' ? accent : 'ink', neutrals: family === 'tinted' && !tintedAvailable(accent) ? 'paper' : family })[scheme];
  const style = { '--cz-a': map['--os-color-bg-muted'], '--cz-b': map['--os-color-fg-muted'] } as CSSProperties;
  return <span className="cz-chip" style={style} aria-hidden="true" />;
}

function Trio({ id, scheme }: { id: PresetId; scheme: Scheme }) {
  const map = derive(PRESETS[id].recipe)[scheme];
  const style = { '--cz-a': map['--os-color-accent-moderate'], '--cz-b': map['--os-color-bg-muted'], '--cz-c': map['--os-color-fg-muted'] } as CSSProperties;
  return <span className="cz-trio" style={style} aria-hidden="true" />;
}

/** A visible group label. The control carries the same name, so the label is hidden from assistive tech. */
function GroupLabel({ children }: { children: string }) {
  return <Label elementType="span" aria-hidden="true" className="cz-label">{children}</Label>;
}

/** Text handed to a live region only after the reader pauses, so arrowing through swatches is not read out one by one. */
function useSettled(text: string, delay = 600) {
  const [settled, setSettled] = useState(text);
  useEffect(() => {
    const timer = window.setTimeout(() => setSettled(text), delay);
    return () => window.clearTimeout(timer);
  }, [text, delay]);
  return settled;
}

function AccentSwatches({ compact }: { compact: boolean }) {
  const { recipe, scheme, update } = useRecipe();
  const custom = recipe.accent.startsWith('#');
  const [picking, setPicking] = useState(custom);
  const [text, setText] = useState(custom ? recipe.accent : '');
  const [showError, setShowError] = useState(false);
  // A preset, Reset or an import changes the accent from outside: follow it.
  const [seen, setSeen] = useState(recipe.accent);
  if (seen !== recipe.accent) {
    setSeen(recipe.accent);
    if (custom) setText(current => (normalizeHex(current.trim()) === recipe.accent ? current : recipe.accent));
    else setPicking(false);
  }
  const selected = custom || picking ? 'custom' : recipe.accent;

  function choose(keys: Set<Key>) {
    const key = [...keys][0];
    if (key === undefined) return;
    if (key === 'custom') {
      setPicking(true);
      return;
    }
    setPicking(false);
    setShowError(false);
    update({ accent: key as AccentPreset });
  }

  function type(value: string) {
    setText(value);
    const hex = normalizeHex(value.trim());
    if (hex) {
      setShowError(false);
      update({ accent: hex });
    }
  }

  const items = accentIds.map(id => (
    <ToggleGroupItem key={id} id={id} aria-label={accentLabel(id)}>
      <Dot color={accentOf(derive({ ...DEFAULT_RECIPE, accent: id }), scheme)} />
    </ToggleGroupItem>
  ));

  if (compact) {
    return (
      <ToggleGroup aria-label="Accent" selectionMode="single" disallowEmptySelection selectedKeys={[custom ? 'custom' : recipe.accent]} onSelectionChange={choose}>
        {items}
        {custom && (
          <ToggleGroupItem id="custom" aria-label={`Custom color, ${recipe.accent}`}>
            <Dot color={accentOf(derive({ ...DEFAULT_RECIPE, accent: recipe.accent }), scheme)} />
          </ToggleGroupItem>
        )}
      </ToggleGroup>
    );
  }

  const hexError = showError && text.trim() !== '' && !normalizeHex(text.trim());
  return (
    <>
      <ToggleGroup aria-label="Accent" selectionMode="single" disallowEmptySelection selectedKeys={[selected]} onSelectionChange={choose}>
        {items}
        <ToggleGroupItem id="custom" aria-label="Custom color">
          <Icon name="plus" size={16} />
        </ToggleGroupItem>
      </ToggleGroup>
      {selected === 'custom' && (
        <TextField
          label="Hex color"
          placeholder="#2a6ada"
          value={text}
          spellCheck={false}
          autoComplete="off"
          onChange={event => type(event.target.value)}
          onBlur={() => setShowError(true)}
          isInvalid={hexError}
          errorMessage={hexError ? 'Enter a hex color, like #2a6ada' : undefined}
          leadingIcon={<Dot color={normalizeHex(text.trim()) ?? 'transparent'} />}
        />
      )}
    </>
  );
}

function AccentCaption() {
  const { recipe, theme } = useRecipe();
  const name = recipe.accent.startsWith('#') ? 'Custom' : accentName(recipe.accent as AccentPreset);
  return (
    <p className="cz-help cz-num">
      {name} · {accentOf(theme, 'light')} light · {accentOf(theme, 'dark')} dark
    </p>
  );
}

function Adjustments() {
  const { theme } = useRecipe();
  const visible = theme.adjustments.filter(a => a.visible);
  const text = visible.map(a => `${cap(a.scheme)} ${a.to}: ${a.message}`).join(' ');
  const settled = useSettled(text);
  return (
    <>
      {visible.length > 0 && (
        <ul className="cz-adjustments" aria-hidden="true">
          {visible.map(a => (
            <li key={`${a.scheme}${a.token}`} className="cz-help">
              <span className="cz-num">{cap(a.scheme)} {a.to}:</span> {a.message}
            </li>
          ))}
        </ul>
      )}
      <span className="docs-sr" role="status" aria-live="polite">{settled}</span>
      {theme.notes.map(note => note.severity === 'warning'
        ? <Alert key={`${note.scheme}${note.against}`} tone="warning" description={note.message} />
        : <p key={`${note.scheme}${note.against}`} className="cz-help">{note.message}</p>)}
    </>
  );
}

function Advanced() {
  const { recipe, update } = useRecipe();
  const ink = recipe.accent === 'ink';
  const [darkText, setDarkText] = useState(recipe.accentDark ?? '');
  const [darkMode, setDarkMode] = useState(recipe.accentDark ? 'custom' : 'auto');
  const darkInvalid = darkText.trim() !== '' && !normalizeHex(darkText.trim());

  return (
    <Collapsible title="Advanced" variant="plain">
      <div className="cz-advanced">
        {ink && <p className="cz-help">Pick a color accent to use these.</p>}
        <Switch size="sm" label="Focus ring follows accent" isSelected={recipe.focusFollowsAccent} isDisabled={ink} onChange={value => update({ focusFollowsAccent: value })} />
        <Switch size="sm" label="Links follow accent" isSelected={recipe.linksFollowAccent} isDisabled={ink} onChange={value => update({ linksFollowAccent: value })} />
        <div className="cz-section">
          <GroupLabel>Dark accent</GroupLabel>
          <SegmentedControl
            label="Dark accent"
                  isDisabled={ink}
            value={darkMode}
            onChange={value => {
              setDarkMode(value);
              if (value === 'auto') update({ accentDark: null });
              else if (normalizeHex(darkText.trim())) update({ accentDark: normalizeHex(darkText.trim()) });
            }}
            options={[{ value: 'auto', label: 'Auto' }, { value: 'custom', label: 'Custom' }]}
          />
          {darkMode === 'custom' && !ink && (
            <TextField
              label="Dark hex color"
              placeholder="#70a4ff"
              value={darkText}
              spellCheck={false}
              autoComplete="off"
              onChange={event => {
                setDarkText(event.target.value);
                const hex = normalizeHex(event.target.value.trim());
                if (hex) update({ accentDark: hex });
              }}
              isInvalid={darkInvalid}
              errorMessage={darkInvalid ? 'Enter a hex color, like #70a4ff' : undefined}
              leadingIcon={<Dot color={normalizeHex(darkText.trim()) ?? 'transparent'} />}
            />
          )}
        </div>
      </div>
    </Collapsible>
  );
}

function NeutralsControl({ compact }: { compact: boolean }) {
  const { recipe, scheme, update } = useRecipe();
  const tinted = tintedAvailable(recipe.accent);
  if (compact) {
    return (
      <ToggleGroup
        aria-label="Neutrals"
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={[recipe.neutrals]}
        onSelectionChange={keys => { const key = [...keys][0]; if (key !== undefined) update({ neutrals: key as NeutralFamily }); }}
      >
        {neutralIds.map(id => (
          <ToggleGroupItem key={id} id={id} isDisabled={id === 'tinted' && !tinted} aria-label={`${NEUTRAL_FAMILIES[id].label}, ${neutralHints[id]}`}>
            <Chip family={id} accent={recipe.accent} scheme={scheme} />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    );
  }
  return (
    <SegmentedControl
      label="Neutrals"
      value={recipe.neutrals}
      onChange={value => update({ neutrals: value as NeutralFamily })}
      options={neutralIds.map(id => ({ value: id, label: NEUTRAL_FAMILIES[id].label, disabled: id === 'tinted' && !tinted }))}
    />
  );
}

function CornersControl() {
  const { recipe, update } = useRecipe();
  return (
    <SegmentedControl
      label="Corners"
      value={recipe.corners}
      onChange={value => update({ corners: value as CornerLadder })}
      options={cornerIds.map(id => ({ value: id, label: cap(id) }))}
    />
  );
}

function TypefaceControl() {
  const { recipe, update } = useRecipe();
  return (
    <SegmentedControl
      label="Typeface"
      value={recipe.typeface}
      onChange={value => update({ typeface: value as Typeface })}
      options={typefaceIds.map(id => ({ value: id, label: TYPEFACES[id].label }))}
    />
  );
}

function ImportTheme() {
  const { setRecipe } = useRecipe();
  const [text, setText] = useState('');
  const [error, setError] = useState(false);
  function open() {
    const recipe = parseImport(text);
    if (!recipe) {
      setError(true);
      return;
    }
    setError(false);
    setText('');
    setRecipe(recipe);
  }
  return (
    <Collapsible title="Open a saved theme" variant="plain">
      <form className="cz-import" onSubmit={event => { event.preventDefault(); open(); }}>
        <TextField
          label="Link, code or file"
          description="Paste a share link, a code such as v1.a-harbor, recipe JSON or an exported file."
          value={text}
          spellCheck={false}
          autoComplete="off"
          onChange={event => { setText(event.target.value); setError(false); }}
          isInvalid={error}
          errorMessage={error ? 'That theme could not be read.' : undefined}
        />
        <Button type="submit" appearance="secondary" isDisabled={text.trim() === ''}>Open</Button>
      </form>
    </Collapsible>
  );
}

function Summary() {
  const { theme } = useRecipe();
  const rows = [...theme.audit.light.rows, ...theme.audit.dark.rows].filter(row => row.gating);
  const failing = rows.filter(row => !row.ok).length;
  const adjusted = theme.adjustments.filter(a => a.visible).length;
  const head = failing === 0 ? `All ${rows.length} checks pass` : `${failing} of ${rows.length} checks need attention`;
  const tail = adjusted === 0 ? '' : ` · ${adjusted} ${adjusted === 1 ? 'color' : 'colors'} adjusted`;
  return (
    <a className="cz-summary cz-num" href={`${pageHref('customize')}/checked-for-you`}>
      <Icon name={failing === 0 ? 'check-circle' : 'alert-circle'} size={16} />
      <span>{head}{tail}</span>
    </a>
  );
}

function RailFooter() {
  const { theme, customized, reset } = useRecipe();
  const linkRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  function getCode() {
    const heading = document.getElementById('get-the-code');
    if (!heading) return;
    heading.scrollIntoView({ block: 'start' });
    if (!heading.hasAttribute('tabindex')) heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl(theme, location.href));
      setCopied(true);
    } catch { /* The clipboard is blocked: nothing to announce. */ }
  }

  return (
    <div className="cz-footer">
      <Summary />
      <div className="cz-actions">
        <Button size="sm" onClick={getCode}>Get the code</Button>
        <Button size="sm" appearance="secondary" isDisabled={!customized} onClick={reset}>Reset</Button>
        <Button ref={linkRef} size="sm" appearance="text" leadingIcon={<Icon name="link" />} onClick={copyLink}>Copy link</Button>
        <AnchoredToast triggerRef={linkRef} isOpen={copied} onOpenChange={setCopied} title="Link copied" placement="top" />
      </div>
    </div>
  );
}

export function ThemeControls({ variant }: { variant: 'full' | 'compact' }) {
  const { recipe, preset, scheme, setRecipe } = useRecipe();
  const id = useId();
  const ladder = CORNER_LADDERS[recipe.corners];
  const presetOptions = useMemo(
    () => presetIds.map(pid => ({ id: pid, label: PRESETS[pid].label, icon: <Trio id={pid} scheme={scheme} /> })),
    [scheme],
  );

  if (variant === 'compact') {
    return (
      <div className="cz-compact">
        <div className="cz-section">
          <div className="cz-label-row">
            <GroupLabel>Accent</GroupLabel>
            <span className="cz-value">{recipe.accent.startsWith('#') ? recipe.accent : accentName(recipe.accent as AccentPreset)}</span>
          </div>
          <AccentSwatches compact />
        </div>
        <div className="cz-section">
          <div className="cz-label-row">
            <GroupLabel>Neutrals</GroupLabel>
            <span className="cz-value">{NEUTRAL_FAMILIES[recipe.neutrals].label}</span>
          </div>
          <NeutralsControl compact />
        </div>
        <div className="cz-section">
          <GroupLabel>Corners</GroupLabel>
          <CornersControl />
        </div>
        <div className="cz-section">
          <GroupLabel>Typeface</GroupLabel>
          <TypefaceControl />
        </div>
      </div>
    );
  }

  return (
    <div className="cz-rail" aria-labelledby={`${id}-title`} role="group">
      <h2 id={`${id}-title`} className="docs-sr">Theme controls</h2>
      <Select
        label="Start from"
        appearance="field"
        fullWidth
        placeholder="Custom mix"
        value={preset}
        options={presetOptions}
        onChange={value => { if (value) setRecipe(PRESETS[value as PresetId].recipe); }}
      />
      <div className="cz-section">
        <GroupLabel>Accent</GroupLabel>
        <AccentSwatches compact={false} />
        <AccentCaption />
        <Adjustments />
        <Advanced />
      </div>
      <div className="cz-section">
        <GroupLabel>Neutrals</GroupLabel>
        <NeutralsControl compact={false} />
        <p className="cz-help">{tintedAvailable(recipe.accent) ? `${NEUTRAL_FAMILIES[recipe.neutrals].label}: ${neutralHints[recipe.neutrals]}.` : 'Tinted takes its hue from the accent, so it needs a color accent.'}</p>
      </div>
      <div className="cz-section">
        <GroupLabel>Corners</GroupLabel>
        <CornersControl />
        <p className="cz-help cz-num">{ladder[6] >= ROUND_CONTROL ? 'Controls round' : `Controls ${ladder[6]}`} · Popups {ladder[3]} · Cards {ladder[4]}</p>
      </div>
      <div className="cz-section">
        <GroupLabel>Typeface</GroupLabel>
        <TypefaceControl />
        <p className="cz-help">Platform uses each reader's system font.</p>
      </div>
      <ImportTheme />
      <RailFooter />
    </div>
  );
}
