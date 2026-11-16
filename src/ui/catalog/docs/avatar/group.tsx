import { AvatarGroup } from '../../../components';

export default function AvatarGroupExample() {
  return (
    <AvatarGroup
      label="Project members"
      max={4}
      items={[
        { name: 'Hana Sato', fallback: 'gradient' },
        { name: 'Arjun Mehta', fallback: 'gradient' },
        { name: 'Omar Farouk', fallback: 'gradient' },
        { name: 'Amara Diallo', fallback: 'gradient' },
        { name: 'Dele Adeyemi', fallback: 'gradient' },
        { name: 'Mei Tanaka', fallback: 'gradient' },
      ]}
    />
  );
}
