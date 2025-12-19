
export enum Category {
  TEXTBOOKS = 'Textbooks',
  UNIFORMS = 'Uniforms',
  STATIONERY = 'Stationery'
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AIResponse {
  text: string;
  sources: GroundingSource[];
  verifiedBy?: string;
  status?: string;
}

export interface TrendingItem {
  id: string;
  title: string;
  price: string;
  retailer: string;
  savingReason: string;
  imageUrl: string;
  url: string;
  category: string;
}

export interface BudgetItem {
  id: string;
  label: string;
  estimated: number;
  actual: number;
  category: string;
}

export interface Listing {
  id: string;
  title: string;
  category: Category;
  price: number;
  imageUrl: string;
  location: string;
  seller: string;
  sellerRating: number;
  safeMeetingPoint?: string;
}

export interface UserStats {
  savings: number;
  activeItems: number;
  messages: number;
  rating: number;
}

export type ViewState = 'HOME' | 'DEALS' | 'BUDGET' | 'PLACEMENT';