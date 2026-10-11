import { Task, TaskAssessment } from "../types/workmesh";
import { analyzeTask } from "../logic/workmeshEngine";
import { formatWorkforceMode } from "../utils/formatting";

interface TaskIntelligenceProps {
  task: Task;
  onBack: () => void;
  onViewAllocation: () => void;
}

const dimensions: { key: keyof TaskAssessment; label: string }[] = [
  { key: "repetition", label: "Repetition" },
  { key: "judgment", label: "Judgment" },
  { key: "risk", label: "Risk" },
  { key: "humanInteraction", label: "Human Interaction" },
  { key: "dataDependency", label: "Data Dependency" },
  { key: "complexity", label: "Complexity" },
];

const SCALE = [1, 2, 3, 4, 5];

function TaskIntelligence({
  task,
  onBack,
  onViewAllocation,
}: TaskIntelligenceProps) {
  const { recommendation } = analyzeTask(task);

  return (
    <main className="task-intel">
      <header className="process-map-header">
        <p className="eyebrow">WORKMESH</p>
        <button className="back-button" onClick={onBack}>
          ← Back to Process
        </button>
      </header>

      <section className="task-intel-intro">
        <p className="section-label">Task Intelligence</p>
        <h1 className="process-title">{task.name}</h1>
        <p className="process-description">{task.description}</p>
      </section>

      <div className="task-intel-grid">
        <section className="characteristics">
          <p className="section-label">Work Characteristics</p>

          <ul className="characteristic-list">
            {dimensions.map(({ key, label }) => {
              const value = task.assessment[key];
              return (
                <li key={key} className="characteristic">
                  <span className="characteristic-label">{label}</span>
                  <span
                    className="score"
                    aria-label={`${label}: ${value} out of 5`}
                  >
                    {SCALE.map((step) => (
                      <span
                        key={step}
                        className={
                          step <= value ? "score-step filled" : "score-step"
                        }
                      />
                    ))}
                  </span>
                  <span className="score-value">{value}/5</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="recommendation">
          <p className="recommendation-label">Workforce Recommendation</p>

          <p className="recommendation-mode">
            {formatWorkforceMode(recommendation.mode)}
          </p>

          <div className="recommendation-confidence">
            <span className="recommendation-meta-label">Confidence</span>
            <span className="recommendation-confidence-value">
              {recommendation.confidence}%
            </span>
          </div>

          <div className="recommendation-reason">
            <p className="recommendation-meta-label">
              Why this recommendation
            </p>
            <p className="recommendation-reason-text">
              {recommendation.reason}
            </p>
          </div>

          {recommendation.alternative && (
            <p className="recommendation-alternative">
              Alternative: {formatWorkforceMode(recommendation.alternative)}
            </p>
          )}
        </section>
      </div>

      <div className="task-intel-actions">
        <button onClick={onViewAllocation}>VIEW WORKFORCE ALLOCATION →</button>
      </div>
    </main>
  );
}

export default TaskIntelligence;
