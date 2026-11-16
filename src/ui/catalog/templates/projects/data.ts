import type { IconName } from '../../../components';

// Sample data for the projects template. Every name, date and project is invented.

export type Status = 'planned' | 'active' | 'review' | 'done';

export type Project = {
  id: string;
  name: string;
  owner: string;
  status: Status;
  /** ISO date. */
  due: string;
  /** 0 to 100. */
  progress: number;
  notes: string;
};

export const statuses: { id: Status; label: string }[] = [
  { id: 'planned', label: 'Planned' },
  { id: 'active', label: 'In progress' },
  { id: 'review', label: 'In review' },
  { id: 'done', label: 'Done' },
];

export const owners = ['Mira', 'Teo', 'Ines', 'Arlo', 'Noor', 'Sami', 'Lena', 'Kofi'];

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

export const projects: Project[] = [
  { id: 'p01', name: 'Harbor launch', owner: 'Mira', status: 'active', due: '2026-12-04', progress: 64, notes: 'Launch plan for the harbor pop-up, with the press kit and the opening night.' },
  { id: 'p02', name: 'Pricing refresh', owner: 'Teo', status: 'review', due: '2026-11-21', progress: 90, notes: 'Two new tiers and a simpler comparison table.' },
  { id: 'p03', name: 'Supplier audit', owner: 'Ines', status: 'active', due: '2026-12-12', progress: 38, notes: 'Check contracts and delivery times for the eight main suppliers.' },
  { id: 'p04', name: 'Research sprint', owner: 'Arlo', status: 'active', due: '2026-11-28', progress: 52, notes: 'Twelve field interviews about how teams plan their week.' },
  { id: 'p05', name: 'Reports v2', owner: 'Noor', status: 'done', due: '2026-11-08', progress: 100, notes: 'Scheduled exports and shareable report links.' },
  { id: 'p06', name: 'Team offsite', owner: 'Sami', status: 'review', due: '2026-12-01', progress: 75, notes: 'Venue shortlist, travel and a two-day agenda.' },
  { id: 'p07', name: 'Help center rewrite', owner: 'Lena', status: 'planned', due: '2027-01-15', progress: 0, notes: 'Rewrite the forty most read articles in plain language.' },
  { id: 'p08', name: 'Mobile onboarding', owner: 'Kofi', status: 'active', due: '2026-12-19', progress: 27, notes: 'Three screens instead of seven, with a skip option.' },
  { id: 'p09', name: 'Brand photography', owner: 'Mira', status: 'planned', due: '2027-01-30', progress: 0, notes: 'A shoot day for team and workspace photos.' },
  { id: 'p10', name: 'Accessibility review', owner: 'Teo', status: 'active', due: '2026-12-08', progress: 46, notes: 'Keyboard and screen reader pass over every form.' },
  { id: 'p11', name: 'Billing migration', owner: 'Ines', status: 'review', due: '2026-11-25', progress: 85, notes: 'Move yearly plans to the new invoicing flow.' },
  { id: 'p12', name: 'Partner newsletter', owner: 'Arlo', status: 'done', due: '2026-10-30', progress: 100, notes: 'A monthly letter for studio partners.' },
  { id: 'p13', name: 'Search tuning', owner: 'Noor', status: 'active', due: '2026-12-15', progress: 58, notes: 'Better matching for project names and people.' },
  { id: 'p14', name: 'Office move', owner: 'Sami', status: 'planned', due: '2027-02-20', progress: 5, notes: 'Floor plan, furniture and the moving weekend.' },
  { id: 'p15', name: 'Quarterly review', owner: 'Lena', status: 'done', due: '2026-10-24', progress: 100, notes: 'Numbers, highlights and next quarter’s goals.' },
  { id: 'p16', name: 'Design tokens', owner: 'Kofi', status: 'review', due: '2026-11-30', progress: 80, notes: 'One set of color and spacing names for every surface.' },
  { id: 'p17', name: 'Customer advisory board', owner: 'Mira', status: 'planned', due: '2027-01-08', progress: 10, notes: 'Invite eight customers to a quarterly call.' },
  { id: 'p18', name: 'Data retention policy', owner: 'Teo', status: 'active', due: '2026-12-22', progress: 33, notes: 'How long we keep files, logs and backups.' },
  { id: 'p19', name: 'Holiday campaign', owner: 'Ines', status: 'done', due: '2026-11-03', progress: 100, notes: 'Gift cards and a winter landing page.' },
  { id: 'p20', name: 'Calendar sync', owner: 'Arlo', status: 'planned', due: '2027-02-05', progress: 0, notes: 'Two-way sync for due dates.' },
  { id: 'p21', name: 'Hiring plan', owner: 'Noor', status: 'active', due: '2026-12-10', progress: 41, notes: 'Roles, budget and interview loops for next year.' },
  { id: 'p22', name: 'Studio handbook', owner: 'Lena', status: 'review', due: '2026-11-27', progress: 70, notes: 'How we work, in one short document.' },
];
