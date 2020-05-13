import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { ItemService } from '../item.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private itemService: ItemService) { }

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
            resolve();
            console.log(firebase.auth().currentUser.uid)
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
            const userId = firebase.auth().currentUser.uid;
            // localStorage.setItem('user', userId)
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  signOutUser() {
    firebase.auth().signOut();
    localStorage.removeItem('user');
  }
}
