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
  @Input({ required: true }) columns!: Array<Column>;
  @Input({ required: true }) tickets!: { [columnId: string]: Array<Ticket> };
  public gridMinWidth: string;
  public location = window.location.href;

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

  public onCreateTicket(colId: number) {
    this.roomService.createTicket(colId).subscribe();
  }

  public onEditColName(newName: string, col: Column) {
    this.roomService.editColumn({ ...col, name: newName }).subscribe();
  }

  public onDeleteColumn(col: Column) {
    this.roomService.removeColumn(col).subscribe();
  }

  public onCreateColumn() {
    this.roomService.createColumn().subscribe();
  }

  public onTelegram() {
    window.open(
      'https://t.me/share/url?url=' + this.location + '&text=Ticket board',
      'SingleSecondaryWindowName',
      "popup=yes",
    )?.addEventListener('click', (e) => {
      console.log(e)
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.columns?.currentValue?.length !== changes.columns?.previousValue?.length) {
      this.gridMinWidth = `${(this.columns.length) * 200}px`;
    }
  }
}
