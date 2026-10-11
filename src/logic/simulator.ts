import { AnalyzedTask, WorkforceBlueprint } from "../types/workmesh";

/*
 * WHAT-IF SIMULATION (V1)
 *
 * A deterministic scenario model, not a prediction. "AI adoption" is the
 * share of analyzed work that is AI-enabled (AI-led or Human + AI). The
 * baseline is the AI-enabled share from the current analysis.
 *
 * Each task carries an equal share of the work and plays one role:
 *
 *   fixedHuman       HUMAN recommendation (high judgment / high risk).
 *                    Always human-led, at any adoption level.
 *   aiEnabled        HUMAN_AI or AI recommendation. Below the baseline,
 *                    this work progressively returns to people.
 *   aiSuitable       AUTOMATION, but data-dependent work that involves some
 *                    judgment. Above the baseline, this work progressively
 *                    moves from rule-based automation to AI.
 *   fixedAutomation  Purely structured AUTOMATION work. Always automated.
 *
 * AI-enabled work therefore cannot exceed aiEnabled + aiSuitable work
 * (the modeled ceiling). The adoption scale runs from 0 to that ceiling
 * (maxAdoption, in whole slider steps), so every selectable value
 * produces a distinct scenario:
 *
 *   0 .. baseline        AI-enabled work returns to people, 1:1.
 *   baseline .. maximum  AI-suitable automation moves to AI, 1:1.
 *
 * Human-led work never falls below the fixedHuman share, and automation
 * never falls below the fixedAutomation share.
 */

type SimulationRole = "fixedHuman" | "aiEnabled" | "aiSuitable" | "fixedAutomation";

export const ADOPTION_STEP = 5;

export interface ScenarioMix {
  humanLed: number;
  aiEnabled: number;
  automation: number;
}

export interface Simulation {
  baselineAdoption: number;
  ceiling: number;
  maxAdoption: number;
  baseline: ScenarioMix;
  humanLedTasks: AnalyzedTask[];
  aiSuitableTasks: AnalyzedTask[];
  shares: Record<SimulationRole, number>;
}

function roleOf(task: AnalyzedTask): SimulationRole {
  const { mode } = task.recommendation;
  const { dataDependency, judgment } = task.assessment;

  if (mode === "HUMAN") return "fixedHuman";
  if (mode === "HUMAN_AI" || mode === "AI") return "aiEnabled";
  if (dataDependency >= 4 && judgment >= 2) return "aiSuitable";
  return "fixedAutomation";
}

export function buildSimulation(blueprint: WorkforceBlueprint): Simulation {
  const tasks = [...blueprint.tasks].sort((a, b) => a.order - b.order);
  const unit = tasks.length > 0 ? 100 / tasks.length : 0;

  const shares: Record<SimulationRole, number> = {
    fixedHuman: 0,
    aiEnabled: 0,
    aiSuitable: 0,
    fixedAutomation: 0,
  };
  tasks.forEach((task) => {
    shares[roleOf(task)] += unit;
  });

  const partial = {
    baselineAdoption: shares.aiEnabled,
    ceiling: shares.aiEnabled + shares.aiSuitable,
    shares,
  };

  return {
    ...partial,
    // Highest slider value that still changes the scenario.
    maxAdoption: Math.floor(partial.ceiling / ADOPTION_STEP + 1e-9) * ADOPTION_STEP,
    baseline: runScenario(partial, shares.aiEnabled),
    humanLedTasks: tasks.filter((task) => roleOf(task) === "fixedHuman"),
    aiSuitableTasks: tasks.filter((task) => roleOf(task) === "aiSuitable"),
  };
}

export function runScenario(
  simulation: Pick<Simulation, "baselineAdoption" | "ceiling" | "shares">,
  adoption: number
): ScenarioMix {
  const { baselineAdoption, ceiling, shares } = simulation;
  const aiEnabled = Math.min(Math.max(adoption, 0), ceiling);

  // Below the baseline, AI-enabled work returns to people.
  const returnedToPeople = Math.max(0, baselineAdoption - aiEnabled);
  // Above the baseline, AI-suitable work moves from automation to AI.
  const movedFromAutomation = Math.max(0, aiEnabled - baselineAdoption);

  return toTenths({
    humanLed: shares.fixedHuman + returnedToPeople,
    aiEnabled,
    automation:
      shares.fixedAutomation + shares.aiSuitable - movedFromAutomation,
  });
}

/*
 * Rounds to one decimal place while keeping the total at exactly 100
 * (largest-remainder method), matching the engine's distribution.
 */
function toTenths(mix: ScenarioMix): ScenarioMix {
  const keys = Object.keys(mix) as (keyof ScenarioMix)[];
  const total = keys.reduce((sum, key) => sum + mix[key], 0);

  if (total === 0) {
    return { humanLed: 0, aiEnabled: 0, automation: 0 };
  }

  const UNITS = 1000;
  const shares = keys.map((key) => {
    const exact = (mix[key] * UNITS) / total;
    return { key, units: Math.floor(exact + 1e-9), remainder: exact % 1 };
  });

  let leftover = UNITS - shares.reduce((sum, s) => sum + s.units, 0);

  [...shares]
    .sort((a, b) => b.remainder - a.remainder)
    .forEach((share) => {
      if (leftover > 0) {
        share.units++;
        leftover--;
      }
    });

  const result = { humanLed: 0, aiEnabled: 0, automation: 0 };
  shares.forEach((share) => {
    result[share.key] = share.units / 10;
  });
  return result;
}
