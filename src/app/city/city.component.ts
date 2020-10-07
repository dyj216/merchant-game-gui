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
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CityComponent implements OnInit {
  name: string;
  displayedColumns: string[] = ['name', 'buy_price', 'sell_price'];
  dataSource;
  expandedElement: null;
  rates: {};
  @ViewChild(PlayersComponent)
  private player: PlayersComponent;
  public amount = 0;
  public tradeDirection = 'buy';
  public maxAmount = 0;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService) { }

  ngOnInit(): void {
    this.getCity();
  }

  toggleDetails(element): void {
    this.amount = 0;
    if (this.player.currentPlayer) {
      this.expandedElement = this.expandedElement === element ? null : element;
      this.setMaxAmount(element);
    }
  }

  setMaxAmount(element): void {
    this.amount = 0;
    if (this.tradeDirection === 'buy') {
      this.maxAmount = Math.floor(this.player.currentPlayer.money / element.buy_price);
    }
    else {
      this.maxAmount = this.player.currentPlayer.items[element.name] ? this.player.currentPlayer.items[element.name] : 0;
    }
  }

  prepareDataSource(): void {
    this.dataSource = [];
    for (const [item, price] of Object.entries<Price>(this.rates)) {
      this.dataSource.push({
        name: item,
        buy_price: (price.buy_price ? parseInt(price.buy_price.toString(), 10) : '-'),
        sell_price: (price.sell_price ? parseInt(price.sell_price.toString(), 10) : '-')
      });
    }
  }

  getCity(): void {
    this.name = this.route.snapshot.paramMap.get('name');
    this.apiService.getCityCurrentRates(this.name)
      .subscribe(rates => {
        this.rates = rates;
        this.prepareDataSource();
      });
  }

  getValue(element): number {
    const price = this.tradeDirection === 'buy' ? element.buy_price : element.sell_price;
    return price * this.amount;
  }

  getMoney(): number {
    return this.player.currentPlayer.money;
  }

  getOwned(element): number {
    return this.player.currentPlayer.items[element.name] ? this.player.currentPlayer.items[element.name] : 0;
  }

  trade(element): void {
    this.apiService.trade(this.name, this.player.currentPlayer.code, this.tradeDirection, element.name, this.amount).subscribe(
      (response) => {
        console.log(response);
        this.expandedElement = null;
        this.player.getPlayer();
        this.prepareDataSource();
      }
    );
  }
}
