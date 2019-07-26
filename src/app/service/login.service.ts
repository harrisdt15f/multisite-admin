import { Injectable } from '@angular/core';
// import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { Utils } from 'config/utils.config';
import { HttpHeaders, HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  serviceHttpIri: string;

  constructor(private http: HttpClient) {
    this.serviceHttpIri = Utils.GethttpIri();
  }
  login(data): Observable<any> {
    let headers = new HttpHeaders({
      'Accept': 'application/json'
    });
    const href =  '/api/login?XDEBUG_SESSION_START=PHPSTORM';
    return this.http.post(href,data , { headers: headers });
  }
  login_out(data): Observable<any> {
    let headers = new HttpHeaders({
      'Accept': 'application/json'
    });
    const href =  '/api/login?email='+data.userName+'&password='+data.email;
    return this.http.post(href,{} , { headers: headers });
  }
}
