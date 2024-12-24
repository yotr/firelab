import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-custom-filter-dropdown',
  templateUrl: './custom-filter-dropdown.component.html',
  styleUrls: ['./custom-filter-dropdown.component.css'],
})
export class CustomFilterDropdownComponent implements OnInit {
  @Input() translated: boolean = false;
  @Input() minWidth: string = '150px';
  // filter
  @Input() filterLoading: boolean = true;
  @Input() filterTotal: number = 0;
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  // others
  @Input() title: any = 'Select';
  @Input() data: any[] = [];
  @Input() objectKey: any = null;
  @Output() onAction: EventEmitter<any> = new EventEmitter();
  isActive: boolean = false;

  constructor(public apiService: ApiService, private toastr: ToastrService) {}

  ngOnInit() {}

  toggle() {
    this.isActive = !this.isActive;
  }
  close() {
    this.isActive = false;
  }
  filterFunction(event: any) {
    this.onFilter.emit(event?.target.value);
  }

  action(value: any, objectKey: any) {
    this.title = objectKey;
    this.onAction.emit(value);
    this.close();
  }
}
