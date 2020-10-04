import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import {Player} from '../player';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {
  currentPlayerCode = '';
  displayedColumns: string[] = ['name', 'value'];
  dataSource;
  currentPlayer: Player = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
  }

  prepareDataSource(): void {
    this.dataSource = [
      {name: 'Money', value: this.currentPlayer.money}
    ];
    for (const [k, v] of Object.entries(this.currentPlayer.items)) {
      this.dataSource.push({name: k, value: parseInt(v.toString(), 10)});
    }
  }

  getPlayer(): void {
    this.apiService.getPlayer(this.currentPlayerCode)
      .subscribe(player => {
        this.currentPlayer = player;
        this.prepareDataSource();
      });
  }

}
