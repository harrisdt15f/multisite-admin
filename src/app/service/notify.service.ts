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
export class NotifyService {
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
  get_notice_message() {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/internal-notice-message/admin-messages';
    return this.commonService.get(href, { headers: headers });
  }

}




