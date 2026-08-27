export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisine: string;
  vibe: string;
  vibeIcon: string;
  rating: number;
  reviewCount: number;
  priceLevel: string;
  imageUrl: string;
  imageAlt: string;
  description: string;
  address: string;
  mapsUrl?: string;
  defaultTime: string;
  highlight: string;
}

export type GameStep = 1 | 2 | 3 | 4 | 5 | 6;

export interface GameCustomization {
  herName: string;
  hisName: string;
  dateDay: string;
  dateTime: string;
}

export interface GameState {
  currentStep: GameStep;
  screen1Choice: 'accept' | 'disagree' | null;
  screen2Choice: 'obviously' | 'maybe' | 'refuse' | null;
  screen3Choice: 'yes' | 'absolutely' | 'fine' | null;
  screen4Upgraded: boolean;
  selectedRestaurantId: string;
  screen6Confirmed: boolean;
}

export type GameEventStatus =
  | 'game_started'
  | 'love_question_answered'
  | 'date_accepted'
  | 'date_upgraded'
  | 'restaurant_selected'
  | 'game_completed';

export interface GameRecord {
  timestamp: string;
  sessionId: string;
  restaurantId?: string;
  restaurantName?: string;
  location?: string;
  cuisineVibe?: string;
  status: GameEventStatus | string;
}

export interface DashboardSession {
  sessionId: string;
  startTime: string;
  lastActivityTime: string;
  restaurantId: string;
  restaurantName: string;
  location: string;
  cuisineVibe: string;
  status: 'Completed ❤️' | 'In Progress 👀' | 'Abandoned' | 'Not started';
  completed: boolean;
  restaurantSelected: boolean;
  events: GameRecord[];
}

