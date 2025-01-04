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
  @Input() deleteModalTitle: string = '';
  // pagination
  @Input() totalItems: number = 0;
  @Output() onPageChange: EventEmitter<any> = new EventEmitter();
  //pagination variables
  currentPage: number = 1;
  // count: number = 0;
  itemsPerPage: number = 10;
  deleteId: any = null;

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

  unAssignParts(deleteId: any) {
    console.log(deleteId);
    this.apiService.delete('assignedParts', deleteId).subscribe({
      next: (data) => {
        if (data?.isSuccess) {
          this.data = this.data.filter((item: any) => item?.id !== deleteId);
          if (this.currentLanguage == 'ar') {
            this.toastr.success('تم حذف العنصر بنجاح...');
          } else {
            this.toastr.success('item deleted successfully...');
          }
        }
      },
      error: (err) => {
        console.log(err);
        if (this.currentLanguage == 'ar') {
          this.toastr.error('هناك شيء خاطئ', 'خطأ');
        } else {
          this.toastr.error('There Is Somthing Wrong', 'Error');
        }
      },
      complete: () => {
        this.deleteId = null;
      },
    });
  }
  unAssignTools(deleteId: any) {
    console.log(deleteId);
    this.apiService.delete('assignedTools', deleteId).subscribe({
      next: (data) => {
        if (data?.isSuccess) {
          this.data = this.data.filter((item: any) => item?.id !== deleteId);
          if (this.currentLanguage == 'ar') {
            this.toastr.success('تم حذف العنصر بنجاح...');
          } else {
            this.toastr.success('item deleted successfully...');
          }
        }
      },
      error: (err) => {
        console.log(err);
        if (this.currentLanguage == 'ar') {
          this.toastr.error('هناك شيء خاطئ', 'خطأ');
        } else {
          this.toastr.error('There Is Somthing Wrong', 'Error');
        }
      },
      complete: () => {
        this.deleteId = null;
      },
    });
  }
}
