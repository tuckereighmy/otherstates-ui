import { Component, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import {
  Accordion,
  AccordionGroup,
  Button,
  Icon,
  Progress,
  SegmentedControl,
  Skeleton,
  StatusBadge,
  Switch,
} from '../../components';
import { DocsIcon } from '../icons';
import { stateCards, type Go, type StateCard } from './states';
import './home.css';

export type HomeTheme = 'light' | 'dark';

type HomeProps = {
  theme: HomeTheme;
  onThemeChange: (theme: HomeTheme) => void;
  /** The docs site, /ui/. Every docs link is built on it. */
  docsHref: string;
  /** The long Otherstates logo, drawn as a mask so it takes the text color. */
  logo: string;
};

// The hero's state sheet: real components, each caught in one of its other states and named the way a
// design file names a variant. It is decoration, so assistive tech and the keyboard skip it; the cards
// below are the live ones.
const sheet = [
  { state: 'loading', component: 'Button', content: <Button size="sm" isLoading>Deploy</Button> },
  { state: 'needs input', component: 'StatusBadge', content: <StatusBadge state="needs-input" /> },
  { state: 'disabled', component: 'Switch', content: <Switch aria-label="Sync" isDisabled defaultSelected /> },
  { state: 'placeholder', component: 'Skeleton', content: <div className="home-sheet-lines"><Skeleton lines={3} /></div> },
  { state: 'failed', component: 'StatusBadge', content: <StatusBadge state="failed" /> },
  { state: 'syncing', component: 'Progress', content: <Progress variant="circular" size="sm" label="Syncing" isIndeterminate /> },
];

const steps = [
  {
    title: 'Install the kit',
    text: 'Run the installer in your Vite or Next.js app. It copies the components into your project, sets up StyleX and gives your agent the skill and the catalog.',
    code: 'npx otherstates-ui',
  },
  {
    title: 'Build with your agent',
    text: 'Your agent looks up the right component and the states it ships, instead of inventing its own.',
  },
  {
    title: 'The check catches drift',
    text: 'In Claude Code, a hook runs the check after every edit. Raw colors, off-scale spacing and type, raw radii and shadows, utility classes, other UI kits and hand-rolled controls come back as errors the agent fixes.',
  },
];

// What the Claude Code hook printed for a hand-written card (check.mjs --hook), word for word, with the
// file path shortened. Four of its six findings are listed; the last line names the other two.
const hookHeader = 'Otherstates UI check: 6 error(s), 0 warning(s). Fix them with system tokens and components (see src/ui/AGENTS.md):';
const findings = [
  { at: 'RunCard.tsx:4:20', rule: 'raw-space', message: 'padding: 18 is a raw space.', fix: 'not on the spacing scale (2 4 6 8 12 16 20 24 32 40 48 56): pick a step' },
  { at: 'RunCard.tsx:4:58', rule: 'raw-color', message: 'Raw color in backgroundColor.', fix: 'use a --os-color-* token' },
  { at: 'RunCard.tsx:5:22', rule: 'raw-type', message: 'fontSize: 11 is a raw size.', fix: 'not on the type scale: use a --os-font-size-* token' },
  { at: 'RunCard.tsx:12:7', rule: 'native-control', message: '<button> hand-rolls a control the system already has.', fix: 'use <Button>' },
];

const foundations = [
  {
    name: 'React Aria',
    icon: 'keyboard' as const,
    text: 'Keyboard, focus and screen-reader behavior, tested across browsers and assistive tech. Press and hover are handled the same way for mouse, touch and pen. The date and number fields are localized and work right to left.',
  },
  {
    name: 'StyleX',
    icon: 'code' as const,
    text: 'Styles compile to static CSS, and inside a component the last style applied wins, so its states never fight. Tokens are typed variables: change one and every component follows. Customize builds a theme for light and dark together.',
  },
];

const questions = [
  {
    id: 'name',
    title: 'Why is it called Otherstates?',
    body: 'A mockup shows a component in its default state. Everything else is the other states: hover, loading, empty, failed, disabled, waiting on a person. That is where products start to feel unfinished, and where AI-written interfaces often cut corners. Agent products add new ones, like waiting on a person or running over a limit, so Otherstates ships them with its components.',
  },
  {
    id: 'agents',
    title: 'Can my coding agent use it?',
    body: 'It was built for that. The kit adds a skill and a component catalog your agent reads. In Claude Code, a hook runs the check after every edit; it flags raw colors, off-scale spacing and type sizes, raw radii and shadows, utility classes, other UI libraries and hand-rolled controls, and keeps the system\'s own files safe to render on a server. Other agents are told to run the check before they finish.',
  },
  {
    id: 'needs',
    title: 'Does it work with Next.js?',
    body: 'Yes: Next.js 16 on the App Router, or Vite, with React 19. The installer sets up StyleX for either. In Next.js your pages stay Server Components; the components that need the browser are marked for the client already. With another bundler, copy the files with --files-only and add the StyleX plugin yourself.',
  },
  {
    id: 'tailwind',
    title: 'My app already uses Tailwind. Can I add it?',
    body: 'Yes, with Tailwind 4. Your Tailwind keeps working, but it sits in a CSS layer below the components, so it can\'t restyle them. The installer records the utility classes your code already has, so the check only fails on new ones, and you move screens over one at a time.',
  },
  {
    id: 'look',
    title: 'Can I change how it looks?',
    body: 'Yes. Color, type, spacing, radii, shadows and motion are tokens. Customize lets you build a theme and copy it, and the components are files in your project, so you can edit them like your own code.',
  },
  {
    id: 'get',
    title: 'Is it free?',
    body: 'Yes. Otherstates UI is open source under the MIT license, and the code is on GitHub. Run npx otherstates-ui in your app\'s folder to install it, and run it again later to upgrade; files you edited are kept.',
  },
];

const repo = 'https://github.com/tuckereighmy/otherstates-ui';

export function Home({ theme, onThemeChange, docsHref, logo }: HomeProps) {
  const docs = (hash: string) => `${docsHref}#${hash}`;
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <div className="home">
      <a className="home-skip" href="#main">Skip to content</a>

      <header className="home-header">
        <div className="home-wrap home-header-inner">
          <a className="home-brand" href="#top" aria-label="Otherstates UI, home">
            <span className="home-brand-logo" style={{ '--home-logo': `url("${logo}")` } as CSSProperties} aria-hidden="true" />
            <span className="home-brand-name" aria-hidden="true">UI</span>
          </a>
          <nav className="home-nav" aria-label="Main">
            <a href={docs('docs/introduction')}>Docs</a>
            <a href={docs('docs/introduction/browse-components')}>Components</a>
            <a href={docs('templates')}>Templates</a>
            <a href={docs('docs/customize')}>Customize</a>
            <a href={repo}>GitHub</a>
          </nav>
          <div className="home-header-actions">
            <button type="button" className="home-icon-button" aria-label={`Switch to ${nextTheme} theme`} onClick={() => onThemeChange(nextTheme)}>
              <DocsIcon name={theme === 'dark' ? 'sun' : 'moon'} />
            </button>
            <Button size="sm" href={docs('docs/get-started')}>Get started</Button>
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        <section className="home-hero" id="top" aria-labelledby="home-title">
          <div className="home-wrap home-hero-inner">
            <div className="home-hero-copy">
              <h1 className="home-title" id="home-title">Every state,<br /> already designed.</h1>
              <p className="home-lead">
                React components for products with agents in them. Loading, empty, failed and waiting on you come built in,
                so neither you nor your coding agent has to invent them.
              </p>
              <div className="home-actions">
                <Button size="lg" href="#states">See the states</Button>
                <Button size="lg" appearance="secondary" href={docs('docs/introduction')}>Browse the docs</Button>
              </div>
              <p className="home-compat">
                Works with <a href={docs('docs/get-started/nextjs')}>Next.js 16</a> and <a href={docs('docs/get-started/stylex')}>Vite</a>, on React 19.
              </p>
            </div>
            <div className="home-sheet" aria-hidden="true" inert>
              {sheet.map(cell => (
                <div key={cell.state} className="home-sheet-cell">
                  <span className="home-sheet-state">{cell.state}</span>
                  <div className="home-sheet-specimen">{cell.content}</div>
                  <span className="home-sheet-name">{cell.component}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="home-section" id="states" aria-labelledby="states-title">
          <div className="home-wrap">
            <div className="home-section-head">
              <h2 className="home-h2" id="states-title">See the other states</h2>
              <p className="home-section-lead">Every card is the real component. Switch its state, or use it, to see what your users will.</p>
            </div>
            <ul className="home-grid" role="list">
              {stateCards.map(card => <StateCardView key={card.id} card={card} href={docs(`component/${card.id}`)} />)}
            </ul>
            <div className="home-more">
              <Button appearance="secondary" href={docs('docs/introduction/browse-components')}>All components</Button>
            </div>
          </div>
        </section>

        <section className="home-section" aria-labelledby="kit-title">
          <div className="home-wrap">
            <div className="home-section-head">
              <h2 className="home-h2" id="kit-title">Install the kit, and your agent stays on the system</h2>
              <p className="home-section-lead">
                The kit puts the components in your app and teaches your coding agent to use them. In Claude Code a check
                reads every edit and sends anything off-system back to the agent.
              </p>
            </div>
            <ol className="home-steps" role="list">
              {steps.map((step, index) => (
                <li key={step.title} className="home-step">
                  <span className="home-step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="home-step-title">{step.title}</h3>
                  <p className="home-step-text">{step.text}</p>
                  {step.code && <code className="home-step-code">{step.code}</code>}
                </li>
              ))}
            </ol>
            <figure className="home-terminal">
              <figcaption className="home-terminal-head">
                <span>What your agent sees after an edit</span>
                <span className="home-terminal-command">Claude Code hook</span>
              </figcaption>
              {/* It scrolls sideways on narrow screens, so keyboard users can focus it to scroll too. */}
              <div className="home-terminal-body" tabIndex={0} role="region" aria-label="Check output">
                <p className="home-terminal-line">{hookHeader}</p>
                <ul className="home-terminal-list" role="list">
                  {findings.map(item => (
                    <li key={item.at} className="home-finding">
                      <span className="home-finding-at">{item.at}</span>
                      <span className="home-finding-level">error</span>
                      <span className="home-finding-rule">{item.rule}</span>
                      <span className="home-finding-message">{item.message} <span className="home-finding-fix">→ {item.fix}</span></span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="home-terminal-foot">and 2 more: raw-radius at 4:38, utility-class at 12:15</p>
            </figure>
          </div>
        </section>

        <section className="home-section" aria-labelledby="built-title">
          <div className="home-wrap">
            <div className="home-section-head">
              <h2 className="home-h2" id="built-title">Built on React Aria and StyleX</h2>
              <p className="home-section-lead">The behavior you would never finish writing yourself, and styles compiled ahead of time.</p>
            </div>
            <ul className="home-foundations" role="list">
              {foundations.map(item => (
                <li key={item.name} className="home-foundation">
                  <span className="home-icon-tile" aria-hidden="true"><Icon name={item.icon} size={18} /></span>
                  <h3 className="home-foundation-title">{item.name}</h3>
                  <p className="home-foundation-text">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="home-section" aria-labelledby="faq-title">
          <div className="home-wrap home-faq">
            <h2 className="home-h2" id="faq-title">Questions</h2>
            <AccordionGroup>
              {questions.map(question => (
                <Accordion key={question.id} id={question.id} title={question.title}>{question.body}</Accordion>
              ))}
            </AccordionGroup>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="home-wrap home-footer-inner">
          <div className="home-footer-brand">
            <span className="home-brand-logo" style={{ '--home-logo': `url("${logo}")` } as CSSProperties} aria-hidden="true" />
            <p>Every state, already designed.</p>
            <p>MIT license. Made by <a href="https://www.teighmy22.com">Tucker Eighmy</a>.</p>
          </div>
          <nav className="home-footer-links" aria-label="Footer">
            <div>
              <h2>Components</h2>
              <ul role="list">
                {stateCards.map(card => <li key={card.id}><a href={docs(`component/${card.id}`)}>{card.title}</a></li>)}
              </ul>
            </div>
            <div>
              <h2>Docs</h2>
              <ul role="list">
                <li><a href={docs('docs/introduction')}>Introduction</a></li>
                <li><a href={docs('docs/get-started')}>Get started</a></li>
                <li><a href={docs('docs/styling')}>Styling</a></li>
                <li><a href={docs('docs/customize')}>Customize</a></li>
                <li><a href={docs('templates')}>Templates</a></li>
              </ul>
            </div>
            <div>
              <h2>Project</h2>
              <ul role="list">
                <li><a href={repo}>GitHub</a></li>
                <li><a href={`${repo}/blob/main/LICENSE`}>License</a></li>
                <li><a href={`${repo}/releases`}>Releases</a></li>
              </ul>
            </div>
          </nav>
        </div>
      </footer>
    </div>
  );
}

// One failing preview shows a note instead of taking the page down. Local, so the homepage does not pull
// in the docs' shared parts (and with them every docs page).
class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function StateCardView({ card, href }: { card: StateCard; href: string }) {
  const [value, setValue] = useState(card.states[0].value);
  // Choosing a state starts it over (a fresh field, a full list), so each pick gets a new key.
  const [visits, setVisits] = useState<Record<string, number>>({});
  const switchRef = useRef<HTMLDivElement>(null);

  function pick(next: string) {
    setValue(next);
    setVisits(all => ({ ...all, [next]: (all[next] ?? 0) + 1 }));
  }
  const go: Go = (next, onlyFrom) => setValue(current => (onlyFrom && current !== onlyFrom ? current : next));

  // On a narrow card the switch scrolls sideways; keep the chosen state and its focus ring in view.
  useEffect(() => {
    const box = switchRef.current;
    if (!box || box.scrollWidth <= box.clientWidth) return;
    const segment = box.querySelector('input:checked')?.closest('label');
    if (!segment) return;
    const outer = box.getBoundingClientRect();
    const inner = segment.getBoundingClientRect();
    if (inner.left < outer.left + 12) box.scrollLeft -= outer.left + 12 - inner.left;
    else if (inner.right > outer.right - 12) box.scrollLeft += inner.right - (outer.right - 12);
  }, [value]);

  return (
    <li className="home-card" data-width={card.width}>
      <div className="home-card-stage">
        <div className="home-card-switch" ref={switchRef}>
          <div className="home-card-switch-fit">
            <SegmentedControl size="sm" label={`${card.title} state`} value={value} onChange={pick} options={card.states.map(item => ({ value: item.value, label: item.label }))} />
          </div>
        </div>
        {/* Every state is mounted in the same cell, so the card is always as tall as its tallest state and
            switching never moves the page. Only the chosen one is visible, focusable and announced. */}
        <div className="home-card-preview">
          {card.states.map(item => {
            const current = item.value === value;
            return (
              <div key={`${item.value}-${visits[item.value] ?? 0}`} className="home-card-state" data-current={current || undefined} aria-hidden={!current || undefined} inert={!current}>
                <Boundary fallback={<p className="home-card-error">This preview could not be shown.</p>}>
                  {item.render(go)}
                </Boundary>
              </div>
            );
          })}
        </div>
      </div>
      <a className="home-card-foot" href={href}>
        <span className="home-card-text">
          <span className="home-card-title">{card.title}</span>
          <span className="home-card-desc">{card.description}</span>
        </span>
        <DocsIcon name="arrowRight" size={14} />
      </a>
    </li>
  );
}
