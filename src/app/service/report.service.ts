import { Injectable, Inject } from '@angular/core';
// import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { Utils } from 'config/utils.config';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { CommonService } from './common.service';
@Injectable({
  providedIn: 'root',
})
export class ReportService {
  serviceHttpIri: string;


  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    this.serviceHttpIri = Utils.GethttpIri();
  }
  transform(value: number) {
    let status: string;
    switch (value) {
      case 0: status = '正在充值'; break;
      case 1: status = '充值成功'; break;
      case 2: status = '充值失败'; break;
      case 10: status = '待审核'; break;
      case 11: status = '审核通过'; break;
      case 12: status = '审核拒绝'; break;
      default: break;
    }
    return status;
  }
  /**
  *获取用户帐变报表
  *
  * @memberof PersonalService
  */
  get_account_type() {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const href = '/api/reportManagement/account_change_type';
    return this.commonService.get(href, { headers: headers });
  }



  /**
   *获取用户帐变报表
   *
   * @memberof PersonalService
   */
  get_account_report(page_size, page_index, data?) {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    var option = {}


    if (data) {

      if (data.username) {
        data.query_conditions = JSON.stringify({ "username": "LIKE" });
      }

      option = data;

    }
    const href = '/api/reportManagement/user-account-change?page_size=' + page_size + '&page=' + page_index;
    return this.commonService.post(href, option, { headers: headers });
  }
  /**
 *获取用户充值报表
 *
 * @memberof PersonalService
 */
  get_recharge_report(page_size, page_index, data?) {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    var option = {};
    if (data) {
      if (data.user_name) {
        data.query_conditions = JSON.stringify({ "user_name": "LIKE" });
      }
      option = data;
    }
    const href = '/api/reportManagement/user-recharge-history?page_size=' + page_size + '&page=' + page_index;;
    return this.commonService.post(href, option, { headers: headers });
  }

  /**
*获取注单列表
*
* @memberof PersonalService
*/
  get_user_bets_report(page_size, page_index, data?) {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    var option = {}

    if (data) {

      if (data.user_name) {
        data.query_conditions = JSON.stringify({ "user_name": "LIKE" });
      }
      option = data;

    }
    const href = '/api/reportManagement/user-bets?page_size=' + page_size + '&page=' + page_index;;
    return this.commonService.post(href, option, { headers: headers });
  }
/**
 * 报表请求
 */
  get_report(url, data?) {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let option = {};

    if (data) {

      if (data.user_name) {
        data.query_conditions = JSON.stringify({ "user_name": "LIKE" });
      }
      option = data;

    }
    const href = url;
    return this.commonService.post(href, option, { headers });
  }


}
