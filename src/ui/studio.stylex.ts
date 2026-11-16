// Compatibility exports for the original style study.
import * as stylex from "@stylexjs/stylex";
import { tokens } from "./tokens.stylex";
export { darkTheme as studioDark } from "./theme";
export const studioLight = stylex.createTheme(tokens, { "--os-color-fg-base": "#17181a" });
