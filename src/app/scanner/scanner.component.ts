import {Component, OnInit, ViewChild} from '@angular/core';
import {ZXingScannerComponent} from '@zxing/ngx-scanner';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css']
})
export class ScannerComponent implements OnInit {
  @ViewChild('scanner', { static: false })
  scanner: ZXingScannerComponent;

  constructor(
    public dialogRef: MatDialogRef<ScannerComponent>,
  ) { }

  ngOnInit(): void {
  }

  writeQrCode(result) {
    this.dialogRef.close(result);
  }

}
