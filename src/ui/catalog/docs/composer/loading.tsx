'use client';

import { Composer } from '../../../components';

export default function ComposerLoading() {
  return <Composer isLoading defaultValue="Draft the release notes" onSubmit={() => {}} />;
}
