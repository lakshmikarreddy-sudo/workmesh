import { useMemo, useState } from "react";
import { customerSupportProcess } from "../data/processes";
import { analyzeProcess } from "../logic/workmeshEngine";
import {
  ADOPTION_STEP,
  ScenarioMix,
  Simulation as SimulationModel,
  buildSimulation,
  runScenario,
} from "../logic/simulator";
import { formatPercent, formatPointChange } from "../utils/formatting";

interface SimulationProps {
  onBack: () => void;
}

// Positions a marker or label under the slider; the thumb travels inside a 12px inset.
const scalePosition = (fraction: number) =>
  `calc(12px + (100% - 24px) * ${fraction})`;

const categories: {
  key: keyof ScenarioMix;
  label: string;
  className: string;
}[] = [
  { key: "humanLed", label: "Human-led", className: "mode-human" },
  { key: "aiEnabled", label: "AI-enabled", className: "mode-human-ai" },
  { key: "automation", label: "Automation", className: "mode-automation" },
];

const quote = (names: string[]) =>
  names.map((name) => `“${name}”`).join(" and ");

function buildStatement(
  simulation: SimulationModel,
  adoption: number
): string {
  const { baselineAdoption, maxAdoption } = simulation;
  const humanNames = quote(simulation.humanLedTasks.map((t) => t.name));
  const humanClause = humanNames
    ? `high-judgment work such as ${humanNames} stays human-led`
    : "rule-based work stays automated";

  if (adoption >= maxAdoption && adoption > baselineAdoption) {
    return `At the maximum modeled level, all AI-suitable work is AI-enabled. Rule-based tasks stay automated, and ${humanClause}.`;
  }

  if (adoption > baselineAdoption) {
    const aiNames = quote(simulation.aiSuitableTasks.map((t) => t.name));
    return `AI takes on more of the data-driven work in tasks such as ${aiNames}, while ${humanClause}.`;
  }

  if (adoption < baselineAdoption) {
    return "With less AI adoption, more analytical work returns to people, while automation continues to handle structured, repetitive tasks.";
  }

  return "This is the baseline from the current analysis. Move the slider to model a different level of AI adoption.";
}

function Simulation({ onBack }: SimulationProps) {
  const process = customerSupportProcess;

  const simulation = useMemo(
    () => buildSimulation(analyzeProcess(process.id, process.name, process.tasks)),
    [process]
  );

  const { baseline, baselineAdoption, maxAdoption } = simulation;
  const baselineStep = Math.min(
    Math.round(baselineAdoption / ADOPTION_STEP) * ADOPTION_STEP,
    maxAdoption
  );
  const [adoption, setAdoption] = useState(baselineStep);

  const scenario = runScenario(simulation, adoption);

  // Slider positions as a fraction of the modeled range.
  const fractionOf = (value: number) =>
    maxAdoption > 0 ? Math.min(value / maxAdoption, 1) : 0;

  return (
    <main className="simulation">
      <header className="process-map-header">
        <p className="eyebrow">WORKMESH</p>
        <button className="back-button" onClick={onBack}>
          ← Back to Blueprint
        </button>
      </header>

      <section className="simulation-intro">
        <p className="section-label">What-If Simulation</p>
        <h1 className="process-title">{process.name}</h1>
        <p className="process-description">
          Explore how different levels of AI adoption could change the way
          work is distributed.
        </p>
      </section>

      <section className="sim-workspace">
        <div className="sim-control">
          <div className="sim-control-heading">
            <label className="section-label" htmlFor="ai-adoption">
              AI Adoption
            </label>
            <p className="sim-baseline-note">
              Baseline {formatPercent(baselineAdoption)} AI adoption
            </p>
          </div>

          <p className="sim-adoption-value" aria-live="polite">
            {adoption}%
          </p>

          <div className="sim-slider">
            <div className="sim-track" aria-hidden="true">
              <span
                className="sim-fill"
                style={{ width: `${fractionOf(adoption) * 100}%` }}
              />
              <span
                className="sim-baseline-marker"
                style={{ left: `${fractionOf(baselineAdoption) * 100}%` }}
              />
            </div>
            <input
              id="ai-adoption"
              type="range"
              min={0}
              max={maxAdoption}
              step={ADOPTION_STEP}
              value={adoption}
              onChange={(event) => setAdoption(Number(event.target.value))}
              aria-valuetext={`${adoption}% AI adoption`}
            />
          </div>

          <div className="sim-scale" aria-hidden="true">
            <span>0%</span>
            <span
              className="sim-scale-baseline"
              style={{ left: scalePosition(fractionOf(baselineAdoption)) }}
            >
              Baseline
            </span>
            <span className="sim-scale-max">
              {maxAdoption}% maximum modeled
            </span>
          </div>

          <p className="section-label sim-mix-label">Scenario Workforce Mix</p>
          <ul className="sim-mix">
            {categories.map(({ key, label, className }) => (
              <li key={key} className="sim-mix-item">
                <span className="mix-label">
                  <span className={`mode-swatch ${className}`} />
                  {label}
                </span>
                <span className="sim-mix-value">
                  {formatPercent(scenario[key])}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="sim-compare">
          <table className="sim-table">
            <thead>
              <tr>
                <th scope="col">
                  <span className="visually-hidden">Measure</span>
                </th>
                <th scope="col">Baseline</th>
                <th scope="col">Scenario</th>
                <th scope="col">Change</th>
              </tr>
            </thead>
            <tbody>
              <tr className="sim-table-adoption">
                <th scope="row">AI adoption</th>
                <td>{formatPercent(baselineAdoption)}</td>
                <td>{adoption}%</td>
                <td
                  className={
                    Math.abs(adoption - baselineAdoption) < 0.05
                      ? "sim-delta-none"
                      : undefined
                  }
                >
                  {formatPointChange(adoption - baselineAdoption)}
                </td>
              </tr>
              {categories.map(({ key, label }) => {
                const delta = scenario[key] - baseline[key];
                return (
                  <tr key={key}>
                    <th scope="row">{label}</th>
                    <td>{formatPercent(baseline[key])}</td>
                    <td>{formatPercent(scenario[key])}</td>
                    <td
                      className={
                        Math.abs(delta) < 0.05 ? "sim-delta-none" : "sim-delta"
                      }
                    >
                      {formatPointChange(delta)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <p className="sim-statement">{buildStatement(simulation, adoption)}</p>

          <p className="sim-model-note">
            Modeled scenario assumption based on the task analysis, not a
            measurement of actual AI adoption.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Simulation;
