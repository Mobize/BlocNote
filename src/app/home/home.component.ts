import { ItemService } from './../item.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Section } from '../models/section.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  sectionsSubscription: Subscription;
  sections: Section[];
  sectionsLoaded = false;
  objectKeys = Object.keys;
  user = firebase.auth().currentUser;
  userConnected = firebase.auth().currentUser.uid;
  emailUser = firebase.auth().currentUser.email;
  userVerificationEmail= firebase.auth().currentUser.emailVerified;
  userSubscription: Subscription;
  userDisplayName : string;

  constructor(private itemService: ItemService) { }

  ngOnInit() {

    // console.log(this.user);
    const email = this.getEmailProvider(this.emailUser);

    if(this.userVerificationEmail && email === 'gmail.com') {
      var userData = {
        'isgooglemail': 'true',
        'verifiedEmail': 'true',
        'emailUser' : this.emailUser
      }
      localStorage.setItem('userInfos', JSON.stringify(userData))
    } else if(this.userVerificationEmail && email !== 'gmail.com'){
      var userDataOther = {
        'isgooglemail': 'false',
        'verifiedEmail': 'true',
        'emailUser' : this.emailUser
      }
      localStorage.setItem('userInfos', JSON.stringify(userDataOther))
    }

        // Données bdd Firebase
    this.userSubscription = this.itemService.userSubject.subscribe(
      (user: any) => {
        // this.userFirstName = user.firstname;
        // this.userLastName = user.lastname;
        this.userDisplayName = user.firstname;
        console.log(user)
      }
    );

    this.itemService.getUserBdd(this.userConnected)
    
    this.sectionsSubscription = this.itemService.sectionSubject.subscribe(
      (section: Section[]) => {
        this.sections = section;
        this.sectionsLoaded = true;
      }
    ), (error: any) => {
      console.log(error);
    };
    
    this.sections = this.itemService.getSections(this.userConnected);
  }

  ngOnDestroy() {
    this.itemService.sectionSubject.closed;
  }

  getEmailProvider(email) {
    return email.split('@')[1];
  }

}
