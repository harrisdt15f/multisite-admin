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
export class DeveloperService {
  serviceHttpIri: string;
  

  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    ) {
    this.serviceHttpIri = Utils.GethttpIri();
  }

  /**
   *获得路由管理列表
   *
   * @returns {Observable<any>}
   * @memberof DeveloperService
   */
  get_route_list(): Observable<any> {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/route/detail';
    return this.commonService.post(href,{},{ headers: headers });
  }
  /**
   *获得所有菜单
   *
   * @returns {Observable<any>}
   * @memberof DeveloperService
   */
  get_all_menu(): Observable<any> {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/menu/get-all-menu';

    return this.commonService.get(href ,{ headers: headers });
  }
  /**
 *添加菜单
 *
 * @memberof UserManageService
 */
add_menu(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/menu/add';
  return this.commonService.post(href, data,{ headers: headers });
}
/**
 *修改菜单
 *
 * @memberof UserManageService
 */
edit_menu(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/menu/edit';
  return this.commonService.post(href, data,{ headers: headers });
}
/**
 *删除菜单
 *
 * @memberof UserManageService
 */
delete_menu(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/menu/delete';
  return this.commonService.post(href, data,{ headers: headers });
}

/**
 * 获取路由列表
*
* @returns
* @memberof UserManageService
*/
get_route_api_list(page_index,data?) {
  let page_size = 20;
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    if (data) {
      if (data.username) {
        data.query_conditions =JSON.stringify( { "username": "LIKE" });
      }
    }
    const href = this.serviceHttpIri + '/api/route/detail?&page_size=' + page_size + '&page=' + page_index;
    return this.commonService.post(href, data, { headers: headers });
}

/**
 * 获取未绑定的路由
*
* @returns
* @memberof UserManageService
*/
get_route_new_api_list() {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const href = this.serviceHttpIri + '/api/menu';
    return this.commonService.get(href,  { headers: headers });
}
  /**
 *添加路由
 *
 * @memberof UserManageService
 */
add_route(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/route/add';
  return this.commonService.post(href, data,{ headers: headers });
}
/**
 *修改路由
 *
 * @memberof UserManageService
 */
edit_route(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/route/edit';
  return this.commonService.post(href, data,{ headers: headers });
}
/**
 *删除路由
 *
 * @memberof UserManageService
 */
delete_route(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/route/delete';
  return this.commonService.post(href, data,{ headers: headers });
}


/**
   *获得投注端所有模块
   *
   * @returns {Observable<any>}
   * @memberof DeveloperService
   */
  get_all_model(): Observable<any> {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/frontend-allocated-model/detail';

    return this.commonService.post(href,{},{ headers: headers });
  }
  /**
 *添加模块
 *
 * @memberof UserManageService
 */
add_model(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/frontend-allocated-model/add';
  return this.commonService.post(href, data,{ headers: headers });
}
/**
 *修改模块
 *
 * @memberof UserManageService
 */
edit_model(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/frontend-allocated-model/edit';
  return this.commonService.post(href, data,{ headers: headers });
}
/**
 *删除模块
 *
 * @memberof UserManageService
 */
delete_model(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/frontend-allocated-model/delete';
  return this.commonService.post(href, data,{ headers: headers });
}
  



}
