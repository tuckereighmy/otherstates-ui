import { createContext } from 'react';

// Formerly the Group nesting switch: Button read it and traded its pill for radius md inside a Group.
// Every control now takes --os-radius-control (DESIGN_SPEC 1.3) and the Group shell adds its 6px inset to
// it, so a control inside a Group is concentric without help. Nothing provides or reads it any more;
// the export stays so existing imports keep compiling.
export const NestedRadiusContext = createContext(false);
