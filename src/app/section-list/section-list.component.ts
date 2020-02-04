import { Component, OnDestroy, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { Section } from '../models/section.model';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-section-list',
  templateUrl: './section-list.component.html',
  styleUrls: ['./section-list.component.css']
})
export class SectionListComponent implements OnInit, OnDestroy {

  sections: Section[];
  sectionsSubscription: Subscription;
  objectKeys = Object.keys;

  constructor(private itemService: ItemService, private router: Router) { }

  ngOnInit() {

    this.sectionsSubscription = this.itemService.sectionSubject.subscribe(
      (section: Section[]) => {
        this.sections = section;
      }
    );
    this.itemService.emitSections();
  }

  onDeleteSection(section: Section) {
    this.itemService.removeSection(section);
  }

  onViewSection(id: number) {
    this.router.navigate(['/sections', id]);
  }

  ngOnDestroy() {
    this.sectionsSubscription.unsubscribe();
  }

}
