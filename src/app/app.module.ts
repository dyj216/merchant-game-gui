import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {RouterModule} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { PlayersComponent } from './players/players.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { ViewSelectorComponent } from './view-selector/view-selector.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import { CitiesComponent } from './cities/cities.component';
import { CityComponent } from './city/city.component';
import { PlayerComponent } from './player/player.component';
import {MAT_RADIO_DEFAULT_OPTIONS, MatRadioModule} from '@angular/material/radio';
import {MatSliderModule} from '@angular/material/slider';
import {MatTabsModule} from '@angular/material/tabs';
import { BankComponent } from './bank/bank.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { RoundCounterComponent } from './round-counter/round-counter.component';
import {CountdownModule} from 'ngx-countdown';
import { LoginComponent } from './login/login.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import {AuthInterceptor} from './api.service';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    PlayersComponent,
    PageNotFoundComponent,
    ViewSelectorComponent,
    CitiesComponent,
    CityComponent,
    PlayerComponent,
    BankComponent,
    RoundCounterComponent,
    LoginComponent,
    UserMenuComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatListModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    HttpClientModule,
    MatRadioModule,
    MatSliderModule,
    MatTabsModule,
    MatExpansionModule,
    CountdownModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  providers: [
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2000}},
  ],
  entryComponents: [
    LoginComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
