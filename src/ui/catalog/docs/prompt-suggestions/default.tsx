'use client';

import { PromptSuggestions } from '../../../components';

export default function PromptSuggestionsDefault() {
  return (
    <PromptSuggestions
      onSelect={prompt => console.log(prompt)}
      suggestions={[
        { id: 'test', label: 'Fix a failing test', icon: 'code' },
        { id: 'review', label: 'Review a pull request', icon: 'eye' },
        { id: 'notes', label: 'Write release notes', icon: 'edit' },
        { id: 'feedback', label: 'Summarize feedback', icon: 'message' },
      ]}
    />
  );
}
