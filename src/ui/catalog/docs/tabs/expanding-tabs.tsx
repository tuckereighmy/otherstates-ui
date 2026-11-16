import { ExpandingTabs, Icon } from '../../../components';

const items = [
  { id: 'home', label: 'Home', icon: <Icon name="home" size={16} />, content: null },
  { id: 'search', label: 'Search', icon: <Icon name="search" size={16} />, content: null },
  { id: 'inbox', label: 'Inbox', icon: <Icon name="inbox" size={16} />, badge: 3, content: null },
  { id: 'saved', label: 'Saved', icon: <Icon name="bookmark" size={16} />, content: null },
];

export default function TabsExpandingTabs() {
  return <ExpandingTabs label="Workspace" items={items} />;
}
