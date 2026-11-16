import type { IconName } from '../../../components';

// Sample data for the settings template. Every name, address and amount is invented.

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

export const workspace = { name: 'Halden studio', handle: 'studio', timezone: 'europe-lisbon', language: 'en-gb', defaultView: 'board' };

export const timezones = [
  { id: 'america-new-york', label: 'New York (UTC−05:00)' },
  { id: 'europe-london', label: 'London (UTC+00:00)' },
  { id: 'europe-lisbon', label: 'Lisbon (UTC+00:00)' },
  { id: 'europe-berlin', label: 'Berlin (UTC+01:00)' },
  { id: 'asia-singapore', label: 'Singapore (UTC+08:00)' },
];

export const languages = [
  { id: 'en-gb', label: 'English (UK)' },
  { id: 'en-us', label: 'English (US)' },
  { id: 'pt-pt', label: 'Português' },
  { id: 'de-de', label: 'Deutsch' },
];

export const views = [
  { value: 'board', label: 'Board', description: 'Columns by status. Good for small teams.' },
  { value: 'table', label: 'Table', description: 'Rows you can sort and filter.' },
  { value: 'timeline', label: 'Timeline', description: 'Projects laid out by due date.' },
];

export type Role = 'Owner' | 'Admin' | 'Member' | 'Guest';

export type Member = { id: string; name: string; email: string; role: Role; lastActive: string; invited?: boolean };

export const members: Member[] = [
  { id: 'm1', name: 'Mira Okafor', email: 'mira@halden.example', role: 'Owner', lastActive: 'Now' },
  { id: 'm2', name: 'Teo Lindqvist', email: 'teo@halden.example', role: 'Admin', lastActive: '2 hr ago' },
  { id: 'm3', name: 'Ines Varga', email: 'ines@halden.example', role: 'Member', lastActive: 'Yesterday' },
  { id: 'm4', name: 'Arlo Bennett', email: 'arlo@halden.example', role: 'Member', lastActive: '3 days ago' },
  { id: 'm5', name: 'Noor Haddad', email: 'noor@halden.example', role: 'Guest', lastActive: 'Last week' },
  { id: 'm6', name: 'Kofi Mensah', email: 'kofi@halden.example', role: 'Member', lastActive: 'Invite sent', invited: true },
];

export const notifications = [
  { id: 'mentions', label: 'Mentions', description: 'When someone mentions you in a comment or a note.', on: true },
  { id: 'comments', label: 'Comments on your projects', description: 'Replies and new threads on projects you own.', on: true },
  { id: 'due', label: 'Due date reminders', description: 'A day before something you own is due.', on: true },
  { id: 'summary', label: 'Weekly summary', description: 'Monday morning: what moved last week.', on: false },
];

export const frequencies = [
  { value: 'instant', label: 'As it happens' },
  { value: 'daily', label: 'Once a day', description: 'A digest at 9:00 in your time zone.' },
  { value: 'weekly', label: 'Once a week', description: 'A digest every Monday.' },
];

export const plan = { name: 'Team plan', renews: '1 March 2027', seatsUsed: 6, seats: 10, storageUsed: 42, storage: 100 };

export const invoices = [
  { id: 'i1', date: '1 Nov 2026', description: 'Team plan, 6 seats', amount: '€72.00', status: 'Paid' },
  { id: 'i2', date: '1 Oct 2026', description: 'Team plan, 6 seats', amount: '€72.00', status: 'Paid' },
  { id: 'i3', date: '1 Sep 2026', description: 'Team plan, 5 seats', amount: '€60.00', status: 'Paid' },
];
