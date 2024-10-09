export interface Ticket {
  name: string;
  roomId: string;
  columnId: string;
}

export interface Room {
  name: string;
  hash: string;
}

export interface Column {
  name: string;
  roomId: string;
}

export interface RoomDto extends Room {
  tickets: Array<Ticket>;
  columns: Array<Column>;
}
