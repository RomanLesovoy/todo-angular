import { ChangeDetectionStrategy, Component, DestroyRef, Inject, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Column, Ticket } from '../../interfaces';
import { TicketServiceService } from '../../services/ticket-service.service';
import { RoomServiceService } from '../../services/room-service.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent implements OnChanges {
  @Input({ required: true }) columns!: Array<Column>;
  @Input({ required: true }) tickets!: { [columnId: string]: Array<Ticket> };
  public gridMinWidth: string;
  private readonly location = window.location.href;

  constructor(
    @Inject(TicketServiceService) private readonly ticketService: TicketServiceService,
    @Inject(RoomServiceService) private readonly roomService: RoomServiceService,
    @Inject(DestroyRef) private readonly destroyRef: DestroyRef,
  ) {
    this.gridMinWidth = `${window.innerWidth}px`;
  }

  public onDeleteTicket(ticket: Ticket) {
    this.ticketService.removeTicket(ticket).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  public onEditTicket(ticket: Ticket) {
    this.ticketService.editTicket(ticket).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  public onCreateTicket(colId: number) {
    this.ticketService.createTicket(colId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  public onEditColName(newName: string, col: Column) {
    this.roomService.editColumn({ ...col, name: newName }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  public onDeleteColumn(col: Column) {
    this.roomService.removeColumn(col).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  public onCreateColumn() {
    this.roomService.createColumn().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  public onTelegram() {
    window.open(
      'https://t.me/share/url?url=' + this.location + '&text=Ticket board',
      'SingleSecondaryWindowName',
      "popup=yes",
    )
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.columns?.currentValue?.length !== changes.columns?.previousValue?.length) {
      this.gridMinWidth = `${(this.columns.length) * 200}px`;
    }
  }
}
