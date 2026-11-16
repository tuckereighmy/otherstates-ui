'use client';

import * as stylex from '@stylexjs/stylex';
import { RunBlock, type RunStep } from '../../../components';

const steps: RunStep[] = [
  { id: 'install', title: 'Install dependencies', state: 'done', tool: 'bash', inputLabel: 'Command', input: 'npm ci', output: 'added 412 packages in 9s', duration: '9s' },
  { id: 'migrate', title: 'Run the migration', state: 'failed', tool: 'bash', inputLabel: 'Command', input: 'npm run db:migrate -- --env staging', error: 'Connection refused: staging database at 10.0.4.12:5432', duration: '2s' },
  { id: 'verify', title: 'Check the row counts', state: 'skipped' },
];

const s = stylex.create({ box: { width: '100%', maxWidth: 480 } });

export default function RunBlockFailed() {
  return <RunBlock {...stylex.props(s.box)} title="Migrating the users table" status="failed" elapsed="11s" steps={steps} onRetry={() => {}} />;
}
