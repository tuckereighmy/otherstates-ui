import { TaskChecklist } from '../../../components';

export default function ProgressTaskChecklist() {
  return (
    <TaskChecklist
      title="Set up your workspace"
      defaultCheckedKeys={['name']}
      items={[
        { id: 'name', label: 'Name your workspace' },
        { id: 'invite', label: 'Invite your team' },
        { id: 'project', label: 'Create a first project' },
        { id: 'calendar', label: 'Connect a calendar' },
        { id: 'alerts', label: 'Choose your notifications' },
      ]}
    />
  );
}
