import { WorkforceMode } from "../types/workmesh";

const workforceModeLabels: Record<WorkforceMode, string> = {
  HUMAN: "Human",
  HUMAN_AI: "Human + AI",
  AI: "AI",
  AUTOMATION: "Automation",
};

export function formatWorkforceMode(mode: WorkforceMode): string {
  return workforceModeLabels[mode];
}

export function formatPercent(value: number): string {
  return `${Number.isInteger(value) ? value : value.toFixed(1)}%`;
}

/* Formats a change in percentage points, e.g. "+12.5 pts" or "No change". */
export function formatPointChange(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  if (rounded === 0) return "No change";
  const sign = rounded > 0 ? "+" : "−";
  const abs = Math.abs(rounded);
  return `${sign}${Number.isInteger(abs) ? abs : abs.toFixed(1)} pts`;
}
