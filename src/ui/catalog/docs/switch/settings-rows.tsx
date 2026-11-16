import * as stylex from '@stylexjs/stylex';
import { Switch } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  list: { display: 'grid', width: 440, maxWidth: '100%' },
  // 16 above and below each row's text, a hairline between rows and none outside the list.
  row: {
    paddingBlockStart: { default: t['--os-space-4'], ':first-child': 0 },
    paddingBlockEnd: { default: t['--os-space-4'], ':last-child': 0 },
    borderTopWidth: { default: 1, ':first-child': 0 },
    borderTopStyle: 'solid',
    borderTopColor: t['--os-color-border-subtle'],
  },
});

const row = stylex.props(s.row).className;

export default function SwitchSettingsRows() {
  return (
    <div {...stylex.props(s.list)}>
      <Switch variant="row" className={row} label="Mentions" description="When someone mentions you in a comment." defaultSelected />
      <Switch variant="row" className={row} label="Due date reminders" description="A day before something you own is due." defaultSelected />
      <Switch variant="row" className={row} label="Weekly summary" description="Monday morning: what moved last week." />
    </div>
  );
}
