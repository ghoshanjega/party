export interface Sockets {
  [key: string]: Socket
}

export class Socket {
  id: string;
  constructor(id: string) {
    this.id = id
  }
}