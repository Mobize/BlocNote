import { CmdComponent } from './cmd/cmd.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTabsModule} from '@angular/material/tabs';
import { RouterModule, Routes } from '@angular/router';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { FormComponent } from './form/form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EscapeHtmlPipe } from './pipes/keep-html.pipe';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import { SectionListComponent } from './section-list/section-list.component';
import { SingleSectionComponent } from './single-section/single-section.component';
import { SectionFormComponent } from './section-form/section-form.component';
import { ItemFormComponent } from './item-form/item-form.component';

const appRoutes: Routes = [
  {path: 'cmd', component: CmdComponent},
  {path: 'form', component: FormComponent},
  {path: 'add-section', component: SectionFormComponent},
  {path: 'sections/:id', component: SingleSectionComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    CmdComponent,
    FormComponent,
    EscapeHtmlPipe,
    SectionListComponent,
    SingleSectionComponent,
    SectionFormComponent,
    ItemFormComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatTabsModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatIconModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
