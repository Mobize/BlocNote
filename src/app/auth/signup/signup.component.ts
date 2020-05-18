import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ItemService } from 'src/app/item.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  errorMessage: string;
  newUserID;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private itemService: ItemService) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.router.navigate(['/']);
      }
    })
    this.initForm();
  }

  initForm() {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: [''],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });
  }

  onSubmit() {
    const email = this.signupForm.get('email').value;
    const firstName = this.signupForm.get('firstName').value;
    const lastName = this.signupForm.get('lastName').value;
    const password = this.signupForm.get('password').value;
    this.authService.IsGoogleNew = false;
    
    this.authService.createNewUser(email, password).then(
      () => {
        this.router.navigate(['/']);
        const newUserID = firebase.auth().currentUser.uid;
        this.itemService.saveUserBdd(newUserID, firstName, lastName);
        var userData = {
          'verifiedEmail': 'false',
          'emailUser' : email
        }
        localStorage.setItem('userInfos', JSON.stringify(userData))
      },
      (error) => {
        this.errorMessage = error;
      }
    );
  }

}
