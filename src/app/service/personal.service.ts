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
export class PersonalService {
  serviceHttpIri: string;
  

  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    ) {
    this.serviceHttpIri = Utils.GethttpIri();
  }


  /**
   *删除组
   *
   * @memberof PersonalService
   */
  change_passport(data){
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/partner-admin-user/self-reset-password?';
    return this.commonService.post(href , data,{ headers: headers });
  }

      /**
*获取系统配置
*
* @returns
* @memberof UserManageService
*/
get_system_helper_list(page_index?, data?) {
  let page_size = 20;
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/help/detail';
  return this.commonService.get(href, { headers: headers });
}
    /**
*添加系统配置
*
* @returns
* @memberof UserManageService
*/
create_system_helper_list( data) {
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/help/add';
  return this.commonService.post(href,data, { headers: headers });
}
/**
*修改系统配置
*
* @returns
* @memberof UserManageService
*/
edit_system_helper_list( data) {
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/help/edit';
  return this.commonService.post(href,data, { headers: headers });
}
    /**
*删除系统配置
*
* @returns
* @memberof UserManageService
*/
delete_system_helper_list( data) {
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/help/delete';
  return this.commonService.post(href,data, { headers: headers });
}



}
