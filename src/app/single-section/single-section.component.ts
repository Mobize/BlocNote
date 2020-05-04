import { SnackBarConfirmationComponent } from './../snack-bar-confirmation/snack-bar-confirmation.component';
import { Item } from './../models/item.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ItemService } from '../item.service';
import { Section } from '../models/section.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from './../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-single-section',
  templateUrl: './single-section.component.html',
  styleUrls: ['./single-section.component.css']
})
export class SingleSectionComponent implements OnInit, OnDestroy {

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

  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
};

  constructor(private route: ActivatedRoute, private itemService: ItemService,
              private router: Router, public dialog: MatDialog,
              private snackBar: SnackBarConfirmationComponent,
              private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    this.codes = [];
    // this.addCodes();
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
      this.sectionId = params.id;
      this.itemService.getItems(this.sectionId);
      this.itemService.getSingleSection(+this.sectionId).then(
        (section: Section) => {
          this.section = section;
          this.sectionLoaded = true;
          this.selectedValue = '';
          this.showForm = false;
          this.editSection = false;
        }
      );
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
    this.itemService.updateSection(this.sectionId, section);
    this.editSection = false;
  }

  cancelEditSection() {
    this.editSection = false;
  }

  onSaveItem() {
    const title = this.itemForm.get('title').value;
    const code = this.itemForm.get('codes').value;
    const newItem = new Item(title, code);

    if (this.editItem) {
      this.itemService.updateItem(newItem, this.sectionId, this.itemKey);
    } else {
      this.itemService.createNewItem(newItem, this.sectionId);
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

  onEditItem(item) {
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
    this.itemService.removeItem(key);
    this.showForm = false;
  }

  cancel() {
    this.showForm = false;
  }

  ngOnDestroy(): void {
    this.itemsSubscription.unsubscribe();

  }

}
