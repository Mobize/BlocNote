import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Section } from '../models/section.model';
import { ItemService } from '../item.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-section-form',
  templateUrl: './section-form.component.html',
  styleUrls: ['./section-form.component.css']
})
export class SectionFormComponent implements OnInit {

  sectionForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private itemService: ItemService,
              private router: Router) { }

  ngOnInit() {
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
    this.itemService.createNewSection(newSection);
    this.initForm();
  }

  cancel() {
    this.sectionForm.reset();
    this.router.navigate(['/']);
  }

}
