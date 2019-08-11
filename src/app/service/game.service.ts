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
export class GameService {
  serviceHttpIri: string;
  

  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    ) {
    this.serviceHttpIri = Utils.GethttpIri();
  }
    /**
   *彩票合法长度接口
   *
   * @memberof PersonalService
   */
  get_input_num_rule(){
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href =  '/api/lotteries/lotteries-code-length';
    return this.commonService.get(href ,{ headers: headers });
  }
  /**
   *重新派奖
   *
   * @memberof PersonalService
   */
  calculate_encode_again(option){
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href =  '/api/lotteries/calculate-encode-again';
    return this.commonService.post(href ,option,{ headers: headers });
  }
    /**
   *重新派奖
   *
   * @memberof PersonalService
   */
  get_encode_splitter(){
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href =  '/api/lotteries/series-lists';
    return this.commonService.get(href ,{ headers: headers });
  }
  /**
   *获取某个系统配置的值
   *
   * @memberof PersonalService
   */
  sys_configure_value(data){
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href =  '/api/partner-sys-configures/sys-configure-value';
    return this.commonService.post(href ,data,{ headers: headers });
  }
    /**
   *奖期手动录号
   *
   * @memberof PersonalService
   */
  input_number_value(data){
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href =  '/api/lotteries/input-code';
    return this.commonService.post(href ,data,{ headers: headers });
  }
    /**
   *自动生成奖期时间
   *
   * @memberof PersonalService
   */
  generate_issue_time(data){
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href =  '/api/partner-sys-configures/generate-issue-time';
    return this.commonService.post(href ,data,{ headers: headers });
  }
/**
   *生成奖期
   *
   * @memberof PersonalService
   */
  create_issue(data){
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href =  '/api/lotteries/lotteries-issue-generate';
    return this.commonService.post(href ,data,{ headers: headers });
  }
  /**
   *获取奖金组
   *
   * @memberof PersonalService
   */
  get_prize_group(){
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href =  '/api/user-handle/prizegroup';
    return this.commonService.get(href ,{ headers: headers });
  }

  /**
   *获取采种系列
   *
   * @memberof PersonalService
   */
  get_lotteries_type(){
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href =  '/api/lotteries/series-lists';
    return this.commonService.get(href ,{ headers: headers });
  }
  /**
   *添加采种
   *
   * @memberof PersonalService
   */
 add_lotteries(data){
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href =  '/api/lotteries/add';
    return this.commonService.post(href , data,{ headers: headers });
  }
    /**
   *添加采种
   *
   * @memberof PersonalService
   */
 edit_lotteries(data){
  let token = this.tokenService.get().token;
  let headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const href =  '/api/lotteries/edit';
  return this.commonService.post(href , data,{ headers: headers });
}
  /**
   *删除采种
   *
   * @memberof PersonalService
   */
  delete_lotteries(data){
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href =  '/api/lotteries/delete';
    return this.commonService.post(href , data,{ headers: headers });
  }
    /**
   *获取采种列表
   *
   * @memberof PersonalService
   */
  get_lotteries_list(data){
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href =  '/api/lotteries/lotteries-lists';
    return this.commonService.post(href , data,{ headers: headers });
  }
      /**
   *获取奖期列表
   *
   * @memberof PersonalService
   */
  get_issue_list(page_index,data){
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
      // if (data.start_time) {
      //   array.push(["created_at", ">=", data.start_time]);
      //   delete data.start_time;
      // }
      // if (data.end_time) {
      //   array.push(["created_at", "<=", data.end_time]);
      //   delete data.end_time;
      // }
      if(array.length>0){
         data.time_condtions = JSON.stringify(array);
      }
      option=data;
     
    }

    const href =  '/api/lotteries/lotteries-issue-lists?&page_size=' + page_size + '&page=' + page_index;
    return this.commonService.post(href, option, { headers: headers });
  }
  /**
   *获取系列玩法
   *
   * @returns
   * @memberof GameService
   */
  get_play_type(){
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href =  '/api/lotteries/lotteries-method-lists?';
    return this.commonService.get(href ,{ headers: headers });
  }

  /**
   *采种开关
   *
   * @memberof PersonalService
   */
  lotteries_status(data){
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href =  '/api/lotteries/lotteries-switch';
    return this.commonService.post(href , data,{ headers: headers });
  }

  /**
   *玩法组开关
   *
   * @memberof PersonalService
   */
  group_status(data){
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href =  '/api/lotteries/method-group-switch';
    return this.commonService.post(href , data,{ headers: headers });
  }
    /**
   *玩法行开关
   *
   * @memberof PersonalService
   */
  row_status(data){
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href =  '/api/lotteries/method-row-switch';
    return this.commonService.post(href , data,{ headers: headers });
  }
    /**
   *玩法开关
   *
   * @memberof PersonalService
   */
  method_status(data){
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href =  '/api/lotteries/method-switch';
    return this.commonService.post(href , data,{ headers: headers });
  }



}
