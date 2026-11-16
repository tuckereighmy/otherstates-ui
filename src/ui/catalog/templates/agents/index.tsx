'use client';

import * as stylex from '@stylexjs/stylex';
import { Fragment, useEffect, useRef, useState, type RefObject } from 'react';
import {
  AgentIdentity, Button, Card, CardPanel, ChangeReview, DecisionCard, HandoffList, Icon, RunTimeline, SegmentedControl, Sheet, Sidebar,
  SidebarCollapseButton, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarItem, SidebarProvider, SidebarSection,
  SidebarTrigger, Stat, StatusBadge, Table, TableBody, TableCell, TableColumnHeader, TableHead, TableRow, ToastRegion, UsageBar,
  createToastQueue, formatCost, formatDuration, formatWait, type AgentState, type Change, type Handoff, type IconName, type TimelineSpan,
} from '../../../components';
import { tokens as t } from '../../../tokens.stylex';
import {
  agents, budget, earlierSpend, finishedEarlier, finishedTrend, initialRuns, nav, prChanges, pricingOptions, workspaceNav,
  type AgentKey, type Run, type RunStatus,
} from './data';

// An agent dashboard: what is waiting on you, what is running, where each run's time and money went. Every
// part is a library component; time moves once a second, so steps finish, runs reach you and wait, and spend
// grows, as on a real workspace.

const phone = '@media (max-width: 767px)';
const narrow = '@media (max-width: 1023px)';
const tiny = '@media (max-width: 519px)';

type Filter = 'all' | 'active' | 'failed' | 'done';
const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'failed', label: 'Failed' },
  { value: 'done', label: 'Done' },
];
const inFilter: Record<Filter, RunStatus[]> = {
  all: ['running', 'needs-input', 'queued', 'failed', 'done', 'canceled'],
  active: ['running', 'needs-input', 'queued'],
  failed: ['failed'],
  done: ['done', 'canceled'],
};
const stateOf: Record<RunStatus, AgentState> = {
  running: 'running', 'needs-input': 'needs-input', queued: 'queued', done: 'done', failed: 'failed', canceled: 'canceled',
};

/** The run's steps as timeline spans, at its current moment. */
function spansFor(run: Run): TimelineSpan[] {
  const out: TimelineSpan[] = [];
  const starts: Record<string, number> = {};
  let at = 0;
  for (const step of run.plan) {
    const start = step.startsWith ? starts[step.startsWith] ?? at : at;
    starts[step.id] = start;
    if (step.wait) {
      if (step.waited !== undefined) {
        out.push({ id: step.id, label: step.decided ?? step.label, start, duration: step.waited, state: step.declined ? 'canceled' : 'done', waiting: true, detail: step.wait.subject });
        at = start + step.waited;
        if (step.declined) break;
        continue;
      }
      if (run.status === 'needs-input') out.push({ id: step.id, label: step.label, start, state: 'needs-input', waiting: true, detail: step.wait.subject });
      break;
    }
    const end = start + step.duration;
    at = Math.max(at, end);
    if (start > run.elapsed || (start === run.elapsed && run.status !== 'running')) continue;
    const part = Math.min(1, (run.elapsed - start) / (step.duration || 1));
    const base = { id: step.id, label: step.label, tool: step.tool, start, depth: step.depth, detail: step.failed ?? step.detail };
    const whole = { tokens: step.tokens, cost: step.cost };
    const some = { tokens: Math.round((step.tokens ?? 0) * part), cost: (step.cost ?? 0) * part };
    if (step.failed) out.push({ ...base, ...whole, duration: step.duration, state: 'failed' });
    else if (run.elapsed >= end) out.push({ ...base, ...whole, duration: step.duration, state: 'done' });
    else if (run.status === 'running') out.push({ ...base, ...some, state: 'running' });
    else out.push({ ...base, ...some, duration: run.elapsed - start, state: 'canceled' });
  }
  return out;
}

/** One second later. */
function advance(run: Run): Run {
  if (run.status === 'needs-input') return { ...run, elapsed: run.elapsed + 1000 };
  if (run.status !== 'running') return run;
  const elapsed = run.elapsed + 1000;
  const starts: Record<string, number> = {};
  let at = 0;
  for (const [index, step] of run.plan.entries()) {
    const start = step.startsWith ? starts[step.startsWith] ?? at : at;
    starts[step.id] = start;
    if (step.wait) {
      if (step.waited !== undefined) { at = start + step.waited; continue; }
      if (elapsed >= start) return { ...run, elapsed, status: 'needs-input' };
      return { ...run, elapsed };
    }
    const end = start + step.duration;
    if (step.fails && !step.failed && elapsed >= end) {
      const plan = run.plan.map((item, i) => (i === index ? { ...item, failed: item.fails, fails: undefined } : item));
      return { ...run, plan, elapsed: end, status: 'failed' };
    }
    at = Math.max(at, end);
  }
  return elapsed >= at ? { ...run, elapsed: at, status: 'done' } : { ...run, elapsed };
}

const costOf = (run: Run) => spansFor(run).reduce((sum, span) => sum + (span.cost ?? 0), 0);
const waitStep = (run: Run) => run.plan.find(step => step.wait && step.waited === undefined);
const waitStart = (run: Run) => spansFor(run).find(span => span.state === 'needs-input')?.start ?? run.elapsed;

function nowLine(run: Run) {
  const spans = spansFor(run);
  if (run.status === 'running') return spans.filter(span => span.state === 'running').map(span => span.label).join(', ') || 'Starting';
  if (run.status === 'needs-input') return `Waiting on you: ${waitStep(run)?.wait?.kind ?? 'a decision'}`;
  if (run.status === 'queued') return `Starts when ${agents[run.agent].name} is free`;
  if (run.status === 'failed') return spans.find(span => span.state === 'failed')?.label ?? 'Failed';
  return run.result ?? '';
}

export default function AgentDashboardTemplate() {
  const [current, setCurrent] = useState('overview');
  const [runs, setRuns] = useState<Run[]>(initialRuns);
  const [filter, setFilter] = useState<Filter>('all');
  const [expanded, setExpanded] = useState<string | null>('checkout');
  const [recent, setRecent] = useState<Record<string, Handoff>>({});
  const [opened, setOpened] = useState<string | null>(null);
  const [changes, setChanges] = useState<Change[]>(prChanges);
  const [toasts] = useState(() => createToastQueue());
  const waitingRef = useRef<HTMLElement>(null);
  const runsRef = useRef<HTMLElement>(null);
  const spendRef = useRef<HTMLElement>(null);
  const before = useRef<Record<string, RunStatus>>(Object.fromEntries(initialRuns.map(run => [run.id, run.status])));
  const timers = useRef<number[]>([]);

  // Time moves once a second; a queued run starts when its agent has nothing else running.
  useEffect(() => {
    const id = window.setInterval(() => setRuns(all => {
      const next = all.map(advance);
      return next.map(run => run.status === 'queued' && !next.some(other => other.agent === run.agent && other.status === 'running')
        ? { ...run, status: 'running', started: 'Just now' } : run);
    }), 1000);
    return () => { window.clearInterval(id); timers.current.forEach(window.clearTimeout); };
  }, []);

  // Tell the person when a run finishes, fails or starts waiting on them.
  useEffect(() => {
    for (const run of runs) {
      const was = before.current[run.id];
      if (was === run.status) continue;
      before.current[run.id] = run.status;
      const who = agents[run.agent].name;
      if (run.status === 'done') toasts.add({ title: `${run.title}: done`, description: run.result, kind: 'success' });
      if (run.status === 'failed') toasts.add({ title: `${run.title} failed`, description: spansFor(run).find(span => span.state === 'failed')?.detail as string, kind: 'error' });
      if (run.status === 'needs-input' && was === 'running') toasts.add({ title: `${who} is waiting on you`, description: waitStep(run)?.wait?.title, kind: 'warning' });
    }
  }, [runs, toasts]);

  const later = (ms: number, run: () => void) => { timers.current.push(window.setTimeout(run, ms)); };
  const update = (id: string, change: (run: Run) => Run) => setRuns(all => all.map(run => (run.id === id ? change(run) : run)));

  // Decides the step a run is waiting on. The row keeps the outcome for a moment, then leaves the list.
  function decide(id: string, decided: string, outcome: string, declined = false) {
    const run = runs.find(item => item.id === id);
    const step = run && waitStep(run);
    if (!run || !step?.wait) return;
    const handoff = handoffOf(run);
    setRecent(all => ({ ...all, [id]: { ...handoff, outcome } }));
    later(1800, () => setRecent(all => { const next = { ...all }; delete next[id]; return next; }));
    update(id, item => ({
      ...item,
      status: declined ? 'canceled' : 'running',
      result: declined ? 'Denied by you. Nothing ran.' : item.result,
      plan: item.plan.map(entry => (entry === step || entry.id === step.id ? { ...entry, waited: item.elapsed - waitStart(item), decided, declined } : entry)),
    }));
  }

  function handoffOf(run: Run): Handoff {
    const wait = waitStep(run)?.wait;
    return {
      id: run.id, agent: agents[run.agent], kind: wait?.kind ?? 'blocked', title: wait?.title ?? run.title, subject: wait?.subject,
      waited: run.elapsed - waitStart(run), risk: wait?.risk,
    };
  }

  const stop = (id: string) => update(id, run => ({ ...run, status: 'canceled', result: 'Stopped by you' }));
  const retry = (id: string) => update(id, run => {
    const at = run.plan.findIndex(step => step.failed);
    const failed = run.plan[at];
    if (!failed?.retryAs) return run;
    const again = { id: `${failed.id}-again`, tool: failed.tool, ...failed.retryAs };
    return { ...run, status: 'running', plan: [...run.plan.slice(0, at + 1), again, ...run.plan.slice(at + 1)] };
  });

  const pending = runs.filter(run => run.status === 'needs-input' && !recent[run.id]).map(handoffOf);
  const handoffs = [...pending, ...Object.values(recent)];
  const longest = Math.max(0, ...pending.map(item => item.waited));
  const running = runs.filter(run => run.status === 'running').length;
  const queued = runs.filter(run => run.status === 'queued').length;
  const finished = finishedEarlier + runs.filter(run => run.status === 'done').length;
  const failedCount = runs.filter(run => run.status === 'failed').length;
  const byAgent = (Object.keys(agents) as AgentKey[]).map(key => ({
    key, value: earlierSpend[key] + runs.filter(run => run.agent === key).reduce((sum, run) => sum + costOf(run), 0),
  }));
  const spend = byAgent.reduce((sum, item) => sum + item.value, 0);
  const shown = runs.filter(run => inFilter[filter].includes(run.status));
  const openRun = runs.find(run => run.id === opened);
  const openWait = openRun && waitStep(openRun)?.wait;
  const jump = (ref: RefObject<HTMLElement | null>) => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <SidebarProvider {...stylex.props(s.app)}>
      <Sidebar label="Halden">
        <SidebarHeader logo={<span {...stylex.props(s.logo)}><Icon name="sparkle" size={16} /></span>} title="Halden" description="Agent workspace" />
        <SidebarContent>
          <SidebarSection>
            {nav.map(item => (
              <SidebarItem key={item.id} icon={item.icon} isCurrent={current === item.id} onPress={() => setCurrent(item.id)}
                badge={item.id === 'overview' && pending.length ? pending.length : undefined}
                badgeLabel={item.id === 'overview' && pending.length ? `${pending.length} waiting on you` : undefined}>
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
        <SidebarFooter><SidebarCollapseButton /></SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <div {...stylex.props(s.page)}>
          <header {...stylex.props(s.header)}>
            <div {...stylex.props(s.heading)}>
              <SidebarTrigger />
              <div {...stylex.props(s.titles)}>
                <h1 {...stylex.props(s.title)}>Agents</h1>
                <p {...stylex.props(s.subtitle)}>What your agents are doing today, and what they need from you.</p>
              </div>
            </div>
            <Button leadingIcon={<Icon name="plus" />}>New task</Button>
          </header>

          <section aria-label="Today in numbers" {...stylex.props(s.stats)}>
            <Stat
              label="Waiting on you" value={String(pending.length)} unit={pending.length === 1 ? 'decision' : 'decisions'}
              tone={pending.length ? 'warning' : 'neutral'} caption={pending.length ? `Longest wait ${formatWait(longest)}` : 'Nothing waiting'}
              onPress={() => jump(waitingRef)}
            />
            <Stat
              label="Running" value={String(running)} unit={running === 1 ? 'run' : 'runs'}
              caption={queued ? `${queued} queued` : 'Nothing queued'} onPress={() => { setFilter('active'); jump(runsRef); }}
            />
            <Stat
              label="Finished today" value={String(finished)} change={{ label: '12%', direction: 'up', against: 'than yesterday' }}
              trend={[...finishedTrend.slice(1), finished]} trendLabel={`Runs finished each day for 12 days, ${finished} today`}
              caption={failedCount ? `${failedCount} failed` : undefined} onPress={() => { setFilter('done'); jump(runsRef); }}
            />
            <Stat
              label="Spend today" value={formatCost(spend)} unit={`of ${formatCost(budget)}`} limit={{ value: spend, max: budget }}
              caption="Resets at midnight" onPress={() => jump(spendRef)}
            />
          </section>

          <div {...stylex.props(s.split)}>
            <Card ref={waitingRef} heading="Waiting on you" description="Runs stand still until you decide. Longest wait first." {...stylex.props(s.anchor)}>
              <HandoffList
                label="Waiting on you"
                items={handoffs}
                onApprove={id => decide(id, 'Approved by you', id === 'refund' ? 'Approved. Support is sending the refund.' : 'Approved. Coder is deploying.')}
                onDeny={id => decide(id, 'Denied by you', 'Denied. Nothing ran.', true)}
                onOpen={setOpened}
              />
            </Card>
            <Card ref={spendRef} heading="Spend by agent" description={`Today, against the ${formatCost(budget)} daily budget`} {...stylex.props(s.anchor)}>
              <UsageBar
                label="Spend today"
                hideLabel
                segments={byAgent.map(item => ({ id: item.key, label: agents[item.key].name, value: item.value, color: agents[item.key].color }))}
                max={budget}
                format={formatCost}
                restLabel="Left today"
                size="lg"
              />
            </Card>
          </div>

          <Card
            ref={runsRef}
            heading="Runs"
            description="Today. Open a run to see where its time and money went."
            action={<SegmentedControl label="Show" size="xs" options={filters} value={filter} onChange={value => setFilter(value as Filter)} />}
            {...stylex.props(s.anchor)}
          >
            <CardPanel>
              <Table aria-label="Runs" variant="plain">
                <TableHead>
                  <TableRow>
                    <TableColumnHeader>Run</TableColumnHeader>
                    <TableColumnHeader {...stylex.props(s.wide)}>Status</TableColumnHeader>
                    <TableColumnHeader {...stylex.props(s.wide)}>Now</TableColumnHeader>
                    <TableColumnHeader alignEnd>Time</TableColumnHeader>
                    <TableColumnHeader alignEnd {...stylex.props(s.wide)}>Cost</TableColumnHeader>
                    <TableColumnHeader alignEnd><span {...stylex.props(s.srOnly)}>Actions</span></TableColumnHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shown.map(run => {
                    const open = expanded === run.id;
                    const spans = spansFor(run);
                    return (
                      <Fragment key={run.id}>
                        <TableRow isSelected={open}>
                          <TableCell>
                            {/* os-allow native-control: a disclosure that spans the run's title and its agent, two lines Button's label does not hold */}
                            <button type="button" aria-expanded={open} aria-controls={`trace-${run.id}`} onClick={() => setExpanded(open ? null : run.id)} {...stylex.props(s.disclose)}>
                              <span aria-hidden {...stylex.props(s.chevron, open && s.chevronOpen)}><Icon name="chevron-right" size={14} /></span>
                              <span {...stylex.props(s.runText)}>
                                <span {...stylex.props(s.runTitle)}>{run.title}</span>
                                <AgentIdentity size="sm" name={agents[run.agent].name} icon={agents[run.agent].icon} color={agents[run.agent].color} {...stylex.props(s.runAgent)} />
                                <span {...stylex.props(s.phoneOnly)}><StatusBadge state={stateOf[run.status]} appearance="text">{run.status === 'canceled' ? 'Stopped' : undefined}</StatusBadge></span>
                              </span>
                            </button>
                          </TableCell>
                          <TableCell wrap="nowrap" {...stylex.props(s.wide)}><StatusBadge state={stateOf[run.status]}>{run.status === 'canceled' ? 'Stopped' : undefined}</StatusBadge></TableCell>
                          <TableCell wrap="truncate" {...stylex.props(s.wide)}>
                            <span {...stylex.props(run.status === 'failed' ? s.error : s.muted)}>{nowLine(run)}</span>
                          </TableCell>
                          <TableCell alignEnd wrap="nowrap"><span {...stylex.props(s.figure)}>{run.status === 'queued' ? '—' : formatDuration(run.elapsed)}</span></TableCell>
                          <TableCell alignEnd wrap="nowrap" {...stylex.props(s.wide)}><span {...stylex.props(s.figure)}>{run.status === 'queued' ? '—' : formatCost(costOf(run))}</span></TableCell>
                          <TableCell alignEnd wrap="nowrap">
                            {run.status === 'running' && <RowAction label="Stop" icon="stop" title={run.title} onPress={() => stop(run.id)} />}
                            {run.status === 'failed' && <RowAction label="Retry" icon="refresh" title={run.title} onPress={() => retry(run.id)} />}
                          </TableCell>
                        </TableRow>
                        {open && (
                          <TableRow>
                            <TableCell colSpan={6} {...stylex.props(s.traceCell)}>
                              <div id={`trace-${run.id}`} {...stylex.props(s.trace)}>
                                {spans.length ? <RunTimeline key={run.id} label={`Steps of ${run.title}`} spans={spans} now={run.elapsed} />
                                  : <p {...stylex.props(s.muted)}>Nothing has run yet. {nowLine(run)}.</p>}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </CardPanel>
          </Card>
        </div>
      </SidebarInset>

      <Sheet
        isOpen={!!openRun && !!openWait}
        onOpenChange={open => { if (!open) setOpened(null); }}
        edge="right"
        size="lg"
        title={openRun ? openRun.title : ''}
        description={openRun ? `${agents[openRun.agent].name} has waited ${formatWait(openRun.elapsed - waitStart(openRun))}.` : undefined}
        showCloseButton
      >
        {close => openRun && openWait?.kind === 'question' ? (
          <DecisionCard
            variant="outline"
            agent={agents[openRun.agent]}
            question={openWait.title}
            context={openWait.subject}
            options={pricingOptions}
            onLater={close}
            onSubmit={([choice]) => {
              const label = pricingOptions.find(option => option.id === choice)?.label ?? choice;
              decide(openRun.id, `You chose ${label.toLowerCase()}`, `Answered: ${label}.`);
              close();
            }}
          />
        ) : openRun && openWait?.kind === 'review' ? (
          <div {...stylex.props(s.sheetBody)}>
            <ChangeReview
              variant="outline"
              title={openWait.title}
              changes={changes}
              onAccept={id => setChanges(all => all.map(change => (change.id === id ? { ...change, status: 'accepted' } : change)))}
              onReject={id => setChanges(all => all.map(change => (change.id === id ? { ...change, status: 'rejected' } : change)))}
              onAcceptAll={() => setChanges(all => all.map(change => (change.status === 'pending' ? { ...change, status: 'accepted' } : change)))}
              onUndo={id => setChanges(all => all.map(change => (change.id === id ? { ...change, status: 'pending' } : change)))}
            />
            <Button
              fullWidth
              isDisabled={changes.some(change => change.status === 'pending')}
              onClick={() => {
                const accepted = changes.filter(change => change.status === 'accepted').length;
                decide(openRun.id, 'Reviewed by you', `Sent: ${accepted} of ${changes.length} changes accepted.`);
                close();
              }}
            >
              Send review
            </Button>
          </div>
        ) : null}
      </Sheet>
      <ToastRegion queue={toasts} />
    </SidebarProvider>
  );
}

/** Stop or Retry: a labeled button, an icon button on phones. */
function RowAction({ label, icon, title, onPress }: { label: string; icon: IconName; title: string; onPress: () => void }) {
  return (
    <>
      <span {...stylex.props(s.notPhone)}>
        <Button size="xs" appearance="secondary" leadingIcon={<Icon name={icon} />} aria-label={`${label} ${title}`} onClick={onPress}>{label}</Button>
      </span>
      <span {...stylex.props(s.phoneOnly)}>
        <Button size="xs" appearance="secondary" iconOnly aria-label={`${label} ${title}`} onClick={onPress}><Icon name={icon} /></Button>
      </span>
    </>
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
  title: { margin: 0, fontSize: t['--os-font-size-lg'], lineHeight: t['--os-line-height-lg'], fontWeight: t['--os-font-weight-medium'], letterSpacing: t['--os-tracking-tight'] },
  subtitle: { margin: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'] },
  stats: {
    display: 'grid',
    gridTemplateColumns: { default: 'repeat(4, minmax(0, 1fr))', [narrow]: 'repeat(2, minmax(0, 1fr))' },
    gap: { default: t['--os-space-4'], [tiny]: t['--os-space-3'] },
  },
  split: { display: 'grid', gap: t['--os-space-4'], alignItems: 'start', gridTemplateColumns: { default: 'minmax(0, 3fr) minmax(0, 2fr)', [narrow]: 'minmax(0, 1fr)' } },
  anchor: { scrollMarginBlockStart: t['--os-space-6'] },
  wide: { display: { default: 'table-cell', [phone]: 'none' } },
  disclose: {
    display: 'flex', alignItems: 'center', gap: t['--os-space-2'], minWidth: 0, margin: 0, padding: 0, borderWidth: 0,
    backgroundColor: 'transparent', color: 'inherit', font: 'inherit', textAlign: 'start', cursor: 'pointer',
    outlineStyle: { default: 'none', ':focus-visible': 'solid' }, outlineWidth: 2, outlineOffset: 2, outlineColor: t['--os-color-focus-ring'], borderRadius: t['--os-radius-xs'],
  },
  chevron: { display: 'flex', flexShrink: 0, color: t['--os-color-fg-muted'], transitionProperty: 'transform', transitionDuration: t['--os-motion-hover'] },
  chevronOpen: { transform: 'rotate(90deg)' },
  runText: { display: 'grid', gap: t['--os-space-0-5'], minWidth: { default: 220, [phone]: 128 } },
  phoneOnly: { display: { default: 'none', [phone]: 'inline-flex' } },
  notPhone: { display: { default: 'inline-flex', [phone]: 'none' } },
  runTitle: { fontWeight: t['--os-font-weight-medium'] },
  runAgent: { color: t['--os-color-fg-muted'] },
  muted: { margin: 0, color: t['--os-color-fg-muted'] },
  error: { color: t['--os-color-fg-error'] },
  figure: { fontVariantNumeric: 'tabular-nums' },
  srOnly: {
    position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap',
  },
  traceCell: { paddingBlockStart: 0 },
  trace: { paddingBlock: t['--os-space-2'], paddingInlineStart: { default: t['--os-space-6'], [phone]: 0 } },
  sheetBody: { display: 'grid', gap: t['--os-space-4'] },
});
