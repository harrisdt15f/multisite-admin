import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { STColumn } from '@delon/abc';
import { NzMessageService } from 'ng-zorro-antd';
import { UserManageService } from 'app/service/user-manage.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { until } from 'protractor';
import { Utils } from 'config/utils.config';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UEditorComponent } from 'ngx-ueditor';
@Component({
  selector: 'app-operasyon-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.less']
})
export class OperasyonActivityListComponent implements OnInit {

  full: UEditorComponent;
  public page_index = 1;
  public list_of_data: object = {};
  public list_of_aply_data: Array<any> = [];
  public list_total: number;
  public list_of_search_status: string;
  public is_load_list: boolean;
  public searchValue = '';
  public note_value: string;
  public sortName: string | null = null;
  public sortValue: string | null = null;
  public serviceHttpIri: string | null = null;
  // activity
  public page_tabs = [
    {title: '电脑端'},
    {title: '移动端'},
  ];
  public activity = {
    list: {
      type: '1',
      page_size: 20,
      page: 1
    }
  }

  public status_type = [
    { text: '关闭', value: '0' },
    { text: '开启', value: '1' }

  ];

  //---------------弹框编辑参数
  public create_form: FormGroup;//表单对象
  public modal_type: string = 'create';//弹框是编辑还是创建
  public modal_lodding: boolean;
  public is_edit_activity = false;
  public file_obj: any;
  public file_iri: string;
  public fileIriPreviewObj: any;
  public fileIriPreview: string;

  public edit_activity_obj: object = {

  };
  //---------------模态框
  public is_show_modal = false;
  public modal_iri: string;
  constructor(
    private http: _HttpClient,
    private userManageService: UserManageService,
    private fb: FormBuilder,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.search(1);//
    this.serviceHttpIri = Utils.GethttpIri();
    this.create_form = this.fb.group({
      title: [null, [Validators.required]],
      content: [null, [Validators.required]],
      pic: [null],
      start_time: [null],
      end_time: [null],
      status: [null, [Validators.required]],
      is_time_interval: [null, [Validators.required]],
      is_redirect: [null, [Validators.required]],
      redirect_url: [null, [Validators.required]]
    });
  }

  // 切换类型
  public change_index(e: any) {
    if (!e) {
      this.activity['list']['type'] = '1';
    } else {
      this.activity['list']['type'] = '2';
    }
    this.search(1);
  }
  /**
   * 拉动排序
   */
  drop_activity(event: CdkDragDrop<string[]>): void {
    let old_array = JSON.parse(JSON.stringify(this.list_of_aply_data));
    if (event.previousIndex != event.currentIndex) {
      moveItemInArray(this.list_of_aply_data, event.previousIndex, event.currentIndex);
      let first_index = event.previousIndex > event.currentIndex ? event.currentIndex : event.previousIndex;
      let last_index = event.previousIndex > event.currentIndex ? event.previousIndex : event.currentIndex;
      let option = {
        sort_type: event.previousIndex > event.currentIndex ? 1 : 2,
        front_id: this.list_of_aply_data[first_index].id,
        type: this.activity.list.type,
        front_sort: old_array[first_index].sort,
        rearways_id: this.list_of_aply_data[last_index].id,
        rearways_sort: old_array[last_index].sort
      }
      this.is_load_list = true;
      this.userManageService.sort_activity(option).subscribe((res: any) => {
        this.is_load_list = false;
        if (res && res.success) {
          // this.get_article_list(this.page_index);
          this.search(this.page_index);//
        } else {
          this.message.error(res.message, {
            nzDuration: 10000,
          });
        }
      })
    }
  }
  /**
   * 自定义是否需要开始结束时间验证
   */
  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (control.value || this.edit_activity_obj['is_time_interval'] == '1') {
      return { required: true };
    }
    return {};
  };

  /**
 *显示图片模态kuang
 *
 * @memberof OperasyonActivityListComponent
 */
  show_modal_img(img_iri) {
    //  this.modal_iri=img_iri;
    document.getElementById('modal_img').setAttribute('src', img_iri);
    this.is_show_modal = true;
  }
  /**
   *隐藏图片模态kuang
   *
   * @memberof OperasyonActivityListComponent
   */
  hide_modal() {
    this.is_show_modal = false;
    document.getElementById('modal_img').removeAttribute('src');
  }
  /**
  * 点击上传文件
  */

  click_update() {
    document.getElementById('pic').click();
  }
  updateFire(item) {
    this.file_obj = item.target['files'][0];
    this.file_iri = window.URL.createObjectURL(this.file_obj)
    document.getElementById('cropedBigImg').setAttribute('src', this.file_iri);
  }

  click_update2() {
    document.getElementById('pic2').click();
  }
  updateFire2(item) {
    this.fileIriPreviewObj = item.target['files'][0];
    this.fileIriPreview = window.URL.createObjectURL(this.fileIriPreviewObj)
    document.getElementById('cropedBigImg2').setAttribute('src', this.fileIriPreview);
  }

  /**
   *开始时间变化
   *
   * @memberof OperasyonActivityListComponent
   */
  on_change_start(item) { }
  /**
 *开始时间确定
 *
 * @memberof OperasyonActivityListComponent
 */
  on_ok_start(item) { }
  /**
 *结束时间变化
 *
 * @memberof OperasyonActivityListComponent
 */
  on_change_end(item) { }
  /**
*结束时间确定
*
* @memberof OperasyonActivityListComponent
*/
  on_ok_end(item) { }
  /**
   *点击添加活动
   *
   * @memberof OperasyonActivityListComponent
   */
  add_activity() {
    this.modal_lodding = false;
    this.update_form();//刷新表单
    this.is_edit_activity = true;
    this.edit_activity_obj = {};
    this.modal_type = 'create';
    document.getElementById('cropedBigImg2').setAttribute('src', '');
  }


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
*状态筛选改变
*
* @param {string[]} value
* @memberof UserManageUserComponent
*/
  is_status_change(value: string): void {
    this.list_of_search_status = value;
    this.search();
  }
  /**
*点击编辑
*
* @param {*} type
* @memberof UserManageUserComponent
*/
  edit_activity(data) {
    this.modal_lodding = false;
    // this.update_form();//刷新表单
    this.modal_type = 'edit';
    this.is_edit_activity = true;
    this.file_iri = Utils.httpIri + data.pic_path;
    this.file_obj = null;
    let {type}=this.activity['list'];
    type==='1' && document.getElementById('cropedBigImg').setAttribute('src', this.file_iri);

    this.note_value = '';
    this.edit_activity_obj = {
      "id": data['id'],
      "title": data['title'],

      "content": data['content'],
      "status": String(data['status']),
      "redirect_url": data['redirect_url'],
      "is_time_interval": String(data['is_time_interval']),
    };
    if (data.start_time) {
      this.edit_activity_obj['start_time'] = new Date(data.start_time);
    }
    if (data.end_time) {
      this.edit_activity_obj['end_time'] = new Date(data.end_time);
    }


  }
  /**
   *d刷新表单
   *
   * @memberof OperasyonActivityListComponent
   */
  update_form() {
    this.file_iri = null;
    this.file_obj = null;
    this.edit_activity_obj = {};
    let {type}=this.activity['list'];
    type==='1' && document.getElementById('cropedBigImg').removeAttribute('src');
    this.create_form.reset();
    for (const key in this.create_form.controls) {
      this.create_form.controls[key].markAsPristine();
      this.create_form.controls[key].updateValueAndValidity();
    }
  }
  /**
   *搜索数组
   *
   * @memberof UserPassportCheckComponent
   */
  search(page?): void {
    let option = {};//筛选条件
    if (this.list_of_search_status && this.list_of_search_status != '1000') {
      option['status'] = this.list_of_search_status;
    }

    if (this.searchValue) {
      option['title'] = this.searchValue;
    }
    option['type'] = this.activity.list.type;
    this.get_activity_aply_list(page ? page : 1, option);
  }
  /**
  *改变页数
  *
  * @param {*} item
  * @memberof UserManageUserComponent
  */
  chang_page_index(item) {
    this.page_index=item;
    this.search(item);
  }
  /*
*
*获取用户管理列表
*
* @memberof UserManageUserComponent
*/
  get_activity_aply_list(page_index, data?) {
    this.is_load_list = true;
    this.userManageService.get_activity_list(page_index, data).subscribe((res: any) => {
      if (res && res.success) {
        this.page_index = page_index;
        this.list_total = res.data.total;
        this.is_load_list = false;
        this.list_of_data = res.data;
        this.list_of_aply_data = res.data.data;

      } else {
        this.is_load_list = false;
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   *删除活动
   *
   * @memberof OperasyonActivityListComponent
   */
  delete_activity(item) {
    let op = {
      id: item.id
    }
    this.is_load_list = true;
    this.userManageService.delete_activity(op).subscribe((res: any) => {
      this.modal_lodding = false;
      this.is_load_list = false;
      this.is_edit_activity = false;
      if (res && res.success) {
        this.search();
        this.message.success('删除活动成功', {
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
   *提交
   *
   * @memberof UserPassportCheckComponent
   */
  submit_activity() {
    this.modal_lodding = true;

    var option = {
      "id": this.edit_activity_obj['id'],
      "title": this.edit_activity_obj['title'],
      "content": this.edit_activity_obj['content'],
      "pic": this.file_obj,
      "preview_pic": this.fileIriPreviewObj,
      "status": this.edit_activity_obj['status'],
      "redirect_url": this.edit_activity_obj['redirect_url'],
      "is_time_interval": this.edit_activity_obj['is_time_interval'],
      "is_redirect": this.edit_activity_obj['is_redirect'],
    };
    if (this.edit_activity_obj['start_time']) {
      option['start_time'] = Utils.change_date(this.edit_activity_obj['start_time'], 'time');
    }
    if (this.edit_activity_obj['end_time']) {
      option['end_time'] = Utils.change_date(this.edit_activity_obj['end_time'], 'time');
    }
    var op: FormData = new FormData();
    if (this.file_obj) op.append('pic', this.file_obj, this.file_obj.name);
    if (this.fileIriPreviewObj) op.append('preview_pic', this.fileIriPreviewObj, this.fileIriPreviewObj.name);
    if (option.id) op.append('id', option['id']);
    op.append('title', option['title']);
    op.append('content', option['content']);
    if (option['start_time']) op.append('start_time', option['start_time']);
    if (option['end_time']) op.append('end_time', option['end_time']);
    op.append('status', option['status']);
    op.append('is_redirect', option['is_redirect']);
    op.append('redirect_url', option['redirect_url']);
    op.append('is_time_interval', option['is_time_interval']);
    op.append('type', this.activity.list.type);
    if (this.modal_type === 'create') {
      this.userManageService.add_activity(op).subscribe((res: any) => {
        this.modal_lodding = false;
        this.is_edit_activity = false;
        if (res && res.success) {
          this.search();
          this.update_form();
          this.message.success('创建活动成功', {
            nzDuration: 2500,
          });
        } else {
          this.message.error(res.message, {
            nzDuration: 2500,
          });
        }
      })
    } else if (this.modal_type === 'edit') {
      this.userManageService.edit_activity(op).subscribe((res: any) => {
        this.modal_lodding = false;
        this.is_edit_activity = false;
        if (res && res.success) {
          this.search();
          this.update_form();
          this.message.success('修改活动成功', {
            nzDuration: 2500,
          });
        } else {

          this.message.error(res.message, {
            nzDuration: 2500,
          });
        }
      })
    }

  }
  public _ready(e) { }
  public _destroy() { }
  public _change(e) { }

}