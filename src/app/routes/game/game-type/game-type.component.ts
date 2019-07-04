import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';

import { GameService } from 'app/service/game.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-game-game-type',
  templateUrl: './game-type.component.html',
  styleUrls: ['./game-type.component.less']

})
export class GameGameTypeComponent implements OnInit {
  public page_index = 1;
  public list_of_aply_data: Array<any> = [];
  public is_load_list: boolean;
  public lotteries_tabs = [];
    //----------弹框
    public current=0;
    public is_show_modal: boolean;
    public modal_type: string = 'create';
    public modal_lodding: boolean;
    public create_form_lottery: FormGroup;//表单对象
    public create_form_rule: FormGroup;//表单对象
    public edit_lotteries_obj: object = {
  
    };
  
  constructor(
    private http: _HttpClient,
    private fb: FormBuilder,
    private gameService: GameService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.get_lotteries_type();
    this.create_form_lottery = this.fb.group({
      cn_name:[null, [Validators.required,Validators.maxLength(16)]],
      en_name:[null, [Validators.required,Validators.maxLength(16)]],
      lottery_type:[null, [Validators.required]],
      is_fast:[null, [Validators.required]],
      auto_open:[null, [Validators.required]],
      max_trace_number:[null, [Validators.required]],
      day_issue:[null, [Validators.required]],
      issue_format:[null, [Validators.required]],
      issue_type:[null, [Validators.required]],
      valid_code:[null, [Validators.required]],
      code_length:[null, [Validators.required]],
      min_prize_group:[null, [Validators.required]],
      max_prize_group:[null, [Validators.required]],
      min_times:[null, [Validators.required]],
      max_times:[null, [Validators.required]],
      valid_modes:[null, [Validators.required]],
      status:[null, [Validators.required]]

   
    });
    this.create_form_rule = this.fb.group({
      begin_time:[null, [Validators.required]],
      issue_seconds:[null, [Validators.required]],
      first_time:[null, [Validators.required]],
      adjust_time:[null, [Validators.required]],
      encode_time:[null, [Validators.required]],
      issue_count:[null, [Validators.required]],
      status:[null, [Validators.required]]

   
    });
  }
  /**
   * 添加彩种
   */
  add_lottery(){
    this.is_show_modal=true;
    this.modal_type='create';

  }
 /**
  * 提交表单
  */
  submit_lotteries(){

  }
  /**
   * 点击下一步
   */
  next_form(){
    this.current=1;
  }  
  /**
  * 点击上一步
  */
 first_form(){
   this.current=0;
 }
  hide_modal(){
    this.is_show_modal=false;
    this.update_form()
  }
    /**
 *d刷新表单
 *
 * @memberof OperasyonaccountListComponent
 */
update_form() {
  this.edit_lotteries_obj = {
  }
  this.current=0;
  this.create_form_lottery.reset();
  for (const key in this.create_form_lottery.controls) {
    this.create_form_lottery.controls[key].markAsPristine();
    this.create_form_lottery.controls[key].updateValueAndValidity();
  }
  this.create_form_rule.reset();
  for (const key in this.create_form_rule.controls) {
    this.create_form_rule.controls[key].markAsPristine();
    this.create_form_rule.controls[key].updateValueAndValidity();
  }
}

  /*
  *
  *获取采种系列
  *
  * @memberof UserManageUserComponent
  */
  get_lotteries_type() {
    this.gameService.get_lotteries_type().subscribe((res: any) => {
      if (res && res.success) {
        this.lotteries_tabs = [];
        for (let key in res.data) {
          this.lotteries_tabs.push({
            label: res.data[key],
            value: key
          }
          )
        }
        this.get_lotteries_list(this.lotteries_tabs[0].value,0)
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   *切换tab
   *
   * @memberof GameGameTypeComponent
   */
  change_index(index: number) {
    if(this.lotteries_tabs[index].lotteries){
      this.list_of_aply_data =this.lotteries_tabs[index].lotteries;
    }else{
      this.get_lotteries_list(this.lotteries_tabs[index].value,index)
    }
    
  }



  /*
  *
  *获取采种列表
  *
  * @memberof UserManageUserComponent
  */
  get_lotteries_list(type,tab_index) {
    this.is_load_list = true;
    let option = {
      series_id: type
    };
    this.gameService.get_lotteries_list(option).subscribe((res: any) => {
      if (res && res.success) {
        this.is_load_list = false;
        this.list_of_aply_data = res.data;
        this.lotteries_tabs[tab_index].lotteries=res.data;

      } else {
        this.is_load_list = false;
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }

}
