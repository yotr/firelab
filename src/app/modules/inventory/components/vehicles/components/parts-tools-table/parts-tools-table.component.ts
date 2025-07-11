import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-parts-tools-table',
  templateUrl: './parts-tools-table.component.html',
  styleUrls: ['./parts-tools-table.component.css'],
})
export class PartsToolsTableComponent implements OnInit {
  //current language
  currentLanguage: any = localStorage.getItem('lang');
  currentTheme: any;
  @Input() data: any[] = [];
  @Input() dataKeys: any[] = [];
  @Input() loading: boolean = true;
  @Input() isParts: boolean = false;
  @Input() isTools: boolean = false;
  // pagination
  @Input() totalItems: number = 0;
  @Output() onPageChange: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();
  //pagination variables
  currentPage: number = 1;
  // count: number = 0;
  itemsPerPage: number = 10;
  deleteId: any = null;
  deleteFrom: string = '';

  constructor(
    private languageService: LanguageService,
    private themeService: ThemeService,
    private toastr: ToastrService,
    public apiService: ApiService
  ) {}

  ngOnInit() {
    // get language from localStorage
    this.languageService.getCurrentLanguage().subscribe((language) => {
      this.currentLanguage = language;
    });
    // get theme from localStorage
    this.themeService.getCurrentTheme().subscribe((theme) => {
      this.currentTheme = JSON.parse(theme);
    });
  }

  unAssign(id: any, table: string) {
    this.onDelete.emit({ id, table });
  }
}
