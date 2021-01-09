import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {LoginComponent} from '../login/login.component';
import {ApiService} from '../api.service';
import {SettingsComponent} from '../settings/settings.component';

interface LanguageInterface {
  url,
  text
}

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent implements OnInit {
  languages: LanguageInterface[];

  constructor(
    public dialog: MatDialog,
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.languages = [
      {url: 'en', text: '🇬🇧 English'},
      {url: 'hu', text: '🇭🇺 Magyar'}
    ];
    const loc = window.location;
    const base = loc.pathname.split('/').reverse()[2];
    for (let element of this.languages) {
      element.url = [loc.origin, base, element.url].join('/') + '/';
    }
  }

  isLoggedIn() {
    return this.apiService.isLoggedIn();
  }

  logout() {
    setTimeout(function (apiService) {
      apiService.logout();
    }, 250, this.apiService);
  }

  openLoginDialog() {
    this.dialog.open(LoginComponent, {
      width: '400px',
    });
  }

  openSettingsDialog() {
    this.dialog.open(SettingsComponent, {
      width: '400px',
    });
  }

}
