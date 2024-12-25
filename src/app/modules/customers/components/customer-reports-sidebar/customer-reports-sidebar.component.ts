import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { LanguageService } from 'src/app/services/language/language.service';

@Component({
  selector: 'app-customer-reports-sidebar',
  templateUrl: './customer-reports-sidebar.component.html',
  styleUrls: ['./customer-reports-sidebar.component.css'],
})
export class CustomerReportsSidebarComponent implements OnInit {
  activeReport: string = '';
  currentLanguage: any = localStorage.getItem('lang');

  // categories
  categories: any[] = [];
  categoriesLoading: boolean = true;
  getDataError: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private apiService: ApiService
  ) {
    //get id
    this.activatedRoute.queryParamMap.subscribe((paramMap: Params) => {
      if (paramMap['get']('report')) {
        this.activeReport = paramMap['get']('report');
      }
    });

    // this.categories = [
    //   {
    //     id: 0,
    //     name: 'Spcial Hazard',
    //     icon: 'pi-exclamation-triangle',
    //     link: '',
    //   },
    //   {
    //     id: 1,
    //     name: 'Alarm',
    //     icon: 'pi-exclamation-triangle',
    //   },
    //   {
    //     id: 3,
    //     name: 'Lighting',
    //     icon: 'pi-exclamation-triangle',
    //   },
    //   {
    //     id: 4,
    //     name: 'Fire Door',
    //     icon: 'pi-exclamation-triangle',
    //   },
    //   {
    //     id: 5,
    //     name: 'Doors',
    //     icon: 'pi-exclamation-triangle',
    //   },
    //   {
    //     id: 6,
    //     name: 'Testing',
    //     icon: 'pi-exclamation-triangle',
    //   },
    // ];
  }

  ngOnInit() {
    this.getCategories();
    this.getLanguage();
  }

  getLanguage() {
    // get language from localStorage
    this.languageService.getCurrentLanguage().subscribe((language) => {
      this.currentLanguage = language;
      // turn on current language (trandlate)
      this.translateService.use(this.currentLanguage);
    });
  }

  navigate(report: any) {
    this.router.navigate(['/modules/customers/hoodSystem'], {
      queryParams: { report: report?.name },
    });
  }

  // get categories data
  getCategories() {
    this.apiService.get('reportCategories').subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          this.categories = data?.value;
          this.getDataError = false;
        }
        this.categoriesLoading = false;
      },
      error: (err) => {
        this.categories = [];
        this.categoriesLoading = false;
        this.getDataError = true;
        console.log(err);
        if (this.currentLanguage == 'ar') {
          this.toastr.error('هناك شيء خاطئ', 'خطأ');
        } else {
          this.toastr.error('There Is Somthing Wrong', 'Error');
        }
        this.categoriesLoading = false;
      },
      complete: () => {
        this.categoriesLoading = false;
      },
    });
  }
}
