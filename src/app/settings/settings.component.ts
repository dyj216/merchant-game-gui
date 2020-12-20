import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../api.service';
import {MatDialogRef} from '@angular/material/dialog';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SettingsComponent>,
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
  ) {

    this.form = this.fb.group({
      server: [this.apiService.getApiRoot(),Validators.required],
    });
  }

  setServer() {
    const val = this.form.value;

    if (val.server) {
       this.apiService.setApiRoot(val.server).subscribe((res) => {
          this.apiService.snackBar.open(`Api address set`, 'Close');
          this.dialogRef.close();
          this.router.navigate(['/']);
        },
        (error => this.apiService.snackBar.open('Not a valid api endpoint', 'Close'))
      );
    }
  }

  clearServer() {
    this.apiService.clearApiRoot();
    this.dialogRef.close();
    this.apiService.snackBar.open('Api address cleared', 'Close');
  }
}
