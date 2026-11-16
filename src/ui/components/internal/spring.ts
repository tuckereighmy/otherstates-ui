import { useEffect, useRef, useState } from 'react';

export type ChoiceSpringState = { position: number; velocity: number };

/** Substeps make the trajectory stable through a dropped display frame. */
export function advanceChoiceSpring(state: ChoiceSpringState, target: number, stiffness: number, damping: number, elapsed: number, substeps?: number): ChoiceSpringState {
  let { position, velocity } = state;
  let remaining = Math.max(0, Math.min(elapsed, substeps ? .05 : .04));
  const step = substeps ? remaining / substeps : 1 / 240;
  while (remaining > .000000001) {
    const dt = Math.min(remaining, step);
    velocity += (stiffness * (target - position) - damping * velocity) * dt;
    position += velocity * dt;
    remaining -= dt;
  }
  return { position, velocity };
}

/** A retargetable physical spring. Momentum survives a second click mid-transition. */
export function useChoiceSpring(target: number, stiffness: number, damping: number, delay = 0, instant = false, substeps?: number, axisDelay = 0) {
  const position = useRef(target);
  const velocity = useRef(0);
  const previousTarget = useRef(target);
  const [value, setValue] = useState(target);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let previous = performance.now();
    const start = previous;
    const finish = () => { cancelAnimationFrame(frame); position.current = target; velocity.current = 0; setValue(target); };
    const moving = Math.abs(position.current - previousTarget.current) > .001 || Math.abs(velocity.current) > .001;
    const wait = (moving ? 0 : delay) + axisDelay;
    previousTarget.current = target;
    if (media.matches || instant) { finish(); return; }
    const tick = (time: number) => {
      if (time - start < wait) { previous = time; frame = requestAnimationFrame(tick); return; }
      const next = advanceChoiceSpring({ position: position.current, velocity: velocity.current }, target, stiffness, damping, (time - (previous || time)) / 1000, substeps);
      previous = time;
      position.current = next.position;
      velocity.current = next.velocity;
      setValue(position.current);
      if (Math.abs(target - position.current) < .0001 && Math.abs(velocity.current) < .001) finish();
      else frame = requestAnimationFrame(tick);
    };
    const onPreference = () => { if (media.matches) finish(); };
    media.addEventListener('change', onPreference);
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); media.removeEventListener('change', onPreference); };
  }, [target, stiffness, damping, delay, instant, substeps, axisDelay]);
  return value;
}

/**
 * Physics spring constants (mass 1). The damping ratio is damping / (2 * sqrt(stiffness)).
 * No bounce on big things (spec 1.10): surfaces and large travel (popups, the Select morph, toasts,
 * cards, sheets, anything moving more than ~40px) use a ratio of at least .85, which overshoots by
 * well under 2% and never swings back. Small objects (knobs, thumbs, pills, check marks) may keep a
 * little spring with a lower ratio.
 */
export const springs = {
  /** The default surface spring (`useSurfaceSpring`): ratio .87, about .4% overshoot. Toasts, profile cards. */
  surface: { stiffness: 380, damping: 34 },
  /** A surface opening over large travel, such as the Select morph: quick, ratio .86. */
  surfaceOpen: { stiffness: 520, damping: 39 },
  /** The same surface closing: ratio .85. */
  surfaceClose: { stiffness: 420, damping: 35 },
} as const;

/** Closed-form damped spring. Solving elapsed time directly makes overlay
 * trajectories independent of display refresh rate, without losing momentum
 * when a pointer reverses direction before the surface comes to rest. */
export function advanceSurfaceSpring(position:number,velocity:number,target:number,elapsed:number,stiffness:number=springs.surface.stiffness,damping:number=springs.surface.damping){
 const seconds=Math.max(0,elapsed), displacement=position-target, decay=damping/2;
 const frequency=Math.sqrt(Math.max(.000001,stiffness-decay*decay));
 const exponential=Math.exp(-decay*seconds), cosine=Math.cos(frequency*seconds), sine=Math.sin(frequency*seconds);
 const harmonic=(velocity+decay*displacement)/frequency;
 const nextDisplacement=exponential*(displacement*cosine+harmonic*sine);
 const nextVelocity=exponential*((harmonic*frequency-decay*displacement)*cosine-(displacement*frequency+decay*harmonic)*sine);
 return {position:target+nextDisplacement,velocity:nextVelocity};
}

export function useSurfaceSpring(target:number,initial=target){
 const current=useRef({position:initial,velocity:0});
 const [value,setValue]=useState(initial);
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0,last=performance.now();
  const finish=()=>{cancelAnimationFrame(frame);current.current={position:target,velocity:0};setValue(target);};
  const tick=(now:number)=>{
   const next=advanceSurfaceSpring(current.current.position,current.current.velocity,target,(now-last)/1000);last=now;current.current=next;
   if(Math.abs(next.position-target)<.001&&Math.abs(next.velocity)<.01){finish();return;}
   setValue(next.position);frame=requestAnimationFrame(tick);
  };
  const preference=()=>{if(media.matches)finish();};
  if(media.matches)finish();else frame=requestAnimationFrame(tick);
  media.addEventListener('change',preference);
  return()=>{cancelAnimationFrame(frame);media.removeEventListener('change',preference);};
 },[target]);
 return value;
}

// Motion tokens for JS-driven animation (WAAPI, timers, rAF), mirroring --os-motion-* and --os-ease-*
// (DESIGN_SPEC 1.10). Physics springs above take their constants from `springs`; they are not duration-based.
/** Durations in ms. `sheetExit` is the one exit that is not --os-motion-hover. */
export const motion = {
  press: 120,
  hover: 160,
  popup: 220,
  modal: 280,
  sheet: 360,
  sheetExit: 240,
  layout: 420,
  slow: 600,
  spin: 800,
  /** The longest anything may take under prefers-reduced-motion (opacity only). */
  reduced: 120,
} as const;

/** Easing curves as CSS strings. */
export const easing = {
  /** Default settle for entries, colors and layout. */
  settle: 'cubic-bezier(.22,1,.36,1)',
  /** Small objects that overshoot: pills, fills, chips. */
  spring: 'cubic-bezier(.24,1.34,.38,1)',
  /** Everything that leaves the screen. */
  exit: 'cubic-bezier(.4,0,1,1)',
} as const;

/** True when the user asked for reduced motion. Safe to call during SSR (returns false). */
export function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}
