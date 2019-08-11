import { Component, OnInit, Injector } from '@angular/core';
import { ReuseTabService } from '@delon/abc';
import { PersonalService } from 'app/service/personal.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';

@Component({
  selector: 'app-personal-personal-center',
  templateUrl: './personal-center.component.html',
  styleUrls: ['./personal-center.component.less'],
})
export class PersonalPersonalCenterComponent implements OnInit {
  public mode = 'inline';
  public title: string;
  public type: string;
  public old_password: string;
  public new_password: string;
  public is_change_passport: boolean;
  public menus: any[] = [
    {
      key: 'base',
      title: '基本设置',
    },
    {
      key: 'security',
      title: '安全设置',
      selected: true,
    },
  ];
  constructor(
    private reuseTabService: ReuseTabService,
    private personalService: PersonalService,
    private message: NzMessageService,
    private injector: Injector,
  ) {}

  ngOnInit() {
    this.reuseTabService.title = '个人中心';
    this.title = '安全设置';
    this.type = 'security';
  }
  /**
   *切换菜单
   *
   * @param {*} item
   * @memberof PersonalPersonalCenterComponent
   */
  change_menu(item) {
    this.title = item.title;
    this.type = item.key;
  }
  /**
   *修改密码
   *
   * @memberof PersonalPersonalCenterComponent
   */
  change_passport() {
    let option = {
      old_password: this.old_password,
      password: this.new_password,
    };
    this.personalService.change_passport(option).subscribe(res => {
      if (res && res.success) {
        this.message.success('修改成功,请重新登录！即将跳转登录页面。', {
          nzDuration: 3000,
        });
        setTimeout(() => {
          (this.injector.get(DA_SERVICE_TOKEN) as ITokenService).clear();
          this.injector.get(Router).navigateByUrl('/passport/login');
        }, 3000);
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
        return;
      }
    });
  }
  /**
   *取消修改密码
   *
   * @memberof PersonalPersonalCenterComponent
   */
  remove_change_passport() {
    this.is_change_passport = false;
    this.old_password = '';
    this.new_password = '';
  }
}
