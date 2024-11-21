import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
// import xlsx package to export function
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css'],
})
export class AddDeviceComponent implements OnInit, AfterViewInit {
  addForm: FormGroup;
  loading: boolean = true;
  // employees: any[] = [];
  // employeesLoading: boolean = true;
  // clients: any[] = [];
  // clientsLoading: boolean = true;
  defaultImgUrl: any = 'assets/img/camera.png';
  currentTheme: any;
  selectUserType: string = 'normal';

  currentUser: any = null;
  // reports
  reports: any[] = [];
  reportsLoading: boolean = true;
  file: any = null;
  fileURL: any = null;
  excelData: any[] = [];

  // defaultPermissions: Permission[];
  uploading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private toastr: ToastrService,
    private router: Router,
    // private apiService: ApiService,
    // private permissionsService: PermissionsService,
    private auth: AuthService
  ) {
    // Add form
    this.addForm = this.formBuilder.group({
      reportCategory: ['', [Validators.required]],
      listName: ['', [Validators.required]],
    });
    this.reports = [
      {
        id: 0,
        name: 'Alarm',
      },
      {
        id: 1,
        name: 'Fire Door',
      },
    ];
  }
  ngAfterViewInit(): void {}

  ngOnInit() {
    this.getTheme();
    this.getCurrentActiveUser();
  }
  // get theme from localStorage
  getTheme() {
    this.themeService.getCurrentTheme().subscribe((theme) => {
      this.currentTheme = JSON.parse(theme);
    });
  }

  // //get selected files form device

  // getSelectedFiles(event: any) {
  //   this.loading = true;
  //   if (event?.target?.files) {
  //     this.file = event?.target?.files[0];
  //     // this.onSelectFiles.emit(event?.target?.files);
  //     // get files as url
  //     var reader = new FileReader();
  //     reader.readAsDataURL(event.target.files[0]);
  //     reader.onload = () => {
  //       this.fileURL = reader.result;
  //       this.loading = false;
  //     };
  //   }
  // }
  truncateString(str: any, length: any, ending = '...') {
    if (str.length > length) {
      return str.slice(0, length - ending.length) + ending;
    }
    return str;
  }
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
      console.log(this.excelData);
      // this.getTableTabKeys(this.excelData);
    };
  }
  // get current user
  getCurrentActiveUser() {
    // check local storage
    let user = localStorage.getItem('firelab-loginData');
    // if exist
    if (user) {
      this.auth.currentUserSignal.set(JSON.parse(user));
      this.currentUser = JSON.parse(user)?.userData;
    } else {
    }
  }

  //add a new
  submit() {
    let date = new Date();
    // add the new date
    // this.addUserForm.patchValue({
    //   date: date.toLocaleDateString('en-CA'),
    // });

    // // add to server
    // if (this.addUserForm.valid) {
    //   let formData: FormData = new FormData();
    //   formData.append('firstName', this.addUserForm.get('firstName').value);
    //   formData.append('lastName', this.addUserForm.get('lastName').value);
    //   formData.append('userName', this.addUserForm.get('userName').value);
    //   formData.append('email', this.addUserForm.get('email').value);
    //   formData.append('password', this.addUserForm.get('password').value);
    //   formData.append(
    //     'confirmPassword',
    //     this.addUserForm.get('confirmPassword').value
    //   );
    //   formData.append('phone', this.addUserForm.get('phone').value);
    //   formData.append('role', this.addUserForm.get('role').value);
    //   // formData.append('company', this.addUserForm.get('company').value);
    //   if (this.addUserForm.get('employeeId').value !== null) {
    //     formData.append('employeeId', this.addUserForm.get('employeeId').value);
    //   }
    //   if (this.addUserForm.get('clientId').value !== null) {
    //     formData.append('clientId', this.addUserForm.get('clientId').value);
    //   }

    //   formData.append('date', this.addUserForm.get('date').value);
    //   // formData.append('permissions', JSON.stringify(this.defaultPermissions));
    //   if (this.addUserForm.get('image').value != null) {
    //     formData.append('image', this.addUserForm.get('image').value);
    //   }

    //   let added = false;
    //   this.uploading = true;
    //   // send the data to server
    //   this.apiService.addMultiData('users/create', formData).subscribe({
    //     next: (data) => {
    //       this.uploading = false;
    //       added = true;
    //     },
    //     error: (error) => {
    //       this.uploading = false;
    //       this.toastr.error('there is something wrong', 'Error');
    //     },
    //     complete: () => {
    //       if (added) {
    //         this.uploading = false;
    //         this.router.navigate(['/modules/users/all-users']);
    //         this.toastr.success('User added Successfully');
    //         this.addUserForm.reset();
    //       }
    //     },
    //   });
    // } else {
    //   this.uploading = false;
    //   this.toastr.error('', 'Please enter mandatory field!');
    // }
  }
  trackFun(index: number, item: any): number {
    return item.id;
  }
  // check page || components permissions
  checkPageActions(): any {
    // return this.permissionsService.checkPageActions(
    //   this.auth.currentUserSignal()?.userData,
    //   'Users',
    //   'add'
    // );
  }
}
