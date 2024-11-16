import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.css'],
})
export class CustomDropdownComponent implements OnInit {
  @Input() data: any[] = [];
  @Output() onAction: EventEmitter<any> = new EventEmitter();
  isActive: boolean = false;

  constructor() {}

  ngOnInit() {}

  toggle() {
    this.isActive = !this.isActive;
  }
  close() {
    this.isActive = false;
  }
  action(value: any) {
    this.onAction.emit(value);
  }
}
