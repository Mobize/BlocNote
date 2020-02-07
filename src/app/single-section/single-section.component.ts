import { SnackBarConfirmationComponent } from './../snack-bar-confirmation/snack-bar-confirmation.component';
import { Item } from './../models/item.model';
import { Component, OnInit, Input } from '@angular/core';
import { ItemService } from '../item.service';
import { Section } from '../models/section.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from './../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-single-section',
  templateUrl: './single-section.component.html',
  styleUrls: ['./single-section.component.css']
})
export class SingleSectionComponent implements OnInit {

  section: Section;
  items: Item[];
  itemForm: FormGroup;
  itemId: number;
  itemKey: number;
  itemTitle: string;
  itemCode: string;
  itemsSubscription: Subscription;
  showForm: boolean;
  editItem = false;
  itemMode = '';
  showCode: boolean;
  showTitle = false;
  selectedValue = '';

  constructor(private route: ActivatedRoute, private itemService: ItemService,
              private router: Router, public dialog: MatDialog,
              private snackBar: SnackBarConfirmationComponent,
              private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
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
      this.itemId = params.id;
      this.itemService.getItems(this.itemId);
      this.itemService.getSingleSection(+this.itemId).then(
        (section: Section) => {
          this.section = section;
          this.selectedValue = '';
          this.showForm = false;
        }
      );
    });
  }

  initForm() {
    this.itemForm = this.fb.group({
      title : ['', Validators.required],
      code : '',
    });
  }

  onSaveItem() {
    const title = this.itemForm.get('title').value;
    const code = this.itemForm.get('code').value;
    const newItem = new Item(title, code);

    if (this.editItem) {
      this.itemService.updateItem(newItem, this.itemId, this.itemKey);
    } else {
      this.itemService.createNewItem(newItem, this.itemId);
    }
    this.initForm();
    this.showForm = false;
  }

  onEditItem(item) {
    this.selectedValue = item.key;
    this.editItem = true;
    this.itemMode = 'Modification d\'un Item';
    this.showForm = true;
    this.itemForm.get('title').setValue(item.value.title);
    this.itemForm.get('code').setValue(item.value.code);
    this.itemKey = item.key;
    this.showCode = false;
    this.showTitle = false;
  }

  openEditForm() {
    this.itemMode = 'Création d\'un Item';
    this.selectedValue = '';
    this.showForm = true;
    this.showCode = false;
    this.editItem = false;
    this.itemForm.reset();
    this.showTitle = false;
  }

  openItem(item, index) {
    this.selectedValue = index;
    this.showForm = false;
    this.itemMode = '';
    this.showTitle = true;
    this.showCode = true;
    this.itemTitle = item.value.title;
    this.itemCode = item.value.code;
  }


  openDialog(item: number, title: string): void {

    this.selectedValue = item.toString();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '370px',
      data: 'Voulez-vous supprimer l\'item ' + title
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

  cancel() {
    this.showForm = false;
  }

}
