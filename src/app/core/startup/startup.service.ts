import { Injectable, Injector, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { zip, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  MenuService,
  SettingsService,
  TitleService,
  ALAIN_I18N_TOKEN,
} from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ACLService } from '@delon/acl';
import { TranslateService } from '@ngx-translate/core';
import { I18NService } from '../i18n/i18n.service';

import { NzIconService } from 'ng-zorro-antd';
import { ICONS_AUTO } from '../../../style-icons-auto';
import { ICONS } from '../../../style-icons';
import { Utils } from 'config/utils.config';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
  serviceHttpIri: string;
  public menu_list: Array<any> = [];
  public menu_obj: object = {};
  public menu: any;

  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    private translate: TranslateService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private httpClient: HttpClient,
    private injector: Injector,
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
    this.serviceHttpIri = Utils.GethttpIri();
  }

  private viaHttp(resolve: any, reject: any, headers?) {
    zip(
      this.httpClient.get(`assets/tmp/i18n/${this.i18n.defaultLang}.json`),
      this.httpClient.get('assets/tmp/app-data.json'),
    )
      .pipe(
        // 接收其他拦截器后产生的异常消息
        catchError(([langData, appData]) => {
          resolve(null);
          return [langData, appData];
        }),
      )
      .subscribe(
        ([langData, appData]) => {
          // setting language data
          this.translate.setTranslation(this.i18n.defaultLang, langData);
          this.translate.setDefaultLang(this.i18n.defaultLang);
          // application data
          const res: any = appData;
          // 应用信息：包括站点名、描述、年份
          this.settingService.setApp(res.app);
          // 用户信息：包括姓名、头像、邮箱地址
          let user = this.tokenService.get();
          this.settingService.setUser(user);
          // ACL：设置权限为全量
          this.aclService.setFull(true);
          if (user && user.token&&this.menu) {
            // 初始化菜单
            this.menuService.add(this.menu);
          }
          // 设置页面标题的后缀
          this.titleService.suffix = res.app.name;
        },
        () => {},
        () => {
          resolve(null);
        },
      );
  }
  /**
   * 获得菜单列表
   */
  private getMenulist(item) {
    Utils.acl_route_list=[];
    let menuList = [
      {
        text: '菜单',
        i18n: 'menu_total',
        children: [],
      },
    ];
    for (let key in item) {
      let obj = {
        key: key,
        text: item[key].label,
        i18n: item[key].en_name,
        icon: item[key].icon,
        children: [],
      };
      this.menu_obj[key]=item[key];

      if (item[key].child) {
        for (let x in item[key].child) {
          this.menu_obj[x]=item[key].child[x];
          let second_obj={
            key: x,
            text: item[key].child[x].label,
            i18n: item[key].child[x].en_name,
            link: item[key].child[x].route,
            children: [],
          };
         
          if(item[key].child[x].child){
            for (let y in item[key].child[x].child){
              if(item[key].child[x].child[y].display===1){
                second_obj.children.push({
                key:  y,
                text: item[key].child[x].child[y].label,
                i18n: item[key].child[x].child[y].en_name,
                link: item[key].child[x].child[y].route,
              })
              }
              Utils.acl_route_list.push(item[key].child[x].child[y].route);
              Utils.acl_id_list.push(y);
            }
          }
          if(item[key].child[x].display===1){
            obj.children.push(second_obj);
            Utils.acl_route_list.push(item[key].child[x].route)
            Utils.acl_id_list.push(x)
          }
        
        }
      }
      menuList[0].children.push(obj);
    }

    return menuList;
  }
  /**
   * 得到创建组中的菜单树
   */
  getMenueTree(item) {

    let menuList = [];
    for (let key in item) {
      let obj = {
        key: Number(key),
        value:  Number(key),
        title: item[key].label,
        en_name: item[key].en_name,
        route: item[key].route,
        display: item[key].display,
        pid: item[key].pid,
        children: [],
      };

      if (item[key].child) {
        for (let x in item[key].child) {
          let second_obj={
            key:  Number(x),
            value: Number(x),
            route: item[key].child[x].route,
            title: item[key].child[x].label,
            en_name: item[key].child[x].en_name,
            display: item[key].child[x].display,
            pid: item[key].child[x].pid,
            children: [],
          };
         
          if(item[key].child[x].child){
            for (let y in item[key].child[x].child){
              // if(item[key].child[x].child[y].display===1){
                second_obj.children.push({
                key:  Number(y),
                value: Number(y),
                isLeaf: true,
                route: item[key].child[x].child[y].lroute,
                pid: item[key].child[x].child[y].pid,
                title: item[key].child[x].child[y].label,
                en_name: item[key].child[x].child[y].en_name,
                display: item[key].child[x].child[y].display,
              })
              // }
            
            }
          }
          obj.children.push(second_obj);
        }
      }
      menuList.push(obj);
    }
    this.menu_list = menuList;
  }

  load(): Promise<any> {
    let token = this.tokenService.get().token;
    let headers;
    if (token) {
      headers = new HttpHeaders({
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      });
    }

    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve, reject) => {
      let user = this.tokenService.get();
      if (user && user.token) {
        this.get_all_menu().subscribe((r: any) => {
          if (r && r.success) {
            this.menu = this.getMenulist(r.data);
            this.getMenueTree(r.data);//添加组用的菜单格式
            this.viaHttp(resolve, reject, headers);
          }else{
            this.viaHttp(resolve, reject, headers);
          }
        });
      } else {
        this.viaHttp(resolve, reject, headers);
      }

    });
  }
  get_all_menu(): Observable<any> {
    let token = this.tokenService.get().token;
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const href = this.serviceHttpIri + '/api/menu/current-admin-menu';
    // const href = this.serviceHttpIri + '/api/menu/current-admin-menu';

    return this.httpClient.get(href, { headers: headers });
  }
}
