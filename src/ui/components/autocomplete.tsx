'use client';

import { SuggestionInput, type AutocompleteFieldProps, type SelectionMode, type SuggestionBaseProps } from './internal/suggestion-input';

export type AutocompleteProps = AutocompleteFieldProps;

/**
 * A text field that suggests matches while someone types. The value is the text: a suggestion fills
 * it in, but any text is allowed. Sections, a result limit, inline completion, a clear button, an
 * optional chevron trigger and a loading state for async results.
 */
export function Autocomplete(props: AutocompleteProps) {
  return <SuggestionInput {...(props as unknown as SuggestionBaseProps<SelectionMode>)} freeform />;
}
