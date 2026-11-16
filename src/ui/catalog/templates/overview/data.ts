import type { IconName } from '../../../components';

// Sample data for the analytics template. Every name, number and project is invented.

export type RangeId = '7d' | '30d' | '90d';

export const ranges: { value: RangeId; label: string }[] = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
];

export const nav: { id: string; label: string; icon: IconName; badge?: number }[] = [
  { id: 'overview', label: 'Overview', icon: 'home' },
  { id: 'inbox', label: 'Inbox', icon: 'inbox', badge: 4 },
  { id: 'projects', label: 'Projects', icon: 'folder' },
  { id: 'reports', label: 'Reports', icon: 'layers' },
];

export const workspaceNav: { id: string; label: string; icon: IconName }[] = [
  { id: 'team', label: 'Team', icon: 'users' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

type KpiValue = { value: string; delta: number; points: number[] };

export type Kpi = {
  id: string;
  label: string;
  /** For a duration, going down is the good direction. */
  lowerIsBetter?: boolean;
  byRange: Record<RangeId, KpiValue>;
};

export const kpis: Kpi[] = [
  {
    id: 'active',
    label: 'Active members',
    byRange: {
      '7d': { value: '128', delta: 4.2, points: [96, 104, 101, 110, 116, 112, 128] },
      '30d': { value: '142', delta: 9.6, points: [104, 112, 109, 118, 121, 126, 124, 133, 138, 142] },
      '90d': { value: '151', delta: 18.1, points: [88, 94, 101, 99, 112, 118, 116, 127, 134, 139, 146, 151] },
    },
  },
  {
    id: 'projects',
    label: 'Projects started',
    byRange: {
      '7d': { value: '9', delta: 12.5, points: [1, 0, 2, 1, 3, 1, 1] },
      '30d': { value: '34', delta: 6.3, points: [2, 4, 3, 5, 3, 4, 6, 2, 3, 2] },
      '90d': { value: '96', delta: -3.1, points: [9, 7, 10, 8, 6, 9, 8, 7, 10, 7, 8, 7] },
    },
  },
  {
    id: 'tasks',
    label: 'Tasks completed',
    byRange: {
      '7d': { value: '441', delta: 15.7, points: [67, 24, 11, 85, 88, 83, 83] },
      '30d': { value: '1,786', delta: 17.1, points: [140, 162, 158, 171, 183, 176, 190, 201, 196, 209] },
      '90d': { value: '5,204', delta: 10.6, points: [372, 390, 401, 384, 420, 436, 428, 447, 455, 470, 466, 535] },
    },
  },
  {
    id: 'cycle',
    label: 'Median cycle time',
    lowerIsBetter: true,
    byRange: {
      '7d': { value: '2.4 d', delta: -8.0, points: [3.1, 2.9, 2.8, 2.9, 2.6, 2.5, 2.4] },
      '30d': { value: '2.7 d', delta: -4.4, points: [3.2, 3.0, 3.1, 2.9, 2.9, 2.8, 2.8, 2.7, 2.8, 2.7] },
      '90d': { value: '2.9 d', delta: 2.1, points: [2.6, 2.7, 2.7, 2.8, 2.9, 3.0, 2.9, 3.0, 2.9, 2.9, 2.8, 2.9] },
    },
  },
];

/** Tasks completed, this period against the one before it. The 7- and 30-day series are daily. */
export const throughput: Record<RangeId, { labels: string[]; values: number[]; previous: number[] }> = {
  '7d': { labels: ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'], values: [67, 24, 11, 85, 88, 83, 83], previous: [64, 28, 17, 57, 60, 77, 78] },
  '30d': {
    labels: ['Oct 14', 'Oct 15', 'Oct 16', 'Oct 17', 'Oct 18', 'Oct 19', 'Oct 20', 'Oct 21', 'Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26', 'Oct 27', 'Oct 28', 'Oct 29', 'Oct 30', 'Oct 31', 'Nov 1', 'Nov 2', 'Nov 3', 'Nov 4', 'Nov 5', 'Nov 6', 'Nov 7', 'Nov 8', 'Nov 9', 'Nov 10', 'Nov 11', 'Nov 12'],
    values: [71, 72, 60, 24, 13, 54, 79, 74, 75, 62, 24, 13, 56, 83, 77, 78, 64, 24, 13, 83, 85, 79, 82, 67, 24, 11, 85, 88, 83, 83],
    previous: [51, 51, 63, 31, 21, 55, 57, 52, 52, 63, 30, 20, 56, 57, 52, 76, 64, 29, 18, 57, 59, 53, 77, 64, 28, 17, 57, 60, 77, 78],
  },
  '90d': {
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'],
    values: [372, 390, 401, 384, 420, 436, 428, 447, 455, 470, 466, 535],
    previous: [346, 351, 369, 365, 370, 397, 385, 398, 419, 423, 424, 460],
  },
};

export type ActivityStatus = 'done' | 'review' | 'blocked' | 'active';

export const statusLabel: Record<ActivityStatus, string> = {
  done: 'Done',
  review: 'In review',
  blocked: 'Blocked',
  active: 'In progress',
};

export const activity: { id: string; person: string; action: string; project: string; status: ActivityStatus; when: string }[] = [
  { id: 'a1', person: 'Mira', action: 'Closed the onboarding checklist', project: 'Harbor launch', status: 'done', when: '12 min ago' },
  { id: 'a2', person: 'Teo', action: 'Asked for a review of the pricing page', project: 'Pricing refresh', status: 'review', when: '40 min ago' },
  { id: 'a3', person: 'Ines', action: 'Flagged a missing contract', project: 'Supplier audit', status: 'blocked', when: '1 hr ago' },
  { id: 'a4', person: 'Arlo', action: 'Started the field interviews', project: 'Research sprint', status: 'active', when: '3 hr ago' },
  { id: 'a5', person: 'Noor', action: 'Shipped the export settings', project: 'Reports v2', status: 'done', when: 'Yesterday' },
  { id: 'a6', person: 'Sami', action: 'Moved the venue shortlist to review', project: 'Team offsite', status: 'review', when: 'Yesterday' },
];

export const goals: { id: string; label: string; value: number; target: number }[] = [
  { id: 'g1', label: 'Projects shipped', value: 18, target: 24 },
  { id: 'g2', label: 'Reviews within a day', value: 41, target: 50 },
  { id: 'g3', label: 'Docs written', value: 9, target: 12 },
];

export const seats = { used: 151, total: 200 };
