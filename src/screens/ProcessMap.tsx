import { Task } from "../types/workmesh";
import { customerSupportProcess } from "../data/processes";

interface ProcessMapProps {
  onBack: () => void;
  onSelectTask: (task: Task) => void;
}

function ProcessMap({ onBack, onSelectTask }: ProcessMapProps) {
  const process = customerSupportProcess;
  const tasks = [...process.tasks].sort((a, b) => a.order - b.order);

  return (
    <main className="process-map">
      <header className="process-map-header">
        <p className="eyebrow">WORKMESH</p>
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
      </header>

      <section className="process-intro">
        <p className="section-label">Process</p>
        <h1 className="process-title">{process.name}</h1>
        <p className="process-description">{process.description}</p>
        <p className="task-count">{tasks.length} tasks</p>
      </section>

      <ol className="task-list">
        {tasks.map((task) => (
          <li key={task.id}>
            <button className="task-card" onClick={() => onSelectTask(task)}>
              <span className="task-number">
                {String(task.order).padStart(2, "0")}
              </span>
              <div>
                <h2 className="task-name">{task.name}</h2>
                <p className="task-description">{task.description}</p>
              </div>
            </button>
          </li>
        ))}
      </ol>
    </main>
  );
}

export default ProcessMap;
