import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  // tslint:disable-next-line: quotemark
  importModule = "import { FormsModule } from '@angular/forms';";
  // tslint:disable-next-line: quotemark
  importComponent = "import { NgForm } from '@angular/forms';";
  name: string;
  status: string;

  constructor() { }

onSubmit(form: NgForm) {
  this.name = form.value.name;
  this.status = form.value.status;
}

  ngOnInit() {
  }

}
