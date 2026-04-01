import { PageHeader } from "../../components/ui/PageHeader";
import { Panel } from "../../components/ui/Panel";

const sections = [
  {
    title: "Product rationale",
    body: "The product exists to reduce context switching across merchant support, disputes, risk, and treasury. The core design choice was to organize the interface around operational decisions instead of isolated tools."
  },
  {
    title: "Architecture",
    body: "The app is organized around typed domain models, a mock client boundary, and route-level features. The current data layer is local so the workflow model can be validated before wiring live services."
  },
  {
    title: "Quality strategy",
    body: "Tests cover rendering integrity and critical workflow actions such as dispute updates. CI runs linting, tests, and a production build to keep the workspace stable as features change."
  }
];

export function PlaybookPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="System notes"
        title="Product rationale, implementation notes, and quality controls"
        description="Reference material for teams extending the workspace or integrating it with merchant, risk, dispute, and treasury systems."
      />

      <section className="dashboard-grid">
        {sections.map((section) => (
          <Panel key={section.title} title={section.title} subtitle="Implementation notes">
            <p>{section.body}</p>
          </Panel>
        ))}
      </section>
    </div>
  );
}
