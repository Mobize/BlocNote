import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { ItemService } from 'src/app/item.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  signinForm: FormGroup;
  errorMessage: string;
  isAuth: boolean;
  userInfos = localStorage.getItem('userInfos');
  showGoogleButton= false;
  notVerifiedAccount= false;
  newGoogleAcount: boolean;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private itemService: ItemService,
    private appComponent: AppComponent) { }

  ngOnInit() {

        if(firebase.auth().currentUser !== null) {
      this.router.navigate(['/']);
    }

    if (this.userInfos) {
      const emailVerified = JSON.parse(this.userInfos).verifiedEmail;
      const googleEmail = JSON.parse(this.userInfos).isgooglemail;
      if(emailVerified === 'true' && googleEmail === 'true') {
        this.showGoogleButton = true;
      }
    }
    
    this.initForm();
  }

  initForm() {
    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });
  }

  google() {
    this.authService.signInGoogle().then(()=> {
          this.authService.getCurrentUser().then((user)=> {
          if(user.emailVerified) {
            this.itemService.saveUserBdd(user.uid,'','', user.displayName, user.photoURL);
            this.router.navigate(['/']);
          }
        })

      if (this.authService.isNewUser && this.authService.IsGoogleNew) {
        this.newGoogleAcount = true;
      } else {
        this.newGoogleAcount = false;
        this.router.navigate(['/']);
      }
    })
  }

  onSubmit() {
    const email = this.signinForm.get('email').value;
    const password = this.signinForm.get('password').value;
    
    this.authService.signInUser(email, password).then(
      () => {
        this.router.navigate(['/']);
      },
      (error) => {
        this.errorMessage = error;
      }
    );
  }

}
