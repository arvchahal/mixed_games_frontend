export type Card = { suit: string; rank: string };

export type PlayerHandStatus = "active" | "all in" | "folded";

export type PlayerView = {
  id: string;
  displayName: string;
  stack: number;
  handStatus: PlayerHandStatus;
  card: Card | null; // null = you (hidden), Card = opponent (visible)
};

export type HandView = {
  pot: number;
  currentBet: number;
  lastRaiseSize: number;
  currentPlayerIndex: number;
  playerOrder: string[];
  players: Record<string, PlayerView>;
  isOver: boolean;
  winnerId: string | null;
};

export type GameState = {
  hand: HandView;
  myId: string;
  myStack: number;
};

export type Action =
  | { type: "fold" }
  | { type: "check" }
  | { type: "call" }
  | { type: "bet"; amount: number }
  | { type: "raise"; amount: number };
