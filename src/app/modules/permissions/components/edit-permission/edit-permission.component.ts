import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-edit-permission',
  templateUrl: './edit-permission.component.html',
  styleUrls: ['./edit-permission.component.css'],
})
export class EditPermissionComponent implements OnInit, AfterViewInit {
  addForm: FormGroup;
  loading: boolean = true;
  currentTheme: any;
  currentLanguage: any = localStorage.getItem('lang');
  currentUser: any = null;
  uploading: boolean = false;

  // modules
  modules: any[] = [];
  modulesLoading: boolean = true;
  getDataError: boolean = false;

  updateId: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private auth: AuthService
  ) {
    //get id
    this.activatedRoute.paramMap.subscribe((paramMap: Params) => {
      if (paramMap['get']('id')) {
        this.updateId = paramMap['get']('id');
      }
    });
    // Add form
    this.addForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      // arabicName: ['', [Validators.required]],
    });
  }
  ngAfterViewInit(): void {
    this.getCurrentData();
  }

  ngOnInit() {
    this.getTheme();
    this.getCurrentLanguage();
    this.getModules();
    this.getCurrentActiveUser();
  }
  // get theme from localStorage
  getTheme() {
    this.themeService.getCurrentTheme().subscribe((theme) => {
      this.currentTheme = JSON.parse(theme);
    });
  }

  getCurrentLanguage() {
    // get language from localStorage
    this.languageService.getCurrentLanguage().subscribe((language: any) => {
      this.currentLanguage = language;
      // turn on current language (trandlate)
      this.translateService.use(this.currentLanguage);
    });
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

  // get Modules data
  getModules() {
    this.apiService.get('modules').subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          this.modules = data?.value;
          this.getDataError = false;
        }
        this.modulesLoading = false;
      },
      error: (err) => {
        this.modules = [];
        this.modulesLoading = false;
        this.getDataError = true;
        console.log(err);
        if (this.currentLanguage == 'ar') {
          this.toastr.error('هناك شيء خاطئ', 'خطأ');
        } else {
          this.toastr.error('There Is Somthing Wrong', 'Error');
        }
        this.modulesLoading = false;
      },
      complete: () => {
        this.modulesLoading = false;
      },
    });
  }

  // get current data
  getCurrentData() {
    this.apiService.getById('roles', this.updateId).subscribe({
      next: (data: any) => {
        this.uploading = true;
        if (data?.isSuccess) {
          setTimeout(() => {
            // check permissions pages and submodules to be true
            let checkedPermissions = this.setCheckedToTrue(
              data?.value?.permissions
            );
            // assign new role permissions data in permissions array
            this.mergeArrays(this.modules, checkedPermissions);
            console.log(data);
            this.addForm.patchValue({
              name: data?.value?.name,
              // arabicName: data?.value?.arabicName,
            });
            this.uploading = false;
          }, 2000);
          // this.selectedRole = data;

          // // check existed permissions using checkbox
          // let newPermissions = this.permissions?.map((module, index) => {
          //   if (this.checkModuleInRoles(data, module?.name) != undefined) {
          //     return { ...module, checked: true };
          //   } else {
          //     return { ...module, checked: false };
          //   }
          // });

          // this.permissions = newPermissions;
          // this.selectedRoleLoading = false;

          //  set values
        }
      },
      error: (error) => {
        this.uploading = false;
        console.log(error);
        if (this.currentLanguage == 'ar') {
          this.toastr.error('هناك شيء خاطئ', 'خطأ');
        } else {
          this.toastr.error('There Is Somthing Wrong', 'Error');
        }
      },
      complete: () => {
        // this.uploading = false;
      },
    });
  }

  // Function to set checked to true
  setCheckedToTrue = (array: any[]) => {
    return array.map((item: any) => {
      item.checked = true;
      return item;
    });
  };

  // Function to merge array2 into array1
  mergeArrays(array1: any[], array2: any[]) {
    console.log(array1, array2);
    // Merge arr2 into arr1
    array1.forEach((item1: any) => {
      item1?.pages?.forEach((page: any) => {
        const existingItem = array2.find(
          (item2: any) => item2.pageId === page.id
        );

        if (existingItem) {
          // Assign values from page2 to page1
          // Object.assign(page, existingItem); // Merge properties
          // Manually assign values
          page.pageId = page?.id;
          page.read = existingItem?.read ?? page.read;
          page.create = existingItem?.create ?? page.create;
          page.update = existingItem?.update ?? page.update;
          page.delete = existingItem?.delete ?? page.delete;
          page.checked = existingItem?.checked ?? page.checked;
        }
      });
    });
  }

  //add a new
  submit() {
    // selected pages in modules
    const selectedPages = this.modules.flatMap((module: any) =>
      module?.pages
        .filter((page: any) => page?.read)
        .map((page: any) => ({
          pageId: page?.id,
          read: page?.read,
          create: page?.create,
          update: page?.update,
          delete: page?.delete,
        }))
    );

    if (this.addForm.valid && selectedPages.length > 0) {
      let data = {
        ...this.addForm.value,
        permissions: selectedPages,
      };

      console.log(data);
      this.uploading = true;
      let roleUpdated = false;
      setTimeout(() => {
        // api update role
        this.apiService.update('roles', this.updateId, data).subscribe({
          next: (data: any) => {
            console.log(data);
            if (data?.isSuccess) {
              roleUpdated = true;
              if (this.currentLanguage == 'ar') {
                this.toastr.success('تمت إضافة البيانات بنجاح...');
              } else {
                this.toastr.success('data added successfully...', 'Success');
              }
              this.router.navigate(['/modules/permissions']);
            } else {
              this.toastr.error('There Is Somthing Wrong', 'Error');
            }
          },
          error: (err: any) => {
            this.uploading = false;
            if (this.currentLanguage == 'ar') {
              this.toastr.error('هناك شيء خاطئ', 'خطأ');
            } else {
              this.toastr.error('There Is Somthing Wrong', 'Error');
              this.toastr.error(err?.error[0]?.message, 'Error');
            }
          },
          complete: () => {
            this.uploading = false;
            // if (roleUpdated) {
            //   this.createNewPermissions(selectedPages, this.updateId);
            // }
          },
        });
      }, 1000);
      // this.uploading = false;
    } else {
      if (this.currentLanguage == 'ar') {
        this.toastr.warning('الرجاء إدخال الحقول المطلوبة');
      } else {
        this.toastr.warning('Please enter the required fields');
      }
    }
  }

  onPermissionsChange(event: any) {
    // let id = event?.id;
    // let status = event?.status;
    // let action = event?.action;
    // let data = event?.data;
    // console.log('id: ', id);
    // console.log('status: ', status);
    // console.log('action: ', action);
    // console.log('data: ', data);
    // if (status && action == 'all' && data != undefined) {
    //   this.createPermissions(data, action);
    // } else if (status == false && action == 'all' && data != undefined) {
    //   this.deletePermissions(data?.id);
    // } else if (status && action == 'read' && data != undefined) {
    //   this.createPermissions(data, action);
    // } else if (status == false && action == 'read' && data != undefined) {
    //   this.deletePermissions(data?.id);
    // } else if (action == 'update' || action == 'create' || action == 'delete') {
    //   this.updatePermissions(data?.id, data);
    // }
  }

  createPermissions(values: any, action: string) {
    let data = {};
    if (action == 'all') {
      data = {
        pageId: values?.id,
        roleId: this.updateId,
        read: true,
        create: true,
        update: true,
        delete: true,
      };
    } else if (action == 'read') {
      data = {
        pageId: values?.id,
        roleId: this.updateId,
        read: values?.read,
        create: values?.create,
        update: values?.update,
        delete: values?.delete,
      };
    }

    this.apiService.add(`permissions/add`, data).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.result?.isSuccess) {
          if (this.currentLanguage == 'ar') {
            this.toastr.success('تمت إضافة البيانات بنجاح...');
          } else {
            this.toastr.success('data added successfully...', 'Success');
          }
          // this.router.navigate(['/modules/permissions']);
        }
      },
      error: (err: any) => {
        if (this.currentLanguage == 'ar') {
          this.toastr.error('هناك شيء خاطئ', 'خطأ');
        } else {
          this.toastr.error('There Is Somthing Wrong', 'Error');
          this.toastr.error(err?.error[0]?.message, 'Error');
        }
        this.uploading = false;
      },
      complete: () => {},
    });
  }

  updatePermissions(id: any, values: any) {
    let data = {
      pageId: values?.pageId,
      roleId: this.updateId,
      read: true,
      create: values?.create,
      update: values?.update,
      delete: values?.delete,
    };

    this.apiService.update(`permissions`, id, data).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          if (this.currentLanguage == 'ar') {
            this.toastr.success('تمت إضافة البيانات بنجاح...');
          } else {
            this.toastr.success('data updated successfully...', 'Success');
          }
          // this.router.navigate(['/modules/permissions']);
        }
      },
      error: (err: any) => {
        if (this.currentLanguage == 'ar') {
          this.toastr.error('هناك شيء خاطئ', 'خطأ');
        } else {
          this.toastr.error('There Is Somthing Wrong', 'Error');
          this.toastr.error(err?.error[0]?.message, 'Error');
        }
        this.uploading = false;
      },
      complete: () => {},
    });
  }
  deletePermissions(id: any) {
    this.apiService.delete(`permissions`, id).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          if (this.currentLanguage == 'ar') {
            this.toastr.success('تمت إضافة البيانات بنجاح...');
          } else {
            this.toastr.success('data deleted successfully...', 'Success');
          }
          // this.router.navigate(['/modules/permissions']);
        }
      },
      error: (err: any) => {
        if (this.currentLanguage == 'ar') {
          this.toastr.error('هناك شيء خاطئ', 'خطأ');
        } else {
          this.toastr.error('There Is Somthing Wrong', 'Error');
          this.toastr.error(err?.error[0]?.message, 'Error');
        }
        this.uploading = false;
      },
      complete: () => {},
    });
  }
  // //
  // createNewPermissions(permissions: any[], roleId: any) {
  //   // api new permissions
  //   console.log(permissions);
  //   this.apiService
  //     .add(`roles/permissions/add?roleId=${roleId}`, permissions)
  //     .subscribe({
  //       next: (data: any) => {
  //         console.log(data);
  //         if (data?.result?.isSuccess) {
  //           if (this.currentLanguage == 'ar') {
  //             this.toastr.success('تمت إضافة البيانات بنجاح...');
  //           } else {
  //             this.toastr.success('data added successfully...', 'Success');
  //           }
  //           this.router.navigate(['/modules/permissions']);
  //         }
  //       },
  //       error: (err: any) => {
  //         if (this.currentLanguage == 'ar') {
  //           this.toastr.error('هناك شيء خاطئ', 'خطأ');
  //         } else {
  //           this.toastr.error('There Is Somthing Wrong', 'Error');
  //           this.toastr.error(err?.error[0]?.message, 'Error');
  //         }
  //         this.uploading = false;
  //       },
  //       complete: () => {
  //         this.uploading = false;
  //       },
  //     });
  // }
}
