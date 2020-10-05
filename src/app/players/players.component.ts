import {Component, Input, OnInit} from '@angular/core';
import { ApiService } from '../api.service';
import {Player} from '../player';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {
  @Input() inline = false;
  currentPlayerCode = '';
  displayedColumns: string[] = ['name', 'value'];
  currentPlayer: Player = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
  }

  getPlayer(): void {
    this.apiService.getPlayer(this.currentPlayerCode)
      .subscribe(player => {
        this.currentPlayer = player;
      });
  }
}
