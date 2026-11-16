'use client';

import { useState, useSyncExternalStore } from 'react';
import { applyColorScheme, Switch } from '__UI__/components';

// The page renders on the server, which can't know the visitor's scheme: the switch starts off there and while
// hydrating, then follows the system until someone flips it.
const query = '(prefers-color-scheme: dark)';
const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};

export function ThemeSwitch() {
  const systemDark = useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
  const [choice, setChoice] = useState<boolean>();
  return (
    <Switch
      variant="row"
      label="Dark mode"
      description="The tokens switch together; nothing in the app branches on the theme."
      isSelected={choice ?? systemDark}
      onChange={on => { setChoice(on); applyColorScheme(on ? 'dark' : 'light'); }}
    />
  );
}
