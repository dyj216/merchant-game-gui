import { Injectable } from '@angular/core';
import {Player} from './player';
import {CityListElement} from './city-list-element';
import { Observable, of } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiRoot = 'http://127.0.0.1:8000/merchant_game/api/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.apiRoot.concat('players/'));
  }

  getPlayer(id: string): Observable<Player> {
    return this.http.get<Player>(this.apiRoot.concat('players/').concat(id))
      .pipe(
        catchError(this.handleError<Player>('getPlayer', {code: '', items: {}, money: 0, loans: [], paybacks: []}))
      );
  }

  getCities(): Observable<CityListElement[]> {
    return this.http.get<CityListElement[]>(this.apiRoot.concat('cities/'))
      .pipe(
        catchError(this.handleError<CityListElement[]>('getCities', []))
      );
  }

  getCityCurrentRates(cityName: string): Observable<any>{
    return this.http.get<any>(this.apiRoot.concat(`cities/${cityName}/current_rates/`))
      .pipe(
        catchError(this.handleError<any>('getCityCurrentRates', {}))
      );
  }

  trade(cityName: string, player: string, tradeDirection: string, item: string, amount: number): Observable<any> {
    return this.http.post(this.apiRoot.concat(`cities/${cityName}/${tradeDirection}/`), {
      player,
      item,
      amount
    }, this.httpOptions);
  }

  rob(robber: string, robType: string, robbed: string): Observable<any> {
    return this.http.post(this.apiRoot.concat(`players/${robber}/rob/`), {
      robbed,
      rob_money: robType === 'money'
    }, this.httpOptions);
  }

  gift(giver: string, taker: string, money: number, items: object): Observable<any> {
    return this.http.post(this.apiRoot.concat(`players/${giver}/gift/`), {
      taker,
      money,
      items
    }, this.httpOptions);
  }

  getLoan(url): Observable<any> {
    return this.http.get(url, this.httpOptions);
  }

  getPayback(id): Observable<any> {
    return this.http.get(this.apiRoot.concat(`loan-paybacks/${id}/`), this.httpOptions);
  }

  payback(url): Observable<any> {
    return this.http.post(url, {}, this.httpOptions);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}


