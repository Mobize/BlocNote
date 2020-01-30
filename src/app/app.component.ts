import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  opened = true;

  constructor() {
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

}
