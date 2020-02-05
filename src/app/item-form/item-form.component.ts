import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Section } from '../models/section.model';
import { Item } from '../models/item.model';
import { ItemService } from '../item.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit {

  itemForm: FormGroup;
  item: Item;
  itemId: number;
  showForm = false;
  // buttonName = '+';

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private itemService: ItemService) { }

  ngOnInit() {

    this.initForm();
    this.route.params.subscribe(params => {
      this.itemId = params.id;
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;

    // if (this.showForm) {
    //   this.buttonName = '-';
    // } else {
    //   this.buttonName = '+';
    // }
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
    this.itemService.createNewItem(newItem, this.itemId);
    this.initForm();
    // this.router.navigate(['/sections']);
  }

}
