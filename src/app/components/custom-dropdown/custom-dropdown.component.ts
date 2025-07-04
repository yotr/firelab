import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';

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
  // filter
  @Input() filter: boolean = false;
  // others
  @Input() title: any = 'Select';
  @Input() data: any[] = [];
  @Input() object: boolean = false;
  @Input() objectKey: any = null;
  @Output() onAction: EventEmitter<any> = new EventEmitter();
  isActive: boolean = false;
  searchText: string = '';

  constructor(public apiService: ApiService, private toastr: ToastrService) {}

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
