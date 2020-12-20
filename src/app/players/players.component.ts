import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { ApiService } from '../api.service';
import {Player} from '../player';

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

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
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
