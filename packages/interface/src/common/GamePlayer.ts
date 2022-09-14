export class GamePlayer {
  id: string;
  username: string;
  constructor(player: GamePlayer) {
    this.id = player.id;
    this.username = player.username;
  }
}