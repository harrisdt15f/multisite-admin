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
export class ManagerService {
  serviceHttpIri: string;


  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    this.serviceHttpIri = Utils.GethttpIri();
  }
  /**
   * 创建组
   * @memberof ManagerService
   */
  create_manager_group(data): Observable<any> {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/partner-admin-group/create';
    return this.commonService.post(href, data, { headers: headers });
  }
  /**
   * 获取组列表
   * @memberof ManagerService
   */
  get_manager_group(): Observable<any> {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/partner-admin-group/detail';
    return this.commonService.get(href, { headers: headers });

  }
  /**
 * 编辑组列表
 * @memberof ManagerService
 */
  edit_manager_group(data): Observable<any> {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/partner-admin-group/edit';
    return this.commonService.post(href, data, { headers: headers });
  }
  /**
   *删除组
   *
   * @memberof ManagerService
   */
  delete_group(data) {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/partner-admin-group/delete-access-group';
    return this.commonService.post(href, data, { headers: headers });
  }
  /**
 *获取组的成员列表
 *
 * @memberof ManagerService
 */
  get_member_list(data) {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/partner-admin-group/specific-group-users';
    return this.commonService.post(href, data, { headers: headers });
  }
  /**
  *删除管理员
  *
  * @memberof ManagerService
  */
  delete_manager(data) {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/partner-admin-user/delete-user';
    return this.commonService.post(href, data, { headers: headers });
  }


  /**
 * 创建管理员
 * @memberof ManagerService
 */
  create_manager(data): Observable<any> {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/partner-admin/register';
    return this.commonService.post(href, data, { headers: headers });
  }
  /**
   * 获取当前所有管理员
   * @memberof ManagerService
   */
  get_manager(): Observable<any> {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/partner-admin-user/get-all-users';
    return this.commonService.get(href, { headers: headers });
  }
  /**
 * 管理员更换组
 * @memberof ManagerService
 */
  edit_manager(data): Observable<any> {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/partner-admin-user/update-user-group';
    return this.commonService.post(href, data, { headers: headers });
  }
  /**
* 管理员更换密码
* @memberof ManagerService
*/
  change_manager_passport(data): Observable<any> {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/partner-admin-user/reset-password';
    return this.commonService.post(href, data, { headers: headers });
  }
  /**
*获取活动列表
*
* @memberof ManagerService
*/
  get_activity_list() {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/homepage-rotation-chart/activity-list';
    return this.commonService.get(href, { headers: headers });
  }
  /**
 *给轮播排序
 *
 * @memberof UserManageService
 */
sort_bannar(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`
  });
  const href = this.serviceHttpIri + '/api/homepage-rotation-chart/sort' ;
  return this.commonService.post(href,data, { headers: headers });
}


  /**
*获取轮播图列表
*
* @memberof ManagerService
*/
  get_banner_list() {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/homepage-rotation-chart/detail';
    return this.commonService.post(href, {}, { headers: headers });
  }
  /**
  *删除轮播图
  *
  * @memberof ManagerService
  */
  delete_banner(data) {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/homepage-rotation-chart/delete';
    return this.commonService.post(href, data, { headers: headers });
  }


  /**
 * 创建轮播图
 * @memberof ManagerService
 */
  create_banner(data): Observable<any> {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/homepage-rotation-chart/add';
    return this.commonService.post(href, data, { headers: headers });
  }
  /**
* 编辑轮播图
* @memberof ManagerService
*/
  edit_banner(data): Observable<any> {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/homepage-rotation-chart/edit';
    return this.commonService.post(href, data, { headers: headers });
  }
  /**
* 主页管理列表
* @memberof ManagerService
*/
  get_home_page_list(pid): Observable<any> {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/homepage/detail?pid='+pid;
    return this.commonService.get(href, { headers: headers });
  }
  /**
* 导航一
* @memberof ManagerService
*/
get_nav_one_list(): Observable<any> {
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/homepage/nav-one';
  return this.commonService.get(href, { headers: headers });
}
  /**
* 主题板块
* @memberof ManagerService
*/
get_page_model_list(): Observable<any> {
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/homepage/page-model';
  return this.commonService.get(href, { headers: headers });
}
  /**
* 上传logo
* @memberof ManagerService
*/
  upload_logo(data): Observable<any> {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/homepage/upload-pic';
    return this.commonService.post(href, data, { headers: headers });
  }
  /**
* 修改客服链接
* 
* @memberof ManagerService
*/
edit_home_page(data): Observable<any> {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/homepage/edit';
    return this.commonService.post(href, data, { headers: headers });
  }

    /**
* 热门彩种列表
* 
* @memberof ManagerService
*/
get_hot_lotteries_one(): Observable<any> {
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/popular-lotteries/detail-one';
  return this.commonService.get(href, { headers: headers });
}
    /**
* 热门彩种列表
* 
* @memberof ManagerService
*/
get_hot_lotteries_two(): Observable<any> {
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/popular-lotteries/detail-two';
  return this.commonService.get(href, { headers: headers });
}

    /**
* 添加热门彩种列表
* 
* @memberof ManagerService
*/
add_hot_lotteries(data): Observable<any> {
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/popular-lotteries/add';
  return this.commonService.post(href, data, { headers: headers });
}

    /**
* 添加热门彩票时选择的彩种列表
* 
* @memberof ManagerService
*/
get_hot_lotteries_list(): Observable<any> {
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/popular-lotteries/lotteries-list';
  return this.commonService.get(href, { headers: headers });
}
/**
* 编辑热门彩票
* 
* @memberof ManagerService
*/
edit_hot_lotteries_list(data): Observable<any> {
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/popular-lotteries/edit';
  return this.commonService.post(href,data, { headers: headers });
}
/**
* 删除热门彩票
* 
* @memberof ManagerService
*/
delete_hot_lotteries_list(data): Observable<any> {
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/popular-lotteries/delete';
  return this.commonService.post(href,data, { headers: headers });
}
/**
* 上下拉排序
* 
* @memberof ManagerService
*/
sort_hot_lotteries_list(data): Observable<any> {
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/popular-lotteries/lotteries-sort';
  return this.commonService.post(href,data, { headers: headers });
}





}
