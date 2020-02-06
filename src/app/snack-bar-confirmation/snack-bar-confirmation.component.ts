import { Component } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar-confirmation',
  templateUrl: './snack-bar-confirmation.component.html',
  styleUrls: ['./snack-bar-confirmation.component.css']
})
export class SnackBarConfirmationComponent {

  durationInSeconds = 3;

  constructor(private snackBar: MatSnackBar) { }

  openSnackBarItem() {
    // tslint:disable-next-line: no-use-before-declare
    this.snackBar.openFromComponent(SnackBarItemComponent, {
      duration: this.durationInSeconds * 1000,
      // verticalPosition: 'top'
    });
  }

  openSnackBarSection() {
    // tslint:disable-next-line: no-use-before-declare
    this.snackBar.openFromComponent(SnackBarSectionComponent, {
      duration: this.durationInSeconds * 1000,
      // verticalPosition: 'top'
    });
  }
}

@Component({
  selector: 'app-snack-bar-item',
  templateUrl: '../snack-bar/snack-bar-item.component.html',
  styleUrls: ['../snack-bar/snack-bar-item.component.css']
})
export class SnackBarItemComponent  {}

@Component({
  selector: 'app-snack-bar-section',
  templateUrl: '../snack-bar/snack-bar-section.component.html',
  styleUrls: ['../snack-bar/snack-bar-section.component.css']
})
export class SnackBarSectionComponent  {}
