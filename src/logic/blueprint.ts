import {
  AnalyzedTask,
  WorkforceBlueprint,
  WorkforceMode,
} from "../types/workmesh";

/*
 * Groups the engine's four workforce modes into three executive
 * layers. Shares are summed from the engine's distribution, so they
 * stay consistent with Workforce Allocation and always total 100.
 */

export type BlueprintLayerKey = "humanLed" | "aiEnabled" | "automation";

export interface BlueprintLayer {
  key: BlueprintLayerKey;
  share: number;
  tasks: AnalyzedTask[];
}

const layerModes: Record<BlueprintLayerKey, WorkforceMode[]> = {
  humanLed: ["HUMAN"],
  aiEnabled: ["HUMAN_AI", "AI"],
  automation: ["AUTOMATION"],
};

const layerOrder: BlueprintLayerKey[] = ["humanLed", "aiEnabled", "automation"];

export function buildBlueprintLayers(
  blueprint: WorkforceBlueprint
): BlueprintLayer[] {
  const { human, humanAI, ai, automation } = blueprint.distribution;

  const shares: Record<BlueprintLayerKey, number> = {
    humanLed: human,
    aiEnabled: Math.round((humanAI + ai) * 10) / 10,
    automation,
  };

  return layerOrder.map((key) => {
    const modes = layerModes[key];

    // Order by mode as listed above (e.g. Human + AI before AI), then by task order.
    const tasks = blueprint.tasks
      .filter((task) => modes.includes(task.recommendation.mode))
      .sort(
        (a, b) =>
          modes.indexOf(a.recommendation.mode) -
            modes.indexOf(b.recommendation.mode) || a.order - b.order
      );

    return { key, share: shares[key], tasks };
  });
}
