import { customerSupportProcess } from "../data/processes";
import { analyzeProcess } from "../logic/workmeshEngine";
import { BlueprintLayerKey, buildBlueprintLayers } from "../logic/blueprint";
import { formatPercent, formatWorkforceMode } from "../utils/formatting";

interface WorkforceBlueprintProps {
  onBack: () => void;
  onRunSimulation: () => void;
}

const layerContent: Record<
  BlueprintLayerKey,
  { label: string; role: string; heading: string; className: string }
> = {
  humanLed: {
    label: "Human-led",
    role: "Judgment and accountability",
    heading: "Requires human judgment",
    className: "mode-human",
  },
  aiEnabled: {
    label: "AI-enabled",
    role: "AI-led or AI-assisted work",
    heading: "AI augments human work",
    className: "mode-human-ai",
  },
  automation: {
    label: "Automation",
    role: "Structured, repetitive work",
    heading: "Automation-ready work",
    className: "mode-automation",
  },
};

function WorkforceBlueprint({
  onBack,
  onRunSimulation,
}: WorkforceBlueprintProps) {
  const process = customerSupportProcess;
  const blueprint = analyzeProcess(process.id, process.name, process.tasks);
  const layers = buildBlueprintLayers(blueprint);

  const automationShare =
    layers.find((layer) => layer.key === "automation")?.share ?? 0;
  const retainedShare = Math.round((100 - automationShare) * 10) / 10;

  // Columns grow with their share, with a floor so small layers stay readable.
  const columns = layers
    .map((layer) => `minmax(250px, ${Math.max(layer.share, 1)}fr)`)
    .join(" ");

  return (
    <main className="blueprint">
      <header className="process-map-header">
        <p className="eyebrow">WORKMESH</p>
        <button className="back-button" onClick={onBack}>
          ← Back to Allocation
        </button>
      </header>

      <section className="blueprint-intro">
        <p className="section-label">Workforce Blueprint</p>
        <h1 className="process-title">{blueprint.processName}</h1>
        <p className="process-description">
          An evidence-based view of how this process could operate across
          humans, AI and automation.
        </p>
      </section>

      <section className="future">
        <div className="mix-heading">
          <p className="section-label">Future Workforce</p>
          <p className="mix-caption">
            {blueprint.tasks.length} analyzed tasks · three workforce layers ·
            share of analyzed work
          </p>
        </div>

        <div className="future-bar" aria-hidden="true">
          {layers
            .filter((layer) => layer.share > 0)
            .map((layer) => (
              <span
                key={layer.key}
                className={`mix-segment ${layerContent[layer.key].className}`}
                style={{ flexGrow: layer.share }}
              />
            ))}
        </div>

        <div className="future-layers" style={{ gridTemplateColumns: columns }}>
          {layers.map((layer) => {
            const content = layerContent[layer.key];
            return (
              <div key={layer.key} className="future-layer">
                <p className="future-layer-label">
                  <span className={`mode-swatch ${content.className}`} />
                  {content.label}
                </p>
                <p className="future-layer-share">
                  {formatPercent(layer.share)}
                </p>
                <p className="future-layer-role">{content.role}</p>

                <p className="future-layer-heading">{content.heading}</p>

                {layer.tasks.length === 0 ? (
                  <p className="future-task-empty">No tasks in this layer.</p>
                ) : (
                  <ul className="future-task-list">
                    {layer.tasks.map((task) => (
                      <li key={task.id} className="future-task">
                        <span className="future-task-name">{task.name}</span>
                        {layer.key === "humanLed" && (
                          <span className="future-task-detail">
                            {task.description}
                          </span>
                        )}
                        {layer.key === "aiEnabled" && (
                          <span className="future-task-detail">
                            {formatWorkforceMode(task.recommendation.mode)}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="capacity">
        <p className="capacity-statement">
          <strong>{formatPercent(automationShare)}</strong> of analyzed tasks
          are automation-ready.
        </p>
        <p className="capacity-statement">
          <strong>{formatPercent(retainedShare)}</strong> of analyzed tasks
          involve human judgment or AI-led analysis.
        </p>
      </section>

      <div className="task-intel-actions">
        <button onClick={onRunSimulation}>RUN WHAT-IF SIMULATION →</button>
      </div>
    </main>
  );
}

export default WorkforceBlueprint;
