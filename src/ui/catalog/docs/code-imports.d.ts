// Docs pages and the template registry import each example's own source as text ('./default.tsx?raw'). Vite
// reads those natively, and nothing in a product imports these pages at runtime, but TypeScript still checks them
// (Next.js does on every build). This declaration covers them in any project. It names '*.tsx?raw' rather than
// Vite's '*?raw', so the two never clash.
declare module '*.tsx?raw' {
  const source: string;
  export default source;
}
