# Prompt suggestions

Offer short prompts that start an empty conversation.

Category: Chat · Exports: `PromptSuggestions`, `PromptSuggestion`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { PromptSuggestions } from '@/ui/components';

<PromptSuggestions suggestions={suggestions} onSelect={send} />
```

## PromptSuggestions

Short prompts that start a conversation.

Extends: <ul> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `suggestions` (required) | `PromptSuggestion[]` |  | Each: `id`, `label`, an optional `prompt` (default: the label) and `icon`. |
| `onSelect` (required) | `(prompt: string) => void` |  | Receives the suggestion's prompt. |
| `align` | `'center' \| 'start'` | `'center'` | Where the row sits. |

## Accessibility

- A list of buttons named by their labels.
- Keep it to four suggestions, so the row reads at a glance and fits a phone in two lines.

## Examples

### Default

`src/ui/catalog/docs/prompt-suggestions/default.tsx`

```tsx
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
```
