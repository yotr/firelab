import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../services/sidebar/sidebar.service';
import { ThemeService } from '../services/theme/theme.service';
import { Router } from '@angular/router';
import { LocationService } from '../services/location/location.service';
import { AuthService } from '../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css'],
})
export class ModulesComponent implements OnInit {
  //variables
  // current language
  currentLanguage: any = localStorage.getItem('lang');
  isSidebarClosed: boolean = false;
  currentTheme: any;
  currentUser: any = {} as any;

  latitude: number = 0;
  longitude: number = 0;
  errorMessage: string = '';

  constructor(
    private sidebarStatusService: SidebarService,
    private themeService: ThemeService,
    private locationService: LocationService,
    private router: Router,
    private auth: AuthService,
    private toastr: ToastrService
  ) {
    this.sidebarStatusService.getSidebarStatus().subscribe((sidebarStatus) => {
      this.isSidebarClosed = sidebarStatus;
    });
  }

  ngOnInit() {
    // get theme from localStorage
    this.themeService.getCurrentTheme().subscribe((theme) => {
      this.currentTheme = JSON.parse(theme);
    });

    // get current logged in user
    this.getCurrentUser();
  }
  ngAfterViewInit(): void {
    this.getUserLocation();
  }

  // get user
  isLoggedIn(): boolean {
    return this.auth.currentUserSignal() == undefined ? false : true;
  }
  // get current user
  getCurrentUser() {
    let user = localStorage.getItem('mms-loginData');
    if (user && this.isLoggedIn()) {
      let data = JSON?.parse(user);
      this.currentUser = data?.userData;
    }
  }

  // Get user's geolocation
  getUserLocation() {
    if (this.isLoggedIn()) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            this.updateLocation();
          },
          (error) => {
            this.errorMessage = `Error getting location: ${error.message}`;
          }
        );
      } else {
        this.errorMessage = 'Geolocation is not supported by this browser.';
      }
    }
  }

  // Optionally, you can also update the location later
  updateLocation() {
    let data = {
      latitude: this.latitude,
      longitude: this.longitude,
    };

    this.locationService
      .updateLocation('teamMembers/location', this.currentUser?.id, data)
      .subscribe({
        next: (response) => {
          // console.log('Location updated successfully:', response);
        },
        error: (error) => {
          console.error('Error updating location:', error);
          if (this.currentLanguage == 'ar') {
            this.toastr.error('هناك شيء خاطئ', 'خطأ');
          } else {
            this.toastr.error('There Is Somthing Wrong', 'Error');
          }
        },
      });
  }
}
