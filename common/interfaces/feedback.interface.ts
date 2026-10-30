export interface FeedbackStarCount {
  stars: number;
  count: number;
  percentage: number;
}

export interface FeedbackByAntragsart {
  antragsart: string;
  totalCount: number;
  ratingCount: number;
  feedbackTextCount: number;
  averageRating: number | null;
}

export interface FeedbackItem {
  uploadID: string;
  uploadDate: Date | string;
  antragsart: string;
  rating: number | null;
  feedbackText: string | null;
}

export interface FeedbackEvaluation {
  totalUploads: number;
  totalRatings: number;
  totalFeedbackTexts: number;
  averageRating: number | null;
  starDistribution: FeedbackStarCount[];
  byAntragsart: FeedbackByAntragsart[];
  items: FeedbackItem[];
}

