import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language/language.service';

@Component({
  selector: 'app-table-dropdown',
  templateUrl: './table-dropdown.component.html',
  styleUrls: ['./table-dropdown.component.css'],
})
export class TableDropdownComponent implements OnInit {
  @Input() columns: any[] = [];
  @Input() key: any = '';
  @Input() sortingKey: any = '';
  @Input() sortingOrder: string = 'none';
  @Output() onSortingChange: EventEmitter<any> = new EventEmitter();
  @Output() onColumnsChange: EventEmitter<any> = new EventEmitter();
  @Output() onFiltersSubmit: EventEmitter<any> = new EventEmitter();
  @Output() onReset: EventEmitter<any> = new EventEmitter();
  //current language
  currentLanguage: any = localStorage.getItem('lang');
  isMenuOpen: boolean = false;
  isColumnsSubmenuOpen: boolean = false;
  isFilterSubmenuOpen: boolean = false;

  filterOperators: any[] =[];
  //filter form
  filterForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private languageService: LanguageService
  ) {
    // // turn on current language (trandlate)
    this.getCurrentLanguage();
    // this.translateService.use(this.currentLanguage);
    //filter form inputs
    this.filterForm = this.formBuilder.group({
      operator1: [''],
      operator2: [''],
      searchValue1: [null],
      searchValue2: [null],
    });

    // 'contains';
    // 'doesnotcontain';
    // 'startswith';
    // 'endswith';
    // 'eq';
    // 'neq';
    // 'gte';
    // 'gt';
    // 'lte';
    // 'lt';
    // this.filterOperators = [
    //   {
    //     name: this.translateService.instant('table_dropdown.contains'),
    //     operator: 'contains',
    //     type: 'string',
    //   },
    //   {
    //     name: this.translateService.instant('table_dropdown.doesnotcontain'),
    //     operator: 'doesnotcontain',
    //     type: 'string',
    //   },
    //   {
    //     name: this.translateService.instant('table_dropdown.startswith'),
    //     operator: 'startswith',
    //     type: 'string',
    //   },
    //   {
    //     name: this.translateService.instant('table_dropdown.endswith'),
    //     operator: 'endswith',
    //     type: 'string',
    //   },
    //   {
    //     name: this.translateService.instant('table_dropdown.eq'),
    //     operator: 'eq',
    //     type: 'number',
    //   },
    //   {
    //     name: this.translateService.instant('table_dropdown.neq'),
    //     operator: 'neq',
    //     type: 'number',
    //   },
    //   {
    //     name: this.translateService.instant('table_dropdown.gte'),
    //     operator: 'gte',
    //     type: 'number',
    //   },
    //   {
    //     name: this.translateService.instant('table_dropdown.gt'),
    //     operator: 'gt',
    //     type: 'number',
    //   },
    //   {
    //     name: this.translateService.instant('table_dropdown.lte'),
    //     operator: 'lte',
    //     type: 'number',
    //   },
    //   {
    //     name: this.translateService.instant('table_dropdown.lt'),
    //     operator: 'lt',
    //     type: 'number',
    //   },
    // ];
  }

  ngOnInit() {
    // this.getCurrentLanguage();
    // get language from localStorage
    // this.languageService.getCurrentLanguage().subscribe((language) => {
    //   this.currentLanguage = language;
    //   // turn on current language (trandlate)
    //   this.translateService.use(this.currentLanguage);
    // });
  }
  getCurrentLanguage() {
    // get language from localStorage
    this.languageService.getCurrentLanguage().subscribe((language) => {
      this.currentLanguage = language;
      // turn on current language (trandlate)
      this.translateService.use(language);

      this.filterOperators = [
        {
          name: this.translateService.instant('table_dropdown.contains'),
          operator: 'contains',
          type: 'string',
        },
        {
          name: this.translateService.instant('table_dropdown.doesnotcontain'),
          operator: 'doesnotcontain',
          type: 'string',
        },
        {
          name: this.translateService.instant('table_dropdown.startswith'),
          operator: 'startswith',
          type: 'string',
        },
        {
          name: this.translateService.instant('table_dropdown.endswith'),
          operator: 'endswith',
          type: 'string',
        },
        {
          name: this.translateService.instant('table_dropdown.eq'),
          operator: 'eq',
          type: 'number',
        },
        {
          name: this.translateService.instant('table_dropdown.neq'),
          operator: 'neq',
          type: 'number',
        },
        {
          name: this.translateService.instant('table_dropdown.gte'),
          operator: 'gte',
          type: 'number',
        },
        {
          name: this.translateService.instant('table_dropdown.gt'),
          operator: 'gt',
          type: 'number',
        },
        {
          name: this.translateService.instant('table_dropdown.lte'),
          operator: 'lte',
          type: 'number',
        },
        {
          name: this.translateService.instant('table_dropdown.lt'),
          operator: 'lt',
          type: 'number',
        },
      ];
    });
  }

  //handle dropdown display
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  clickedOutside() {
    this.isMenuOpen = false;
  }
  // handle submenu display
  toggleColumnsSubmenu() {
    this.isFilterSubmenuOpen = false;
    this.isColumnsSubmenuOpen = !this.isColumnsSubmenuOpen;
  }
  toggleFilterSubmenu() {
    this.isColumnsSubmenuOpen = false;
    this.isFilterSubmenuOpen = !this.isFilterSubmenuOpen;
  }
  //when sorting change in menu emit function in table
  handleSortingChange(order: string) {
    this.onSortingChange.emit(order);
  }
  //handle when click on column checlbox
  columnsSelectChanges(value: string) {
    this.columns = this.columns?.map((column) =>
      column.name == value
        ? { ...column, active: !column.active }
        : { ...column }
    );
  }
  //send columns selection changes
  handleColumnsChanges() {
    this.onColumnsChange.emit(this.columns);
  }

  //filters
  handleFiltersChanges() {
    // console.log(this.filterForm.value);
    this.onFiltersSubmit.emit(this.filterForm.value);
  }
  //reset data
  handleReset() {
    this.onReset.emit();
  }
  // to enhance loop when u remove or update item not render all items
  trackFun(index: number, item: any): number {
    return item.id;
  }
}
