import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';

import { GameService } from 'app/service/game.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CronOptions } from "cron-editor/cron-editor";
import { Utils } from 'config/utils.config';
import { ApiService } from '../../../../api/api.service';
import { utils } from 'protractor';

@Component({
  selector: 'app-game-game-type',
  templateUrl: './game-type.component.html',
  styleUrls: ['./game-type.component.less']

})
export class GameGameTypeComponent implements OnInit {
  public file_obj: any;
  public file_iri: any;
  public page_index = 1;
  public list_of_aply_data: Array<any> = [];
  public issue_format: Array<any> = [];
  public is_load_list: boolean;
  public tab_index = 0;
  public lotteries_tabs = [];
  // 开奖位置选项
  public positionOption = [];
  public positionText = '请选择开奖位置';

  // 投注单位选项
  public validModesOption = [];
  // 默认显示的文字
  public validModesText = '请选择投注单位';
  //----------弹框
  public current = 0;
  public is_show_modal: boolean;
  public modal_type: string = 'create';
  public min_prize_group: string;
  public max_prize_group: string = 'create';
  public modal_lodding: boolean;
  public create_form_lottery: FormGroup;//表单对象
  public create_form_rule: FormGroup;//表单对象
  public edit_lotteries_obj: object = {};
  public edit_rule_obj = [{
    begin_time: new Date(),
    end_time: new Date(),
    issue_seconds: 1,
    first_time: new Date(),
    adjust_time: 1,
    encode_time: 1,
    issue_count: 1,
    status: '0'
   }];;
  public cronExpression: any='00:00:00'
  public cronOptions: CronOptions = {
    formInputClass: 'form-control cron-editor-input',
    formSelectClass: 'form-control cron-editor-select',
    formRadioClass: 'cron-editor-radio',
    formCheckboxClass: 'cron-editor-checkbox',
    defaultTime: "00:00:00",
    hideMinutesTab: false,
    removeSeconds: false,
    removeYears: false,
    hideHourlyTab: false,
    hideDailyTab: false,
    hideWeeklyTab: false,
    hideMonthlyTab: false,
    hideYearlyTab: false,
    hideAdvancedTab: true,
    use24HourTime: true,
    hideSeconds: false
  };



  constructor(
    private http: _HttpClient,
    private Api: ApiService,
    private fb: FormBuilder,
    private gameService: GameService,
    private message: NzMessageService
  ) {
    
   }

  ngOnInit() {
    this.issue_format=Utils.issue_format;
    this.get_lotteries_type();
    this.get_prize_group();
    this.create_form_lottery = this.fb.group({
      cn_name: [null, [Validators.required, Validators.maxLength(16)]],
      en_name: [null, [Validators.required, Validators.maxLength(16)]],
      lottery_type: [null, [Validators.required]],
      is_fast: [null, [Validators.required]],
      auto_open: [null, [Validators.required]],
      max_trace_number: [null, [Validators.required]],
      day_issue: [null, [Validators.required]],
      positions: [null, [Validators.required]],
      issue_format: [null, [Validators.required]],
      issue_type: [null, [Validators.required]],
      valid_code: [null, [Validators.required]],
      code_length: [null, [Validators.required]],
      prize_group: [null, [Validators.required]],
      max_profit_bonus: [null, [Validators.required]],
      min_times: [null, [Validators.required]],
      max_times: [null, [Validators.required]],
      valid_modes: [null, [Validators.required]],
      status: [null, [Validators.required]]
    });
    this.create_form_rule = this.fb.group({
      begin_time: [null, [Validators.required]],
      end_time: [null, [Validators.required]],
      issue_seconds: [null, [Validators.required]],
      first_time: [null, [Validators.required]],
      adjust_time: [null, [Validators.required]],
      encode_time: [null, [Validators.required]],
      issue_count: [null, [Validators.required]]
    });
  }

  // 开奖位置
  public positions() {
    let data = this.lotteries_tabs[this.tab_index];
    let result =[];
    if(data['value'] === 'pk10') {
      let arr = ['0', 1, 2, 3, 4, 5, 6, 7, 8, 9];
      result[0] = {
        title: '全选',
        value: '0, 1, 2, 3, 4, 5, 6, 7, 8, 9',
        key: '0, 1, 2, 3, 4, 5, 6, 7, 8, 9',
        children: [],
        isLeaf: false
      }
      for (let i = 0; i < arr.length; i++) {
        let json = {};
        json['key'] = arr[i];
        json['value'] = arr[i];
        json['title'] = arr[i];
        json['isLeaf'] = true;
        result[0].children.push(json);
      }
    } else if(data['value'] === 'lhc') {
      let arr = [1, 2, 3, 4, 5, 6, 7];
      result[0] = {
        title: '全选',
        value: '1, 2, 3, 4, 5, 6, 7',
        key: '1, 2, 3, 4, 5, 6, 7',
        children: [],
        isLeaf: false
      }
      for (let i = 0; i < arr.length; i++) {
        let json = {};
        json['key'] = arr[i];
        json['value'] = arr[i];
        json['title'] = arr[i];
        json['isLeaf'] = true;
        result[0].children.push(json);
      }
    } else {
      let arr = [
        {lable: '万', value: 'w'},
        {lable: '千', value: 'q'},
        {lable: '百', value: 'b'},
        {lable: '十', value: 's'},
        {lable: '个', value: 'g'},
      ];
      result[0] = {
        title: '全选',
        value: '万, 千, 百, 十, 个',
        key: 'w, q, b, s, g',
        children: [],
        isLeaf: false
      }
      for (let i = 0; i < arr.length; i++) {
        let json = {};
        json['key'] = arr[i].value;
        json['value'] = arr[i].value;
        json['title'] = arr[i].lable;
        json['isLeaf'] = true;
        result[0].children.push(json);
      }
    }
    
    this.positionOption = result;
  }
  // 投注单位 
  public validModesOptions() {
    let result =[];
    let arr = [
      {lable: '元', value: '1'},
      {lable: '角', value: '2'},
      {lable: '分', value: '3'}
    ];
    result[0] = {
      title: '全选',
      value: '1, 2, 3',
      key: '1, 2, 3',
      children: [],
      isLeaf: false
    }
    for (let i = 0; i < arr.length; i++) {
      let json = {};
      json['key'] = arr[i].value;
      json['value'] = arr[i].value;
      json['title'] = arr[i].lable;
      json['isLeaf'] = true;
      result[0].children.push(json);
    }
    
    this.validModesOption = result;
  }
  //  加减
  public maxTraceNumberCount(obj: any, type: any, number = 1) {
    if (number === 1) {
      if (type === '-') {
        if (+this.edit_lotteries_obj[obj] > 0) {
          +this.edit_lotteries_obj[obj] --;
        }
      } else {
        +this.edit_lotteries_obj[obj] ++;
      }
    } else {
      if (type === '-') {
        if (+this.edit_rule_obj[0][obj] > 0) {
          +this.edit_rule_obj[0][obj] --;
        }
      } else {
        +this.edit_rule_obj[0][obj] ++;
      }
    }
  }
  // 限制输入数字
  public maxTraceNumber(obj: any, type = false, number = 1) {
    if (number === 1) {
      this.edit_lotteries_obj[obj] = Utils.number(this.edit_lotteries_obj[obj], type);
    } else {
      this.edit_rule_obj[0][obj] = Utils.number(this.edit_rule_obj[0][obj], type);
    }
  }
  // 添加彩种icon
  public updateFireChange(e: any) {
    document.getElementById('pic_5').click();
  }
  public updateFire_lot(item: any) {
    let data = new FormData();
    this.file_obj = item.target['files'][0];
    this.file_iri = window.URL.createObjectURL(this.file_obj);
    data.append('pic', this.file_obj, this.file_obj.name)
    data.append('folder_name', 'lottery')

    this.Api.uploadPic(data).subscribe((response: any) => {
      if (response && response['success']) {
        document.getElementById('cropedBigImg')['src'] = this.file_iri;
        this.message.success('上传成功', {
          nzDuration: 2500,
        });
        this.edit_lotteries_obj['icon_name'] = response['data']['name'];
        this.edit_lotteries_obj['icon_path'] = response['data']['path'];
      } else {
        this.message.error(response.message, {
          nzDuration: 2500,
        });
      }
    })
  }
  /**
   * 切换期号格式
   */
  change_issue_format(e){

  }
  /**
  * 获取奖金组
  */
  get_prize_group() {
    this.gameService.get_prize_group().subscribe((res: any) => {
      if (res && res.success) {
        this.min_prize_group = res.data.min;
        this.max_prize_group = res.data.max;
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   * 滑动奖金组
   */
  change_prize_group(e: number) {

  }
  /**
   * 添加彩种
   */
  add_lottery() {
    this.is_show_modal = true;
    this.modal_type = 'create';
    this.edit_lotteries_obj = new LotteriesObj(this.min_prize_group, this.max_prize_group);
    this.edit_rule_obj = [{
     end_time: new Date(),
     begin_time: new Date(),
     issue_seconds: 1,
     first_time: new Date(),
     adjust_time: 1,
     encode_time: 1,
     issue_count: 1,
     status: '0'
    }];
    document.getElementById('cropedBigImg')['src'] = '';
    this.positions();
    this.validModesOptions();
  }
  /**
   * 编辑采种
   */
  edit_lottery(data: any) {
    this.is_show_modal = true;
    this.modal_type = 'edit';
    this.positions();
    this.validModesOptions();
    if (data['valid_modes']) {
      let modes = '';
      for(let k of data['valid_modes'].split(',')) {
        switch (k) {
          case '1':
              modes += '元 ';
            break
          case '2':
              modes += '角 ';
            break
          case '3':
              modes += '分 ';
            break
          case '4':
              modes += '厘';
            break
        }
      }
      this.validModesText = modes;
    }
    if (data['positions']) {
      let text = '';
      for(let k of data['positions'].split(',')) {
        switch (k) {
          case 'w':
              text += '万 ';
            break
          case 'q':
              text += '千 ';
            break
          case 'b':
              text += '百 ';
            break
          case 's':
              text += '十 ';
            break
          case 'g':
              text += '个';
            break
        }
      }
      this.positionText = text;
    }

    this.edit_lotteries_obj = {
      id: String(data['id']),
      auto_open: String(data['auto_open']),
      cn_name: data['cn_name'],
      code_length: data['code_length'],
      day_issue: data['day_issue'],
      en_name: data['en_name'],
      is_fast: String(data['is_fast']),
      issue_format: data['issue_format'],
      issue_seconds: data['issue_seconds'],
      issue_type: data['issue_type'],
      lottery_type: String(data['lottery_type']),
      max_times: data['max_times'],
      max_trace_number: data['max_trace_number'],
      min_times: data['min_times'],
      positions: data['positions'],
      max_profit_bonus: data['max_profit_bonus'],
      prize_group: [
        data['min_prize_group'],
        data['max_prize_group']
      ],
      status: String(data['status']),
      valid_code: data['valid_code'],
      valid_modes: data['valid_modes'],
      icon_path: data['icon_path']
    };
    let rule = [];
    for (let i = 0; i < data['issue_rule'].length; i++) {
      rule.push({
        'adjust_time': data.issue_rule[i]['adjust_time'],
        'encode_time': data.issue_rule[i]['encode_time'],
        'issue_seconds': data.issue_rule[i]['issue_seconds'],
        'issue_count': data.issue_rule[i]['issue_count'],
        'status': String(data.issue_rule[i]['status']),
        'first_time': new Date('2019-10-10 ' + data.issue_rule[i]['first_time']),
        'end_time': new Date('2019-10-10 ' + data.issue_rule[i]['end_time']),
        'begin_time': new Date('2019-10-10 ' + data.issue_rule[i]['begin_time'])
      });
    }
    this.edit_rule_obj = rule;
    if (data['icon_path']) {
      document.getElementById('cropedBigImg')['src'] = Utils.GethttpIri() + data['icon_path'];
    } else {
      document.getElementById('cropedBigImg')['src'] = '';
    }

  }
  /**
   * 删除彩种
   */
  delete_lottery(data) { 
    let option={
      id:data.id
    }
    this.gameService.delete_lotteries(option).subscribe((res: any) => {
      if (res && res.success) {
        this.message.success('删除彩种成功', {
          nzDuration: 10000,
        });
        this.get_lotteries_list(this.lotteries_tabs[0].value, 0)
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   * 提交表单
   */
  submit_lotteries() {
    let option = {
      lottery: {
        series_id: this.lotteries_tabs[this.tab_index].value,
        auto_open: this.edit_lotteries_obj['auto_open'],
        cn_name: this.edit_lotteries_obj['cn_name'],
        code_length: this.edit_lotteries_obj['code_length'],
        day_issue: this.edit_lotteries_obj['day_issue'],
        en_name: this.edit_lotteries_obj['en_name'],
        is_fast: this.edit_lotteries_obj['is_fast'],
        issue_format: this.edit_lotteries_obj['issue_format'],
        issue_seconds: this.edit_lotteries_obj['issue_seconds'],
        issue_type: this.edit_lotteries_obj['issue_type'],
        lottery_type: this.edit_lotteries_obj['lottery_type'],
        max_times: this.edit_lotteries_obj['max_times'],
        max_trace_number: this.edit_lotteries_obj['max_trace_number'],
        min_times: this.edit_lotteries_obj['min_times'],
        positions: Array.isArray(this.edit_lotteries_obj['positions']) ? this.edit_lotteries_obj['positions'].join(',') : this.edit_lotteries_obj['positions'],
        min_prize_group: this.edit_lotteries_obj['prize_group'][0],
        max_prize_group: this.edit_lotteries_obj['prize_group'][1],
        status: this.edit_lotteries_obj['status'],
        valid_code: this.edit_lotteries_obj['valid_code'],
        valid_modes: Array.isArray(this.edit_lotteries_obj['valid_modes']) ? this.edit_lotteries_obj['positions'].join(',') : this.edit_lotteries_obj['valid_modes'],
        max_profit_bonus: this.edit_lotteries_obj['max_profit_bonus'],
        icon_name: this.edit_lotteries_obj['icon_name'],
        icon_path: this.edit_lotteries_obj['icon_path']
      },
      issue_rule: []
    };
    for(let k of Object.keys(this.edit_rule_obj)){
      option.issue_rule.push({
        id: this.edit_lotteries_obj['id'],
        lottery_name: this.edit_lotteries_obj['cn_name'],
        lottery_id: this.edit_lotteries_obj['en_name'],
        adjust_time: this.edit_rule_obj[k]['adjust_time'],
        encode_time: this.edit_rule_obj[k]['encode_time'],
        issue_seconds: this.edit_rule_obj[k]['issue_seconds'],
        issue_count: this.edit_rule_obj[k]['issue_count'],
        status: this.edit_lotteries_obj['status'],
        first_time: this.get_time(this.edit_rule_obj[k]['first_time']),
        end_time: this.get_time(this.edit_rule_obj[k]['end_time']),
        begin_time: this.get_time(this.edit_rule_obj[k]['begin_time'])
      });
    }
    
    switch (this.modal_type) {
      case 'create':
        this.submit_add_lotteries(option);
        break;
      case 'edit':
        option.lottery['id'] = this.edit_lotteries_obj['id'];
        this.submit_edit_lotteries(option);
        break;
    }

  }
  /** 
   * 提交添加
  */
  submit_add_lotteries(option) {
    this.gameService.add_lotteries(option).subscribe((res: any) => {
      if (res && res.success) {
        this.message.success('创建彩种成功', {
          nzDuration: 10000,
        });
        this.get_lotteries_list(this.lotteries_tabs[this.tab_index].value, this.tab_index);
        this.hide_modal();
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /** 
 * 提交编辑
*/
  submit_edit_lotteries(option) {
    this.gameService.edit_lotteries(option).subscribe((res: any) => {
      if (res && res.success) {
        this.message.success('编辑彩种成功', {
          nzDuration: 10000,
        });
        this.get_lotteries_list(this.lotteries_tabs[this.tab_index].value, this.tab_index);
        this.hide_modal();
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   * 
   * @param time 得到时间
   */
  get_time(time) {
    var hour = Number(time.getHours());
    var min = Number(time.getMinutes());
    var sec = Number(time.getSeconds());
    let value = (hour < 10 ? '0' + hour : hour) + ':' + (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec);
    return value;
  }
  /**
   * 点击下一步
   */
  next_form() {
    console.log(this.edit_lotteries_obj)
    if(+this.edit_lotteries_obj['max_times'] < +this.edit_lotteries_obj['min_times']) {
      this.message.error('最大下注倍数 不能小于 最小下注倍数', {
        nzDuration: 2500,
      });
      return;
    }

    if (this.modal_type === 'create') {
      this.edit_rule_obj = [{
        end_time: new Date(),
        begin_time: new Date(),
        issue_seconds: 1,
        first_time: new Date(),
        adjust_time: 1,
        encode_time: 1,
        issue_count: 1,
        status: '0'
       }];
      if (this.edit_lotteries_obj['en_name'] === 'cqssc') {
        this.edit_rule_obj.push({
          begin_time: new Date(),
          end_time: new Date(),
          issue_seconds: 1,
          first_time: new Date(),
          adjust_time: 1,
          encode_time: 1,
          issue_count: 1,
          status: '0'
         });
      }
    } else {

    }
    this.current += 1;
  }
  /**
  * 点击上一步
  */
  first_form() {
    this.current = 0;
  }
  hide_modal() {
    this.is_show_modal = false;
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
    this.current = 0;
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
        res.data.forEach((item,index) => {
          this.lotteries_tabs.push({
            label: item.title,
            value: item.series_name,
            status: item.status,
            encode_splitter: item.encode_splitter
          });
        });
        this.get_lotteries_list(this.lotteries_tabs[0].value, 0)
      } else {
        this.message.error(res.message, {
          nzDuration: 2500,
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
    this.tab_index = index;
    console.log(this.lotteries_tabs[index])
    if (this.lotteries_tabs[index].lotteries) {
      this.list_of_aply_data = this.lotteries_tabs[index].lotteries;
    } else {
      this.get_lotteries_list(this.lotteries_tabs[index].value, index)
    }

  }



  /*
  *
  *获取采种列表
  *
  * @memberof UserManageUserComponent
  */
  get_lotteries_list(type, tab_index) {

    this.is_load_list = true;
    let option = {
      series_id: type
    };
    this.gameService.get_lotteries_list(option).subscribe((res: any) => {
      if (res && res.success) {
        this.is_load_list = false;
        this.list_of_aply_data = res.data;
        this.lotteries_tabs[tab_index].lotteries = res.data;

      } else {
        this.is_load_list = false;
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }

}
class LotteriesObj {
  public cn_name: string;
  public en_name: string;
  public is_fast = '0';
  public lottery_type = '1';
  public auto_open = '0';
  public max_trace_number = 1;
  public day_issue = 1;
  public positions: string;
  public issue_format: string;
  public issue_type: string;
  public valid_code: string;
  public code_length = 1;
  public prize_group: Array<any>;
  public min_times = 1;
  public max_times = 1;
  public valid_modes = '请选择投注单位';
  public max_profit_bonus = 0;
  public icon: any;
  public status = '0';

  constructor(private min_group, private max_group) {
    this.prize_group = [
      this.min_group, this.max_group
    ]
  }

}
