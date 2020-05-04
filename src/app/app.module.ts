import { EditSectionComponent } from './edit-section/edit-section.component';
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
import { HomeComponent } from './home/home.component';
import {MatBadgeModule} from '@angular/material/badge';
import {MatDialogModule} from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {
  SnackBarConfirmationComponent,
  SnackBarItemComponent,
  SnackBarSectionComponent
} from './snack-bar-confirmation/snack-bar-confirmation.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule} from '@angular/common/http';
// import 'froala-editor/js/plugins.pkgd.min.js';
// import 'froala-editor/js/languages/fr.js';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'cmd', component: CmdComponent},
  {path: 'form', component: FormComponent},
  {path: 'add-section', component: SectionFormComponent},
  {path: 'sections/:id', component: SingleSectionComponent},
  {path: 'sections/edit/:id', component: EditSectionComponent}
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
    EditSectionComponent,
    ItemFormComponent,
    HomeComponent,
    ConfirmationDialogComponent,
    SnackBarConfirmationComponent,
    SnackBarItemComponent,
    SnackBarSectionComponent,
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
    MatBadgeModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    AngularEditorModule,
    HttpClientModule,
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
    RouterModule.forRoot(appRoutes, {useHash: true})
  ],
  entryComponents: [
    ConfirmationDialogComponent,
    SnackBarConfirmationComponent,
    SnackBarItemComponent,
    SnackBarSectionComponent
  ],
  providers: [SnackBarConfirmationComponent, ItemFormComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
