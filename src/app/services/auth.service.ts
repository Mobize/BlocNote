import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { ItemService } from '../item.service';
import DataSnapshot = firebase.database.DataSnapshot;
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isNewUser;
  isGoogleAuth;
  IsGoogleNew: boolean;
  isAuth : boolean;
  opened: boolean;
  isVerifiedAccount: boolean;

  constructor(private itemService: ItemService, private router: Router) { }

  getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      var user = firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
          resolve(user);
        } 
      })
    })
  }

  createNewUser(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(
          () => {
            var user = firebase.auth().currentUser;
            var actionCodeSettings = {
              url: 'https://oliviercharpentier.fr/blocnote/?email=' + firebase.auth().currentUser.email,
            };
            user.sendEmailVerification(actionCodeSettings);
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  signInUser(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  async signInGoogle() {

    await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((user) => {
      const newUser = firebase.auth().currentUser;

      // Empechement d'acceder à l'application via Google avec un nouveau compte
      this.isNewUser = user.additionalUserInfo.isNewUser;
      this.isGoogleAuth = user.additionalUserInfo.providerId;
      if (this.isNewUser === true && this.isGoogleAuth === "google.com") {
        this.IsGoogleNew = true;
        this.signOutUser()
        newUser.delete()
    } else {
      this.IsGoogleNew = false;
    }
      
      // const userId = newUser.uid;

      // firebase.database().ref(userId + '/infos')
      // .on('value', (data: DataSnapshot) => {
      //   const userFirebase = data.val() ? data.val() : [];
      //   // console.log(userFirebase);
      //   if(userFirebase.emailVerified === false) {
      //     // console.log('email non verifié bdd')
      //     // this.IsGoogleNew = true;
      //     this.isAuth = false;
      //     this.opened= false;
      //     this.isVerifiedAccount = false;
      //     this.signOutUser();
      //   } else {
      //     this.isVerifiedAccount = true;
      //     this.isAuth = false;
      //     this.opened= false;
      //   }
      // });


    })
  }

  signOutUser() {
    firebase.auth().signOut();
  }
}
