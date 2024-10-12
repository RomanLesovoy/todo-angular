import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ticket } from '../../../interfaces';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss'
})
export class TicketComponent {
  @Input() ticket!: Ticket;
  @Output() onDeleteTicket = new EventEmitter<Ticket>();
  @Output() onEditTicket = new EventEmitter<Ticket>();
  isLoading: boolean = false;

  showLoader(time: number) {
    this.isLoading = true;
    setTimeout(() => this.isLoading = false, time);
  }

  removeTicket() {
    this.showLoader(1000);
    this.onDeleteTicket.emit(this.ticket);
  }

  completeTicket() {
    this.showLoader(1000);
    this.onEditTicket.emit({ ...this.ticket, isCompleted: !this.ticket.isCompleted });
  }
}
