import * as stylex from '@stylexjs/stylex';
import { Button, Card } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
  meta: { color: tokens['--os-color-fg-muted'], fontVariantNumeric: 'tabular-nums' },
});

export default function CardWithFooter() {
  return (
    <div {...stylex.props(s.root)}>
      <Card
        variant="outline"
        heading="Team plan"
        description="Billed yearly, renews on March 4"
        footer={
          <>
            <span {...stylex.props(s.meta)}>3 of 5 seats used</span>
            <Button size="sm" appearance="secondary">Add seats</Button>
          </>
        }
      >
        Invite two more people before the renewal date at no extra cost.
      </Card>
    </div>
  );
}
