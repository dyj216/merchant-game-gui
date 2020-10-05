import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../api.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {PlayersComponent} from '../players/players.component';

interface Price {
  buy_price: bigint;
  sell_price: bigint;
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

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService) { }

  ngOnInit(): void {
    this.getCity();
  }

  toggleDetails(element): void {
    if (this.player.currentPlayer) {
      this.expandedElement = this.expandedElement === element ? null : element;
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

}
