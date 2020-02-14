import { ConfirmationDialogComponent } from './../confirmation-dialog/confirmation-dialog.component';
import { SnackBarConfirmationComponent } from './../snack-bar-confirmation/snack-bar-confirmation.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { Section } from '../models/section.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-section-list',
  templateUrl: './section-list.component.html',
  styleUrls: ['./section-list.component.css']
})
export class SectionListComponent implements OnInit, OnDestroy {

  sections: Section[];
  sectionsSubscription: Subscription;
  objectKeys = Object.keys;
  selectedValue;

  constructor(private itemService: ItemService, private router: Router, public dialog: MatDialog,
              private snackBar: SnackBarConfirmationComponent) { }

  ngOnInit() {

    this.sectionsSubscription = this.itemService.sectionSubject.subscribe(
      (section: Section[]) => {
        this.sections = section;
      }
    );
    this.itemService.emitSections();
  }

  openDialog(section): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Confirmer la suppression de section ?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onDeleteSection(section);
        this.snackBar.openSnackBarSection();
        this.router.navigate(['/']);
      }
    });
  }

  onDeleteSection(section: Section) {
    this.itemService.removeSection(section);
  }

  onViewSection(id: number) {
    this.router.navigate(['/sections', id]);
    this.selectedValue = id;
  }

  ngOnDestroy() {
    this.sectionsSubscription.unsubscribe();
  }

}
