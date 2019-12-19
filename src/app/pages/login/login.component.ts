import { Component, OnInit, OnDestroy } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthLoginInfo} from '../../auth/login-info';
import {AuthService} from '../../auth/auth.service';
import {TokenStorageService} from '../../auth/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  form: any = {};
  isLoginFailed = false;
  isLoggedIn = false;
  errorMessage = '';
  roles: string[] = [];
  private loginInfo: AuthLoginInfo;

  constructor(private authService: AuthService, private tokenStorageService: TokenStorageService) {}

  ngOnInit() {
    if(this.tokenStorageService.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorageService.getAuthorities();
    }
  }
  ngOnDestroy() {
  }

  onSubmit(formulare: NgForm) {
      console.log(formulare);
    this.loginInfo = new AuthLoginInfo(
      this.form.username,
      this.form.password
    );
      this.authService.attemptAuth(this.loginInfo).subscribe(
        data => {
          this.tokenStorageService.saveUsername(data.username);
          this.tokenStorageService.saveToken(data.accessToken);
          this.tokenStorageService.saveAuthorities(data.authorities);
          this.isLoggedIn = true;
          this.isLoginFailed = false;
          this.roles = this.tokenStorageService.getAuthorities();
        },
        error => {
          console.log(error);
          this.errorMessage = error.error;
          this.isLoginFailed = true;
        }
      );
  }

}
