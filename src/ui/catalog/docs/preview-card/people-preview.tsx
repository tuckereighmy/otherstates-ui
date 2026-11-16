import { PeoplePreview } from '../../../components';
import type { PreviewProfile } from '../../../components';

const profiles: PreviewProfile[] = [
  {
    id: 'anouk', name: 'Anouk Verbeek', handle: '@anoukverbeek', avatar: { fallback: 'gradient' },
    bio: 'Design lead for the launch team. Collects buttons that almost shipped.',
    followingCount: 128, followersCount: 964, mutualLabel: 'Followed by Dele and Hana',
    mutualAvatars: [{ name: 'Dele Adeyemi', fallback: 'gradient' }, { name: 'Hana Sato', fallback: 'gradient' }],
  },
  {
    id: 'dele', name: 'Dele Adeyemi', handle: '@deleadeyemi', avatar: { fallback: 'gradient' },
    bio: 'Engineer on the sync team. Happiest when a flaky test finally stays green.',
    followingCount: 203, followersCount: 1512, mutualLabel: 'Followed by Anouk and Rafael',
    mutualAvatars: [{ name: 'Anouk Verbeek', fallback: 'gradient' }, { name: 'Rafael Ortiz', fallback: 'gradient' }],
  },
  {
    id: 'hana', name: 'Hana Sato', handle: '@hanasato', avatar: { fallback: 'gradient' },
    bio: 'Writes the release notes. Believes every error message deserves an editor.',
    followingCount: 86, followersCount: 2340, mutualLabel: 'Followed by Anouk and Dele',
    mutualAvatars: [{ name: 'Anouk Verbeek', fallback: 'gradient' }, { name: 'Dele Adeyemi', fallback: 'gradient' }],
  },
  {
    id: 'rafael', name: 'Rafael Ortiz', handle: '@rafaelortiz', avatar: { fallback: 'gradient' },
    bio: 'Researcher. Runs the Thursday interviews and shares the quotes.',
    followingCount: 175, followersCount: 731,
  },
];

export default function PreviewCardPeoplePreview() {
  return <PeoplePreview profiles={profiles} summary="Anouk and 3 others" />;
}
