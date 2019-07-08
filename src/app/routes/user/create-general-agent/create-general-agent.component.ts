import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { STColumn } from '@delon/abc';
import { NzMessageService } from 'ng-zorro-antd';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { until } from 'protractor';
import { Utils } from 'config/utils.config';
import { UserManageService } from 'app/service/user-manage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-create-general-agent',
  templateUrl: './create-general-agent.component.html',
  styles: [
    `
      [nz-form] {
        max-width: 600px;
      }
    `
  ]
})
export class UserCreateGeneralAgentComponent implements OnInit {
public  create_user_form: FormGroup;
public  create_user_obj: object=new create_user_obj();
public  max_prize_group: number;
public  is_Loading: boolean;
public  min_prize_group: number;
  constructor(
    private http: _HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private userManageService: UserManageService,
    private message: NzMessageService
    ) { }
    /**
     *获取奖金组范围
     *
     * @memberof UserCreateGeneralAgentComponent
     */
    get_prize_group_value(){
      this.userManageService.get_prize_group_value().subscribe((res:any)=>{
        if (res && res.success) {
          this.max_prize_group=res.data.max;
          this.min_prize_group=res.data.min;
          this.create_user_obj['prize_group']=this.min_prize_group;
        } else {
          this.message.error(res.message, {
            nzDuration: 10000,
          });
        }
      })

    }
/**
 *点击创建
 *
 * @memberof UserCreateGeneralAgentComponent
 */
create_user(): void {
  let option=this.create_user_obj;
  this.is_Loading=true;
  option['type']=2;
  this.userManageService.crete_total_user(option).subscribe((res:any)=>{
    this.is_Loading=false;
    if (res && res.success) {
      this.message.success('创建成功', {
        nzDuration: 10000,
      });

      this.router.navigateByUrl('/manage/manage-user');
      this.update_form();


      for (const i in this.create_user_form.controls) {
        this.create_user_form.controls[i].markAsDirty();
        this.create_user_form.controls[i].updateValueAndValidity();
      }
    } else {
      this.message.error(res.message, {
        nzDuration: 10000,
      });
    }
  })



    }
      /**
*d刷新表单
*
* @memberof OperasyonActivityListComponent
*/
  update_form() {
    this.create_user_obj = {};
    this.create_user_form.reset();
    for (const key in this.create_user_form.controls) {
      this.create_user_form.controls[key].markAsPristine();
      this.create_user_form.controls[key].updateValueAndValidity();
    }

  }
  /**
   * *校验密码
   *
   * @memberof UserCreateGeneralAgentComponent
   */
  update_confirm_check_password(): void {
      /** wait for refresh value */
      Promise.resolve().then(() => this.create_user_form.controls.check_password.updateValueAndValidity());
      console.log(this.create_user_form.get('password').hasError('minLength'));
    }
     /**
   * *校验资金密码
   *
   * @memberof UserCreateGeneralAgentComponent
   */
  update_confirm_check_fund_password(): void {

    /** wait for refresh value */
    Promise.resolve().then(() => this.create_user_form.controls.check_fund_password.updateValueAndValidity());
 
  }
  /**
   *校验密码
   *
   * @memberof UserCreateGeneralAgentComponent
   */
  confirmation_passport = (control: FormControl): { [s: string]: boolean } => {
      if (!control.value) {
        return { required: true };
      } else if (control.value !== this.create_user_form.controls.password.value) {
        return { confirm: true, error: true };
      }
      return {};
    };
      /**
   *校验资金密码
   *
   * @memberof UserCreateGeneralAgentComponent
   */
  confirmation_prize_passport = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.create_user_form.controls.fund_password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };
  

  ngOnInit() {
    console.log(this.create_user_obj);
    this.get_prize_group_value();

    this.create_user_form = this.fb.group({
      username: [null, [Validators.required,Validators.maxLength(16)]],
      password: [null, [Validators.required,Validators.minLength(6),Validators.maxLength(16)]],
      check_password: [null, [Validators.required, this.confirmation_passport]],
      fund_password: [null, [Validators.required]],
      prize_group: [null, [Validators.required]],
      is_tester: [null],
      check_fund_password: [null, [Validators.required, this.confirmation_prize_passport]]
    });

  
   }

}

class create_user_obj{
  public username:string=null;
  public password:string=null;
  public fund_password:string=null;
  public is_tester:string=null;
  public prize_group: number=null;
  public type: number=null;
  constructor(){
    this.type=Utils.total_user_type;
    this.is_tester='0';
  }
}
