// Player actions
export const TABLE_JOIN = 'TABLE_JOIN';
export const TABLE_LEAVE = 'TABLE_LEAVE';
export const PLAYER_BET = 'PLAYER_BET';
export const PLAYER_CALL = 'PLAYER_CALL';
export const PLAYER_RAISE = 'PLAYER_RAISE';
export const PLAYER_FOLD = 'PLAYER_FOLD';
export const PLAYER_ALL_IN = 'PLAYER_ALL_IN';

// Updates
export const TABLE_UPDATE = 'TABLE_UPDATE';
export const PLAYER_UPDATE = 'PLAYER_UPDATE';


export function tableJoin(tableId) {

}

export function tableLeave() {

}

export function playerBet(amount) {
  return { type: PLAYER_BET, amount };
}

export function playerCall(amount) {
  return { type: PLAYER_CALL, amount };
}

export function playerRaise(amount) {

}

export function playerFold() {
  return { type: PLAYER_FOLD };
}

export function playerAllIn(amount) {

}

export function tableUpdate(table) {
  return { type: TABLE_UPDATE, table };
}

export function playerUpdate(player) {
  return { type: PLAYER_UPDATE, player };
}
