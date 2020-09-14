import { SnackBarConfirmationComponent } from './../snack-bar-confirmation/snack-bar-confirmation.component';
import { Item } from './../models/item.model';
import { Component, OnInit, OnDestroy, NgZone, ViewChild, ElementRef } from '@angular/core';
import { ItemService } from '../item.service';
import { Section } from '../models/section.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from './../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-single-section',
  templateUrl: './single-section.component.html',
  styleUrls: ['./single-section.component.css']
})
export class SingleSectionComponent implements OnInit, OnDestroy {

  @ViewChild('query', { static: true }) input: ElementRef;

  section: Section;
  editSection = false;
  sectionTitle = '';
  items: Item[];
  itemForm: FormGroup;
  sectionId: number;
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
  selected = new FormControl(0);
  codes;
  sectionLoaded = false;
  editorOptions = {theme: 'vs-dark', language: 'javascript'};
  testArray = [];
  user;
  filteredItems: Object;
  itemTitles;

  constructor(private route: ActivatedRoute, private itemService: ItemService,
              private router: Router, public dialog: MatDialog,
              private snackBar: SnackBarConfirmationComponent,
              private fb: FormBuilder,
              private authService: AuthService,
              private ngZone: NgZone) {}

  ngOnInit() {

    this.initForm();
    this.codes = [];
    this.section = new Section('');
    this.itemsSubscription = this.itemService.itemSubject.subscribe(
      (items: Item[]) => {
        this.filteredItems = this.items = items;
        this.itemTitle = '';
        this.itemCode = '';
      }
    );
    this.itemService.emitItems();
    this.route.params.subscribe(params => {
      this.sectionId = params.id;
      this.authService.getCurrentUser().then((user) => {
        this.user = user;
        this.itemService.getItems(this.user.uid, this.sectionId);
        this.itemService.getSingleSection(this.user.uid, +this.sectionId).then(
          (section: Section) => {

            this.section = section;
            if (this.section == null) {
              this.router.navigate(['/']);
            }
            this.sectionLoaded = true;
            this.selectedValue = '';
            this.showForm = false;
            this.editSection = false;
          }
        );

      });
    });
  }

  filter(query: string) {
    const result: object = {};

    // tslint:disable-next-line: forin
    for (const  key in this.items) {
      const data = this.items[key];

      if (this.items.hasOwnProperty(key) && data.title &&
        data.title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
        .indexOf(query.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()) !== -1) {
        result[key] = data;
      }
    }

    this.ngZone.run(() => {
      this.filteredItems = Object.keys(result).length ? result : '';
    });
}

  initForm() {
    this.itemForm = this.fb.group({
      title : ['', Validators.required],
      codes : this.fb.array([])
    });
    this.addCodes();
  }

  removeCode(i: number) {
    const codes = this.itemForm.controls.codes as FormArray;
    codes.removeAt(i);
  }

  onEditSection() {
    this.editSection = true;
    this.showForm = false;
  }

  saveEditSection(section) {
    this.itemService.updateSection(this.user.uid, this.sectionId, section);
    this.editSection = false;
  }

  cancelEditSection() {
    this.editSection = false;
  }

  onSaveItem() {
    const title = this.itemForm.get('title').value;
    const code = this.itemForm.get('codes').value;
    const newItem = new Item(title, code);

    Object(newItem.codes).forEach((code, index) => {
      if (code.language.toLowerCase().includes('php')) {
        if (!code.script.includes('<?php')) {
            code.script = '<?php \n' + code.script;
        }
      }
    });

    if (this.editItem) {
      this.itemService.updateItem(this.user.uid, newItem, this.sectionId, this.itemKey);
      // this.input.nativeElement.value = '';
    } else {
      this.itemService.createNewItem(this.user.uid, newItem, this.sectionId);
    }
    this.initForm();
    this.addCodes();
    this.showForm = false;
  }

  get FormData() {
    return this.itemForm.get('codes') as FormArray;
  }

  addCodes() {
    const codes = this.itemForm.controls.codes as FormArray;
    codes.push(this.fb.group({
      language: ['', Validators.required],
      script: ['', Validators.required],
    }));
    this.selected.setValue(this.FormData.controls.length - 1);
  }

  log(val) {
    console.log(val);
  }

  onEditItem(item) {
    console.log(item);
    this.selectedValue = item.key;
    this.editItem = true;
    this.itemMode = 'Modification d\'un Item';
    this.showForm = true;
    this.itemForm.get('title').setValue(item.value.title);
    this.codes = this.itemForm.controls.codes as FormArray;
    item.value.codes.forEach(() => {
      this.codes.push(this.fb.group({
          language: '',
          script: ''
        })
      );
    });
    this.FormData.controls.length = item.value.codes.length;

    this.itemForm.get('codes').setValue(item.value.codes);

    this.itemKey = item.key;
    this.showCode = false;
    this.showTitle = false;
  }

  openNewItemForm() {
    this.FormData.controls.length = 1;
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
    this.itemCode = item.value.codes;

    // Configuration du language de programmation affiché (en fonction du language saisi)
    Object.keys(item.value.codes).forEach((key, index) => {
      if (item.value.codes[key].language.toLowerCase().includes('php')) {
        this.testArray.splice(index, 1, [{theme: 'vs-dark', language :  'php'}]);
      } else {
        this.testArray.splice(index, 1, [{theme: 'vs-dark', language :  item.value.codes[key].language.toLowerCase()}]);
      }
    });
  }


  openDialog(item: number, title: string): void {
    this.selectedValue = item.toString();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '370px',
      data: 'Confirmer la suppression d\'item ?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onDeleteItem(item);
        this.snackBar.openSnackBarItem();
      }
    });
  }

  onDeleteItem(key: number) {
    this.itemService.removeItem(this.user.uid, key);
    this.showForm = false;
  }

  cancel() {
    this.showForm = false;
  }

  ngOnDestroy(): void {
    this.itemsSubscription.unsubscribe();
  }

}
