import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../api.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {PlayersComponent} from '../players/players.component';

interface Price {
  buy_price: number;
  sell_price: number;
}


@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BankComponent implements OnInit {
  @ViewChild(PlayersComponent)
  public player: PlayersComponent;
  public amount = 0;

  constructor(
    private apiService: ApiService) { }

  ngOnInit(): void {
  }

  getMoney(): number {
    let money = 0;
    if (this.player) {
      if (this.player.currentPlayer) {
        money = this.player.currentPlayer.money;
      }
    }
    return money;
  }

  getOwned(element): number {
    return this.player.currentPlayer.items[element.name] ? this.player.currentPlayer.items[element.name] : 0;
  }
}
