import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, Self, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-editable',
  templateUrl: './editable.component.html',
  styleUrl: './editable.component.scss'
})
export class EditableComponent implements OnChanges {
  public isEditable: boolean = false;
  public currentTextValue: string = '';
  public inputHeight: number = 0;
  @Input() public editable?: boolean = true;
  @Input({ required: true }) public text!: string;
  @Output() public onChange: EventEmitter<string> = new EventEmitter();

  constructor(
    private inputElement: ElementRef,
    @Self() private element: ElementRef,
  ) {
    this.currentTextValue = this.text;
    
    // get child height and set it to input (avoid content jumping)
    setTimeout(() => {
      this.inputHeight = this.element.nativeElement.offsetHeight;
    }, 10);
  }

  emitValue(): void {
    if (this.text !== this.currentTextValue) {
      this.onChange.emit(this.currentTextValue.trim());
    }
  }

  onDoubleClickActivateInput(): void {
    this.isEditable = !!this.editable;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.editable) {
      this.isEditable = this.isEditable && changes.editable.currentValue;
    }
    if (changes.text) {
      this.currentTextValue = changes.text.currentValue;
    }
  }

  @HostListener('document:mousedown', ['$event'])
  onClickOutside(e: Event): void {
     if (!this.inputElement.nativeElement.contains(e.target) && !!this.isEditable) {
        this.isEditable = false;
        this.emitValue();
     }
  }
}