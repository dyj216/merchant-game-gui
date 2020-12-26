import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import {Player} from '../player';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  currentPlayerCode = '';
  displayedColumns: string[] = ['name', 'value'];
  dataSource;
  currentPlayer: Player = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.getPlayer();
  }

  prepareDataSource(): void {
    this.dataSource = [];
    for (const [k, v] of Object.entries(this.currentPlayer.items)) {
      this.dataSource.push({name: k, value: parseInt(v.toString(), 10)});
    }
  }

  getPlayer(): void {
    this.currentPlayerCode = this.route.snapshot.paramMap.get('id');
    this.apiService.getPlayer(this.currentPlayerCode)
      .subscribe(player => {
        this.currentPlayer = player;
        this.prepareDataSource();
      });
  }
}
