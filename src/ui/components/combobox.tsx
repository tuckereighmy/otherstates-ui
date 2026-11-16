'use client';

import {
  PopupSuggestionInput, SuggestionInput, type ComboboxProps, type SelectionMode, type SuggestionBaseProps,
} from './internal/suggestion-input';

export type { CatalogEntry, CatalogOption, CatalogSection, ComboboxProps } from './internal/suggestion-input';

/**
 * A text field with a list of options: typing filters the list, and the value must be one of the
 * options. Single or multiple selection (chips), sections, a clear button, a start addon and a
 * loading state. `inputPlacement="popup"` turns the field into a select-like button with the search
 * input inside the popup.
 */
export function Combobox<M extends SelectionMode = 'single'>({ inputPlacement = 'field', searchPlaceholder, ...props }: ComboboxProps<M>) {
  const shared = props as unknown as SuggestionBaseProps<SelectionMode>;
  return inputPlacement === 'popup'
    ? <PopupSuggestionInput {...shared} searchPlaceholder={searchPlaceholder} />
    : <SuggestionInput {...shared} freeform={false} />;
}
