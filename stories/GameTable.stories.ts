import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import GameTable from "../app/room/[room_id]/components/GameTable";

const meta = {
    component: GameTable,
} satisfies Meta<typeof GameTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    gameState: {
      myId: "player-1",
      myStack: 500,
      ledger: [
        { displayName: "You", totalBuyIn: 500, stack: 450, delta: 75 },
        { displayName: "Alice", totalBuyIn: 500, stack: 300, delta: -140 },
        { displayName: "Bob", totalBuyIn: 500, stack: 200, delta: 65 },
      ],
      hand: {
        pot: 150,
        currentBet: 50,
        currentPlayerIndex: 0,
        playerOrder: ["player-1", "player-2", "player-3"],
        isOver: false,
        winnerId: null,
        buttonIndex: 0,
        minRaise: 100,
        players: {
          "player-1": { id: "player-1", displayName: "You", stack: 450, handStatus: "active", card: null, seatIndex: 0, currentBetAmount: 50 },
          "player-2": { id: "player-2", displayName: "Alice", stack: 300, handStatus: "active", card: { suit: "hearts", rank: "A" }, seatIndex: 1, currentBetAmount: 50 },
          "player-3": { id: "player-3", displayName: "Bob", stack: 200, handStatus: "folded", card: { suit: "spades", rank: "7" }, seatIndex: 2, currentBetAmount: 0 },
        },
      },
    },
    lobbyPlayers: [],
    myId: "player-1",
    onAction: () => {},
  },
};
