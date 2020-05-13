import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { ItemService } from './item.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  opened = false;
  showHomeIcon = false;
  isAuth: boolean;
  userId;
  userEmail;

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
    this.authService.getCurrentUser().then((user) => {

    });

    firebase.auth().onAuthStateChanged(
      (user) => {
        if(user) {
          this.isAuth = true;
          this.userId = user.uid;
          this.userEmail= user.email;
          this.opened= true;
          
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
