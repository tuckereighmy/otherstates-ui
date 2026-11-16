import { getLocalTimeZone, today } from '@internationalized/date';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert, Badge, Button, Calendar, Card, Checkbox, Dialog, Icon, Menu, MenuItem, MenuSeparator, Progress, Radio, RadioGroup, Select,
  Switch, Tabs, TextField, Toggle, Tooltip,
} from '../../components';
import { DEFAULT_RECIPE, ScopedTheme, type Scheme } from '../../customize';
import { Showcase } from '../pages/showcase';
import { useRecipe } from './RecipeProvider';
import { derive } from './ThemeControls';

// The preview canvas: a small product settings screen that puts every token family to work,
// in the page's scheme and, with "Both schemes", the other scheme in a ScopedTheme beside it.

const splitKey = 'otherstates-ui-customize-split';

function readSplit() {
  try { return localStorage.getItem(splitKey) === '1'; } catch { return false; }
}

const zones = [
  { id: 'lisbon', label: 'Lisbon (GMT+0)' },
  { id: 'berlin', label: 'Berlin (GMT+1)' },
  { id: 'new-york', label: 'New York (GMT−5)' },
  { id: 'tokyo', label: 'Tokyo (GMT+9)' },
];

const members = [
  { name: 'Mara Okafor', email: 'mara@fieldnotes.example', role: 'Owner' },
  { name: 'Theo Lindqvist', email: 'theo@fieldnotes.example', role: 'Admin' },
  { name: 'Ines Duarte', email: 'ines@fieldnotes.example', role: 'Member' },
];

function General() {
  return (
    <div className="cz-form">
      <TextField label="Workspace name" defaultValue="Fieldnotes" />
      <Select label="Time zone" appearance="field" fullWidth defaultValue="lisbon" options={zones} />
      <RadioGroup label="Default view" defaultValue="board" orientation="horizontal">
        <Radio value="list" label="List" />
        <Radio value="board" label="Board" />
        <Radio value="calendar" label="Calendar" />
      </RadioGroup>
      <div className="cz-choices">
        <Checkbox label="Send a weekly summary" defaultSelected />
        <Switch label="Let guests comment" defaultSelected />
      </div>
      <div className="cz-form-actions">
        <Button>Save changes</Button>
        <Button appearance="secondary">Cancel</Button>
        <Button appearance="destructive" className="cz-push">Delete workspace</Button>
      </div>
    </div>
  );
}

function Members() {
  return (
    <ul className="cz-members">
      {members.map(person => (
        <li key={person.email}>
          <span className="cz-member">
            <span className="cz-member-name">{person.name}</span>
            <span className="cz-member-mail">{person.email}</span>
          </span>
          <Badge variant={person.role === 'Owner' ? 'neutral' : 'outline'}>{person.role}</Badge>
        </li>
      ))}
    </ul>
  );
}

function Billing() {
  return (
    <div className="cz-form">
      <TextField label="Billing email" type="email" defaultValue="billing@fieldnotes.example" />
      <Checkbox label="Email a receipt for every payment" defaultSelected />
    </div>
  );
}

function CardActions() {
  return (
    <div className="cz-card-actions">
      <Tooltip trigger={<Button appearance="tertiary" size="sm" iconOnly aria-label="About settings"><Icon name="info" /></Button>}>
        Changes apply to everyone in the workspace.
      </Tooltip>
      <Toggle size="sm" iconOnly defaultSelected aria-label="Starred"><Icon name="star" size={16} /></Toggle>
      <Menu trigger={<Button appearance="tertiary" size="sm" iconOnly aria-label="More actions"><Icon name="more-horizontal" /></Button>} aria-label="Workspace actions">
        <MenuItem id="rename" icon={<Icon name="edit" />}>Rename</MenuItem>
        <MenuItem id="copy" icon={<Icon name="copy" />}>Copy invite link</MenuItem>
        <MenuSeparator />
        <MenuItem id="leave" icon={<Icon name="log-out" />} destructive>Leave workspace</MenuItem>
      </Menu>
    </div>
  );
}

function SettingsScreen() {
  const start = useMemo(() => today(getLocalTimeZone()), []);
  return (
    <div className="cz-screen">
      <Card heading="Workspace settings" description="Fieldnotes · Team plan" action={<CardActions />}>
        <Tabs
          label="Settings sections"
          variant="underline"
          items={[
            { id: 'general', label: 'General', content: <General /> },
            { id: 'members', label: 'Members', content: <Members /> },
            { id: 'billing', label: 'Billing', content: <Billing /> },
          ]}
        />
      </Card>
      <div className="cz-screen-row">
        <Card heading="Away dates" description="Mentions wait until you are back.">
          <Calendar mode="range" aria-label="Away dates" defaultValue={{ start, end: start.add({ days: 2 }) }} />
        </Card>
        <Card
          heading="Plan"
          description="Team, billed yearly"
          action={<Badge variant="success">Active</Badge>}
          footer={(
            <div className="cz-form-actions">
              <Dialog
                trigger={<Button appearance="secondary" size="sm">Add seats</Button>}
                title="Add seats"
                description="New seats are billed for the rest of the year."
                footer={close => (
                  <>
                    <Button appearance="secondary" onClick={close}>Cancel</Button>
                    <Button onClick={close}>Add 2 seats</Button>
                  </>
                )}
              >
                <TextField label="Seats to add" type="number" defaultValue="2" />
              </Dialog>
              <Button appearance="text" size="sm">Compare plans</Button>
            </div>
          )}
        >
          <div className="cz-plan">
            <Progress label="Seats used" value={8} maxValue={10} showValue valueLabel="8 of 10" />
            <div className="cz-badges">
              <Badge variant="info">Beta</Badge>
              <Badge variant="warning">Trial</Badge>
              <Badge variant="error">Overdue</Badge>
              <Badge variant="success">Paid</Badge>
            </div>
            <Alert tone="warning" heading="Card expires soon" description="Update it before 30 November to keep every seat." />
          </div>
        </Card>
      </div>
    </div>
  );
}

const schemeName = (scheme: Scheme) => (scheme === 'dark' ? 'Dark' : 'Light');

export function ThemePreview() {
  const { theme, scheme, showOriginal, setShowOriginal } = useRecipe();
  const [split, setSplit] = useState(readSplit);
  const other: Scheme = scheme === 'dark' ? 'light' : 'dark';
  const shown = showOriginal ? derive(DEFAULT_RECIPE) : theme;

  // "Show original" is a look, not a setting: leaving the page puts the theme back.
  useEffect(() => () => setShowOriginal(false), [setShowOriginal]);

  function changeSplit(value: boolean) {
    setSplit(value);
    try {
      if (value) localStorage.setItem(splitKey, '1');
      else localStorage.removeItem(splitKey);
    } catch { /* Remembered for this visit only. */ }
  }

  return (
    <section className="cz-preview" aria-label="Preview">
      <div className="cz-preview-bar">
        <span className="cz-preview-title">Preview</span>
        <Toggle size="sm" variant="outline" isSelected={showOriginal} onChange={setShowOriginal}>Show original</Toggle>
        <Toggle size="sm" variant="outline" isSelected={split} onChange={changeSplit}>Both schemes</Toggle>
      </div>
      <div className="cz-canvas" data-split={split ? '' : undefined}>
        <div className="cz-half">
          {split && <p className="cz-half-label">{schemeName(scheme)}</p>}
          <div className="cz-stage">
            <SettingsScreen />
          </div>
        </div>
        {split && (
          <div className="cz-half">
            <p className="cz-half-label">{schemeName(other)}</p>
            <ScopedTheme theme={shown} scheme={other} className="cz-stage cz-stage-scoped">
              <SettingsScreen />
            </ScopedTheme>
          </div>
        )}
      </div>
      {!split && (
        <div className="cz-showcase">
          <Showcase />
        </div>
      )}
    </section>
  );
}
