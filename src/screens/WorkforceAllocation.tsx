import { WorkforceBlueprint, WorkforceMode } from "../types/workmesh";
import { customerSupportProcess } from "../data/processes";
import { analyzeProcess } from "../logic/workmeshEngine";
import { formatPercent, formatWorkforceMode } from "../utils/formatting";

interface WorkforceAllocationProps {
  onBack: () => void;
  onBuildBlueprint: () => void;
}

const mixOrder: {
  mode: WorkforceMode;
  key: keyof WorkforceBlueprint["distribution"];
}[] = [
  { mode: "HUMAN", key: "human" },
  { mode: "HUMAN_AI", key: "humanAI" },
  { mode: "AI", key: "ai" },
  { mode: "AUTOMATION", key: "automation" },
];

const modeClass: Record<WorkforceMode, string> = {
  HUMAN: "mode-human",
  HUMAN_AI: "mode-human-ai",
  AI: "mode-ai",
  AUTOMATION: "mode-automation",
};

function WorkforceAllocation({
  onBack,
  onBuildBlueprint,
}: WorkforceAllocationProps) {
  const process = customerSupportProcess;
  const blueprint = analyzeProcess(process.id, process.name, process.tasks);
  const tasks = [...blueprint.tasks].sort((a, b) => a.order - b.order);

  return (
    <main className="allocation">
      <header className="process-map-header">
        <p className="eyebrow">WORKMESH</p>
        <button className="back-button" onClick={onBack}>
          ← Back to Task
        </button>
      </header>

      <section className="allocation-intro">
        <p className="section-label">Workforce Allocation</p>
        <h1 className="process-title">{blueprint.processName}</h1>
        <p className="process-description">
          WorkMesh has analyzed the work task-by-task and mapped each task to
          the workforce model best suited to it.
        </p>
        <p className="allocation-count">{tasks.length} TASKS ANALYZED</p>
      </section>

      <section className="mix">
        <div className="mix-heading">
          <p className="section-label">Workforce Mix</p>
          <p className="mix-caption">
            Task distribution · share of analyzed work
          </p>
        </div>

        <div className="mix-bar" aria-hidden="true">
          {mixOrder
            .filter(({ key }) => blueprint.distribution[key] > 0)
            .map(({ mode, key }) => (
              <span
                key={mode}
                className={`mix-segment ${modeClass[mode]}`}
                style={{ flexGrow: blueprint.distribution[key] }}
              />
            ))}
        </div>

        <ul className="mix-values">
          {mixOrder.map(({ mode, key }) => (
            <li key={mode} className="mix-value">
              <span className="mix-label">
                <span className={`mode-swatch ${modeClass[mode]}`} />
                {formatWorkforceMode(mode)}
              </span>
              <span className="mix-percent">
                {formatPercent(blueprint.distribution[key])}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="allocation-tasks">
        <p className="section-label">Task Allocation</p>

        <ol className="allocation-list">
          {tasks.map((task) => (
            <li key={task.id} className="allocation-row">
              <span className="task-number">
                {String(task.order).padStart(2, "0")}
              </span>
              <span className="allocation-name">{task.name}</span>
              <span className="allocation-result">
                <span className="allocation-mode">
                  <span
                    className={`mode-swatch ${modeClass[task.recommendation.mode]}`}
                  />
                  {formatWorkforceMode(task.recommendation.mode)}
                </span>
                <span className="allocation-confidence">
                  {task.recommendation.confidence}% confidence
                </span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <div className="task-intel-actions">
        <button onClick={onBuildBlueprint}>BUILD WORKFORCE BLUEPRINT →</button>
      </div>
    </main>
  );
}

export default WorkforceAllocation;
