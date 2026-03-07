export type Card = { suit: string; rank: string };

export type PlayerHandStatus = "active" | "all in" | "folded";

export type PlayerView = {
  id: string;
  displayName: string;
  stack: number;
  handStatus: PlayerHandStatus;
  card: Card | null; // null = you, Card = others
  seatIndex: number;
  currentBetAmount: number;
};

export type HandView = {
  pot: number;
  currentBet: number;
  currentPlayerIndex: number;
  playerOrder: string[];
  players: Record<string, PlayerView>;
  isOver: boolean;
  winnerId: string | null;
  buttonIndex: number;
  minRaise: number;
};

export type LedgerEntry = {
  displayName: string;
  totalBuyIn: number;
  stack: number;
  delta: number;
};

export type GameState = {
  hand: HandView;
  myId: string;
  myStack: number;
  ledger: LedgerEntry[];
};

export type Action =
  | { type: "fold" }
  | { type: "check" }
  | { type: "call" }
  | { type: "bet"; amount: number }
  | { type: "raise"; amount: number };
