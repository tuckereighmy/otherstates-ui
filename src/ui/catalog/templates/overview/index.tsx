'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import {
  Avatar, Badge, Button, Card, CardPanel, Icon, Input, InputGroup, InputGroupAddon, LineChart, Menu, MenuItem, MenuSeparator,
  Meter, Progress, SegmentedControl, Sidebar, SidebarCollapseButton, SidebarContent, SidebarFooter, SidebarHeader,
  SidebarInset, SidebarItem, SidebarProvider, SidebarSection, SidebarTrigger,
  Sparkline, Table, TableBody, TableCell, TableColumnHeader, TableHead, TableRow,
} from '../../../components';
import { tokens as t } from '../../../tokens.stylex';
import { activity, goals, kpis, nav, ranges, seats, statusLabel, throughput, workspaceNav, type ActivityStatus, type Kpi, type RangeId } from './data';

// An analytics dashboard. Layout is StyleX on the tokens; every control is a library component.

const phone = '@media (max-width: 767px)';
const narrow = '@media (max-width: 1023px)';
const tiny = '@media (max-width: 519px)';

const statusVariant: Record<ActivityStatus, 'success' | 'info' | 'warning' | 'error'> = {
  done: 'success',
  active: 'info',
  review: 'warning',
  blocked: 'error',
};

export default function AnalyticsTemplate() {
  const [current, setCurrent] = useState('overview');
  const [range, setRange] = useState<RangeId>('30d');
  const chart = throughput[range];

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
                <h1 {...stylex.props(s.title)}>Overview</h1>
                <p {...stylex.props(s.subtitle)}>How the studio is moving, across every project.</p>
              </div>
            </div>
            <div {...stylex.props(s.tools)}>
              <SegmentedControl label="Date range" options={ranges} value={range} onChange={value => setRange(value as RangeId)} />
              <InputGroup {...stylex.props(s.search)}>
                <InputGroupAddon><Icon name="search" /></InputGroupAddon>
                <Input type="search" aria-label="Search" placeholder="Search" />
              </InputGroup>
              <Menu
                aria-label="Account"
                placement="bottom end"
                trigger={<Button appearance="text" iconOnly aria-label="Account menu"><Avatar name="Mira" size="sm" decorative /></Button>}
              >
                <MenuItem icon={<Icon name="user" />}>Profile</MenuItem>
                <MenuItem icon={<Icon name="settings" />}>Preferences</MenuItem>
                <MenuItem icon={<Icon name="keyboard" />} shortcut="?">Shortcuts</MenuItem>
                <MenuSeparator />
                <MenuItem icon={<Icon name="log-out" />}>Sign out</MenuItem>
              </Menu>
            </div>
          </header>

          <section aria-label="Key numbers" {...stylex.props(s.kpis)}>
            {kpis.map(kpi => <KpiCard key={kpi.id} kpi={kpi} range={range} />)}
          </section>

          <div {...stylex.props(s.split)}>
            <Card heading="Tasks completed" description={range === '7d' ? 'Per day, last 7 days' : range === '30d' ? 'Per day, last 30 days' : 'Per week, last 90 days'}>
              <LineChart
                aria-label="Tasks completed"
                area
                labels={chart.labels}
                series={[
                  { id: 'current', label: 'This period', values: chart.values },
                  { id: 'previous', label: 'Previous period', values: chart.previous, muted: true },
                ]}
              />
            </Card>
            <Card heading="Quarter goals" description="Q4 targets for the studio">
              <div {...stylex.props(s.goals)}>
                {goals.map(goal => (
                  <Progress key={goal.id} label={goal.label} showLabel value={goal.value} maxValue={goal.target} showValue valueLabel={`${goal.value} of ${goal.target}`} />
                ))}
                <Meter label="Seats in use" value={seats.used} maxValue={seats.total} valueLabel={`${seats.used} of ${seats.total}`} tone={seats.used / seats.total > 0.9 ? 'warning' : 'accent'} />
              </div>
            </Card>
          </div>

          <Card heading="Recent activity" description="The latest changes across projects" action={<Button appearance="text" size="sm">View all</Button>}>
            <CardPanel>
              <Table aria-label="Recent activity" variant="plain">
                <TableHead>
                  <TableRow>
                    <TableColumnHeader>Member</TableColumnHeader>
                    <TableColumnHeader>Update</TableColumnHeader>
                    <TableColumnHeader>Project</TableColumnHeader>
                    <TableColumnHeader>Status</TableColumnHeader>
                    <TableColumnHeader alignEnd>When</TableColumnHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activity.map(item => (
                    <TableRow key={item.id}>
                      <TableCell wrap="nowrap">
                        <span {...stylex.props(s.person)}><Avatar name={item.person} size="xs" decorative />{item.person}</span>
                      </TableCell>
                      <TableCell>{item.action}</TableCell>
                      <TableCell wrap="nowrap">{item.project}</TableCell>
                      <TableCell wrap="nowrap"><Badge variant={statusVariant[item.status]} size="sm">{statusLabel[item.status]}</Badge></TableCell>
                      <TableCell alignEnd wrap="nowrap"><span {...stylex.props(s.muted)}>{item.when}</span></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardPanel>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function KpiCard({ kpi, range }: { kpi: Kpi; range: RangeId }) {
  const { value, delta, points } = kpi.byRange[range];
  const good = kpi.lowerIsBetter ? delta <= 0 : delta >= 0;
  return (
    <Card>
      <div {...stylex.props(s.kpi)}>
        <div {...stylex.props(s.kpiTop)}>
          <span {...stylex.props(s.kpiLabel)}>{kpi.label}</span>
          <Badge variant={good ? 'success' : 'error'} size="sm">{delta > 0 ? '+' : ''}{delta.toFixed(1)}%</Badge>
        </div>
        <span {...stylex.props(s.kpiValue)}>{value}</span>
        <Sparkline values={points} />
      </div>
    </Card>
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
  tools: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: t['--os-space-2'], minWidth: 0, flexGrow: { default: 0, [phone]: 1 } },
  search: { width: { default: 220, [phone]: 'auto' }, flexGrow: { default: 0, [phone]: 1 }, flexBasis: { default: 'auto', [phone]: 140 }, minWidth: 0 },
  kpis: {
    display: 'grid', gap: t['--os-space-4'],
    gridTemplateColumns: { default: 'repeat(4, minmax(0, 1fr))', [narrow]: 'repeat(2, minmax(0, 1fr))', [tiny]: 'minmax(0, 1fr)' },
  },
  kpi: { display: 'grid', gap: t['--os-space-2'] },
  kpiTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: t['--os-space-2'], minWidth: 0 },
  kpiLabel: { color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], letterSpacing: t['--os-tracking-tight'], lineHeight: t['--os-line-height-sm'], fontWeight: t['--os-font-weight-medium'] },
  kpiValue: {
    fontSize: t['--os-font-size-xl'], lineHeight: t['--os-line-height-lg'], fontWeight: t['--os-font-weight-semibold'],
    letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
  },
  split: { display: 'grid', gap: t['--os-space-4'], gridTemplateColumns: { default: 'minmax(0, 2fr) minmax(0, 1fr)', [narrow]: 'minmax(0, 1fr)' } },
  goals: { display: 'grid', gap: t['--os-space-4'] },
  person: { display: 'inline-flex', alignItems: 'center', gap: t['--os-space-2'] },
  muted: { color: t['--os-color-fg-muted'], fontVariantNumeric: 'tabular-nums' },
});
