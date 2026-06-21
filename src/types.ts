export interface OptionAnalysis {
  name: string;
  pros: string[];
  cons: string[];
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface MetricComparison {
  metric: string;
  ratings: number[]; // Ratings corresponding to each option in order (usually 2 values, e.g. [4, 2])
  tradeoffText: string;
}

export interface RecommendationReport {
  decisivePath: string;
  rationale: string;
  firstStep24Hours: string;
}

export interface FaislaAnalysis {
  executiveSummary: {
    acknowledgment: string;
    coreTension: string;
  };
  options: OptionAnalysis[];
  swot: SwotAnalysis;
  comparison: MetricComparison[];
  recommendation: RecommendationReport;
}

export interface SavedDilemma {
  id: string;
  dilemma: string;
  context?: string;
  customMetrics?: string[];
  createdAt: string;
  analysis: FaislaAnalysis;
  userProgress?: {
    firstStepCompleted: boolean;
    status: "Resolved" | "Undecided" | "In Progress";
    selectedOptionIndex?: number;
    notes?: string;
  };
}
