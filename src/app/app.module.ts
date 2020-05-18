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
// import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { ItemService } from './item.service';
// import { environment } from 'src/environments/environment.prod';
import { environment } from 'src/environments/environment.prod';

const appRoutes: Routes = [
  {path: '', canActivate: [AuthGuardService], component: HomeComponent},
  {path: 'auth/signup', component: SignupComponent},
  {path: 'auth/signin', component: SigninComponent},
  {path: 'cmd', component: CmdComponent},
  {path: 'form', component: FormComponent},
  {path: 'add-section', canActivate: [AuthGuardService], component: SectionFormComponent},
  {path: 'sections/:id', canActivate: [AuthGuardService], component: SingleSectionComponent},
  {path: 'sections/edit/:id',canActivate: [AuthGuardService], component: EditSectionComponent},
  {path: '**', redirectTo: '/'},
];

const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: environment.production == true ? './assets' : '', // configure base path for monaco editor default: './assets'
  defaultOptions: { scrollBeyondLastLine: false }, // pass default options to be used
  // onMonacoLoad: () => { console.log((<any>window).monaco); } // here monaco object will be available as window.monaco use this function to extend monaco editor functionalities.
};


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
    SignupComponent,
    SigninComponent,
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
    MonacoEditorModule.forRoot(monacoConfig),
    // FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
    RouterModule.forRoot(appRoutes, {useHash: true})
  ],
  entryComponents: [
    ConfirmationDialogComponent,
    SnackBarConfirmationComponent,
    SnackBarItemComponent,
    SnackBarSectionComponent
  ],
  providers: [AuthService, AuthGuardService, ItemService, SnackBarConfirmationComponent, ItemFormComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
