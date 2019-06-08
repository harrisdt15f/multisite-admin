import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { ManagerService } from 'app/service/manager.service';
import { Utils } from 'config/utils.config';
@Component({
  selector: 'app-operasyon-nav-one',
  templateUrl: './nav-one.component.html',
  styleUrls:['./nav-one.component.less']
})
export class OperasyonNavOneComponent implements OnInit {

 
  public tab_index: number = 0;
  public page_tabs = [];
  public file_obj: any;
  public file_iri: string;
  public serviceHttpIri: string;
  public logo_iri: string;
  public is_edit_service: boolean;
  public loadding_btn: boolean;
  
  constructor(
    private http: _HttpClient,
    private managerService: ManagerService,
    private el:ElementRef,
    private renderer2: Renderer2,
    private message: NzMessageService
    ) { }

  ngOnInit() {
    this.get_home_page_list();
    this.serviceHttpIri = Utils.GethttpIri();
   }
   /**
* 点击上传logo文件
*/

click_update(tab) {
  // this.edit
  document.getElementById('pic_3').click();
}
updateFire(item) {
  this.file_obj = item.target['files'][0];
  this.file_iri = window.URL.createObjectURL(this.file_obj);
  var op: FormData = new FormData();
  op.append('pic',  this.file_obj);
  op.append('key',  'logo');
  this.managerService.upload_logo(op).subscribe((res: any) => {
    if (res && res.success) {
      this.get_home_page_list();
      this.message.success('上传logo成功', {
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
* 点击上传ico文件
*/

click_ico_update(tab) {
  // this.edit
  document.getElementById('pic_6').click();
}
update_ico_fire(item) {
  this.file_obj = item.target['files'][0];
  this.file_iri = window.URL.createObjectURL(this.file_obj);
  var op: FormData = new FormData();
  op.append('ico',  this.file_obj);
  this.managerService.upload_ico(op).subscribe((res: any) => {
    if (res && res.success) {
      this.get_home_page_list();
      this.message.success('上传ico成功', {
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
 *切换tab
 *
 * @memberof GameGameTypeComponent
 */
  change_index(index: number) {
    this.tab_index = index;
    console.log(this.page_tabs[this.tab_index].key);
  }

  /**
 * 获得主页管理列表
 */
get_home_page_list(){
  this.managerService.get_nav_one_list().subscribe((res: any) => {
    if (res && res.success) {
    this.page_tabs=res.data;
    this.is_edit_service=true;
    } else {
      this.message.error(res.message, {
        nzDuration: 10000,
      });
    }
  })
}
/**
 * 编辑客服
 */
edit_service(){
  this.is_edit_service=false;
}
/**
 * 提交修改客服链接
 */

update_service(data,value){

  if(!Utils.link_check(value)){
    this.message.error('请输入合法的http链接！', {
      nzDuration: 10000,
    });

    return;
  }
  let op={
    id:data.id,
    value:value
  };
  this.loadding_btn=true;
  this.managerService.edit_home_page(op).subscribe((res: any) => {
    this.loadding_btn=false;
    if (res && res.success) {
      this.get_home_page_list();
      this.message.success('修改客服链接成功', {
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
