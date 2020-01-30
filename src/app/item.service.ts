import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Section } from './models/section.model';
import { Item } from './models/item.model';
import * as firebase from 'firebase';
import DataSnapshot = firebase.database.DataSnapshot;
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private route: ActivatedRoute) {
    this.getSections();
  }

  sections: Section[] = [];
  items: Item[] = [];
  sectionSubject = new Subject<Section[]>();
  itemSubject = new Subject<Item[]>();

  emitSections() {
    this.sectionSubject.next(this.sections);
  }

  emitItems() {
    this.itemSubject.next(this.items);
  }

  saveSections() {
    firebase.database().ref('/sections').set(this.sections);
  }

  saveItems(sectionId: number) {
    firebase.database().ref('/sections/' + sectionId + '/items').push(this.items);
  }

  getSections() {
    firebase.database().ref('/sections')
    .on('value', (data: DataSnapshot) => {
      this.sections = data.val() ? data.val() : [];
      this.emitSections();
    });
  }

  getItems(sectionId: number) {
    firebase.database().ref('/sections/' + sectionId + '/items')
    .on('value', (data: DataSnapshot) => {
      this.items = data.val() ? data.val() : [];
      console.log(this.items);
      this.emitItems();
    });
  }

  getSingleSection(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/sections/' + id).once('value').then(
          (data: DataSnapshot) => {
            data.forEach(function(childSnapshot){
              console.log(childSnapshot.child('items').child(data.key))
            })
            resolve(data.val());
            // console.log(data.val().items)
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  createNewSection(newSection: Section) {
    this.sections.push(newSection);
    this.saveSections();
    this.emitSections();
  }

  createNewItem(newItem: Item, sectionId: number) {
      firebase.database().ref('/sections/' + sectionId + '/items').push(newItem);
      this.emitItems();
  }

  removeSection(section: Section) {
    const sectionIndexToRemove = this.sections.findIndex(
      (sectionEl) => {
        if (sectionEl === section) {
          return true;
        }
      }
    );
    this.sections.splice(sectionIndexToRemove, 1);
    this.saveSections();
    this.emitSections();
  }
}
