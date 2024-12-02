import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxPrintService, PrintOptions } from 'ngx-print';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reports-module-table',
  templateUrl: './reports-module-table.component.html',
  styleUrls: ['./reports-module-table.component.css'],
})
export class ReportsModuleTableComponent implements OnInit {
  //variables
  @Input() data: any[] = [];
  @Input() dataKeys: any[] = [];
  @Input() loading: boolean = true;
  @Input() currentTheme: any;
  //  ================================================
  @Output() onDelete: EventEmitter<any> = new EventEmitter();
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  @Output() onReset: EventEmitter<any> = new EventEmitter();
  @Output() onDeleteSelected: EventEmitter<any> = new EventEmitter();
  @Input() deleteModalTitle: string = '';
  @Input() tableTitle: string = '';
  @Input() editPagePath: any;
  //if exist to leave - admin  table
  @Output() onStatusChange: EventEmitter<any> = new EventEmitter();
  // pagination
  @Input() totalItems: number = 0;
  @Output() onPageChange: EventEmitter<any> = new EventEmitter();
  @Output() onSearch: EventEmitter<any> = new EventEmitter();

  date: Date = new Date();

  searchValue: any = null;
  selectedColumn: any = null;
  testingTable: any;
  deleteId: any;

  //sorting variables
  sortingKey: any = '';
  sortingOrder: string = 'none';
  sortingState: boolean = false;

  //current language
  currentLanguage: any = localStorage.getItem('lang');

  //pagination variables
  currentPage: number = 1;
  // count: number = 0;
  itemsPerPage: number = 10;
  tableEntries: number[] = [
    10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 100,
  ];
  printing: boolean = false;
  api: string = '';
  // current logged in user
  currentUser: any = {} as any;

  constructor(
    private printService: NgxPrintService,
    private sidebarService: SidebarService,
    // private permissionsService: PermissionsService,
    private auth: AuthService
  ) {
    this.api = environment.API;
  }

  // ================== \\  General Functions for all tables  \\ ==================

  ngOnInit() {
    this.getCurrentUserData();
  }
  // get user
  isLoggedIn(): boolean {
    return this.auth.currentUserSignal() == undefined ? false : true;
  }

  getCurrentUserData() {
    if (this.isLoggedIn()) {
      this.currentUser = this.auth.currentUserSignal()?.userData;
    }
  }
  // on paginate
  onPaginate(page: any) {
    this.currentPage = page;
    this.onPageChange.emit({ page: page, itemsPerPage: this.itemsPerPage });
  }

  //when table data change
  onTableSizeChange(event: any) {
    this.itemsPerPage = event.target.value;
    this.currentPage = 1;
    this.onPageChange.emit({
      page: this.currentPage,
      itemsPerPage: event.target.value,
    });
  }
  //sorting Table when tab on table
  autoSortingTable(key: string) {
    this.sortingKey = key;
    if (this.sortingOrder == 'none') {
      this.sortingOrder = 'asc';
    } else if (this.sortingOrder == 'asc') {
      this.sortingOrder = 'desc';
    } else if (this.sortingOrder == 'desc') {
      this.sortingOrder = 'none';
    }
  }
  //sorting Table by clicking asc or desc buttons
  sortingTableByOrder(order: string, key: string) {
    this.sortingKey = key;
    this.sortingOrder = order;
  }

  //get Selected Column
  getSelectedColumn(column: string) {
    this.selectedColumn = column;
  }

  //srearch
  search(value: string) {
    this.searchValue = value;
    this.onSearch.emit({ value: value, column: this.selectedColumn });
  }

  //check All CheckBox
  checkAllCheckBox(event: any) {
    this.data.forEach((result) => (result.checked = event.target.checked));
  }
  // check one CheckBox
  checkOneCheckBox(id: any) {
    this.data = this.data.map((result) =>
      result.id == id ? { ...result, checked: !result.checked } : { ...result }
    );
  }
  //check if box checked
  isAllCheckBoxChecked() {
    return this.data?.every((result) => result.checked);
  }
  //handle display for  new selected columns sent from dropdown
  handleColumnsChangs(newKeys: any[]) {
    this.dataKeys = newKeys;
  }
  //filters handle
  handleFiltersSubmit(filters: any, column: string) {
    this.onFilter.emit({ column, filters });
  }
  resetData() {
    this.onReset.emit();
  }
  // delete
  deleteItem() {
    //client side
    this.data = this.data?.filter((d) => d?.id != this.deleteId);
    // server side
    this.onDelete.emit(this.deleteId);
  }
  //delete selected
  deleteSelected() {
    //client side
    this.data = this.data.filter((result) => result.checked != true);
    //in server side
    this.onDeleteSelected.emit(this.data);
    // api
  }

  // ================== \\  Functions for scpcific tables  \\ ==================

  //change status
  onTableStatusChange(status: any, client: any) {
    this.onStatusChange.emit({ status, client });
  }

  printAll() {
    this.printing = true;
    this.itemsPerPage = this.data?.length;
    this.currentPage = 1;
    setTimeout(() => {
      if (this.itemsPerPage == this.data?.length) {
        this.printing = false;
        const customPrintOptions: PrintOptions = new PrintOptions({
          printSectionId: 'print-table-section',
        });
        this.printService.styleSheetFile = 'assets/style/print-pdf.css';
        this.printService.print(customPrintOptions);
      }
    }, 1000);
  }

}
