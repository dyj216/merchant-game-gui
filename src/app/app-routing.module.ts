import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayersComponent } from './players/players.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {ViewSelectorComponent} from './view-selector/view-selector.component';
import {CitiesComponent} from './cities/cities.component';
import {CityComponent} from './city/city.component';
import {PlayerComponent} from "./player/player.component";


const routes: Routes = [
  {
    path: '',
    component: ViewSelectorComponent,
    data: { title: 'Merchant Game' }
  },
  {
    path: 'players',
    component: PlayersComponent,
    data: { title: 'Players' }
  },
  {
    path: 'players/:id',
    component: PlayerComponent,
  },
  {
    path: 'cities',
    component: CitiesComponent,
    data: {title: 'Cities'}
  },
  {
    path: 'cities/:name',
    component: CityComponent,
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
// @ts-ignore
export class AppRoutingModule { }
