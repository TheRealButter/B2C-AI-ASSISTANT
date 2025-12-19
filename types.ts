
export enum Category {
  TEXTBOOKS = 'Textbooks',
  UNIFORMS = 'Uniforms',
  STATIONERY = 'Stationery',
  FEES = 'Fees & Levies'
}

export interface GroundingSource {
  title: string;
  uri: string;
}

// AIResponse updated to include optional fields for intelligence node status
export interface AIResponse {
  text: string;
  sources: GroundingSource[];
  // Added optional fields used for deep scan reporting
  verifiedBy?: string;
  status?: string;
}

// Listing interface used in Dashboard, MapSearch, ItemDetails and CreateListing
export interface Listing {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  category: Category;
  location: string;
  seller: string;
  sellerRating: number;
  safeMeetingPoint?: string;
}

// UserStats interface used in Dashboard and Profile
export interface UserStats {
  messages: number;
  rating: number;
}

export interface RetailerDeal {
  retailer: string;
  price: number;
  item: string;
  url: string;
  lastVerified: string;
}

export interface BudgetItem {
  id: string;
  label: string;
  estimated: number;
  actual: number;
  category: string;
}

export type ViewState = 'HOME' | 'DEALS' | 'BUDGET' | 'PLACEMENT' | 'ABOUT';

// Added missing interface for trending retail items
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

// Added missing interface for rapid access store nodes
export interface StoreNode {
  id: string;
  name: string;
  dealType: string;
  icon: string;
  color: string;
}
