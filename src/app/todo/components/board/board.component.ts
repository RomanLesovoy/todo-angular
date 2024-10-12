import { Component, Inject, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Column, Ticket } from '../../interfaces';
import { TicketServiceService } from '../../services/ticket-service.service';
import { RoomServiceService } from '../../services/room-service.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class BoardComponent implements OnChanges {
  @Input() columns!: Array<Column>;
  @Input() tickets!: { [columnId: string]: Array<Ticket> };
  public gridMinWidth: string;

  constructor(
    @Inject(TicketServiceService) private readonly ticketService: TicketServiceService,
    @Inject(RoomServiceService) private readonly roomService: RoomServiceService,
  ) {
    this.gridMinWidth = `${window.innerWidth}px`;
  }

  public onDeleteTicket(ticket: Ticket) {
    this.ticketService.removeTicket(ticket).subscribe();
  }

  public onEditTicket(ticket: Ticket) {
    this.ticketService.editTicket(ticket).subscribe();
  }

  public onEditColName(newName: string, col: Column) {
    this.roomService.editColumn({ ...col, name: newName }).subscribe();
  }

  public onDeleteColumn(col: Column) {
    this.roomService.removeColumn(col).subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.columns?.currentValue?.length !== changes.columns?.previousValue?.length) {
      this.gridMinWidth = `${(this.columns.length) * 200}px`;
    }
  }
}
