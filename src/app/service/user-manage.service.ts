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
export class UserManageService {
  serviceHttpIri: string;
  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    this.serviceHttpIri = Utils.GethttpIri();
  }
  /**
   *根据ip获取城市信息
   *
   */
  search_city_by_ip(ip) {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/log/get-address?ip='+ip;
    return this.commonService.get(href, { headers: headers });
  }

  /**
   *创建总代
   *
   */
  crete_total_user(data) {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/user-handle/create-user?';
    return this.commonService.post(href, data, { headers: headers });
  }
  /**
   *获取奖金组范围
   *
   * @returns
   * @memberof UserManageService
   */
  get_prize_group_value() {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/user-handle/prizegroup?';
    return this.commonService.get(href, { headers: headers });
  }
  /**
 *获取用户管理表
 *
 * @returns
 * @memberof UserManageService
 */
  get_user_manage_list(page_index, data?) {
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
      this.change_time(data);
    }
    const href = this.serviceHttpIri + '/api/user-handle/users-info?page_size=' + page_size + '&page=' + page_index;
    return this.commonService.post(href, data, { headers: headers });
  }
/**
*获取前台日志操作列表
*
* @returns
* @memberof UserManageService
*/
get_frontend_log_list(page_index, data?) {
  let page_size = 20;
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  if (data) {
    this.change_time(data);
  }

  const href = this.serviceHttpIri + '/api/log/frontend-list?page_size=' + page_size + '&page=' + page_index;
  return this.commonService.post(href, data, { headers: headers });
}
get_ip_list() {
  let page_size = 20;
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });


  const href =  'http://ip.taobao.com/service/getIpInfo.php?ip=115.156.238.114';
  return this.commonService.get(href, { headers: headers });
}
  /**
*获取日志操作列表
*
* @returns
* @memberof UserManageService
*/
  get_log_list(page_index, data?) {
    let page_size = 20;
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    if (data) {
      this.change_time(data);
    }

    const href = this.serviceHttpIri + '/api/log/list?page_size=' + page_size + '&page=' + page_index;
    return this.commonService.post(href, data, { headers: headers });
  }
   /**
*获取ip所在地
*
* @returns
* @memberof UserManageService
*/
get_country_by_ip(ip) {
  let page_size = 20;
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });


  const href = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip='+ip;
  return this.commonService.get(href, { headers: headers });
}
  /**
   *提交修改密码申请
   *
   * @param {*} data
   * @returns
   * @memberof UserManageService
   */
  submit_change_passport_apply(data) {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/user-handle/reset-password?';
    return this.commonService.post(href, data, { headers: headers });
  }
  /**
 *提交修改资金密码申请
 *
 * @param {*} data
 * @returns
 * @memberof UserManageService
 */
  submit_change_prize_passport_apply(data) {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/user-handle/reset-fund-password?';
    return this.commonService.post(href, data, { headers: headers });
  }
  /**
 *获取提交用户修改密码申请列表
 *
 * @returns
 * @memberof UserManageService
 */
  get_passport_aply_list(page_index, data?) {
    let page_size = 20;
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    var option={};

    if (data) {

      if (data.username) {
        data.query_conditions =JSON.stringify( { "username": "LIKE" });
      }

      let array = []
      if (data.start_time) {
        array.push(["created_at", ">=", data.start_time]);
        delete data.start_time;
      }
      if (data.end_time) {
        array.push(["created_at", "<=", data.end_time]);
        delete data.end_time;
      }
      if(array.length>0){
         data.time_condtions = JSON.stringify(array);
      }
      option=data;
     
    }
    option['type']=1

    const href = this.serviceHttpIri + '/api/user-handle/reset-password-list?page_size=' + page_size + '&page=' + page_index;
    return this.commonService.post(href, option, { headers: headers });
  }
  /**
   * 提交审核登录结果
   */
  submit_pass_result(data) {

    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/user-handle/audit-applied-password?';
    return this.commonService.post(href, data, { headers: headers });
  }
  /*获取提交用户修改资金密码申请列表
  *
  * @returns
  * @memberof UserManageService
  */
  get_prize_passport_aply_list(page_index, data?) {
    let page_size = 20;
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    var option={}
    
  
    if (data) {

      if (data.username) {
        data.query_conditions =JSON.stringify( { "username": "LIKE" });
      }

      let array = []
      if (data.start_time) {
        array.push(["created_at", ">=", data.start_time]);
        delete data.start_time;
      }
      if (data.end_time) {
        array.push(["created_at", "<=", data.end_time]);
        delete data.end_time;
      }
      if(array.length>0){
         data.time_condtions = JSON.stringify(array);
      }
      option=data;
     
    }
    option['type']=2
    const href = this.serviceHttpIri + '/api/user-handle/reset-fund-password-list?&page_size=' + page_size + '&page=' + page_index;
    return this.commonService.post(href, option, { headers: headers });
  }
  /**
   *设置账户权限
   *
   * @param {*} data
   * @returns
   * @memberof UserManageService
   */
  submit_freeze(data){
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const href = this.serviceHttpIri + '/api/user-handle/deactivate';
    return this.commonService.post(href, data, { headers: headers });
  }
    /**
   *查看权限设置历史
   *
   * @param {*} data
   * @returns
   * @memberof UserManageService
   */
  submit_freeze_history(data){
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const href = this.serviceHttpIri + '/api/user-handle/deactivated-detail';
    return this.commonService.post(href, data, { headers: headers });
  }
      /**
   *查看账变记录
   *
   * @param {*} data
   * @returns
   * @memberof UserManageService
   */
  user_account_change(data){
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const href = this.serviceHttpIri + '/api/user-handle/user_account_change';
    return this.commonService.post(href, data, { headers: headers });
  }
      /**
   *查看充值记录
   *
   * @param {*} data
   * @returns
   * @memberof UserManageService
   */
  user_recharge_history(data){
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const href = this.serviceHttpIri + '/api/user-handle/user_recharge_history';
    return this.commonService.post(href, data, { headers: headers });
  }
    /**
*获取系统配置
*
* @returns
* @memberof UserManageService
*/
get_system_setting_list(page_index?, data?) {
  let page_size = 20;
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/partner-sys-configures/detail';
  return this.commonService.get(href, { headers: headers });
}
    /**
*添加系统配置
*
* @returns
* @memberof UserManageService
*/
create_system_setting_list( data) {
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/partner-sys-configures/add?XDEBUG_SESSION_START=PHPSTORM';
  return this.commonService.post(href,data, { headers: headers });
}
/**
*修改系统配置
*
* @returns
* @memberof UserManageService
*/
edit_system_setting_list( data) {
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/partner-sys-configures/edit';
  return this.commonService.post(href,data, { headers: headers });
}
    /**
*删除系统配置
*
* @returns
* @memberof UserManageService
*/
delete_system_setting_list( data) {
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/partner-sys-configures/delete';
  return this.commonService.post(href,data, { headers: headers });
}
/**
*切换启用状态
*
* @returns
* @memberof UserManageService
*/
change_status( data) {
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/partner-sys-configures/switch';
  return this.commonService.post(href,data, { headers: headers });
}
/**
 * 修改城市信息
*
* @returns
* @memberof UserManageService
*/
edit_city_msg(data) {
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/region/edit';
  return this.commonService.post(href,data, { headers: headers });
}
/**
 * 添加城市信息
*
* @returns
* @memberof UserManageService
*/
add_city_msg(data) {
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/region/add';
  return this.commonService.post(href,data, { headers: headers });
}

/**
h获取城市列表
*
* @returns
* @memberof UserManageService
*/
get_city_list() {
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/region/detail';
  return this.commonService.get(href, { headers: headers });
}
/**
h获取镇列表
*
* @returns
* @memberof UserManageService
*/
get_city_last_list(data) {
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/region/get_town';
  return this.commonService.post(href,data, { headers: headers });
}
/**
 *编辑活动类型
 *
 * @param {*} data
 * @returns
 * @memberof UserManageService
 */
edit_activity_type(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/activity/edit-actype';
  return this.commonService.post(href, data,{ headers: headers });
}
/**
 *获得活动类型列表
 *
 * @memberof UserManageService
 */
get_activity_type_list(){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/activity/type';
  return this.commonService.get(href, { headers: headers });
}

/**
 * 获取活动列表
*
* @returns
* @memberof UserManageService
*/
get_activity_list(page_index,data?) {
  let page_size = 20;
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    var option={}
    
  
    if (data) {

      if (data.title) {
        data.query_conditions =JSON.stringify( { "title": "LIKE" });
      }

      let array = []
      if (data.start_time) {
        array.push(["created_at", ">=", data.start_time]);
        delete data.start_time;
      }
      if (data.end_time) {
        array.push(["created_at", "<=", data.end_time]);
        delete data.end_time;
      }
      if(array.length>0){
         data.time_condtions = JSON.stringify(array);
      }
      option=data;
     
    }
   
    const href = this.serviceHttpIri + '/api/activity/detail?&page_size=' + page_size + '&page=' + page_index;
    return this.commonService.post(href, option, { headers: headers });
}
/**
 *添加活动类型列表
 *
 * @memberof UserManageService
 */
add_activity(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/activity/add?XDEBUG_SESSION_START=PHPSTORM';
  return this.commonService.post(href, data,{ headers: headers });
}
/**
 *修改活动类型列表
 *
 * @memberof UserManageService
 */
edit_activity(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/activity/edit';
  return this.commonService.post(href, data,{ headers: headers });
}
/**
 *删除活动类型列表
 *
 * @memberof UserManageService
 */
delete_activity(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/activity/delete';
  return this.commonService.post(href, data,{ headers: headers });
}
/**
*获取分类管理数据列表
*
* @returns
* @memberof UserManageService
*/
get_category_manage_list(page_index?, data?) {
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/content/category';
  return this.commonService.get(href, { headers: headers });
}
  /**
*获取文章类型
*
* @returns
* @memberof UserManageService
*/
get_article_type() {

  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });

  const href = this.serviceHttpIri + '/api/content/category-select' ;
  return this.commonService.get(href, { headers: headers });
}
  /**
*获取文章列表列表
*
* @returns
* @memberof UserManageService
*/
get_article_list(page_index, data?) {
let page_size='20';
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/content/detail?page_size='+ page_size + '&page=' + page_index; ;
  return this.commonService.post(href,{}, { headers: headers });
}
/**
 *给文章排序
 *
 * @memberof UserManageService
 */
sort_article(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`
  });
  const href = this.serviceHttpIri + '/api/content/sort-articles' ;
  return this.commonService.post(href,data, { headers: headers });
}
/**
 *给活动排序
 *
 * @memberof UserManageService
 */
sort_activity(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`
  });
  const href = this.serviceHttpIri + '/api/activity/sort' ;
  return this.commonService.post(href,data, { headers: headers });
}

/*给文章排序
*
* @memberof UserManageService
*/
top_articles(data){
 let token = this.tokenService.get().token;
 let headers = new HttpHeaders({
   Accept: 'application/json',
   Authorization: `Bearer ${token}`
 });
 const href = this.serviceHttpIri + '/api/content/top-articles' ;
 return this.commonService.post(href,data, { headers: headers });
}
/**
 *添加活动类型列表
 *
 * @memberof UserManageService
 */
add_article(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/content/add-articles';
  return this.commonService.post(href, data,{ headers: headers });
}
/**
 *修改活动类型列表
 *
 * @memberof UserManageService
 */
edit_article(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/content/edit-articles';
  return this.commonService.post(href, data,{ headers: headers });
}
/**
 *删除活动类型列表
 *
 * @memberof UserManageService
 */
delete_article(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/content/delete-articles';
  return this.commonService.post(href, data,{ headers: headers });
}


  /**
*获取银行列表
*
* @returns
* @memberof UserManageService
*/
get_bank_list(page_index, data?) {
  let page_size='20';
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    var option={}
    
  
    if (data) {

      if (data.title) {
        data.query_conditions =JSON.stringify( { "title": "LIKE" });
      }
      option=data;
     
    }
    const href = this.serviceHttpIri + '/api/bank/detail?page_size='+ page_size + '&page=' + page_index; ;
    return this.commonService.post(href,option, { headers: headers });
  }

/**
 *添加银行
 *
 * @memberof UserManageService
 */
add_bank(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/bank/add-bank';
  return this.commonService.post(href, data,{ headers: headers });
}
/**
 *修改银行
 *
 * @memberof UserManageService
 */
edit_bank(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/bank/edit-bank';
  return this.commonService.post(href, data,{ headers: headers });
}
/**
 *删除银行
 *
 * @memberof UserManageService
 */
delete_bank(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/bank/delete-bank';
  return this.commonService.post(href, data,{ headers: headers });
}
  /**
*获取管理员列表
*
* @returns
* @memberof UserManageService
*/
get_quota_history(data) {
  let page_size='20';
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const href = this.serviceHttpIri + '/api/fundOperation/fund-change-log';
    return this.commonService.post(href,data, { headers: headers });
  }



  /**
*获取管理员列表
*
* @returns
* @memberof UserManageService
*/
get_quota_list(page_index, data?) {
  let page_size='20';
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    var option={}
    
  
    if (data) {

      if (data.name) {
        data.query_conditions =JSON.stringify( { "name": "LIKE" });
      }
      option=data;
     
    }
    const href = this.serviceHttpIri + '/api/fundOperation/admins?page_size='+ page_size + '&page=' + page_index; ;
    return this.commonService.post(href,option, { headers: headers });
  }

/**
 *设置每日额度
 *
 * @memberof UserManageService
 */
set_day_quota(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/fundOperation/every-day-fund';
  return this.commonService.post(href, data,{ headers: headers });
}
/**
 *给管理员增加额度额度
 *
 * @memberof UserManageService
 */
add_manage_quota(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/fundOperation/add-fund';
  return this.commonService.post(href, data,{ headers: headers });
}



 /**
  时间参数处理
  *
  * @param {*} data
  * @memberof UserManageService
  */
 change_time(data){

  let array = []
  if (data.start_time) {
    array.push(["created_at", ">=", data.start_time]);
    delete data.start_time;
  }
  if (data.end_time) {
    array.push(["created_at", "<=", data.end_time]);
    delete data.end_time;
  }
  if(array.length>0){
     data.time_condtions = JSON.stringify(array);
  }
}


  /**
*获取人工充值列表
*
* @returns
* @memberof UserManageService
*/
get_recharge_list(page_index, data?) {
  let page_size='20';
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    var option={}
    
  
    if (data) {

      if (data.username) {
        data.query_conditions =JSON.stringify( { "username": "LIKE" });
      }
      option=data;
     
    }
    const href = this.serviceHttpIri + '/api/artificialRecharge/users?page_size='+ page_size + '&page=' + page_index; ;
    return this.commonService.post(href,option, { headers: headers });
  }
/**
 *人工充值
 *
 * @memberof UserManageService
 */
add_recharge_quota(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/artificialRecharge/add';
  return this.commonService.post(href, data,{ headers: headers });
}
/**
 *人工扣减
 *
 * @memberof UserManageService
 */
reduce_quota(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/user-handle/deduction_balance';
  return this.commonService.post(href, data,{ headers: headers });
}
  /**
   * 提交审核充值结果
   */
  submit_recharge_result(data,type) {

    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let href ='';
    if(type==1){
       href = this.serviceHttpIri + '/api/recharge-check/audit-success?';
    }else if(type==2){
       href = this.serviceHttpIri + '/api/recharge-check/audit-failure?';
    }
  
    return this.commonService.post(href, data, { headers: headers });
  }

  /**
 *充值审核列表
 *
 * @returns
 * @memberof UserManageService
 */
get_recharge_check_list(page_index, data?) {
  let page_size = 20;
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  var option={};

  if (data) {

    if (data.user_name) {
      data.query_conditions =JSON.stringify( { "user_name": "LIKE" });
    }

    let array = []
    if (data.start_time) {
      array.push(["created_at", ">=", data.start_time]);
      delete data.start_time;
    }
    if (data.end_time) {
      array.push(["created_at", "<=", data.end_time]);
      delete data.end_time;
    }
    if(array.length>0){
       data.time_condtions = JSON.stringify(array);
    }
    option=data;
   
  }

  const href = this.serviceHttpIri + '/api/recharge-check/detail?page_size=' + page_size + '&page=' + page_index;
  return this.commonService.post(href, option, { headers: headers });
}

/**
*获取账变类型列表
*
* @returns
* @memberof UserManageService
*/
get_account_list(page_index?, data?) {
  let page_size='20';
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });

  const href = this.serviceHttpIri + '/api/accountChangeType/detail?page_size='+ page_size + '&page=' + page_index; ;

  return this.commonService.post(href,  {}, { headers: headers });
}

/**
*获取账变类型列表
*
* @returns
* @memberof UserManageService
*/
add_account_type(data) {
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/accountChangeType/add';
  return this.commonService.post(href,data, { headers: headers });
}
/**
*编辑账变类型列表
*
* @returns
* @memberof UserManageService
*/
edit_account_type(data) {
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/accountChangeType/edit';
  return this.commonService.post(href,data, { headers: headers });
}/**
*删除账变类型列表
*
* @returns
* @memberof UserManageService
*/
delete_account_type(data) {
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href = this.serviceHttpIri + '/api/accountChangeType/delete';
  return this.commonService.post(href,data, { headers: headers });
}

/*公告列表
*
* @memberof UserManageService
*/
get_announcement(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`
  });
  const href = this.serviceHttpIri + '/api/notice/detail' ;
  return this.commonService.get(href, { headers: headers });
 }

/*给公告排序
*
* @memberof UserManageService
*/
sort_announcement(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`
  });
  const href = this.serviceHttpIri + '/api/notice/sort' ;
  return this.commonService.post(href,data, { headers: headers });
 }
 /*给公告置顶
*
* @memberof UserManageService
*/
top_announcement(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`
  });
  const href = this.serviceHttpIri + '/api/notice/top' ;
  return this.commonService.post(href,data, { headers: headers });
 }
 /**
  *添加公告
  *
  * @memberof UserManageService
  */
 add_announcement(data){
   let token = this.tokenService.get().token;
   let headers = new HttpHeaders({
     Accept: 'application/json',
     Authorization: `Bearer ${token}`,
   });
   const href = this.serviceHttpIri + '/api/notice/add';
   return this.commonService.post(href, data,{ headers: headers });
 }
 /**
  *修改公告
  *
  * @memberof UserManageService
  */
 edit_announcement(data){
   let token = this.tokenService.get().token;
   let headers = new HttpHeaders({
     Accept: 'application/json',
     Authorization: `Bearer ${token}`,
   });
   const href = this.serviceHttpIri + '/api/notice/edit';
   return this.commonService.post(href, data,{ headers: headers });
 }
 /**
  *删除公告
  *
  * @memberof UserManageService
  */
 delete_announcement(data){
   let token = this.tokenService.get().token;
   let headers = new HttpHeaders({
     Accept: 'application/json',
     Authorization: `Bearer ${token}`,
   });
   const href = this.serviceHttpIri + '/api/notice/delete';
   return this.commonService.post(href, data,{ headers: headers });
 }

}
