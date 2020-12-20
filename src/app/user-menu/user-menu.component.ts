import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {LoginComponent} from '../login/login.component';
import {ApiService} from '../api.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
  }

  isLoggedIn() {
    return this.apiService.isLoggedIn();
  }

  logout() {
    setTimeout(function (apiService) {
      apiService.logout();
    }, 250, this.apiService);
  }

  openDialog() {
    this.dialog.open(LoginComponent);
  }

}
