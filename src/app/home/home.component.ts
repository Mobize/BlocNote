import { ItemService } from './../item.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Section } from '../models/section.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

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

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    
    this.sectionsSubscription = this.itemService.sectionSubject.subscribe(
      (section: Section[]) => {
        this.sections = section;
        this.sectionsLoaded = true;
      }
    ), (error: any) => {
      console.log(error);
    };
    
    this.sections = this.itemService.getSections();
  }

  ngOnDestroy() {
    this.itemService.sectionSubject.closed;
  }

}
