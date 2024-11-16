import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-table-search',
  templateUrl: './table-search.component.html',
  styleUrls: ['./table-search.component.css'],
})
export class TableSearchComponent implements OnInit {
  //vars
  @Input() searchValue: string = '';
  @Output() sendSearchValue: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
  // send search value
  sendSearch() {
    this.sendSearchValue.emit(this.searchValue);
  }
  search(event: any) {
    if (event?.keyCode === 13) {
      console.log(this.searchValue);
      this.sendSearchValue.emit(this.searchValue);
    }
  }
}
