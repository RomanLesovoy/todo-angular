export interface Ticket {
  title: string;
  roomId: string;
  columnId: string;
  isCompleted: boolean;
  id: string;
}

export interface Room {
  name: string;
  hash: string;
}

export interface Column {
  name: string;
  roomId: string;
  id: number;
}

export interface RoomDto extends Room {
  todos: Array<Ticket>;
  columns: Array<Column>;
}

export interface RoomPrepared extends Omit<RoomDto, 'todos'> {
  todos: {
    [columnId: string]: Array<Ticket>,
  };
}

export interface GeneralResponse {
  success: boolean,
  message?: string,
  error?: string,
}
