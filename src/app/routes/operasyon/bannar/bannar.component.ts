import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManagerService } from 'app/service/manager.service';
import { Utils } from 'config/utils.config';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-operasyon-bannar',
  templateUrl: './bannar.component.html',
  styleUrls: ['./bannar.component.less']
})
export class OperasyonBannarComponent implements OnInit {

  public list_of_aply_data: Array<any> = [];
  public is_load_list: boolean;
  public show_text: string;
  public serviceHttpIri: string;
  //----------弹框
  public is_show_modal: boolean;
  public modal_type: string = 'create';
  public modal_lodding: boolean;
  public is_show_box: boolean;
  public activity_list: Array<any> = [];
  public create_form: FormGroup;//表单对象
  public edit_bannar_obj: object = {

  };
  public file_obj: any;
  public file_iri: string;

  // banner
  public page_tabs = [
    {title: '电脑端'},
    {title: '移动端'},
  ];
  public banner = {
    list: {
      type: '1',
      page_size: 20,
      page: 1
    }
  }

  constructor(
    private http: _HttpClient,
    private fb: FormBuilder,
    private managerService: ManagerService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    // this.get_system_setting_list();
    this.serviceHttpIri = Utils.GethttpIri();
    this.get_bannar_list();
    this.get_activity_list();
    this.create_form = this.fb.group({
      title: [null, [Validators.required]],
      content: [null, [Validators.required]],
      type: [null, [Validators.required]],
      status: [null, [Validators.required]],
      start_time: [null, [Validators.required]],
      end_time: [null, [Validators.required]],
      redirect_url: [null],
      activity_id: [null],
      bannar_id: [null],
      pic: [null],
    });
  }
  // 切换轮播
  public change_index(e: any) {
    if (!e) {
      this.banner['list']['type'] = '1';
    } else {
      this.banner['list']['type'] = '2';
    }
    this.get_bannar_list();
  }

  drop(event: CdkDragDrop<string[]>) {
    let old_array = JSON.parse(JSON.stringify(this.list_of_aply_data));
    moveItemInArray(this.list_of_aply_data, event.previousIndex, event.currentIndex);
    let first_index = event.previousIndex > event.currentIndex ? event.currentIndex : event.previousIndex;
    let last_index = event.previousIndex > event.currentIndex ? event.previousIndex : event.currentIndex;
    let option = {
      sort_type: event.previousIndex > event.currentIndex ? 1 : 2,
      front_id: this.list_of_aply_data[first_index].id,
      front_sort: old_array[first_index].sort,
      rearways_id: this.list_of_aply_data[last_index].id,
      rearways_sort: old_array[last_index].sort
    }
    this.is_load_list=true;
    this.managerService.sort_bannar(option).subscribe((res: any) => {
      this.is_load_list = false;
      if (res && res.success) {
        this.get_bannar_list();
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   * 获得活动列表
   */
  get_activity_list() {
    this.managerService.get_activity_list().subscribe((res: any) => {
      if (res && res.success) {
        this.activity_list = res.data;
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
* @memberof OperasyonbannarListComponent
*/
  show_modal_img(img_iri) {
    //  this.modal_iri=img_iri;
    this.is_show_modal = true;
    if(document.getElementById('modal_img')){
         document.getElementById('modal_img').setAttribute('src', img_iri);
    }
 
    
  }
  /**
   *隐藏图片模态kuang
   *
   * @memberof OperasyonbannarListComponent
   */
  hide_modal() {
    this.is_show_modal = false;
    if(document.getElementById('modal_img')){
       document.getElementById('modal_img').removeAttribute('src');
    }
   
  }

  /**
  * 点击上传文件
  */

  click_update() {
    document.getElementById('pic_2').click();
  }
  updateFire(item) {
    this.file_obj = item.target['files'][0];
    this.file_iri = window.URL.createObjectURL(this.file_obj);
    document.getElementById('cropedBigImg').setAttribute('src', this.file_iri);


  }

  /**
   *开始时间变化
   *
   * @memberof OperasyonbannarListComponent
   */
  on_change_start(item) { }
  /**
 *开始时间确定
 *
 * @memberof OperasyonbannarListComponent
 */
  on_ok_start(item) { }
  /**
 *结束时间变化
 *
 * @memberof OperasyonbannarListComponent
 */
  on_change_end(item) { }
  /**
*结束时间确定
*
* @memberof OperasyonbannarListComponent
*/
  on_ok_end(item) { }

  /**
   *调用添加
   *
   * @param {*} data
   * @memberof OperasyonbannarManageComponent
   */
  add_bannar_submit(data) {
    this.managerService.create_banner(data).subscribe((res: any) => {
      this.modal_lodding = false;
      if (res && res.success) {
        this.get_bannar_list();
        this.message.success('添加轮播图成功', {
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
  /**
   *调用修改
   *
   * @param {*} data
   * @memberof OperasyonbannarManageComponent
   */
  edit_bannar_submit(data) {
    this.managerService.edit_banner(data).subscribe((res: any) => {
      this.modal_lodding = false;
      this.is_show_box = false;
      if (res && res.success) {
        this.get_bannar_list();
        this.update_form();
        this.hide_modal();
        this.message.success('修改轮播图成功', {
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
 *d刷新表单
 *
 * @memberof OperasyonbannarListComponent
 */
  update_form() {
    this.edit_bannar_obj = {
    }
    this.modal_lodding = false;
    if (document.getElementById('modal_img')) {
      document.getElementById('modal_img').removeAttribute('src');
    }
    this.file_obj = {};
    this.file_iri = '';
    this.create_form.reset();
    for (const key in this.create_form.controls) {
      this.create_form.controls[key].markAsPristine();
      this.create_form.controls[key].updateValueAndValidity();
    }
  }
  /**
   * 切换轮播图开关
   */
  change_open_bannar(e,data){
   let option = {
      "id": data['id'],
      "title": data['title'],
      "content": data['content'],
      "status": e?1:0,
      "type": data['type'],
      "start_time": data['start_time'],
      "end_time": data['end_time'],
   
    };
    if(data['redirect_url']){option['redirect_url']=data['redirect_url']};
    if(data['activity_id']){option['activity_id']=data['activity_id']};
    this.edit_bannar_submit(option);

  }

  /**
   *获取轮播列表
   *
   * @param {*} 
   * @memberof OperasyonbannarManageComponent
   */
  get_bannar_list() {
    this.is_load_list = true;
    this.managerService.get_banner_list(this.banner['list']['type']).subscribe((res: any) => {
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
   *点击添加轮播
   *
   * @memberof OperasyonbannarManageComponent
   */
  add_bannar() {

    this.is_show_box = true;
    this.modal_type = 'create';
    this.update_form();
    document.getElementById('cropedBigImg').setAttribute('src', '');
  }


  /**
   *点击编辑
   *
   * @memberof OperasyonbannarManageComponent
   */
  edit_bannar(data) {
    this.is_show_box = true;
    this.modal_type = 'edit';
    this.file_iri = Utils.httpIri + data.pic_path;
    this.file_obj = null;
    document.getElementById('cropedBigImg').setAttribute('src', this.file_iri);
    this.edit_bannar_obj = {
      "id": data['id'],
      "title": data['title'],
      "content": data['content'],
      "status": String(data['status']),
      "type": String(data['type']),
      "redirect_url": data['redirect_url'],
      "activity_id": data['activity_id'],
    };
    if (data.start_time) {
      this.edit_bannar_obj['start_time'] = new Date(data.start_time);
    }
    if (data.end_time) {
      this.edit_bannar_obj['end_time'] = new Date(data.end_time);
    }

  }
  /**
   * 点击删除
   *
   * @memberof OperasyonbannarManageComponent
   */
  delete_bannar(data) {
    let option = {
      id: data.id
    }
    this.is_load_list = true;
    this.managerService.delete_banner(option).subscribe((res: any) => {
      this.is_load_list = false;
      if (res && res.success) {
        this.get_bannar_list();
        this.message.success('删除轮播成功', {
          nzDuration: 10000,
        });

      } else {

        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }











  submit_bannar() {
    this.modal_lodding = true;
    let start_time;
    let end_time
    if (this.edit_bannar_obj['start_time']) {
      start_time = Utils.change_date(this.edit_bannar_obj['start_time'], 'time');
    }
    if (this.edit_bannar_obj['end_time']) {
      end_time = Utils.change_date(this.edit_bannar_obj['end_time'], 'time');
    }
    var op: FormData = new FormData();
    if (this.file_obj) op.append('pic', this.file_obj, this.file_obj.name);
    op.append('start_time', start_time);
    op.append('end_time', end_time);
    op.append('status', this.edit_bannar_obj['status']);
    op.append('content', this.edit_bannar_obj['content']);
    op.append('title', this.edit_bannar_obj['title']);
    op.append('type', this.edit_bannar_obj['type']);
    op.append('flag', this.banner.list.type);
    if (this.edit_bannar_obj['id']) {
      op.append('id', this.edit_bannar_obj['id']);
    }
    if (this.edit_bannar_obj['type'] == 1||this.edit_bannar_obj['type'] == 3) {
      op.append('redirect_url', this.edit_bannar_obj['redirect_url']);
    }
    if (this.edit_bannar_obj['type'] == 2) {
      op.append('activity_id', this.edit_bannar_obj['activity_id']);
    }
    if (this.modal_type == 'create') {
      this.add_bannar_submit(op);
    } else if (this.modal_type == 'edit') {
      this.edit_bannar_submit(op);
    }

  }





}
