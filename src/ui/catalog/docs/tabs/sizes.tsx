import * as stylex from '@stylexjs/stylex';
import { Tab, TabList, Tabs } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const sizes = [
  { size: 'sm', title: 'Small' },
  { size: 'md', title: 'Default' },
  { size: 'lg', title: 'Large' },
] as const;

const s = stylex.create({
  stack: { display: 'grid', justifyItems: 'center', gap: t['--os-space-4'] },
});

export default function TabsSizes() {
  return (
    <div {...stylex.props(s.stack)}>
      {sizes.map(({ size, title }) => (
        <Tabs key={size} size={size}>
          <TabList aria-label={`Report, ${title.toLowerCase()}`}>
            <Tab id="summary">Summary</Tab>
            <Tab id="details">Details</Tab>
            <Tab id="export">Export</Tab>
          </TabList>
        </Tabs>
      ))}
    </div>
  );
}
