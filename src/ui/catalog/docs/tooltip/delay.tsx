import * as stylex from '@stylexjs/stylex';
import { Button, Tooltip } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ row: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-3'] } });

export default function TooltipDelay() {
  return (
    <div {...stylex.props(s.row)}>
      <Tooltip delay={0} closeDelay={0} trigger={<Button appearance="secondary">Instant</Button>}>
        Opens with no delay
      </Tooltip>
      <Tooltip trigger={<Button appearance="secondary">Default</Button>}>
        Opens after 250ms
      </Tooltip>
      <Tooltip delay={800} closeDelay={400} trigger={<Button appearance="secondary">Patient</Button>}>
        Opens after 800ms, lingers 400ms
      </Tooltip>
    </div>
  );
}
