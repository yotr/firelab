import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { passwordMatch } from 'src/app/validation/passwordMatch.validation';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  currentLanguage: any = localStorage.getItem('lang');
  email: any = null;
  token: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private auth: AuthService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {
    //get querys
    this.activatedRoute.queryParamMap.subscribe((paramMap: Params) => {
      this.email = paramMap['get']('email');
      this.token = paramMap['get']('token');
    });
    // login form group controls
    this.resetPasswordForm = this.formBuilder.group(
      {
        newPassword: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatch }
    );
  }

  ngOnInit() {}

  submit() {
    if (this.resetPasswordForm.valid) {
      let data: any = {
        token: this.token,
        email: this.email,
        newPassword: this.resetPasswordForm.get('newPassword')?.value,
      };
      // // send the data to server
      this.auth.resetPassword(`teamMembers/reset-password`, data).subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            if (this.currentLanguage == 'ar') {
              this.toastr.success(
                'لقد تم إعادة تعيين كلمة المرور الخاصة بك بنجاح.'
              );
            } else {
              this.toastr.success(
                'Your password has been successfully reset.',
                'Success'
              );
            }
          }
        },
        error: (error: any) => {
          // show error message
          this.toastr.error(error?.error[0]?.message, 'Error');
          this.toastr.error('there is something wrong', 'Error');
        },
        complete: () => {
          this.resetPasswordForm.reset();
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
