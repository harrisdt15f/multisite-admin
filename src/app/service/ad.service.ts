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
export class AdService {
  serviceHttpIri: string;
  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    this.serviceHttpIri = Utils.GethttpIri();
  }

  /**
   *获得广告类型列表
   *
   * @memberof UserManageService
   */
  get_ad_type_list() {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href =  '/api/advertisement-type/detail';
    return this.commonService.get(href, { headers: headers });
  }


  /**
   *编辑广告类型
   *
   * @param {*} data
   * @returns
   * @memberof UserManageService
   */
  edit_ad_type(data) {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href =  '/api/advertisement-type/edit';
    return this.commonService.post(href, data, { headers: headers });
  }
}




