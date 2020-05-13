import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Section } from '../models/section.model';
import { ItemService } from '../item.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';


@Component({
  selector: 'app-section-form',
  templateUrl: './section-form.component.html',
  styleUrls: ['./section-form.component.css']
})
export class SectionFormComponent implements OnInit {

  sectionForm: FormGroup;
  connectedUserId = firebase.auth().currentUser.uid;

  constructor(private formBuilder: FormBuilder, private itemService: ItemService,
              private router: Router) { }

  ngOnInit() {
    this.itemService.getSections(this.connectedUserId)
    this.initForm();
  }

  initForm() {
    this.sectionForm = this.formBuilder.group({
      title: ['', Validators.required],
    });
  }

  onSaveSection() {
    const title = this.sectionForm.get('title').value;
    const newSection = new Section(title);
    this.itemService.createNewSection(newSection, this.connectedUserId);
    this.initForm();
  }

  cancel() {
    this.sectionForm.reset();
    this.router.navigate(['/']);
  }

}
