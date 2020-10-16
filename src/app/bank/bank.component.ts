import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../api.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {PlayersComponent} from '../players/players.component';
import {Observable} from "rxjs";

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
  loans = [];
  dataSource = null;
  displayedColumns: ['player', 'money'];
  expandedElement = null;

  constructor(
    private apiService: ApiService) { }

  ngOnInit(): void {
  }

  toggleDetails(element): void {
    this.amount = 0;
    if (this.player.currentPlayer) {
      this.expandedElement = this.expandedElement === element ? null : element;
    }
  }

  prepareDataSource(): void {
    this.getEndData().subscribe(endData => {
      this.dataSource = [];
      console.log(endData);
      for (const [k, v] of Object.entries<any>(endData)) {
        if (k === 'final_prices') {

        }
        else {
          this.dataSource.push({
            player: k,
            final_money: v.final_money
          });
        }
      }
    });
  }

  getEndData(): Observable<any> {
    return this.apiService.getEndData();
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

  getLoan(url): void {
    this.apiService.getLoan(url).subscribe(loan => {
      if (loan.payback) {
        this.apiService.getPayback(loan.payback).subscribe(payback => loan.payback = payback);
      }
      this.loans.push(loan);
    });
  }

  getLoans(playerReady: boolean): void {
    this.loans = [];
    this.player.currentPlayer.loans.forEach((loan) => {
      this.getLoan(loan);
    });
  }

  payback(loan): void {
    this.apiService.payback(loan.pay_back_loan).subscribe(payback => loan.payback = payback);
  }
}
