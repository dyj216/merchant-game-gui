import {Injectable} from '@angular/core';
import {Player} from './player';
import {CityListElement} from './city-list-element';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, shareReplay, tap} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';

interface User {
  username,
  password,
}


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(
      req: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {

        const idToken = localStorage.getItem("id_token");

        if (idToken) {
            const cloned = req.clone({
                headers: req.headers.set("Authorization",
                    "Bearer " + idToken)
            });

            return next.handle(cloned);
        }
        else {
            return next.handle(req);
        }
    }
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiRoot = 'http://127.0.0.1:8000/merchant_game/api/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    public snackBar: MatSnackBar,
  ) { }

    login(username: string, password: string) {
      return this.http.post<User>(this.apiRoot.concat('token/'), {username, password}).pipe(
        tap(res => this.setSession(res))
      );
    }

    private setSession(authResult) {
      localStorage.setItem('id_token', authResult.access);
      const now = new Date();
      const expires = new Date(now.getTime() + 5*60*1000);
      localStorage.setItem('expires_at', JSON.stringify(expires.getTime()));
    }

    logout() {
      localStorage.removeItem('id_token');
      localStorage.removeItem('expires_at');
      this.snackBar.open(`Logged out`, 'Close');
    }

    public isLoggedIn() {
      const now = new Date();
      return (now.getTime() < this.getExpiration().getTime());
    }

    isLoggedOut() {
      return !this.isLoggedIn();
    }

    getExpiration() {
      const expiration = localStorage.getItem('expires_at');
      return new Date(JSON.parse(expiration));
    }

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.apiRoot.concat('players/'));
  }

  getPlayer(id: string): Observable<Player> {
    return this.http.get<Player>(this.apiRoot.concat('players/').concat(id))
      .pipe(
        catchError(this.handleError<Player>('getPlayer', {code: '', items: {}, money: 0, loans: [], paybacks: []}, id)),
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

  getEndData(): Observable<object> {
    return this.http.get(this.apiRoot.concat(`end`), this.httpOptions);
  }

  getGameData(): Observable<any> {
    return this.http.get(this.apiRoot.concat('game-data'), this.httpOptions);
  }

  private handleError<T>(operation = 'operation', result?: T, o?: string) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      if (error.status === 403) {
        this.snackBar.open('This functionality needs authentication', 'Close');
      }

      if (error.status === 404) {
        const text = o ? `'${o}'` : 'Object';
        this.snackBar.open(`'${text}' is not found`, 'Close')
      }

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}


