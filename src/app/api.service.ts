import {Injectable} from '@angular/core';
import {Player} from './player';
import {CityListElement} from './city-list-element';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';
import {Router} from '@angular/router';
import {jwtOptions} from './jwt';

interface User {
  username,
  password,
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiRoot = new BehaviorSubject('');
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    public snackBar: MatSnackBar,
    public jwtHelperService: JwtHelperService,
    private router: Router,
  ) { }

    getApiRoot(): string {
      const api_root = localStorage.getItem('api_root');
      return  api_root ? api_root : '';
    }

    getApiRootBehaviorSubject() {
      return this.apiRoot;
    }

    clearApiRoot() {
      localStorage.removeItem('api_root')
    }

    setApiRoot(address: string) {
      return this.http.get<any>(address.concat('check/'), this.httpOptions).pipe(
        tap(res => {
          if (res.api_root) {
            let url = document.createElement('a');
            url.href = address;
            jwtOptions.addToAllowedDomainList(url.host);
            address = address.endsWith('/') ? address : address.concat('/');
            localStorage.setItem('api_root', res.api_root)
            this.apiRoot.next(res.api_root);
          }
        }),
      );
    }

    login(username: string, password: string) {
      return this.http.post<User>(this.getApiRoot().concat('token/'), {username, password}).pipe(
        tap(res => this.setSession(res))
      );
    }

    private setSession(authResult) {
      localStorage.setItem('access_token', authResult.access);
    }

    logout() {
      localStorage.removeItem('access_token');
      this.snackBar.open(`Logged out`, 'Close');
      this.router.navigate(['/']);
    }

    public isLoggedIn() {
      return (!this.jwtHelperService.isTokenExpired(this.jwtHelperService.tokenGetter()));
    }

    isLoggedOut() {
      return !this.isLoggedIn();
    }

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.getApiRoot().concat('players/'));
  }

  getPlayer(id: string): Observable<Player> {
    return this.http.get<Player>(this.getApiRoot().concat('players/').concat(id))
      .pipe(
        catchError(this.handleError<Player>('getPlayer', {code: '', items: {}, money: 0, loans: [], paybacks: []}, id)),
      );
  }

  getCities(): Observable<CityListElement[]> {
    return this.http.get<CityListElement[]>(this.getApiRoot().concat('cities/'))
      .pipe(
        catchError(this.handleError<CityListElement[]>('getCities', []))
      );
  }

  getCityCurrentRates(cityName: string): Observable<any>{
    return this.http.get<any>(this.getApiRoot().concat(`cities/${cityName}/current_rates/`))
      .pipe(
        catchError(this.handleError<any>('getCityCurrentRates', {}))
      );
  }

  trade(cityName: string, player: string, tradeDirection: string, item: string, amount: number): Observable<any> {
    return this.http.post(this.getApiRoot().concat(`cities/${cityName}/${tradeDirection}/`), {
      player,
      item,
      amount
    }, this.httpOptions);
  }

  rob(robber: string, robType: string, robbed: string): Observable<any> {
    return this.http.post(this.getApiRoot().concat(`players/${robber}/rob/`), {
      robbed,
      rob_money: robType === 'money'
    }, this.httpOptions);
  }

  gift(giver: string, taker: string, money: number, items: object): Observable<any> {
    return this.http.post(this.getApiRoot().concat(`players/${giver}/gift/`), {
      taker,
      money,
      items
    }, this.httpOptions);
  }

  getLoan(url): Observable<any> {
    return this.http.get(url, this.httpOptions);
  }

  getPayback(id): Observable<any> {
    return this.http.get(this.getApiRoot().concat(`loan-paybacks/${id}/`), this.httpOptions);
  }

  payback(url): Observable<any> {
    return this.http.post(url, {}, this.httpOptions);
  }

  getEndData(): Observable<object> {
    return this.http.get(this.getApiRoot().concat(`end`), this.httpOptions);
  }

  getGameData(): Observable<any> {
    return this.http.get(this.getApiRoot().concat('game-data'), this.httpOptions);
  }

  private handleError<T>(operation = 'operation', result?: T, o?: string) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      if (error.status === 403) {
        this.snackBar.open('This functionality needs authentication', 'Close');
      }

      if (error.status === 404) {
        const text = o ? `'${o}'` : 'Item';
        this.snackBar.open(`'${text}' is not found`, 'Close')
      }

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}


