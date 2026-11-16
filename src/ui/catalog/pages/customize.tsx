import { AuditTable } from '../customize/AuditTable';
import { ExportPanel } from '../customize/ExportPanel';
import { ThemeControls } from '../customize/ThemeControls';
import { ThemePreview } from '../customize/ThemePreview';
import { Heading } from '../PageParts';
import '../customize/customize.css';

const path = 'docs/customize';

export default function Customize() {
  return (
    <>
      <div className="cz-builder" data-docs-raw="">
        <div className="cz-grid">
          <ThemeControls variant="full" />
          <ThemePreview />
        </div>
      </div>

      <div className="cz-below">
        <ExportPanel />
        <AuditTable />

        <Heading level={2} id="what-stays-fixed" path={path}>What stays fixed, and why</Heading>
        <ul>
          <li><strong>Sizes and spacing.</strong> Each component has a size prop, and Table has a compact density.</li>
          <li><strong>Type scale and line heights.</strong> Text sits on whole pixels at every size, so the scale is set once.</li>
          <li><strong>Status colors.</strong> Success, warning and error keep their meaning in every theme.</li>
          <li><strong>The selection blue.</strong> Selected text and rows read the same everywhere.</li>
          <li><strong>Signature motion.</strong> Sizes, travel and springs of the components built around one interaction, such as StretchSwitch and ScrubStepper.</li>
          <li><strong>Circles.</strong> Switches, radios, avatars, sliders and spinners stay round under every ladder. Buttons, fields and badges are pills only under Round.</li>
          <li><strong>Shadows, the dark overlay and motion.</strong> Their shape and timing belong to the system, not the brand.</li>
        </ul>
        <p>
          Corners come in ladders rather than a slider because a nested shape takes the outer radius minus its inset. A slider would
          break those sums; a ladder keeps every pair concentric.
        </p>
      </div>
    </>
  );
}
