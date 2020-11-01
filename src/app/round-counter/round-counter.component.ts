import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../api.service';
import {CountdownComponent, CountdownConfig, CountdownEvent} from 'ngx-countdown';

@Component({
  selector: 'app-round-counter',
  templateUrl: './round-counter.component.html',
  styleUrls: ['./round-counter.component.scss']
})
export class RoundCounterComponent implements OnInit {
  currentRound: number;
  roundTime: number;
  gameData;
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;
  config: CountdownConfig;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.getGameData();
  }

  getGameData(): void {
    this.apiService.getGameData().subscribe(gameDataList => {
      this.gameData = gameDataList.pop();
      this.currentRound = this.gameData.current_round;
      this.config = {leftTime: this.gameData.round_remaining_seconds, format: 'mm:ss'};
    })
  }

  handleCountDownEvent(event: CountdownEvent): void {
    console.log(event);
    if (event.action === 'done') {
      if (this.gameData.current_round !== this.gameData.last_round) {
        this.getGameData();
      }
    }
  }

}
