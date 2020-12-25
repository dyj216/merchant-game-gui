import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { ApiService } from '../api.service';
import {Player} from '../player';
import {MatDialog} from '@angular/material/dialog';
import {ScannerComponent} from '../scanner/scanner.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {
  @Input() inline = false;
  @Output() playerReady = new EventEmitter<boolean>();
  currentPlayerCode = '';
  currentPlayer: Player = null;

  constructor(
    public dialog: MatDialog,
    private apiService: ApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
  }

  openScannerDialog() {
    const dialogRef = this.dialog.open(ScannerComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.currentPlayerCode = result;
        if (this.inline) this.getPlayer();
        else this.router.navigate(['/', 'players', this.currentPlayerCode]);
      }
    });
  }

  getPlayer(): void {
    if (this.currentPlayerCode !== '') {
      this.apiService.getPlayer(this.currentPlayerCode)
        .subscribe(player => {
          if (player.code !== '') {
            this.currentPlayer = player;
            this.apiService.snackBar.open(`'${player.code}' data fetched.`, 'Close')
            this.playerReady.emit(true);
          }
        });
    }
  }
}
