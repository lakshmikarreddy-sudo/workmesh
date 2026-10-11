export type WorkforceMode =
  | "HUMAN"
  | "HUMAN_AI"
  | "AI"
  | "AUTOMATION";

export interface TaskAssessment {
  repetition: number;
  judgment: number;
  risk: number;
  humanInteraction: number;
  dataDependency: number;
  complexity: number;
}

export interface Task {
  id: string;
  order: number;
  name: string;
  description: string;
  assessment: TaskAssessment;
}

export interface Recommendation {
  mode: WorkforceMode;
  confidence: number;
  reason: string;
  alternative?: WorkforceMode;
}

export interface AnalyzedTask extends Task {
  recommendation: Recommendation;
}

export interface Process {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
}

export interface WorkforceBlueprint {
  processId: string;
  processName: string;
  tasks: AnalyzedTask[];
  distribution: {
    human: number;
    humanAI: number;
    ai: number;
    automation: number;
  };
}

export interface Scenario {
  aiAdoption: number;
  blueprint: WorkforceBlueprint;
}