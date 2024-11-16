import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.css'],
})
export class CustomDropdownComponent implements OnInit {
  @Input() minWidth: string = '150px';
  @Input() title: string = 'Select';
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
    this.title = value;
    this.onAction.emit(value);
    this.close();
  }
}
