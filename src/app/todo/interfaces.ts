

export interface TicketCreateRequest {
  title: string;
  roomHash: string;
  columnId: number;
  isCompleted: boolean;
}

export interface Ticket extends TicketCreateRequest {
  id: string;
  roomId: string;
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

export interface ColumnRequest {
  name: string;
  roomHash: string;
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
