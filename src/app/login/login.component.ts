import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../api.service';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    private fb: FormBuilder,
    private apiService: ApiService,
  ) {

    this.form = this.fb.group({
      username: ['',Validators.required],
      password: ['',Validators.required]
    });
  }

  login() {
    const val = this.form.value;

    if (val.username && val.password) {
       this.apiService.login(val.username, val.password).subscribe((res) => {
          this.apiService.snackBar.open(`Login successful`, 'Close');
          this.dialogRef.close();
        },
        (error => this.apiService.snackBar.open(error.error.detail, 'Close'))
      );
    }
  }
}
