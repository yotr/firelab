import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-custom-multi-select-dropdown',
  templateUrl: './custom-multi-select-dropdown.component.html',
  styleUrls: ['./custom-multi-select-dropdown.component.css'],
})
export class CustomMultiSelectDropdownComponent implements OnInit {
  @Input() minWidth: string = '150px';
  @Input() height: string = '50px';
  @Input() filter: boolean = false;
  @Input() title: string = 'Select';
  @Input() data: any[] = [];
  @Input() object: boolean = false;
  @Input() objectKey: any = null;
  @Output() onAction: EventEmitter<any> = new EventEmitter();
  isActive: boolean = false;
  searchText: string = '';
  @Input() checkedData: any[] = [];

  constructor() {}

  ngOnInit() {}

  toggle() {
    this.isActive = !this.isActive;
  }
  close() {
    this.isActive = false;
  }
  action(value: any, objectKey?: any) {
    // this.onAction.emit(this.checkedData);
  }
  onCheck(event: any, id: any) {
    let value = event.target.checked;
    // check or uncheck
    this.data = this.data.map((item) => {
      return item?.id === id ? { ...item, checked: value } : item;
    });
    // get checked
    this.getCheckedData();
    this.onAction.emit({
      checkedData: this.checkedData,
      id: id,
      checked: value,
    });
  }

  getCheckedData(): any[] {
    let data = this.data.filter((item) => item?.checked);
    this.checkedData = data;
    return data;
  }

  truncateString(str: any, length: any, ending = '...') {
    if (str.length > length) {
      return str.slice(0, length - ending.length) + ending;
    }
    return str;
  }
}
