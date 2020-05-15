import { Injectable, ReflectiveInjector } from '@angular/core';
import { Subject, Observable, bindCallback } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Section } from './models/section.model';
import { Item } from './models/item.model';
import * as firebase from 'firebase';
import DataSnapshot = firebase.database.DataSnapshot;
import { ActivatedRoute, Router, ActivationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  idSection: number;
  // userConnectedId = firebase.auth().currentUser;

  constructor(private route: ActivatedRoute, private router: Router) {
    // console.log(this.userConnectedId)
    // this.getSections(this.userConnectedId);

    this.router.events
      .pipe(
        filter(e => (e instanceof ActivationEnd) && (Object.keys(e.snapshot.params).length > 0)),
        map(e => e instanceof ActivationEnd ? e.snapshot.params : {})
      )
      .subscribe(params => {
      this.idSection =  params.id;
      // this.getItems(id);
      });
  }

  sections: Section[] = [];
  items: Item[] = [];
  sectionSubject = new Subject<Section[]>();
  itemSubject = new Subject<Item[]>();
  user;
  userSubject = new Subject<any>();

  emitSections() {
    this.sectionSubject.next(this.sections);
  }

  emitItems() {
    this.itemSubject.next(this.items);
  }

  emitUser() {
    this.userSubject.next(this.user)
  }

  saveUserBdd(user,firstname?: string, lastname?: string, displayName?: string, photoUrl?: string) {
    if(displayName === undefined) {
      firebase.database().ref(user + '/infos').set(
        {
          // 'emailVerified': verifiedEmail,
          'firstname': firstname, 
          'lastname': lastname
        }
      );
    } else {
      firebase.database().ref(user + '/infos').update(
        {
          // 'emailVerified': verifiedEmail,
          'displayname': displayName, 
          'photourl': photoUrl
        }
      );
    }
  }

  getUserBdd(user) {
    firebase.database().ref(user + '/infos')
    .on('value', (data: DataSnapshot) => {
      this.user = data.val() ? data.val() : [];
      // console.log(this.user);
      this.emitUser();
    });
    return this.user; 

  }

  saveSections(user) {
    firebase.database().ref(user + '/sections').set(this.sections);
  }

  getSections(user) {
    firebase.database().ref(user + '/sections')
    .on('value', (data: DataSnapshot) => {
      this.sections = data.val() ? data.val() : [];
      this.emitSections();
    });
    
    return this.sections;
  }

  getItems(user,id: number) {
    firebase.database().ref(user + '/sections/' + id + '/items')
    .on('value', (data: DataSnapshot) => {
      this.items = data.val() ? data.val() : [];
      this.emitItems();
    });
    return this.items;
  }

  getSingleSection(user, id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref(user + '/sections/' + id).once('value').then(
          (data: DataSnapshot) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  createNewSection(newSection: Section, user) {
    this.sections.push(newSection);
    this.saveSections(user);
    this.emitSections();
  }

  createNewItem(user, newItem: Item, sectionId: number) {
    firebase.database().ref(user + '/sections/' + sectionId + '/items').push(newItem);
    this.emitItems();
  }

  updateItem(user, item: Item, sectionId: number, key: number) {
    firebase.database().ref(user + '/sections/' + sectionId + '/items/' + key).update(item);
  }

  updateSection(user, sectionId, section) {
    firebase.database().ref(user + '/sections/' + sectionId).update(section);
  }

  removeItem(user, key: number) {
    const item = firebase.database().ref(user +'/sections/' + this.idSection + '/items/' + key);
    item.remove();
  }

  removeSection(user, section: Section) {
    const sectionIndexToRemove = this.sections.findIndex(
      (sectionEl) => {
        if (sectionEl === section) {
          return true;
        }
      }
    );
    this.sections.splice(sectionIndexToRemove, 1);
    this.saveSections(user);
    this.emitSections();
  }
}
