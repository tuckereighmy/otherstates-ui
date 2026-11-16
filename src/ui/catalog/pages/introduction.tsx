import { docs } from '../docs/registry';
import { docCategories } from '../docs/types';
import { DocsIcon } from '../icons';
import { Heading } from '../PageParts';
import { componentHref, pageHref } from '../route';
import { Showcase } from './showcase';

// The body of #docs/introduction. The shell renders the title and the two-sentence description above it.

const path = 'docs/introduction';

const principles = [
  {
    title: 'Own the code',
    text: 'Each component is a file you copy into your project, with the few shared helpers it imports. Read it, change it, or delete the parts you do not need. There is no runtime package and nothing to override from outside: running the installer again upgrades the files and keeps the ones you edited.',
  },
  {
    title: 'Accessible by default',
    text: 'Interaction comes from React Aria. Keyboard support, focus management and screen-reader semantics are part of every control, not a later pass.',
  },
  {
    title: 'One token contract',
    text: 'Color, type, spacing, radius, shadow and motion are StyleX variables. Change a token and every component that reads it follows, in both themes.',
  },
  {
    title: 'Motion with a reason',
    text: 'Things move when their state changes, to show where something came from or where it went. When the system asks for less motion, the movement goes and the change stays.',
  },
];

// What a component page holds, said only as far as every page bears it out. Read from the docs
// registry, so the sentence stays true while pages are still being filled in.
function browseSummary() {
  const all = (test: (doc: typeof docs[number]) => boolean) => docs.length > 0 && docs.every(test);
  const examples = all(doc => doc.examples.length > 1);
  const props = all(doc => doc.api.length > 0);
  if (examples && props) return 'Every component has a page with live examples, the code for each one and a props reference.';
  if (examples) return 'Every component has a page with live examples and the code for each one.';
  return 'Every component has a page with a live preview, its code and the files to copy.';
}

export default function Introduction() {
  // Categories in their declared order, each with its components in title order. A category
  // with no pages yet is left out.
  const groups = docCategories
    .map(category => ({ category, items: docs.filter(doc => doc.category === category) }))
    .filter(group => group.items.length > 0);

  return (
    <>
      <Showcase />

      <Heading level={2} id="principles" path={path}>Principles</Heading>
      <ul className="pg-principles" role="list" data-docs-raw="">
        {principles.map(principle => (
          <li key={principle.title} className="pg-principle">
            <h3 className="pg-principle-title">{principle.title}</h3>
            <p className="pg-principle-text">{principle.text}</p>
          </li>
        ))}
      </ul>

      <div className="docs-actions">
        <a className="docs-button" data-variant="primary" href={pageHref('get-started')}>
          Get started <DocsIcon name="arrowRight" size={14} />
        </a>
        <a className="docs-button" data-variant="secondary" href={pageHref('styling')}>
          Styling and themes
        </a>
      </div>

      <Heading level={2} id="browse-components" path={path}>Browse components</Heading>
      <p>{browseSummary()}</p>
      <div className="pg-browse" data-docs-raw="">
        {groups.map(group => (
          <section key={group.category} className="pg-browse-group" aria-labelledby={`browse-${group.category.toLowerCase()}`}>
            <h3 className="pg-browse-label" id={`browse-${group.category.toLowerCase()}`}>{group.category}</h3>
            <ul className="pg-links" role="list">
              {group.items.map(doc => (
                <li key={doc.id}>
                  <a className="pg-link" href={componentHref(doc.id)}>{doc.title}</a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
