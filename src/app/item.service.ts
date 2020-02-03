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

  constructor(private route: ActivatedRoute, private router: Router) {
    this.getSections();

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

  emitSections() {
    this.sectionSubject.next(this.sections);
  }

  emitItems() {
    this.itemSubject.next(this.items);
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

  getItems(id: number) {
    firebase.database().ref('/sections/' + id + '/items')
    .on('value', (data: DataSnapshot) => {
      this.items = data.val() ? data.val() : [];
      this.emitItems();
    });
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
    this.emitItems();
  }

  removeItem(key: number) {
    const item = firebase.database().ref('sections/' + this.idSection + '/items/' + key);
    item.remove();
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
