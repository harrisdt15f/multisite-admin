import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import {  HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { Utils } from 'config/utils.config';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  public serviceHttpIri: string;
    // 上传图片地址
  public imgURL = '/api/system/upload-pic';
  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private message: NzMessageService,
    ) {
      this.serviceHttpIri = Utils.GethttpIri();
      window['upload_iri'] = this.serviceHttpIri + this.imgURL;
  }
  public post(url: string, data?: Object, options?: Object): Observable<any> {
    let token = this.tokenService.get().token;
    let headers = {};
    if (token) {
      headers = new HttpHeaders({
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      });
    }
    return this.http.post<string[]>(this.serviceHttpIri + url, data, options = {headers: headers})
  }
    /**
   * http-get请求，获取数据
   * 
   * @private
   * @param {string} url 
   * @returns {Observable<string[]>} 
   * @memberof RestProvider
   */
  public get(url: string, options?: Object): Observable<string[]> {
    let token = this.tokenService.get().token;
    let headers = {};
    if (token) {
      headers = new HttpHeaders({
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      });
    }
    return this.http.get<string[]>(this.serviceHttpIri + url, options = {headers: headers})
  }
    /**
   * 错误信息处理
   * 
   * @private
   * @template T 
   * @param {string} [operation='operation'] 
   * @param {T} [result] 
   * @returns 
   * @memberof RestProvider
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      this.show_tips(error);

      return of(result as T);
    };
  }
   /**
   * 提示信息
   * 
   * @private
   * @param {*} error 
   * @memberof ApiProvider
   */
  private show_tips(error: any) {
    let error_code: number = Number(error['status']);
    switch (error_code) {
      case 401:
        this.message.error('登录超时，请重新登录！', {
          nzDuration: 10000
        });
        this.router.navigateByUrl('/passport/login');
        break;
      case 429:
        this.message.error('服务器繁忙，请稍后重试！', {
          nzDuration: 10000
        });
        break;
      case 500:
        this.message.error('服务器异常！', {
          nzDuration: 10000
        });
        break;
        case 0:
        this.message.error('登录超时，请重新登录！', {
          nzDuration: 10000
        });
        this.router.navigateByUrl('/passport/login');
        break;
      default:
        this.message.error('服务器异常！', {
          nzDuration: 10000
        });
        break;
    }
  }


}
