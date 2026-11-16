import { getLocalTimeZone, today } from '@internationalized/date';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  AvatarGroup,
  Button,
  Calendar,
  ExpandingTabs,
  Icon,
  Menu,
  MenuItem,
  MenuSeparator,
  OtpField,
  OverlayButton,
  ScrubStepper,
  SegmentedControl,
  Select,
  Slider,
  Switch,
  TaskChecklist,
} from '../../components';
import { docsById } from '../docs/registry';
import { DocsIcon } from '../icons';
import { Boundary } from '../PageParts';
import { componentHref } from '../route';

// The showcase on the introduction: real components from the library, each in a tile that links
// to its page. Every tile is live, so a reader can try a control before opening its docs.

function SaveButton() {
  const [state, setState] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    if (state === 'idle') return;
    const timer = window.setTimeout(() => setState(state === 'saving' ? 'saved' : 'idle'), state === 'saving' ? 700 : 1600);
    return () => window.clearTimeout(timer);
  }, [state]);

  return (
    <div className="pg-tile-row">
      <Button size="medium" appearance="secondary">Cancel</Button>
      {/* The minimum width keeps the button steady while its label changes. */}
      <Button
        size="medium"
        loading={state === 'saving'}
        leadingIcon={state === 'saved' ? <Icon name="check" size={16} /> : undefined}
        style={{ minWidth: 136 }}
        onClick={() => setState('saving')}
      >
        {state === 'saved' ? 'Saved' : 'Save changes'}
      </Button>
    </div>
  );
}

const views = [
  { id: 'home', label: 'Home', icon: <Icon name="home" size={16} />, content: null },
  { id: 'search', label: 'Search', icon: <Icon name="search" size={16} />, content: null },
  { id: 'inbox', label: 'Inbox', icon: <Icon name="inbox" size={16} />, content: null },
  { id: 'saved', label: 'Saved', icon: <Icon name="bookmark" size={16} />, content: null },
];

const roles = [
  { id: 'viewer', label: 'Viewer' },
  { id: 'editor', label: 'Editor' },
  { id: 'admin', label: 'Admin' },
  { id: 'owner', label: 'Owner' },
];

const ranges = ['Day', 'Week', 'Month'].map(range => ({ value: range, label: range }));

function VolumeSlider() {
  const [volume, setVolume] = useState(60);
  return <Slider label="Volume" hideLabel value={volume} onChange={setVolume} />;
}

function RoleSelect() {
  const [role, setRole] = useState<string | null>('editor');
  return <Select label="Role" hideLabel options={roles} value={role} onChange={setRole} />;
}

function CodeField() {
  const [code, setCode] = useState('');
  return <OtpField label="Verification code" hideLabel hint="Type any four digits" length={4} value={code} onChange={setCode} validate={() => true} />;
}

function DatePick() {
  const [start] = useState(() => today(getLocalTimeZone()));
  return <Calendar aria-label="Pick a date" defaultValue={start} />;
}

function ActionsMenu() {
  return (
    <Menu
      aria-label="File actions"
      placement="bottom start"
      trigger={
        <OverlayButton>
          Actions
          <Icon name="chevron" size={14} />
        </OverlayButton>
      }
    >
      <MenuItem>Rename</MenuItem>
      <MenuItem>Duplicate</MenuItem>
      <MenuItem>Move to…</MenuItem>
      <MenuSeparator />
      <MenuItem destructive>Delete</MenuItem>
    </Menu>
  );
}

type Tile = {
  /** The component page this tile links to. */
  id: string;
  /** Shown if the page is not in the registry. */
  fallbackTitle: string;
  /** Columns the tile spans on the six-column grid. */
  columns: 2 | 3;
  /** Rows the tile spans. */
  rows?: 2;
  /** The third tile of a row of three takes a full row when the grid drops to two columns. */
  solo?: boolean;
  render: () => ReactNode;
};

const tiles: Tile[] = [
  {
    id: 'progress',
    fallbackTitle: 'Progress',
    columns: 3,
    rows: 2,
    render: () => (
      <TaskChecklist
        title="Launch checklist"
        defaultCheckedKeys={['tokens']}
        items={[
          { id: 'tokens', label: 'Review the tokens' },
          { id: 'forms', label: 'Test every form' },
          { id: 'dark', label: 'Check the dark theme' },
          { id: 'notes', label: 'Write release notes' },
        ]}
      />
    ),
  },
  { id: 'tabs', fallbackTitle: 'Tabs', columns: 3, render: () => <ExpandingTabs label="Views" items={views} defaultSelectedKey="home" /> },
  { id: 'slider', fallbackTitle: 'Slider', columns: 3, render: () => <VolumeSlider /> },
  { id: 'switch', fallbackTitle: 'Switch', columns: 2, render: () => <Switch label="Notifications" appearance="stretch" hideLabel defaultChecked /> },
  { id: 'otp-field', fallbackTitle: 'OTP Field', columns: 2, render: () => <CodeField /> },
  {
    id: 'avatar',
    fallbackTitle: 'Avatar',
    columns: 2,
    solo: true,
    render: () => (
      <AvatarGroup
        label="Project members"
        items={[
          { name: 'Ines Okafor', fallback: 'gradient' },
          { name: 'Tomas Lindqvist', fallback: 'gradient' },
          { name: 'Mei Tanaka', fallback: 'gradient' },
          { name: 'Rafael Costa', fallback: 'gradient' },
        ]}
      />
    ),
  },
  { id: 'button', fallbackTitle: 'Button', columns: 3, render: () => <SaveButton /> },
  { id: 'calendar', fallbackTitle: 'Calendar', columns: 3, rows: 2, render: () => <DatePick /> },
  { id: 'segmented-control', fallbackTitle: 'Segmented Control', columns: 3, render: () => <SegmentedControl label="Range" defaultValue="Week" options={ranges} /> },
  { id: 'select', fallbackTitle: 'Select', columns: 2, render: () => <RoleSelect /> },
  { id: 'number-field', fallbackTitle: 'Number Field', columns: 2, render: () => <ScrubStepper label="Seats" defaultValue={4} min={1} max={20} /> },
  { id: 'menu', fallbackTitle: 'Menu', columns: 2, solo: true, render: () => <ActionsMenu /> },
];

export function Showcase() {
  return (
    <section className="pg-bento" aria-label="Components to try" data-docs-raw="" data-example="showcase">
      <ul className="pg-bento-grid" role="list">
        {tiles.map(tile => {
          const doc = docsById.get(tile.id);
          const title = doc?.title ?? tile.fallbackTitle;
          return (
            <li key={tile.id} className="pg-tile" data-tile={tile.id} data-columns={tile.columns} data-rows={tile.rows} data-solo={tile.solo || undefined}>
              <div className="pg-tile-stage">
                <Boundary fallback={<p className="pg-tile-error" role="status">{title} could not be shown.</p>}>
                  {tile.render()}
                </Boundary>
              </div>
              {doc ? (
                <a className="pg-tile-link" href={componentHref(doc.id)} aria-label={`${title} documentation`}>
                  {title}
                  <DocsIcon name="arrowRight" size={12} />
                </a>
              ) : (
                <span className="pg-tile-link" data-static="">{title}</span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
