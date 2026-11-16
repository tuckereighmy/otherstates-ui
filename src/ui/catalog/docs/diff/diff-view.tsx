import * as stylex from '@stylexjs/stylex';
import { DiffView, type DiffLine } from '../../../components';

const lines: DiffLine[] = [
  { type: 'context', number: 11, text: 'export const plans = {' },
  { type: 'remove', number: 12, text: "  team: { seat: 12, currency: 'usd' }," },
  { type: 'add', number: 12, text: "  team: { seat: 14, currency: 'usd' }," },
  { type: 'context', number: 13, text: "  free: { seat: 0, currency: 'usd' }," },
  { type: 'context', number: 14, text: '};' },
];

const s = stylex.create({ box: { maxWidth: 480, marginInline: 'auto', width: '100%' } });

export default function DiffDiffView() {
  return <DiffView heading="src/billing/plans.ts" lines={lines} {...stylex.props(s.box)} />;
}
