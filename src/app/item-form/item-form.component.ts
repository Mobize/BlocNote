import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Section } from '../models/section.model';
import { Item } from '../models/item.model';
import { ItemService } from '../item.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit {

  itemForm: FormGroup;
  item: Item;
  itemId: number;
  userId;

  constructor(private route: ActivatedRoute, 
    private fb: FormBuilder, 
    private itemService: ItemService, 
    private authService: AuthService) { }

  ngOnInit() {
    console.log('test')

    this.authService.getCurrentUser().then((user) => {
      this.userId= user.uid;
    })

    this.initForm();
    this.route.params.subscribe(params => {
      this.itemId = params.id;
    });
  }

  initForm() {
    this.itemForm = this.fb.group({
      title : ['', Validators.required],
      code : '',
    });
  }

  // onSaveItem() {
  //   console.log(this.userId)
  //   const title = this.itemForm.get('title').value;
  //   const code = this.itemForm.get('code').value;
  //   const newItem = new Item(title, code);
  //   this.itemService.createNewItem(this.userId,newItem, this.itemId);
  //   this.initForm();
  // }

}
