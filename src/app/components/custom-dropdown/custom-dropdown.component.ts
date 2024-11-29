import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.css'],
})
export class CustomDropdownComponent implements OnInit {
  @Input() translated: boolean = false;
  @Input() minWidth: string = '150px';
  @Input() fixedHeight: boolean = true;
  @Input() height: string = '50px';
  @Input() filter: boolean = false;
  @Input() title: string = 'Select';
  @Input() data: any[] = [];
  @Input() object: boolean = false;
  @Input() objectKey: any = null;
  @Output() onAction: EventEmitter<any> = new EventEmitter();
  isActive: boolean = false;
  searchText: string = '';

  constructor() {}

  ngOnInit() {}

  toggle() {
    this.isActive = !this.isActive;
  }
  close() {
    this.isActive = false;
  }
  action(value: any, objectKey?: any) {
    if (this.object) {
      this.title = objectKey;
    } else {
      this.title = value;
    }
    this.onAction.emit(value);
    this.close();
  }
}
