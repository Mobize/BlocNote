import { Injectable, ReflectiveInjector } from '@angular/core';
import { Subject, Observable, bindCallback } from 'rxjs';
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
  sectionSubject = new Subject<Section[]>();

  emitSections() {
    this.sectionSubject.next(this.sections);
  }

  saveSections() {
    firebase.database().ref('/sections').set(this.sections);
  }

  getSections() {
    firebase.database().ref('/sections')
    .on('value', (data: DataSnapshot) => {
      this.sections = data.val() ? data.val() : [];
      this.emitSections();
    });
  }

  getItems(sectionId: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/sections/' + sectionId + '/items').once('value').then(
          (data: DataSnapshot) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        )
      }
    );
  }

  gettest(sectionId: number) {

      firebase.database().ref('/sections/' + sectionId + '/items').on('child_added', (snapshot) => {
        console.log(snapshot.val())
      })
  }

  getSingleSection(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/sections/' + id).once('value').then(
          (data: DataSnapshot) => {
            resolve(data.val());
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
