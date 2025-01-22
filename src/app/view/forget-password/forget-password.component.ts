import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
})
export class ForgetPasswordComponent implements OnInit {
  forgetPasswordForm: FormGroup;
  currentLanguage: any = localStorage.getItem('lang');
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private auth: AuthService,
    private toastr: ToastrService
  ) {
    // login form group controls
    this.forgetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {}

  submit() {
    if (this.forgetPasswordForm.valid) {
      let data: any = {
        email: this.forgetPasswordForm.get('email')?.value,
      };
      // // send the data to server
      this.auth.forgotPassword(`teamMembers/forgot-password`, data).subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            if (this.currentLanguage == 'ar') {
              this.toastr.success(
                'لقد تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.'
              );
            } else {
              this.toastr.success(
                ' Password reset link has been sent to your email.'
              );
            }
          }

          // this.toastr.success('You are receiving email ', 'Success');
        },
        error: (error: any) => {
          // show erroe message
          this.toastr.error(error?.error[0]?.message, 'Error');
          this.toastr.error('there is something wrong', 'Error');
        },
        complete: () => {
          this.forgetPasswordForm.reset();
        },
      });
    } else {
      this.toastr.error('', 'Please enter mandatory field!');
    }
  }

  openLink() {
    window.open('https://www.aktitec.com/');
  }
}
