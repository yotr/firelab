import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
// import xlsx package to export function
import * as XLSX from 'xlsx';
declare const $: any;

@Component({
  selector: 'app-drop-file-section',
  templateUrl: './drop-file-section.component.html',
  styleUrls: ['./drop-file-section.component.css'],
})
export class DropFileSectionComponent implements OnInit {
  @Input() currentTheme: any;
  @Output() onAttach: EventEmitter<any> = new EventEmitter();
  files: File[] = [];
  loading: boolean = true;
  fileTypes: any = {};
  file: any = null;
  fileURL: any = null;
  excelData: any[] = [];
  currentLanguage: any = localStorage.getItem('lang');
  uploading: boolean = false;

  constructor(private toastr: ToastrService, private apiService: ApiService) {
    this.fileTypes = {
      img: 'image',
      pdf: 'application/pdf',
      excel: 'excel',
      word: 'word',
      text: 'text',
      video: 'video',
      audio: 'audio',
      json: 'json',
      app: 'x-msdownload',
    };
  }

  ngOnInit() {}

  // on attach files to be uploaded
  onAttachFiles() {
    // console.log(this.excelData);

    if (this.excelData.length != 0) {
      let data = this.excelData;

      this.uploading = true;
      // api
      this.apiService?.add('customers/bulkCreate', data).subscribe({
        next: (data) => {
          console.log(data);
          if (data?.isSuccess) {
            if (this.currentLanguage == 'ar') {
              this.toastr.success('تمت إضافة البيانات بنجاح...');
            } else {
              this.toastr.success('data added successfully...', 'Success');
            }
            this.onAttach.emit(this.excelData);
            $('#drag_documents_files').modal('hide');
          }
          this.uploading = false;
        },
        error: (err: any) => {
          if (this.currentLanguage == 'ar') {
            this.toastr.error('هناك شيء خاطئ', 'خطأ');
          } else {
            this.toastr.error('There Is Somthing Wrong', 'Error');
          }
          this.uploading = false;
        },
        complete: () => {
          this.uploading = false;
        },
      });
    } else {
      if (this.currentLanguage == 'ar') {
        this.toastr.warning('الرجاء إدخال الحقول المطلوبة');
      } else {
        this.toastr.warning('Please enter the required fields');
      }
    }
  }
  cancel() {
    this.files = [];
    $('#drag_documents_files').modal('hide');
  }

  truncateString(str: any, length: any, ending = '...') {
    if (str.length > length) {
      return str.slice(0, length - ending.length) + ending;
    }
    return str;
  }

  importExcel(file: any) {
    //get file path
    let path = file.target.files[0];
    this.file = file.target.files[0];
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
      console.log(this.excelData);
      // this.getTableTabKeys(this.excelData);
    };
  }

  removeFile(index: number) {
    const input: any = document.getElementById('files');
    // as an array, u have more freedom to transform the file list using array functions.
    const fileListArr: File[] = Array.from(this.files);
    fileListArr.splice(index, 1); // here u remove the file
    this.files = fileListArr;
  }

  // format bytes
  formatBytes(bytes: any, decimals = 2) {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }
}
