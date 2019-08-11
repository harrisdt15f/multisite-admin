import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { UserManageService } from 'app/service/user-manage.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { startOfMonth } from 'date-fns';
import { Utils } from 'config/utils.config';

@Component({
  selector: 'app-operasyon-quota-manage',
  templateUrl: './quota-manage.component.html',
  styleUrls:['./quota-manage.component.less']
})
export class OperasyonQuotaManageComponent implements OnInit {

//-----------条件筛选参数
public searchValue = '';
public choise_pay_type :string;
public choise_status :string;


public page_index = 1;

public list_of_aply_data: Array<any> = [];
public list_total: number;
public data_prize_string: number=0;
public is_load_list: boolean;
public show_text: string;
//----------弹框
public is_show_data_prize:boolean;
public is_show_person_prize:boolean;
public isOkLoading:boolean;
public data_prize:number;
public person_prize:number;
public spin_show:boolean;
public history_list:Array<any>=[];
public now_edit_manage:Object={};
public look_history: boolean;
public ranges1 = { 
  "今日": [new Date(), new Date()], 
  '本月': [startOfMonth(new Date()),new Date()] 
};
public end_time: string;
public start_time: string;
public now_date=[new Date(), new Date()];


constructor(
  private http: _HttpClient,
  private userManageService: UserManageService,
  private fb: FormBuilder,
  private message: NzMessageService
) { }

ngOnInit() {

  this.search(1);
  this.start_time=this.change_date(new Date(),'start');
  this.end_time=this.change_date(new Date(),'end');
}

/**
 * 金额输入框验证
 */
account_check(){

  this.data_prize=Utils.account_check(this.data_prize,90000);
}
/**
 * 金额输入框验证
 */
person_prize_check(){

  this.person_prize=Utils.account_check(this.person_prize,90000);
}
/**
   *时间组件改变
   *
   * @param {Date[]} result
   * @memberof LogOperationLogComponent
   */
  on_change_time(result: Date[]): void {
    if (result.length == 0) {
      this.start_time = '';
      this.end_time = '';
    }else{
    this.start_time = this.change_date(result[0], 'start');
    this.end_time = this.change_date(result[1], 'end');
 
    }

    this.get_history_list();

  }
    /**
   * GmT转时间格式 
   * */
  change_date(time, type) {
    let date = new Date(time);
    let mouth = (date.getMonth() + 1) < 10 ? '0' + ((date.getMonth() + 1)) : (date.getMonth() + 1);
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let Str = date.getFullYear() + '-' + mouth + '-' + day + ' ';
    return type == 'start' ? Str + '00:00:00' : Str + '23:59:59'
  }
/**
 *点击查看历史
 *
 * @memberof OperasyonQuotaManageComponent
 */
check_history(data){
 this.look_history=true;

 this.now_edit_manage=data;
 this.get_history_list();

}

get_history_list(){
  this.history_list =[];
  this.spin_show=true;
  let option={
    admin_id:this.now_edit_manage['id'],
    start_time:this.start_time,
    end_time:this.end_time
  };
  this.userManageService.get_quota_history(option).subscribe((res: any) => {
    this.spin_show=false;
    if (res && res.success) {
  
      this.history_list = res.data;
  
    } else {
  
      this.message.error(res.message, {
        nzDuration: 10000,
      });
    }
  })
}
/**
 *点击修改人工充值额度
 *
 * @param {*} data
 * @memberof OperasyonQuotaManageComponent
 */
person_amount(data){
  this.is_show_person_prize=true;
  this.now_edit_manage=data;
}
/**
 *点击修改每日资金
 *
 * @memberof OperasyonQuotaManageComponent
 */
edit_data_prize(){
  this.is_show_data_prize=true;
}

//取消每日资金弹框
cancel_data_prize(){
  this.isOkLoading=false;
  this.is_show_data_prize=false;
  this.is_show_person_prize=false;
}
//确定
ok_data_prize(){
this.set_day_quota();
}
//确定
ok_person_prize(){
this.add_manage_quota();
}
/**
 *设置每日额度
 *
 * @memberof OperasyonQuotaManageComponent
 */
set_day_quota(){
  let option={
    fund:this.data_prize
  };
  this.isOkLoading=true;
  this.userManageService.set_day_quota(option).subscribe((res: any) => {
    this.isOkLoading=false;
    if (res && res.success) {
     this.data_prize_string=this.data_prize;
     this.data_prize=null;
     this.message.success('设置每日额度成功', {
      nzDuration: 10000,
    });
    this.cancel_data_prize();
    } else {

      this.message.error(res.message, {
        nzDuration: 10000,
      });
    }
  })
}

/**
 *给管理员增加额度
 *
 * @memberof OperasyonQuotaManageComponent
 */
add_manage_quota(){
  let option={
    id:this.now_edit_manage['id'],
    fund:this.person_prize
  };
  this.isOkLoading=true;
  this.userManageService.add_manage_quota(option).subscribe((res: any) => {
    this.isOkLoading=false;
    if (res && res.success) {
     this.search();
     this.person_prize=null;
     this.message.success('增加管理员额度成功', {
      nzDuration: 10000,
    });
    this.cancel_data_prize();
    } else {

      this.message.error(res.message, {
        nzDuration: 10000,
      });
    }
  })
}









/**
 *获取银行列表
 *
 * @param {*} page_index
 * @memberof OperasyonquotaManageComponent
 */
get_quota_list(page_index,data?) {
  this.is_load_list = true;
  this.userManageService.get_quota_list(page_index,data).subscribe((res: any) => {
    if (res && res.success) {
      this.page_index = page_index
      this.list_total = res.data.total;
      this.is_load_list = false;
      this.list_of_aply_data = [];
      this.data_prize_string = res.data.dailyFundLimit;
      for(let x in res.data.admin_user['data']){
        this.list_of_aply_data.push(res.data.admin_user['data'][x]);
      }
      console.log(this.list_of_aply_data);
    } else {

      this.message.error(res.message, {
        nzDuration: 10000,
      });
    }
  })
}



/**


/**
 *取消搜索
 *
 * @memberof UserPassportCheckComponent
 */
 reset(): void {
  this.searchValue = '';
  this.search();
}

/**
 *搜索数组
 *
 * @memberof UserPassportCheckComponent
 */
search(page?): void {
  let option = {};//筛选条件
  if (this.searchValue) {
    option['name'] = this.searchValue;
  }
  this.get_quota_list(page?page:1, option);

}
/**
*改变页数
*
* @param {*} item
* @memberof UserManageUserComponent
*/
chang_page_index(item) {
  this.search(item);
}

}
