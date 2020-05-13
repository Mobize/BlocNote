import { ConfirmationDialogComponent } from './../confirmation-dialog/confirmation-dialog.component';
import { SnackBarConfirmationComponent } from './../snack-bar-confirmation/snack-bar-confirmation.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { Section } from '../models/section.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';

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
  sectionsLoaded = false;
  userConected ;

  constructor(private itemService: ItemService, private router: Router, public dialog: MatDialog,
              private snackBar: SnackBarConfirmationComponent, private authService: AuthService) { }

  ngOnInit() {

    this.authService.getCurrentUser().then((user) => {
      this.userConected = user.uid;
      this.itemService.emitSections();
      this.sections = this.itemService.getSections(this.userConected);
      // console.log(this.sections)
    })

    this.sectionsSubscription = this.itemService.sectionSubject.subscribe(
      (section: Section[]) => {
        this.sections = section;
        this.sectionsLoaded = true;
      }
    );
    // this.itemService.emitSections();
    // this.sections = this.itemService.getSections(this.userConected);
    // console.log(this.sections)
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
    this.itemService.removeSection(this.userConected,section);
  }

  onViewSection(id: number) {
    this.router.navigate(['/sections', id]);
    this.selectedValue = id;
  }

  ngOnDestroy() {
    this.sectionsSubscription.unsubscribe();
  }

}
