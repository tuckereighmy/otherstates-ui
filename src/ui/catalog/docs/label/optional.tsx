import * as stylex from '@stylexjs/stylex';
import { Input, Label } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-2'], width: 320, maxWidth: '100%' },
});

export default function LabelOptional() {
  return (
    <div {...stylex.props(s.root)}>
      <Label htmlFor="purchase-order" isOptional>Purchase order number</Label>
      <Input id="purchase-order" name="purchaseOrder" />
    </div>
  );
}
