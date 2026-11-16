'use client';

import * as stylex from '@stylexjs/stylex';
import { useMemo, useState, type FormEvent, type MouseEvent } from 'react';
import {
  Avatar, Badge, Button, Card, Checkbox, Dialog, Field, Icon, Input, InputGroup, InputGroupAddon, Pagination, Progress,
  SegmentedControl, Select, Sheet, Sidebar, SidebarCollapseButton, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset,
  SidebarItem, SidebarProvider, SidebarSection, SidebarTrigger, Table, TableBody, TableCell, TableColumnHeader, TableHead,
  TableRow, Textarea, ToastRegion, createToastQueue,
} from '../../../components';
import { tokens as t } from '../../../tokens.stylex';
import { nav, owners, projects as initialProjects, statuses, workspaceNav, type Project, type Status } from './data';

// A project list: filters, a table that sorts, selects and pages, a board view, a sheet to edit a
// project and a dialog to start one. Layout is StyleX on the tokens; every control is a library component.

const phone = '@media (max-width: 767px)';
const narrow = '@media (max-width: 1023px)';
const pageSize = 8;

type SortKey = 'name' | 'due' | 'progress';
type Sort = { key: SortKey; direction: 'ascending' | 'descending' };
type Draft = Pick<Project, 'name' | 'owner' | 'status' | 'due' | 'notes'>;

const statusVariant: Record<Status, 'neutral' | 'info' | 'warning' | 'success'> = {
  planned: 'neutral',
  active: 'info',
  review: 'warning',
  done: 'success',
};
const statusName = Object.fromEntries(statuses.map(status => [status.id, status.label])) as Record<Status, string>;
const statusOptions = [{ id: 'all', label: 'All statuses' }, ...statuses];
const ownerOptions = owners.map(owner => ({ id: owner, label: owner }));
const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const formatDate = (iso: string) => dateFormat.format(new Date(`${iso}T12:00:00`));
const emptyDraft: Draft = { name: '', owner: owners[0], status: 'planned', due: '2027-01-31', notes: '' };

export default function ProjectsTemplate() {
  const [toasts] = useState(() => createToastQueue());
  const [current, setCurrent] = useState('projects');
  const [items, setItems] = useState(initialProjects);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [view, setView] = useState('table');
  const [sort, setSort] = useState<Sort>({ key: 'due', direction: 'ascending' });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = items.filter(project =>
      (status === 'all' || project.status === status)
      && (!needle || project.name.toLowerCase().includes(needle) || project.owner.toLowerCase().includes(needle)));
    const order = sort.direction === 'ascending' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const by = sort.key === 'progress' ? a.progress - b.progress : a[sort.key].localeCompare(b[sort.key]);
      return by * order || a.name.localeCompare(b.name);
    });
  }, [items, query, status, sort]);

  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const rows = visible.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const allOnPage = rows.length > 0 && rows.every(row => selected.has(row.id));
  const someOnPage = rows.some(row => selected.has(row.id));

  function sortBy(key: SortKey) {
    setSort(previous => ({ key, direction: previous.key === key && previous.direction === 'ascending' ? 'descending' : 'ascending' }));
    setPage(1);
  }
  const direction = (key: SortKey) => (sort.key === key ? sort.direction : undefined);

  function toggle(id: string, on: boolean) {
    const next = new Set(selected);
    if (on) next.add(id); else next.delete(id);
    setSelected(next);
  }
  function togglePage(on: boolean) {
    const next = new Set(selected);
    for (const row of rows) if (on) next.add(row.id); else next.delete(row.id);
    setSelected(next);
  }

  function openProject(project: Project) {
    setDraft({ name: project.name, owner: project.owner, status: project.status, due: project.due, notes: project.notes });
    setEditing(project.id);
  }
  // A click anywhere on a row opens it, except on its checkbox.
  function onRowClick(event: MouseEvent<HTMLTableRowElement>, project: Project) {
    if ((event.target as Element).closest('[data-select], button, a, input, label')) return;
    openProject(project);
  }

  function save() {
    setItems(list => list.map(project => (project.id === editing ? { ...project, ...draft, name: draft.name.trim() || project.name } : project)));
    toasts.add({ title: 'Changes saved', description: `${draft.name.trim() || 'The project'} is up to date.`, kind: 'success' });
    setEditing(null);
  }

  function create(draft: Draft) {
    const project: Project = { ...draft, id: `p${Date.now()}`, progress: 0 };
    setItems(list => [project, ...list]);
    toasts.add({ title: 'Project created', description: `${project.name} is in the list.`, kind: 'success' });
  }

  return (
    <SidebarProvider {...stylex.props(s.app)}>
      <Sidebar label="Halden">
        <SidebarHeader logo={<span {...stylex.props(s.logo)}><Icon name="layers" size={16} /></span>} title="Halden" description="Studio workspace" />
        <SidebarContent>
          <SidebarSection>
            {nav.map(item => (
              <SidebarItem key={item.id} icon={item.icon} badge={item.badge} badgeLabel={item.badge ? `${item.badge} unread` : undefined} isCurrent={current === item.id} onPress={() => setCurrent(item.id)}>
                {item.label}
              </SidebarItem>
            ))}
          </SidebarSection>
          <SidebarSection label="Workspace">
            {workspaceNav.map(item => (
              <SidebarItem key={item.id} icon={item.icon} isCurrent={current === item.id} onPress={() => setCurrent(item.id)}>{item.label}</SidebarItem>
            ))}
          </SidebarSection>
        </SidebarContent>
        <SidebarFooter>
          <SidebarCollapseButton />
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <div {...stylex.props(s.page)}>
          <header {...stylex.props(s.header)}>
            <div {...stylex.props(s.heading)}>
              <SidebarTrigger />
              <div {...stylex.props(s.titles)}>
                <h1 {...stylex.props(s.title)}>Projects</h1>
                <p {...stylex.props(s.subtitle)}>{items.length} projects across the studio</p>
              </div>
            </div>
            <Dialog
              trigger={<Button leadingIcon={<Icon name="plus" />}>New project</Button>}
              title="New project"
              description="Give it a name and an owner. You can change everything later."
            >
              {close => <NewProjectForm onCreate={create} close={close} />}
            </Dialog>
          </header>

          <div {...stylex.props(s.filters)}>
            <InputGroup {...stylex.props(s.search)}>
              <InputGroupAddon><Icon name="search" /></InputGroupAddon>
              <Input type="search" aria-label="Search projects" placeholder="Search projects or people" value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} />
            </InputGroup>
            <div {...stylex.props(s.status)}>
              <Select label="Status" hideLabel appearance="field" options={statusOptions} value={status} onChange={value => { setStatus(value ?? 'all'); setPage(1); }} />
            </div>
            <SegmentedControl
              label="View"
              value={view}
              onChange={setView}
              options={[
                { value: 'table', label: 'Table', icon: <Icon name="list" size={16} />, hideLabel: true },
                { value: 'board', label: 'Board', icon: <Icon name="grid" size={16} />, hideLabel: true },
              ]}
            />
          </div>

          {view === 'table' ? (
            <Card>
              <div {...stylex.props(s.tableBar)}>
                <span {...stylex.props(s.count)} aria-live="polite">
                  {selected.size > 0 ? `${selected.size} selected` : `${visible.length} ${visible.length === 1 ? 'project' : 'projects'}`}
                </span>
                {selected.size > 0 && <Button appearance="text" size="sm" onClick={() => setSelected(new Set())}>Clear selection</Button>}
              </div>
              <Table aria-label="Projects" variant="plain">
                <TableHead>
                  <TableRow>
                    <TableColumnHeader {...stylex.props(s.checkColumn)}>
                      <Checkbox aria-label="Select all projects on this page" isSelected={allOnPage} isIndeterminate={someOnPage && !allOnPage} onChange={togglePage} />
                    </TableColumnHeader>
                    <TableColumnHeader sortDirection={direction('name')} onSort={() => sortBy('name')}>Name</TableColumnHeader>
                    <TableColumnHeader>Owner</TableColumnHeader>
                    <TableColumnHeader>Status</TableColumnHeader>
                    <TableColumnHeader sortDirection={direction('due')} onSort={() => sortBy('due')}>Due</TableColumnHeader>
                    <TableColumnHeader alignEnd sortDirection={direction('progress')} onSort={() => sortBy('progress')}>Progress</TableColumnHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map(project => (
                    <TableRow key={project.id} isSelected={selected.has(project.id)} onClick={event => onRowClick(event, project)} {...stylex.props(s.row)}>
                      <TableCell data-select>
                        <Checkbox aria-label={`Select ${project.name}`} isSelected={selected.has(project.id)} onChange={on => toggle(project.id, on)} />
                      </TableCell>
                      <TableCell>
                        {/* os-allow native-control: a row title that opens the project; the system has no Link component yet */}
                        <button type="button" {...stylex.props(s.nameButton)} onClick={() => openProject(project)}>{project.name}</button>
                      </TableCell>
                      <TableCell wrap="nowrap"><span {...stylex.props(s.person)}><Avatar name={project.owner} size="xs" decorative />{project.owner}</span></TableCell>
                      <TableCell wrap="nowrap"><Badge variant={statusVariant[project.status]} size="sm">{statusName[project.status]}</Badge></TableCell>
                      <TableCell wrap="nowrap"><span {...stylex.props(s.number)}>{formatDate(project.due)}</span></TableCell>
                      <TableCell alignEnd wrap="nowrap">
                        <span {...stylex.props(s.progress)}>
                          <Progress label={`${project.name} progress`} showLabel={false} value={project.progress} size="sm" {...stylex.props(s.progressBar)} />
                          <span {...stylex.props(s.number, s.percent)}>{project.progress}%</span>
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}><span {...stylex.props(s.empty)}>No projects match these filters.</span></TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div {...stylex.props(s.pager)}>
                <span {...stylex.props(s.count)}>
                  {visible.length === 0 ? 'Nothing to show' : `${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, visible.length)} of ${visible.length}`}
                </span>
                <Pagination totalPages={totalPages} page={currentPage} onPageChange={setPage} size="sm" />
              </div>
            </Card>
          ) : (
            <div {...stylex.props(s.board)}>
              {statuses.map(column => {
                const cards = visible.filter(project => project.status === column.id);
                return (
                  <section key={column.id} aria-label={column.label} {...stylex.props(s.column)}>
                    <div {...stylex.props(s.columnHead)}>
                      <span>{column.label}</span>
                      <Badge variant="neutral" size="sm">{cards.length}</Badge>
                    </div>
                    {cards.map(project => (
                      <Card key={project.id} size="sm">
                        <div {...stylex.props(s.boardCard)}>
                          {/* os-allow native-control: a row title that opens the project; the system has no Link component yet */}
                          <button type="button" {...stylex.props(s.nameButton)} onClick={() => openProject(project)}>{project.name}</button>
                          <Progress label={`${project.name} progress`} showLabel={false} value={project.progress} size="sm" />
                          <div {...stylex.props(s.boardMeta)}>
                            <span {...stylex.props(s.person)}><Avatar name={project.owner} size="xs" decorative />{project.owner}</span>
                            <span {...stylex.props(s.number)}>{formatDate(project.due)}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                    {cards.length === 0 && <p {...stylex.props(s.empty)}>Nothing here.</p>}
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </SidebarInset>

      <Sheet
        isOpen={editing !== null}
        onOpenChange={open => { if (!open) setEditing(null); }}
        edge="right"
        title="Edit project"
        description="Changes apply when you save."
        footer={close => (
          <div {...stylex.props(s.actions)}>
            <Button appearance="secondary" onClick={close}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </div>
        )}
      >
        <div {...stylex.props(s.form)}>
          <Field label="Name">
            <Input value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} />
          </Field>
          <Field label="Status">
            <Select options={statuses} value={draft.status} onChange={value => value && setDraft({ ...draft, status: value as Status })} />
          </Field>
          <Field label="Owner">
            <Select options={ownerOptions} value={draft.owner} onChange={value => value && setDraft({ ...draft, owner: value })} />
          </Field>
          <Field label="Due date">
            <Input type="date" value={draft.due} onChange={event => setDraft({ ...draft, due: event.target.value })} />
          </Field>
          <Field label="Notes">
            <Textarea minRows={4} value={draft.notes} onChange={event => setDraft({ ...draft, notes: event.target.value })} />
          </Field>
        </div>
      </Sheet>

      <ToastRegion queue={toasts} />
    </SidebarProvider>
  );
}

/** The New project form. It keeps its own state, so the dialog starts empty each time it opens. */
function NewProjectForm({ onCreate, close }: { onCreate: (draft: Draft) => void; close: () => void }) {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [tried, setTried] = useState(false);
  const missing = tried && !draft.name.trim();

  function submit(event: FormEvent) {
    event.preventDefault();
    setTried(true);
    if (!draft.name.trim()) return;
    onCreate({ ...draft, name: draft.name.trim() });
    close();
  }

  return (
    <form {...stylex.props(s.form)} onSubmit={submit} noValidate>
      <Field label="Name" isRequired errorMessage={missing ? 'Enter a name for the project.' : undefined}>
        {/* Uncontrolled on purpose: a required Field updates its own state on the native input event,
            before React's onChange runs, and that re-render resets a controlled value. */}
        <Input autoFocus defaultValue="" onChange={event => setDraft({ ...draft, name: event.target.value })} placeholder="Spring campaign" />
      </Field>
      <div {...stylex.props(s.pair)}>
        <Field label="Owner">
          <Select options={ownerOptions} value={draft.owner} onChange={value => value && setDraft({ ...draft, owner: value })} />
        </Field>
        <Field label="Status">
          <Select options={statuses} value={draft.status} onChange={value => value && setDraft({ ...draft, status: value as Status })} />
        </Field>
      </div>
      <Field label="Description" isOptional>
        <Textarea minRows={3} value={draft.notes} onChange={event => setDraft({ ...draft, notes: event.target.value })} />
      </Field>
      <div {...stylex.props(s.actions)}>
        <Button type="button" appearance="secondary" onClick={close}>Cancel</Button>
        <Button type="submit">Create project</Button>
      </div>
    </form>
  );
}

const s = stylex.create({
  app: { backgroundColor: t['--os-color-bg-subtle'], color: t['--os-color-fg-base'], fontFamily: t['--os-font-family'] },
  logo: {
    display: 'grid', placeItems: 'center', width: t['--os-size-sm'], height: t['--os-size-sm'], borderRadius: t['--os-radius-md'],
    backgroundColor: t['--os-color-accent-moderate'], color: t['--os-color-accent-on-accent'],
  },
  page: {
    display: 'grid', gap: t['--os-space-4'], alignContent: 'start', boxSizing: 'border-box', width: '100%', maxWidth: 1200, marginInline: 'auto',
    paddingInline: { default: t['--os-space-6'], [phone]: t['--os-space-4'] }, paddingBlock: { default: t['--os-space-6'], [phone]: t['--os-space-4'] },
  },
  header: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: t['--os-space-4'], paddingBlockEnd: t['--os-space-2'] },
  heading: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'], minWidth: 0 },
  titles: { display: 'grid', gap: t['--os-space-0-5'], minWidth: 0 },
  title: {
    margin: 0, fontSize: t['--os-font-size-lg'], lineHeight: t['--os-line-height-lg'], fontWeight: t['--os-font-weight-medium'],
    letterSpacing: t['--os-tracking-tight'],
  },
  subtitle: { margin: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], letterSpacing: t['--os-tracking-tight'], lineHeight: t['--os-line-height-sm'] },
  filters: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: t['--os-space-2'] },
  search: { flexGrow: 1, flexBasis: 240, minWidth: 0, maxWidth: { default: 360, [phone]: 'none' } },
  status: { width: { default: 180, [phone]: 'auto' }, flexGrow: { default: 0, [phone]: 1 } },
  tableBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: t['--os-space-2'], minHeight: 32, paddingBlockEnd: t['--os-space-2'] },
  count: { color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], letterSpacing: t['--os-tracking-tight'], lineHeight: t['--os-line-height-sm'], fontVariantNumeric: 'tabular-nums' },
  checkColumn: { width: 48 },
  row: { cursor: 'pointer' },
  nameButton: {
    padding: 0, margin: 0, borderWidth: 0, backgroundColor: 'transparent', color: t['--os-color-fg-base'], cursor: 'pointer',
    fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit', fontWeight: t['--os-font-weight-medium'], textAlign: 'start',
    borderRadius: t['--os-radius-xs'],
    textDecorationLine: { default: 'none', ':hover': 'underline' }, textUnderlineOffset: 3,
    outlineStyle: 'none', boxShadow: { default: 'none', ':focus-visible': t['--os-focus-shadow'] },
  },
  person: { display: 'inline-flex', alignItems: 'center', gap: t['--os-space-2'] },
  number: { fontVariantNumeric: 'tabular-nums' },
  progress: { display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: t['--os-space-3'] },
  progressBar: { width: 64 },
  percent: { minWidth: 40, textAlign: 'end' },
  empty: { margin: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], letterSpacing: t['--os-tracking-tight'], lineHeight: t['--os-line-height-sm'] },
  pager: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: t['--os-space-2'], paddingBlockStart: t['--os-space-4'] },
  board: {
    display: 'grid', gap: t['--os-space-4'], alignItems: 'start',
    gridTemplateColumns: { default: 'repeat(4, minmax(0, 1fr))', [narrow]: 'repeat(2, minmax(0, 1fr))', [phone]: 'minmax(0, 1fr)' },
  },
  column: { display: 'grid', gap: t['--os-space-2'], minWidth: 0 },
  columnHead: {
    display: 'flex', alignItems: 'center', gap: t['--os-space-2'], minHeight: 32, paddingInline: t['--os-space-1'],
    fontSize: t['--os-font-size-caption'], letterSpacing: t['--os-tracking-tight'], lineHeight: t['--os-line-height-sm'], fontWeight: t['--os-font-weight-medium'], color: t['--os-color-fg-muted'],
  },
  boardCard: { display: 'grid', gap: t['--os-space-3'], fontSize: t['--os-font-size-caption'], letterSpacing: t['--os-tracking-tight'], lineHeight: t['--os-line-height-sm'] },
  boardMeta: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: t['--os-space-2'], color: t['--os-color-fg-muted'] },
  form: { display: 'grid', gap: t['--os-space-4'] },
  pair: { display: 'grid', gap: t['--os-space-4'], alignItems: 'start', gridTemplateColumns: { default: 'repeat(2, minmax(0, 1fr))', [phone]: 'minmax(0, 1fr)' } },
  actions: { display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: t['--os-space-2'], paddingBlockStart: t['--os-space-2'] },
});
