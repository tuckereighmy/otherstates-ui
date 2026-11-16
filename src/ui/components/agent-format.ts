// How agent numbers read: tokens, cost and time. Every agent component formats through these, so the same
// number always looks the same wherever it shows (spec 1.19).

const trim = (value: number, digits: number) => String(Number(value.toFixed(digits)));

/** 960 → "960", 1,284 → "1.3k", 36,000 → "36k", 175,600 → "175.6k", 1,250,000 → "1.3M". */
export function formatTokens(value: number): string {
  const abs = Math.abs(value);
  if (abs < 1000) return String(Math.round(value));
  if (abs < 999_950) return `${trim(value / 1000, 1)}k`;
  return `${trim(value / 1_000_000, 1)}M`;
}

/** US dollars. 0 → "$0.00", 0.004 → "<$0.01", 1.62 → "$1.62", 12,400 → "$12.4k". */
export function formatCost(usd: number): string {
  if (usd > 0 && usd < 0.01) return '<$0.01';
  if (Math.abs(usd) >= 10_000) return `$${trim(usd / 1000, 1)}k`;
  return `$${usd.toFixed(2)}`;
}

export type DurationStyle = 'short' | 'clock';

/**
 * Milliseconds as a duration.
 * `short`: 628 → "628ms", 1,400 → "1.4s", 34,000 → "34s", 126,000 → "2m 06s", 4,380,000 → "1h 13m".
 * `clock`: 43,000 → "0:43", 175,000 → "2:55", 3,723,000 → "1:02:03".
 */
export function formatDuration(ms: number, style: DurationStyle = 'short'): string {
  const total = Math.max(0, ms);
  const seconds = Math.floor(total / 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  if (style === 'clock') {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h ? `${h}:${pad(m)}:${pad(seconds % 60)}` : `${m}:${pad(seconds % 60)}`;
  }
  if (total < 1000) return `${Math.round(total)}ms`;
  if (total < 10_000) return `${trim(total / 1000, 1)}s`;
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${pad(seconds % 60)}s`;
  return `${Math.floor(seconds / 3600)}h ${pad(Math.floor((seconds % 3600) / 60))}m`;
}

/** A wait: "<1m", "14m", "1h 05m". */
export function formatWait(ms: number): string {
  const minutes = Math.floor(ms / 60_000);
  if (minutes < 1) return '<1m';
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`;
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** What restoring a checkpoint undoes: "This undoes 3 file changes and 2 messages made after it." */
export function describeUndo(undoes: { files?: number; messages?: number } | undefined): string {
  const parts = [undoes?.files ? plural(undoes.files, 'file change') : '', undoes?.messages ? plural(undoes.messages, 'message') : ''].filter(Boolean);
  return parts.length ? `This undoes ${parts.join(' and ')} made after it.` : 'Nothing has changed since this point.';
}
