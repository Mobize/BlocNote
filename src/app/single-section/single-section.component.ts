import { SnackBarConfirmationComponent } from './../snack-bar-confirmation/snack-bar-confirmation.component';
import { Item } from './../models/item.model';
import { Component, OnInit, Input } from '@angular/core';
import { ItemService } from '../item.service';
import { Section } from '../models/section.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from './../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-single-section',
  templateUrl: './single-section.component.html',
  styleUrls: ['./single-section.component.css']
})
export class SingleSectionComponent implements OnInit {

  section: Section;
  items: Item[];
  itemTitle: string;
  itemCode: string;
  itemsSubscription: Subscription;

  constructor(private route: ActivatedRoute, private itemService: ItemService,
              private router: Router, public dialog: MatDialog, private snackBar: SnackBarConfirmationComponent) {}

  ngOnInit() {

    this.section = new Section('');
    this.itemsSubscription = this.itemService.itemSubject.subscribe(
      (items: Item[]) => {
        this.items = items;
        this.itemTitle = '';
        this.itemCode = '';
      }
    );
    this.itemService.emitItems();
    this.route.params.subscribe(params => {
      const id = params.id;
      this.itemService.getItems(id);
      this.itemService.getSingleSection(+id).then(
        (section: Section) => {
          this.section = section;
        }
      );
    });
  }

  openItem(item) {
    this.itemTitle = item.value.title;
    this.itemCode = item.value.code;
  }

  openDialog(item: number, title: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Voulez-vous supprimer l\'item ' + title + '  ?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onDeleteItem(item);
        this.snackBar.openSnackBarItem();
      }
    });
  }

  onDeleteItem(key: number) {
    this.itemService.removeItem(key);
  }

}
