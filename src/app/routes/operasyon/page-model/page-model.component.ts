import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ManagerService } from 'app/service/manager.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Utils } from 'config/utils.config';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-operasyon-page-model',
  templateUrl: './page-model.component.html',
  styleUrls: ['./page-model.component.less']
})
export class OperasyonPageModelComponent implements OnInit {
  //-------------------热门彩票
  public list_of_aply_data: Array<any> = [];
  public list_of_aply_data_two: Array<any> = [];
  public lotteries_list: Array<any> = [];
  public is_load_list: boolean;
  public show_text: string;
  public serviceHttpIri: string;
  //----------弹框
  public is_show_modal: boolean;
  public modal_type: string = 'create';
  public modal_lodding: boolean;
  public is_show_box: boolean;

  public create_form: FormGroup;//表单对象
  public create_form_two: FormGroup;//表单对象
  public edit_lotteries_obj: object = {
  };
  public file_obj: any;
  public file_iri: string;
  //-------------------热门彩票

  public mode = 'inline';
  public title: string;
  public type: string;
  public is_upload: boolean;
  public menus: any[] = [
    {
      key: 'base',
      title: '基本设置',
      selected: true,
    },
    {
      key: 'popularLotteries.one',
      title: '热门彩票',
    },
    {
      key: 'popularLotteries.two',
      title: '热门玩法',
    },
  ];
  public home_page_type: object = {};
  //---------------------模态框
  public is_visible_modal: boolean;//模态框显示
  public is_loading_modal: boolean;//加载图标显示
  public input_value: string;
  public modal_type_obj = {
    'winning.ranking': {
      title: '中奖排行条数设置',
      value: '',
    },
    'notice': {
      title: '中奖公告条数设置',
      value: '',
    }
  }

  public edit_modal_type: string = 'winning.ranking';
  public method_value: any[] = [];
  public method_option = [];
  constructor(
    private http: _HttpClient,
    private message: NzMessageService,
    private fb: FormBuilder,
    private managerService: ManagerService
  ) { }

  ngOnInit() {
    this.type = 'base';
    this.title = '基本设置';
    this.serviceHttpIri = Utils.GethttpIri();
    this.get_page_model_msg();

    //-----------热门
    this.serviceHttpIri = Utils.GethttpIri();
    this.get_lotteries();
    this.get_lotteries_list();
    this.get_methods_list();
    this.get_lotteries_two();
    this.create_form = this.fb.group({
      lotteries_id: [null, [Validators.required]],
      pic: [null],
    });
    this.create_form_two = this.fb.group({
      method_id: [null, [Validators.required]]
    });
  }
  onChanges(values: any): void {
    console.log(values, this.method_value);
    this.edit_lotteries_obj['method_id']=values[1];

  }
  //----------------热门彩zhong
  drop(event: CdkDragDrop<string[]>, type) {
    let list_obj = [];
    if (type == 1) {
      list_obj = this.list_of_aply_data;
    } else if (type == 2) {
      list_obj = this.list_of_aply_data_two;
    };
    let old_array = JSON.parse(JSON.stringify(list_obj));
    moveItemInArray(list_obj, event.previousIndex, event.currentIndex);
    let first_index = event.previousIndex > event.currentIndex ? event.currentIndex : event.previousIndex;
    let last_index = event.previousIndex > event.currentIndex ? event.previousIndex : event.currentIndex;
    let option = {
      sort_type: event.previousIndex > event.currentIndex ? 1 : 2,
      front_id: list_obj[first_index].id,
      front_sort: old_array[first_index].sort,
      rearways_id: list_obj[last_index].id,
      rearways_sort: old_array[last_index].sort
    }
    this.is_load_list = true;
    if (type == 1) {
      this.managerService.sort_hot_lotteries_list(option).subscribe((res: any) => {
        this.is_load_list = false;
        if (res && res.success) {
            this.get_lotteries();
    
        } else {
          this.message.error(res.message, {
            nzDuration: 10000,
          });
        }
      })
    } else if (type == 2) {
      this.managerService.sort_hot_method_list(option).subscribe((res: any) => {
        this.is_load_list = false;
        if (res && res.success) {
            this.get_lotteries_two();
        } else {
          this.message.error(res.message, {
            nzDuration: 10000,
          });
        }
      })
    };

  }
  /**
   * 添加热门玩法时的玩法列表
   */
  get_methods_list(){
    this.managerService.get_methods_list().subscribe((res: any) => {
      if (res && res.success) {
        this.method_option=[];
        for(let key in res.data){
          let lot={
            value: key,
            label: key,
            children: []
          }
          res.data[key].forEach((data) => {
            lot.children.push({
              value: data.method_id,
              label: data.method_name,
              isLeaf: true
            })
          });
          this.method_option.push(lot);
        }
       
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }


  /**
 * 获得彩种列表
 */
  get_lotteries_list() {
    this.managerService.get_hot_lotteries_list().subscribe((res: any) => {
      if (res && res.success) {
        this.lotteries_list = res.data;
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }


  /**
*显示图片模态kuang
*
* @memberof OperasyonlotteriesListComponent
*/
  show_modal_img(img_iri) {
    //  this.modal_iri=img_iri;
    this.is_show_modal = true;
    if (document.getElementById('modal_img')) {
      document.getElementById('modal_img').setAttribute('src', img_iri);
    }


  }
  /**
   *隐藏图片模态kuang
   *
   * @memberof OperasyonlotteriesListComponent
   */
  hide_modal() {
    this.is_show_modal = false;
    if (document.getElementById('modal_img')) {
      document.getElementById('modal_img').removeAttribute('src');
    }

  }

  /**
  * 点击上传文件
  */

  click_update_lot() {
    document.getElementById('pic_5').click();
  }
  updateFire_lot(item) {
    this.file_obj = item.target['files'][0];
    this.file_iri = window.URL.createObjectURL(this.file_obj);
    document.getElementById('cropedBigImg').setAttribute('src', this.file_iri);


  }




  /**
   *调用添加
   *
   * @param {*} data
   * @memberof OperasyonlotteriesManageComponent
   */
  add_lotteries_submit(data, type) {

    if (type == 1) {
      this.managerService.add_hot_lotteries(data).subscribe((res: any) => {
        this.modal_lodding = false;
        if (res && res.success) {
          this.get_lotteries();
          this.message.success('添加热门彩票成功', {
            nzDuration: 10000,
          });
          this.hide_modal();
          this.update_form();
          this.is_show_modal = false;
          this.is_show_box = false;

        } else {

          this.message.error(res.message, {
            nzDuration: 10000,
          });
        }
      })
    } else if (type == 2) {
      this.managerService.add_popular_methods(data).subscribe((res: any) => {
        this.modal_lodding = false;
        if (res && res.success) {
          this.get_lotteries_two();
          this.message.success('添加热门玩法成功', {
            nzDuration: 10000,
          });
          this.hide_modal();
          this.update_form();
          this.is_show_modal = false;
          this.is_show_box = false;

        } else {

          this.message.error(res.message, {
            nzDuration: 10000,
          });
        }
      })
    }

  }
  /**
   *调用修改
   *
   * @param {*} data
   * @memberof OperasyonlotteriesManageComponent
   */
  edit_lotteries_submit(data, type) {
    if (type == 1) {
      this.managerService.edit_hot_lotteries_list(data).subscribe((res: any) => {
        this.modal_lodding = false;
        this.is_show_box = false;
        if (res && res.success) {
          this.get_lotteries();

          this.update_form();
          this.hide_modal();
          this.message.success('修改热门彩票成功', {
            nzDuration: 10000,
          });
        } else {
          this.message.error(res.message, {
            nzDuration: 10000,
          });
        }
      })

    } else if (type == 2) {
      this.managerService.edit_popular_methods_list(data).subscribe((res: any) => {
        this.modal_lodding = false;
        this.is_show_box = false;
        if (res && res.success) {
          this.get_lotteries_two();
          this.update_form();
          this.hide_modal();
          this.message.success('修改热门玩法成功', {
            nzDuration: 10000,
          });

        } else {

          this.message.error(res.message, {
            nzDuration: 10000,
          });
        }
      })

    }

  }

  /**
 *d刷新表单
 *
 * @memberof OperasyonlotteriesListComponent
 */
  update_form() {
    this.edit_lotteries_obj = {
    }
    this.modal_lodding = false;
    if (document.getElementById('modal_img')) {
      document.getElementById('modal_img').removeAttribute('src');
    }
    this.file_obj = {};
    this.file_iri = '';
    this.create_form.reset();
    this.create_form_two.reset();
    for (const key in this.create_form.controls) {
      this.create_form.controls[key].markAsPristine();
      this.create_form.controls[key].updateValueAndValidity();
    }

    for (const key in this.create_form_two.controls) {
      this.create_form_two.controls[key].markAsPristine();
      this.create_form_two.controls[key].updateValueAndValidity();
    }
  }


  /**
   *获取热门彩票一列表
   *
   * @param {*} 
   * @memberof OperasyonlotteriesManageComponent
   */
  get_lotteries() {
    this.is_load_list = true;
    this.managerService.get_hot_lotteries_one().subscribe((res: any) => {
      if (res && res.success) {

        this.is_load_list = false;
        this.list_of_aply_data = res.data;

      } else {

        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
 *获取热门彩票二列表
 *
 * @param {*} 
 * @memberof OperasyonlotteriesManageComponent
 */
  get_lotteries_two() {
    this.is_load_list = true;
    this.managerService.get_hot_lotteries_two().subscribe((res: any) => {
      if (res && res.success) {

        this.is_load_list = false;
        this.list_of_aply_data_two = res.data;

      } else {

        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   *点击添加热门彩票一
   *
   * @memberof OperasyonlotteriesManageComponent
   */
  add_lotteries() {

    this.is_show_box = true;
    this.modal_type = 'create';
    this.update_form();
  }


  /**
   *点击编辑
   *
   * @memberof OperasyonlotteriesManageComponent
   */
  edit_lotteries(data, type) {
    this.is_show_box = true;
    this.modal_type = 'edit';
    this.edit_lotteries_obj = {
      "id": data['id']
    };
    if (type == 1) {
      this.edit_lotteries_obj['lotteries_id']=Number(data['lotteries_id'])
      this.file_iri = Utils.httpIri + data.pic_path;
      this.file_obj = null;
      document.getElementById('cropedBigImg').setAttribute('src', this.file_iri);
    }else if(type==2){
      this.edit_lotteries_obj['method_id']=Number(data['method_id']);
      this.method_value=[data['lottery_name'],Number(data['method_id'])]
    }

 
  }
  /**
   * 点击删除
   *
   * @memberof OperasyonlotteriesManageComponent
   */
  delete_lotteries(data, type) {
    let option = {
      id: data.id
    }
    this.is_load_list = true;
    if (type == 1) {
      this.managerService.delete_hot_lotteries_list(option).subscribe((res: any) => {
        this.is_load_list = false;
        if (res && res.success) {
          this.get_lotteries(); 
          this.message.success('删除热门彩票成功', {
            nzDuration: 10000,
          });
  
        } else {
  
          this.message.error(res.message, {
            nzDuration: 10000,
          });
        }
      })
    } else if (type == 2) {
      this.managerService.delete_hot_methods_list(option).subscribe((res: any) => {
        this.is_load_list = false;
        if (res && res.success) {
            this.get_lotteries_two();
          this.message.success('删除热门玩法成功', {
            nzDuration: 10000,
          });
  
        } else {
  
          this.message.error(res.message, {
            nzDuration: 10000,
          });
        }
      })
    }
  
  }

  submit_lotteries(type) {
    this.modal_lodding = true;
    var op: FormData = new FormData();
    op.append('lotteries_id', this.edit_lotteries_obj['lotteries_id']);
    op.append('method_id', this.edit_lotteries_obj['method_id']);
    if (this.file_obj && this.file_obj.name) {
      op.append('pic', this.file_obj, this.file_obj.name);
    }
    if (this.edit_lotteries_obj['id']) {
      op.append('id', this.edit_lotteries_obj['id']);

    }
    op.append('type', type);

    if (this.modal_type == 'create') {
      this.add_lotteries_submit(op, type);
    } else if (this.modal_type == 'edit') {
      this.edit_lotteries_submit(op, type);
    }

  }
  //----------------热门彩zhong
  /**
   * 基本设置开关切换
   */
  change_open_base(type, item) {
    let op = {
      id: item.id,
      status: type ? 1 : 0
    };
    this.managerService.edit_home_page(op).subscribe((res: any) => {
      if (res && res.success) {
        this.message.success('修改开关状态成功', {
          nzDuration: 10000,
        });
      } else {

        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }


  /**
  * 点击上传文件
  */

  click_update() {
    // this.edit
    document.getElementById('pic_4').click();
  }
  updateFire(item) {
    this.is_upload = true;
    this.file_obj = item.target['files'][0];
    this.file_iri = window.URL.createObjectURL(this.file_obj);
    var op: FormData = new FormData();
    op.append('pic', this.file_obj);
    op.append('key', 'qr.code');
    setTimeout(() => {
      this.is_upload = false;
    }, 10000)
    this.managerService.upload_logo(op).subscribe((res: any) => {
      this.is_upload = false;
      if (res && res.success) {
        this.get_page_model_msg();
        this.message.success('上传二维码成功', {
          nzDuration: 10000,
        });
      } else {

        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   * 获取主题板块数据
   */
  get_page_model_msg() {
    this.is_upload = false;
    this.managerService.get_page_model_list().subscribe((res: any) => {
      if (res && res.success) {
        res.data.forEach((item) => {
          this.home_page_type[item.key] = item;
        });
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }

  /**
 *切换菜单
 *
 * @param {*} item
 * @memberof PersonalPersonalCenterComponent
 */
  public change_menu(item) {
    this.title = item.title;
    this.type = item.key;
  }
  /**
   * 取消莫泰框
   */
  public modal_cancel() {

    this.is_visible_modal = false;
    this.input_value = '';
  }
  /**
   * 莫泰框确定
   */
  public modal_ok() {
    let op = {
      id: this.home_page_type[this.edit_modal_type].id,
      show_num: this.input_value
    };
    this.is_loading_modal = true;
    this.managerService.edit_home_page(op).subscribe((res: any) => {
      this.is_loading_modal = false;
      if (res && res.success) {
        this.home_page_type[this.edit_modal_type].show_num = this.input_value;
        this.input_value = '';
        this.is_visible_modal = false;
        this.message.success('修改数据成功', {
          nzDuration: 10000,
        });
      } else {

        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   * 点击修改
   */
  edit_base_msg(type) {
    this.edit_modal_type = type;
    this.is_visible_modal = true;
    this.input_value = '';
  }

}

