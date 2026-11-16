import * as stylex from '@stylexjs/stylex';
import { Badge, Tab, TabList, TabPanel, Tabs } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  frame: { width: '100%', maxWidth: 480 },
  row: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'] },
});

export default function TabsComposition() {
  return (
    <div {...stylex.props(s.frame)}>
      <Tabs defaultSelectedKey="open">
        <TabList aria-label="Issues">
          <Tab id="open">Open</Tab>
          <Tab id="closed">Closed</Tab>
        </TabList>
        <TabPanel id="open">
          <div {...stylex.props(s.row)}>
            Login page flickers on resize <Badge>New</Badge>
          </div>
        </TabPanel>
        <TabPanel id="closed">Export drops the last row (fixed in 2.4).</TabPanel>
      </Tabs>
    </div>
  );
}
