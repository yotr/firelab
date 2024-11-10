import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../services/sidebar/sidebar.service';
import { ThemeService } from '../services/theme/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css']
})
export class ModulesComponent implements OnInit {
//variables
  isSidebarClosed: boolean = false;
  currentTheme: any;

  currentUser: any = {} as any;

  constructor(
    private sidebarStatusService: SidebarService,
    private themeService: ThemeService,
    // private signalingService: SignalingService,
    private router: Router,
    // private authService: AuthService
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
    this.whenCallMsgComeing();
  }

  // get current user
  getCurrentUser() {
    // this.currentUser = this.authService.currentUserSignal()?.userData;
  }

  // connect users to socket and generate random ids
  public whenCallMsgComeing(): void {
    // this.signalingService.getCallData().subscribe((data) => {
    //   console.log(data);
    //   if (data?.receiver === this.currentUser?.email) {
    //     // calling this user
    //     if (data?.type == 'video-call' || data?.type == 'audio-call') {
    //       // if video or audio call comeing
    //       this.router.navigate(['/modules/apps/calls/incoming'], {
    //         queryParams: {
    //           type: data?.type,
    //           room: data?.room,
    //           sender: data?.sender,
    //         },
    //       });
    //     }
    //   }
    // });
  }
}

