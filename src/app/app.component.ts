import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { ItemService } from './item.service';
import { Subscription } from 'rxjs';
import DataSnapshot = firebase.database.DataSnapshot;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  opened = false;
  showHomeIcon = false;
  isAuth = false;
  user;
  userId;
  userEmail;
  userFirstName;
  userLastName;
  userPhotoUrl: string;
  userSubscription: Subscription;
  newGoogleUser: boolean;
  isVerifiedAccount: boolean;

  constructor(private authService: AuthService, private router: Router, private itemService: ItemService) {
    const config = {
      apiKey: 'AIzaSyAkS9TU8jUI94N_CqsBVax93FJI6_cWa10',
      authDomain: 'blocnote-f5652.firebaseapp.com',
      databaseURL: 'https://blocnote-f5652.firebaseio.com',
      projectId: 'blocnote-f5652',
      storageBucket: 'blocnote-f5652.appspot.com',
      messagingSenderId: '1025129978433',
      appId: '1:1025129978433:web:e2a7ef31426249ab5884c0',
      measurementId: 'G-KFLDJFECZN'
    };
    firebase.initializeApp(config);
  }

  ngOnInit() {

    // Données Authentification FIrebase
    firebase.auth().onAuthStateChanged(
      (user) => {
        if(user) {
          this.user = user;
          this.itemService.getUserBdd(user.uid);
          this.userPhotoUrl = user.photoURL;
          this.isAuth = true;
          this.opened = true;

          // Données bdd Firebase
          this.userSubscription = this.itemService.userSubject.subscribe(
            (user: any) => {
              this.userFirstName = user.firstname;
              this.userLastName = user.lastname;
            }
          );
          if(this.authService.isNewUser && this.authService.IsGoogleNew) {
            // console.log('google et nouveau');
            this.newGoogleUser = true;
            // this.authService.signOutUser();
            this.opened= false;
            this.isAuth = false;
          } 
            this.userEmail= user.email;
        } else {
          this.isAuth = false;
          this.opened = false;
        }
      }
    )
  }

  onSignOut() {
    this.authService.signOutUser();
    this.router.navigate(['/auth/signin']);
  }

  onClose() {
    this.showHomeIcon = true;
  }

  onOpen() {
    this.showHomeIcon = false;
  }

}
