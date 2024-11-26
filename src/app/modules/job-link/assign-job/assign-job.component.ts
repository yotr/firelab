import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-assign-job',
  templateUrl: './assign-job.component.html',
  styleUrls: ['./assign-job.component.css'],
})
export class AssignJobComponent implements OnInit {
  addForm: FormGroup;
  loading: boolean = true;
  hours: any[] = [];
  minutes: any[] = [];
  durations: any[] = [];
  // employees: any[] = [];
  // employeesLoading: boolean = true;
  // clients: any[] = [];
  // clientsLoading: boolean = true;
  defaultImgUrl: any = 'assets/img/camera.png';
  currentTheme: any;
  selectUserType: string = 'normal';
  members: any[] = [];
  selectedMembers: any[] = [];

  currentUser: any = null;
  // roles
  roles: any[] = [];
  rolesLoading: boolean = true;
  // defaultPermissions: Permission[];
  uploading: boolean = false;
  isNoteActive: boolean = false;
  isInspectorNoteActive: boolean = false;
  isCustomerNoteActive: boolean = false;

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
      startDate: ['', [Validators.required]],
      durationBy: ['', [Validators.required]],
      hours: ['', [Validators.required]],
      mintes: ['', [Validators.required]],
      meridiem: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      teamIds: [[], [Validators.required]],
      inspectorNote: [[''], [Validators.required]],
      customerNote: [[''], [Validators.required]],
    });
    this.hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    this.minutes = ['00', '30'];
    this.durations = Array.from({ length: 47 }, (_, index) => 1 + index * 0.5);

    this.members = [
      {
        id: 0,
        name: 'Member One',
      },
      {
        id: 1,
        name: 'Member Two',
      },
      {
        id: 2,
        name: 'Member Three',
      },
      {
        id: 3,
        name: 'Member Four',
      },
      {
        id: 4,
        name: 'Member Five',
      },
      {
        id: 5,
        name: 'Member Six',
      },
      {
        id: 6,
        name: 'Member Seven',
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

  toggleNote() {
    this.isNoteActive = !this.isNoteActive;
  }
  close() {
    this.isNoteActive = false;
  }
  addInspectorNote() {
    this.isInspectorNoteActive = true;
  }
  removeInspectorNote() {
    this.addForm.get('inspectorNote')?.setValue('');
    this.isInspectorNoteActive = false;
  }
  addCustomerNote() {
    this.isCustomerNoteActive = true;
  }
  removeCustomerNote() {
    this.addForm.get('customerNote')?.setValue('');
    this.isCustomerNoteActive = false;
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

  getSelectedMembers(members: any[]) {
    this.selectedMembers = members;
    console.log(members);
  }

  //add a new
  submit() {
    let date = new Date();
    console.log(this.selectedMembers);
  }
  trackFun(index: number, item: any): number {
    return item.id;
  }
}
