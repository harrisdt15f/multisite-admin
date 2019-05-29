import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { UserManageService } from 'app/service/user-manage.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-user-recharge',
  templateUrl: './recharge.component.html',
  styleUrls:['./recharge.component.less']
})
export class UserRechargeComponent implements OnInit {

//-----------条件筛选参数
public searchValue = '';
public choise_pay_type :string;
public choise_status :string;

public page_index = 1;
public now_edit_manage: object = {};
public list_of_aply_data: Array<any> = [];
public list_total: number;
public is_load_list: boolean;
public show_text: string;
//----------弹框

public is_show_recharge_num:boolean;
public recharge_num:string;
public person_prize:string;
public isOkLoading:boolean;





constructor(
  private http: _HttpClient,
  private userManageService: UserManageService,
  private fb: FormBuilder,
  private message: NzMessageService
) { }

ngOnInit() {


  this.search(1);
}

/**
 *点击修改人工充值额度
 *
 * @param {*} data
 * @memberof OperasyonrechargeManageComponent
 */
person_amount(data){
  this.is_show_recharge_num=true;
  this.now_edit_manage=data;
}


//取消每日资金弹框
cancel_recharge_num(){
  this.isOkLoading=false;
  this.is_show_recharge_num=false;
}
//确定
ok_recharge(){
this.add_recharge_quota();
this.isOkLoading=true;
}
/**
 *给管理员增加额度
 *
 * @memberof OperasyonQuotaManageComponent
 */
add_recharge_quota(){
  let option={
    id:this.now_edit_manage['id'],
    amount:this.recharge_num
  };

  this.userManageService.add_recharge_quota(option).subscribe((res: any) => {
    this.isOkLoading=false;
    this.isOkLoading=false;
    if (res && res.success) {
     this.search();
     this.person_prize='';
     this.message.success('玩家充值成功', {
      nzDuration: 10000,
    });
    this.cancel_recharge_num();
    } else {

      this.message.error(res.message, {
        nzDuration: 10000,
      });
    }
  })
}

/**
 *获取人工充值列表
 *
 * @param {*} page_index
 * @memberof OperasyonrechargeManageComponent
 */
get_recharge_list(page_index,data?) {
  this.is_load_list = true;
  this.userManageService.get_recharge_list(page_index,data).subscribe((res: any) => {
    if (res && res.success) {
      this.page_index = page_index
      this.list_total = res.data.total;
      this.is_load_list = false;

      this.list_of_aply_data = [...res.data['data']];

    } else {

      this.message.error(res.message, {
        nzDuration: 10000,
      });
    }
  })
}



/**



/**
 *搜索数组
 *
 * @memberof UserPassportCheckComponent
 */
search(page?): void {
  let option = {};//筛选条件

  if (this.searchValue) {
    option['username'] = this.searchValue;
  }
  this.get_recharge_list(page?page:1, option);

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
*改变页数
*
* @param {*} item
* @memberof UserManageUserComponent
*/
chang_page_index(item) {
  this.search(item);
}

}

