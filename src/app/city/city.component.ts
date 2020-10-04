import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../api.service';

interface Price {
  buy_price: bigint;
  sell_price: bigint;
}


@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {
  name: string;
  displayedColumns: string[] = ['name', 'buy_price', 'sell_price'];
  dataSource;
  rates: {};

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService) { }

  ngOnInit(): void {
    this.getCity();
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
