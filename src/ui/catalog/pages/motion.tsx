import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Heading } from '../PageParts';
import { pageHref } from '../route';
import { Caption, shortName, Specimen, TokenName, tokensByValue, tokensWithPrefix, useReducedMotion, useTokens } from './shared';

// The body of #docs/motion. Every demo runs on var(--os-motion-…) and var(--os-ease-…), the list is
// read from the contract (a duration added to tokens.stylex.ts appears here, shortest first), and
// each easing graph is drawn from the curve the document resolves, so it changes when the token does.

const path = 'docs/motion';
const durationPrefix = '--os-motion-';
const easePrefix = '--os-ease-';

const durationNotes: Record<string, string> = {
  press: 'The answer to a press: the control scales to .97 and its fill steps once. Short enough to feel instant.',
  hover: 'Hover colors and focus, and every overlay leaving the screen. No change of color takes longer.',
  popup: 'An anchored popup or a backdrop arriving, and small reveals: a chevron turning, a check drawing.',
  modal: 'A dialog arriving.',
  sheet: 'A sheet or a drawer sliding in from its edge. It leaves faster, in 240ms.',
  layout: 'A change of size or place: a panel opening, the composer growing, a meter filling.',
  slow: 'Long travel: a progress fill, the tab tile crossing a track, content revealed in stages.',
  spin: 'One turn of every spinner, at a constant speed.',
};

const easeNotes: Record<string, string> = {
  settle: 'Starts fast and settles gently, with no overshoot. Use it for anything that enters, or answers the pointer.',
  spring: 'Overshoots a little, then settles. For small objects that should feel physical: pills, fills and chips.',
  exit: 'Starts slowly and speeds away. For everything that leaves the screen.',
};

// Durations with a demo of their own. Any other duration gets a dot that crosses a track.
const replayShapes = new Set(['popup', 'modal', 'sheet', 'layout', 'slow']);

/** Restarts a CSS animation: clears the attribute for a frame, then sets it again. */
function useReplay() {
  const [run, setRun] = useState(0);
  const [on, setOn] = useState(true);
  useEffect(() => {
    if (run === 0) return;
    setOn(false);
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setOn(true)));
    return () => cancelAnimationFrame(frame);
  }, [run]);
  return { on, replay: () => setRun(count => count + 1) };
}

function ReplayButton({ onPress, label }: { onPress: () => void; label: string }) {
  return (
    <button type="button" className="pg-replay" onClick={onPress} aria-label={label}>
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.75 8a5.25 5.25 0 1 0 1.6-3.77" />
        <path d="M2.5 2.5v3h3" />
      </svg>
      Replay
    </button>
  );
}

function DurationDemo({ name }: { name: string }) {
  const key = shortName(name, durationPrefix);
  const timing = { '--pg-duration': `var(${name})` } as CSSProperties;
  if (key === 'press') {
    return (
      <div className="pg-motion-demo">
        <button type="button" className="pg-press-sample">Press and hold</button>
      </div>
    );
  }
  if (key === 'hover') {
    return (
      <div className="pg-motion-demo">
        <span className="pg-hover-sample" style={timing} aria-hidden="true">Hover here</span>
      </div>
    );
  }
  if (key === 'spin') {
    return (
      <div className="pg-motion-demo">
        <span className="pg-spin-sample" style={timing} aria-hidden="true" />
      </div>
    );
  }
  return <ReplayDemo name={name} shape={replayShapes.has(key) ? key : 'travel'} />;
}

function ReplayDemo({ name, shape }: { name: string; shape: string }) {
  const { on, replay } = useReplay();
  const timing = { '--pg-duration': `var(${name})` } as CSSProperties;
  return (
    <div className="pg-motion-demo">
      <span className="pg-anim-frame" data-shape={shape} aria-hidden="true">
        <span className="pg-anim" data-shape={shape} data-run={on || undefined} style={timing} />
      </span>
      <ReplayButton onPress={replay} label={`Replay ${shortName(name, durationPrefix)}`} />
    </div>
  );
}

/** "cubic-bezier(.22, 1, .36, 1)" → [0.22, 1, 0.36, 1]. Keywords map to their CSS definitions. */
function parseCurve(value: string): [number, number, number, number] | null {
  const keywords: Record<string, [number, number, number, number]> = {
    linear: [0, 0, 1, 1],
    ease: [0.25, 0.1, 0.25, 1],
    'ease-in': [0.42, 0, 1, 1],
    'ease-out': [0, 0, 0.58, 1],
    'ease-in-out': [0.42, 0, 0.58, 1],
  };
  const trimmed = value.trim();
  if (keywords[trimmed]) return keywords[trimmed];
  const match = trimmed.match(/^cubic-bezier\(([^)]+)\)$/);
  if (!match) return null;
  const parts = match[1].split(',').map(part => Number(part.trim()));
  return parts.length === 4 && parts.every(Number.isFinite) ? [parts[0], parts[1], parts[2], parts[3]] : null;
}

function EaseDemo({ name, value }: { name: string; value: string }) {
  const { on, replay } = useReplay();
  const curve = parseCurve(value);
  const size = 152;
  const pad = 8;
  // A curve that overshoots (a spring) or dips leaves the unit square. The graph widens its range
  // to the control points, which always contain the curve, and the square stays marked inside it.
  const low = Math.min(0, curve?.[1] ?? 0, curve?.[3] ?? 0);
  const high = Math.max(1, curve?.[1] ?? 1, curve?.[3] ?? 1);
  const span = size - pad * 2;
  const x = (t: number) => pad + t * span;
  const y = (t: number) => pad + ((high - t) / (high - low)) * span;

  return (
    <div className="pg-ease">
      <svg className="pg-curve" viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Graph of ${value}: progress over time`}>
        <rect className="pg-curve-frame" x={x(0)} y={y(1)} width={span} height={y(0) - y(1)} rx="2" />
        <path className="pg-curve-guide" d={`M${x(0)} ${y(0)} L${x(1)} ${y(1)}`} />
        {curve && (
          <>
            <path className="pg-curve-handle" d={`M${x(0)} ${y(0)} L${x(curve[0])} ${y(curve[1])} M${x(1)} ${y(1)} L${x(curve[2])} ${y(curve[3])}`} />
            <circle className="pg-curve-dot" cx={x(curve[0])} cy={y(curve[1])} r="3" />
            <circle className="pg-curve-dot" cx={x(curve[2])} cy={y(curve[3])} r="3" />
            <path className="pg-curve-line" d={`M${x(0)} ${y(0)} C${x(curve[0])} ${y(curve[1])} ${x(curve[2])} ${y(curve[3])} ${x(1)} ${y(1)}`} />
          </>
        )}
      </svg>
      <div className="pg-tracks">
        <div className="pg-track-group">
          <Caption>{shortName(name, easePrefix)}</Caption>
          <div className="pg-track" data-run={on || undefined} style={{ '--pg-ease': `var(${name})` } as CSSProperties} aria-hidden="true">
            <span className="pg-track-dot" />
          </div>
        </div>
        <div className="pg-track-group">
          <Caption>linear, for comparison</Caption>
          <div className="pg-track" data-run={on || undefined} data-linear="" aria-hidden="true">
            <span className="pg-track-dot" />
          </div>
        </div>
        <div className="pg-ease-foot">
          <Caption>Both dots take the same time.</Caption>
          <ReplayButton onPress={replay} label={`Replay the ${shortName(name, easePrefix)} comparison`} />
        </div>
      </div>
    </div>
  );
}

export default function Motion() {
  const values = useTokens();
  const reduced = useReducedMotion();
  const durations = tokensByValue(durationPrefix, values);
  const eases = tokensWithPrefix(easePrefix);

  return (
    <>
      <p>
        Movement should explain a change: where a menu came from, that a press landed, which item is now selected. If a motion does
        not explain anything, leave it out. Animate the object that changes, not the things around it.
      </p>

      <Heading level={2} id="durations" path={path}>Durations</Heading>
      <p>
        Shortest first. A change of color never takes longer than 160ms, and a change of size or place never less than 220ms. Things
        leave faster than they arrive.
      </p>
      <ul className="pg-rows" role="list" data-docs-raw="">
        {durations.map(name => (
          <li key={name} className="pg-row pg-motion-row">
            <div className="pg-motion-meta">
              <TokenName name={name} />
              <span className="pg-value">{values.value(name)}</span>
            </div>
            <span className="pg-use">{durationNotes[shortName(name, durationPrefix)] ?? ''}</span>
            <DurationDemo name={name} />
          </li>
        ))}
      </ul>

      <Heading level={2} id="easing" path={path}>Easing</Heading>
      {eases.map(name => (
        <section key={name} className="pg-ease-section">
          <ul className="pg-rows" role="list" data-docs-raw="">
            <li className="pg-row pg-token-row">
              <TokenName name={name} />
              <span className="pg-value">{values.value(name)}</span>
            </li>
          </ul>
          <p>{easeNotes[shortName(name, easePrefix)] ?? ''}</p>
          <Specimen id={`ease-${shortName(name, easePrefix)}`} align="stretch">
            <EaseDemo name={name} value={values.value(name)} />
          </Specimen>
        </section>
      ))}

      <Heading level={2} id="choreography" path={path}>Springs and loops</Heading>
      <p>
        A few components are driven by physics springs rather than a duration: the switch, the segmented control and the slider, so
        they keep their momentum when you change your mind halfway. Their constants live in each component's file, next to what they
        move. Skeleton breathes on its own slow loop of 1.4 seconds.
      </p>

      <Heading level={2} id="reduced-motion" path={path}>Reduced motion</Heading>
      <p className="pg-state" data-on={reduced || undefined} data-docs-raw="" role="status">
        {reduced ? 'Your system asks for reduced motion. The demos above are showing it.' : 'Your system allows full motion.'}
      </p>
      <p>When the reader's system asks for less motion, the tokens keep their values and each component does the rest:</p>
      <ul>
        <li>Every transform goes: nothing slides, scales or travels.</li>
        <li>What fades still fades, in 120ms or less, so a change is never abrupt.</li>
        <li>Springs jump to where they would have settled, and Skeleton stops breathing.</li>
        <li>Spinners stop turning and show a still three-quarter ring.</li>
        <li>Nothing that carries meaning is removed. A switch still switches and a selected item is still marked.</li>
      </ul>
      <p>
        To check your own work, turn on Reduce motion in your system's accessibility settings, or emulate the setting in your browser's
        developer tools. <a href={pageHref('styling')}>Styling</a> shows the pattern for your own styles.
      </p>
    </>
  );
}
