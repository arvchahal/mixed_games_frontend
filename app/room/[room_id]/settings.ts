export type RoomSettings = {
  stake: number;
  smallBlind: number;
  bigBlind: number;
};

export const DEFAULT_ROOM_SETTINGS: RoomSettings = {
  stake: 100,
  smallBlind: .5,
  bigBlind: 1,
};
