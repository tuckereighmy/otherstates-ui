import * as stylex from '@stylexjs/stylex';
import { ToolCall } from '../../../components';

const output = ['src/checkout/cart.ts', 'src/checkout/cart.test.ts', 'src/checkout/summary.tsx', 'src/checkout/coupon.ts', 'src/billing/plans.ts', 'src/billing/invoice.tsx', 'src/billing/tax.ts', 'src/billing/currency.ts', 'src/billing/refund.ts', 'src/billing/plans.test.ts'].join('\n');

const s = stylex.create({ box: { width: '100%', maxWidth: 480 } });

export default function RunBlockToolCall() {
  return <ToolCall {...stylex.props(s.box)} tool="bash" inputLabel="Command" input="git diff --name-only main" output={output} />;
}
