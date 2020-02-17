import { ItemService } from './../item.service';
import { Component, OnInit } from '@angular/core';
import { Section } from '../models/section.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  sectionsSubscription: Subscription;
  sections: Section[];
  objectKeys = Object.keys;

  constructor(private itemService: ItemService) { }

  ngOnInit() {

    this.sectionsSubscription = this.itemService.sectionSubject.subscribe(
      (section: Section[]) => {
        this.sections = section;
      }
    );
    this.itemService.emitSections();
  }

}
