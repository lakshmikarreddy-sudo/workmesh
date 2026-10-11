import {
  Task,
  TaskAssessment,
  Recommendation,
  WorkforceMode,
  AnalyzedTask,
  WorkforceBlueprint,
} from "../types/workmesh";

const clamp = (value: number, min = 1, max = 5) =>
  Math.min(max, Math.max(min, value));

function calculateScores(a: TaskAssessment) {
  const repetition = clamp(a.repetition);
  const judgment = clamp(a.judgment);
  const risk = clamp(a.risk);
  const humanInteraction = clamp(a.humanInteraction);
  const dataDependency = clamp(a.dataDependency);
  const complexity = clamp(a.complexity);

  const automation =
    repetition * 0.35 +
    (6 - judgment) * 0.25 +
    (6 - risk) * 0.20 +
    (6 - complexity) * 0.20;

  const ai =
    repetition * 0.25 +
    dataDependency * 0.30 +
    complexity * 0.20 +
    (6 - humanInteraction) * 0.15 +
    (6 - risk) * 0.10;

  const human =
    judgment * 0.35 +
    risk * 0.30 +
    humanInteraction * 0.20 +
    complexity * 0.15;

  const collaboration =
    judgment * 0.25 +
    dataDependency * 0.25 +
    complexity * 0.20 +
    humanInteraction * 0.15 +
    (6 - risk) * 0.15;

  return {
    automation,
    ai,
    human,
    collaboration,
  };
}

function getRecommendation(
  assessment: TaskAssessment
): Recommendation {
  const {
    repetition,
    judgment,
    risk,
    humanInteraction,
    dataDependency,
    complexity,
  } = assessment;

  const scores = calculateScores(assessment);

  /*
   * SAFETY GATES
   *
   * High-risk + high-judgment work should remain human-led.
   */
  if (risk >= 4 && judgment >= 4) {
    return {
      mode: "HUMAN",
      confidence: 92,
      reason:
        "High judgment and high consequence require human accountability.",
    };
  }

  /*
   * High human interaction + high judgment:
   * AI can assist, but should not own the task.
   */
  if (judgment >= 4 && humanInteraction >= 3) {
    return {
      mode: "HUMAN_AI",
      confidence: 86,
      reason:
        "The task requires human judgment and interaction, while AI can support analysis and preparation.",
    };
  }

  /*
   * Highly structured, repetitive and predictable work.
   */
  if (
    repetition >= 4 &&
    judgment <= 2 &&
    risk <= 2 &&
    complexity <= 2
  ) {
    return {
      mode: "AUTOMATION",
      confidence: 90,
      reason:
        "Highly repetitive, structured and low-risk work is well suited to deterministic automation.",
    };
  }

  /*
   * Data-heavy, repetitive work with limited judgment.
   */
  if (
    dataDependency >= 4 &&
    repetition >= 3 &&
    judgment <= 3 &&
    risk <= 3
  ) {
    return {
      mode: "AI",
      confidence: 87,
      reason:
        "The task is data-intensive and repetitive with limited judgment, making it suitable for AI assistance or execution.",
    };
  }

  /*
   * AI can augment moderately complex judgment.
   */
  if (
    dataDependency >= 3 &&
    judgment >= 3 &&
    complexity >= 3 &&
    risk <= 3
  ) {
    return {
      mode: "HUMAN_AI",
      confidence: 82,
      reason:
        "AI can analyze information and prepare recommendations while human judgment remains important.",
    };
  }

  /*
   * Fall back to whichever model has the strongest score.
   */
  const ranked: [WorkforceMode, number][] = [
    ["HUMAN", scores.human],
    ["HUMAN_AI", scores.collaboration],
    ["AI", scores.ai],
    ["AUTOMATION", scores.automation],
  ];

  ranked.sort((a, b) => b[1] - a[1]);

  const [mode, topScore] = ranked[0];
  const [, secondScore] = ranked[1];

  const confidence = Math.round(
    Math.min(94, 65 + (topScore - secondScore) * 8)
  );

  const reasons: Record<WorkforceMode, string> = {
    HUMAN:
      "The task requires meaningful judgment, accountability or human interaction.",
    HUMAN_AI:
      "The task benefits from AI assistance while retaining human oversight.",
    AI:
      "The task is sufficiently data-driven and repeatable for AI to handle much of the work.",
    AUTOMATION:
      "The task is structured, repetitive and predictable enough for deterministic automation.",
  };

  return {
    mode,
    confidence,
    reason: reasons[mode],
  };
}

export function analyzeTask(task: Task): AnalyzedTask {
  return {
    ...task,
    recommendation: getRecommendation(task.assessment),
  };
}

export function analyzeProcess(
  processId: string,
  processName: string,
  tasks: Task[]
): WorkforceBlueprint {
  const analyzedTasks = tasks.map(analyzeTask);

  const counts = {
    human: 0,
    humanAI: 0,
    ai: 0,
    automation: 0,
  };

  analyzedTasks.forEach((task) => {
    switch (task.recommendation.mode) {
      case "HUMAN":
        counts.human++;
        break;
      case "HUMAN_AI":
        counts.humanAI++;
        break;
      case "AI":
        counts.ai++;
        break;
      case "AUTOMATION":
        counts.automation++;
        break;
    }
  });

  return {
    processId,
    processName,
    tasks: analyzedTasks,
    distribution: toPercentages(counts, analyzedTasks.length),
  };
}

/*
 * Converts task counts into percentages with one decimal place that
 * always total exactly 100 (largest-remainder method). Independently
 * rounding each share can produce totals such as 99 or 102.
 */
function toPercentages(
  counts: WorkforceBlueprint["distribution"],
  total: number
): WorkforceBlueprint["distribution"] {
  const keys = Object.keys(counts) as (keyof typeof counts)[];

  if (total === 0) {
    return { human: 0, humanAI: 0, ai: 0, automation: 0 };
  }

  // Work in tenths of a percent so results keep one decimal place.
  const UNITS = 1000;

  const shares = keys.map((key) => {
    const exact = (counts[key] * UNITS) / total;
    return { key, units: Math.floor(exact), remainder: exact % 1 };
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

  const result = { human: 0, humanAI: 0, ai: 0, automation: 0 };
  shares.forEach((share) => {
    result[share.key] = share.units / 10;
  });

  return result;
}