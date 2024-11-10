import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css'],
})
export class DeleteModalComponent implements OnInit {
  @Input() title: string = '';
  @Input() currentTheme: any;
  @Output() onDelete: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit() {}
  // delete Action
  delete() {
    this.onDelete.emit();
  }
}
