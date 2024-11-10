import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ThemeService } from 'src/app/services/theme/theme.service';
// import xlsx package to export function
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-import-excel',
  templateUrl: './import-excel.component.html',
  styleUrls: ['./import-excel.component.css'],
})
export class ImportExcelComponent implements OnInit {
  //variables
  excelData: any[] = [];
  tabKeys: string[] = [];
  dataValues: any[] = [];
  loading: boolean = true;
  DataKeys: any[] = [];
  currentTheme: any;

  //pagination variables
  currentPage: number = 1;
  // count: number = 0;
  itemsPerPage: number = 2;
  tableEntries: number[] = [
    5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 100,
  ];

  uploading: boolean = false;

  constructor(
    private themeService: ThemeService,
    // public apiService: ApiService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    // get theme from localStorage
    this.themeService.getCurrentTheme().subscribe((theme) => {
      this.currentTheme = JSON.parse(theme);
    });
  }
  // on paginate
  onPaginate(page: any) {
    this.currentPage = page;
  }
  //when table data change
  onTableSizeChange(event: any) {
    this.itemsPerPage = event.target.value;
    this.currentPage = 1;
  }
  // export to execl file
  importExcel(file: any) {
    //get file path
    let path = file.target.files[0];
    //file reader
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(path);
    // when file load
    fileReader.onload = (e) => {
      this.loading = false;
      //read sheet file from excel
      let workbook = XLSX.read(fileReader.result, { type: 'binary' });
      let sheetNames = workbook.SheetNames;
      //conver to json
      this.excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
      // console.log(this.excelData);
      this.getTableTabKeys(this.excelData);
    };
  }
  //get Table data keys (get dynamic columns)
  getTableTabKeys(data: any) {
    // get data keys and values
    data.forEach((res: any) => {
      this.tabKeys = Object.keys(res);
      this.dataValues.push(Object.values(res));
    });
    // push coloums to another array  to know which column active and shown in table
    this.tabKeys.forEach((element) => {
      this.DataKeys.push({ name: element, active: true });
    });
  }

  // upload excel file to server
  uploadExcelData() {
    console.log(new Date()?.toISOString());
    let uploadData = {
      employees: this.excelData,
    };

    // this.uploading = true;
    // setTimeout(() => {
    //   this.uploading = false;
    // }, 4000);

      console.log(uploadData);
    let added = false;
    this.uploading = true;
    // this.apiService.add('employees/addemployees', uploadData).subscribe({
    //   next: (data) => {
    //     console.log(data);
    //     added = true;
    //   },
    //   error: (error) => {
    //     this.uploading = false;
    //     this.toastr.error('there is something wrong', 'Error');
    //   },
    //   complete: () => {
    //     if (added) {
    //       this.uploading = false;
    //       this.router.navigate(['/modules/employees/all-employees'], {
    //         queryParams: { view_type: 'table' },
    //       });
    //       // this.toastr.success('data uploaded successfully..', 'Success');
    //     }
    //   },
    // });
  }
}
