export interface GenerateInput {
  topic: string;
}

export interface GenerateResult {
  bestTitle: string;
  alternativeTitles: string[];
  description: string;
  tags: string[];
}