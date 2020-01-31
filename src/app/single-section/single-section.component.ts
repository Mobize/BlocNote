import { Item } from './../models/item.model';
import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { Section } from '../models/section.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-single-section',
  templateUrl: './single-section.component.html',
  styleUrls: ['./single-section.component.css']
})
export class SingleSectionComponent implements OnInit {

  section: Section;
  items: Item;
  itemsSubscription: Subscription;

  constructor(private route: ActivatedRoute, private itemService: ItemService,
              private router: Router) {}

  ngOnInit() {

    this.section = new Section('');

    this.route.params.subscribe(params => {
      const id = params.id;

      this.itemService.getItems(id).then(
        (items: Item) => {
          this.items = items;
        }
      );

      this.itemService.getSingleSection(+id).then(
        (section: Section) => {
          this.section = section;
        }
      );
    });
  }

}
