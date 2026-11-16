// A small tokenizer for the TypeScript and TSX shown in the docs. It is not a parser: it knows
// enough to color comments, strings, keywords, numbers and JSX tags and attributes, and it leaves
// everything else as plain text. Unknown or broken input still comes out whole, only less colored.

export type TokenType = 'plain' | 'comment' | 'string' | 'keyword' | 'number' | 'tag' | 'attr' | 'punct';
export type Token = { type: TokenType; text: string };

const keywords = new Set([
  'import', 'export', 'default', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do',
  'switch', 'case', 'break', 'continue', 'new', 'typeof', 'instanceof', 'in', 'class', 'extends', 'implements',
  'interface', 'enum', 'try', 'catch', 'finally', 'throw', 'await', 'yield', 'void', 'delete', 'static', 'this', 'super',
]);
// Words that are keywords only in position: `type Props = …` but not `type="text"` or `{ type }`.
const softKeywords = new Set(['type', 'from', 'as', 'of', 'is', 'async', 'satisfies', 'keyof', 'infer', 'readonly', 'declare', 'get', 'set']);
const literals = new Set(['true', 'false', 'null', 'undefined', 'NaN', 'Infinity']);

const identStart = /[A-Za-z_$]/;
const identPart = /[\w$]/;
const numberPattern = /^(?:0[xX][\da-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|(?:\d[\d_]*\.?[\d_]*|\.\d[\d_]*)(?:[eE][+-]?\d+)?)n?/;
// A "/" after one of these starts a regular expression, not a division.
const regexLead = new Set(['(', ',', '=', ':', '[', '!', '&', '|', '?', '{', '}', ';', '=>', 'return', 'typeof']);

export function tokenize(source: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  // The last token that was not whitespace or a comment, and whether a line break followed it.
  let last: Token | null = null;
  let lineBreakSinceLast = false;

  function push(type: TokenType, text: string) {
    if (!text) return;
    const previous = out[out.length - 1];
    if (previous && previous.type === type) previous.text += text;
    else out.push({ type, text });
    if (type === 'comment') return;
    if (type === 'plain' && !text.trim()) {
      if (text.includes('\n')) lineBreakSinceLast = true;
      return;
    }
    last = { type, text };
    lineBreakSinceLast = false;
  }

  function readWhile(pattern: RegExp) {
    const start = i;
    while (i < source.length && pattern.test(source[i])) i++;
    return source.slice(start, i);
  }

  function whitespace() {
    push('plain', readWhile(/\s/));
  }

  function comment(): boolean {
    if (source.startsWith('//', i)) {
      const end = source.indexOf('\n', i);
      const stop = end < 0 ? source.length : end;
      push('comment', source.slice(i, stop));
      i = stop;
      return true;
    }
    if (source.startsWith('/*', i)) {
      const end = source.indexOf('*/', i + 2);
      const stop = end < 0 ? source.length : end + 2;
      push('comment', source.slice(i, stop));
      i = stop;
      return true;
    }
    return false;
  }

  function quoted(quote: string) {
    const start = i++;
    while (i < source.length && source[i] !== quote && source[i] !== '\n') i += source[i] === '\\' ? 2 : 1;
    if (source[i] === quote) i++;
    push('string', source.slice(start, i));
  }

  function template() {
    let start = i++;
    while (i < source.length && source[i] !== '`') {
      if (source[i] === '\\') { i += 2; continue; }
      if (source.startsWith('${', i)) {
        push('string', source.slice(start, i));
        push('punct', '${');
        i += 2;
        code(true);
        if (source[i] === '}') { push('punct', '}'); i++; }
        start = i;
        continue;
      }
      i++;
    }
    if (source[i] === '`') i++;
    push('string', source.slice(start, i));
  }

  function regex(): boolean {
    const lead = last as Token | null;
    if (lead && !((lead.type === 'punct' || lead.type === 'keyword') && regexLead.has(lead.text))) return false;
    let j = i + 1;
    let inClass = false;
    for (; j < source.length; j++) {
      const ch = source[j];
      if (ch === '\n') return false;
      if (ch === '\\') { j++; continue; }
      if (ch === '[') inClass = true;
      else if (ch === ']') inClass = false;
      else if (ch === '/' && !inClass) break;
    }
    if (j >= source.length || j === i + 1) return false;
    j++;
    while (j < source.length && /[a-z]/.test(source[j])) j++;
    push('string', source.slice(i, j));
    i = j;
    return true;
  }

  function word() {
    const before = source[i - 1];
    const text = readWhile(identPart);
    let j = i;
    while (source[j] === ' ' || source[j] === '\t') j++;
    const next = source[j] ?? '';
    const gap = j > i;
    if (before === '.' && source[i - text.length - 2] !== '.') return push('plain', text);
    if (literals.has(text)) return push('number', text);
    if (keywords.has(text)) {
      // `{ default: 'none' }` is an object key; `default:` in a switch is not.
      const lead = last as Token | null;
      const isKey = next === ':' && (lead?.text === '{' || lead?.text === ',' || lead?.text.endsWith('{') || lead?.text.endsWith(','));
      return push(isKey ? 'plain' : 'keyword', text);
    }
    if (softKeywords.has(text)) {
      const leads = gap && (identStart.test(next) || next === '{' || next === '[' || next === '(' || next === '*' || next === '"' || next === "'");
      // `async (` and `get (` only count for async: `get(` is a call.
      const callLike = next === '(' && text !== 'async';
      return push(leads && !callLike ? 'keyword' : 'plain', text);
    }
    push('plain', text);
  }

  // Does the "<" at i open JSX? Not after a name, a literal or a closing bracket on the same
  // line: there it is a comparison or a type argument.
  function opensElement(): boolean {
    const next = source[i + 1] ?? '';
    if (!(identStart.test(next) || next === '>')) return false;
    const lead = last as Token | null;
    if (!lead || lineBreakSinceLast) return true;
    if (lead.type === 'plain' || lead.type === 'number' || lead.type === 'string') return false;
    if (lead.type === 'punct' && /[)\]]$/.test(lead.text)) return false;
    if (next !== '>') {
      // `<T,>(value: T) => …` and `<T extends …>` are type parameters.
      let j = i + 1;
      while (j < source.length && /[\w$.]/.test(source[j])) j++;
      if (source[j] === ',' || source.startsWith(' extends ', j) || source.startsWith('>(', j)) return false;
    }
    return true;
  }

  // An opening tag. Returns true when it leaves children to read.
  function openTag(): boolean {
    i++;
    if (source[i] === '>') { push('punct', '<>'); i++; return true; }
    push('punct', '<');
    push('tag', readWhile(/[\w$.:-]/));
    while (i < source.length) {
      const ch = source[i];
      if (/\s/.test(ch)) whitespace();
      else if (source.startsWith('/>', i)) { push('punct', '/>'); i += 2; return false; }
      else if (ch === '>') { push('punct', '>'); i++; return true; }
      else if (ch === '{') { push('punct', '{'); i++; code(true); if (source[i] === '}') { push('punct', '}'); i++; } }
      else if (ch === '"' || ch === "'") quoted(ch);
      else if (comment()) continue;
      else if (identStart.test(ch)) push('attr', readWhile(/[\w$:-]/));
      else { push(ch === '=' ? 'punct' : 'plain', ch); i++; }
    }
    return false;
  }

  function closeTag() {
    push('punct', '</');
    i += 2;
    push('tag', readWhile(/[\w$.:-]/));
    whitespace();
    if (source[i] === '>') { push('punct', '>'); i++; }
  }

  function element() {
    if (!openTag()) return;
    while (i < source.length) {
      const ch = source[i];
      if (ch === '{') { push('punct', '{'); i++; code(true); if (source[i] === '}') { push('punct', '}'); i++; } }
      else if (source.startsWith('</', i)) { closeTag(); return; }
      else if (ch === '<' && (identStart.test(source[i + 1] ?? '') || source[i + 1] === '>')) element();
      else {
        const start = i++;
        while (i < source.length && source[i] !== '<' && source[i] !== '{') i++;
        push('plain', source.slice(start, i));
      }
    }
  }

  // Ordinary code. Inside braces it stops at the brace that closes them, without consuming it.
  function code(insideBraces: boolean) {
    while (i < source.length) {
      const ch = source[i];
      if (/\s/.test(ch)) whitespace();
      else if (comment()) continue;
      else if (ch === '"' || ch === "'") quoted(ch);
      else if (ch === '`') template();
      else if (ch === '{') { push('punct', '{'); i++; code(true); if (source[i] === '}') { push('punct', '}'); i++; } }
      else if (ch === '}') { if (insideBraces) return; push('punct', '}'); i++; }
      else if (ch === '<' && opensElement()) element();
      else if (ch === '/' && regex()) continue;
      else if (identStart.test(ch)) word();
      else if (/\d/.test(ch) || (ch === '.' && /\d/.test(source[i + 1] ?? ''))) {
        const match = numberPattern.exec(source.slice(i, i + 40));
        const text = match?.[0] || ch;
        push('number', text);
        i += text.length;
      }
      else if (source.startsWith('=>', i)) { push('punct', '=>'); i += 2; }
      else if (source.startsWith('...', i)) { push('punct', '...'); i += 3; }
      else { push('punct', ch); i++; }
    }
  }

  code(false);
  return out;
}
