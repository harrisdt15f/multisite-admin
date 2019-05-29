import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SimpleGuard } from '@delon/auth';
import { environment } from '@env/environment';
// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
import { LayoutPassportComponent } from '../layout/passport/passport.component';
// dashboard pages
import { DashboardComponent } from './dashboard/dashboard.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
// single pages
import { CallbackComponent } from './callback/callback.component';
import { UserLockComponent } from './passport/lock/lock.component';
import { ACLGuard } from '@delon/acl';

const routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    canActivate: [SimpleGuard],
        // 所有子路由有效
    canActivateChild: [ ACLGuard ],
    children: [
      { path: '', redirectTo: 'operasyon', pathMatch: 'full' },
      { path: 'website', loadChildren: './website-manage/website-manage.module#WebsiteManageModule' },
      { path: 'operasyon', loadChildren: './operasyon/operasyon.module#OperasyonModule' },
      { path: 'manage', loadChildren: './user/user.module#UserModule' },
      { path: 'game', loadChildren: './game/game.module#GameModule' },
      { path: 'developer', loadChildren: './developer/developer.module#DeveloperModule' },
      { path: 'personal', loadChildren: './personal/personal.module#PersonalModule' },
      { path: 'ad-manage', loadChildren: './ad/ad.module#AdModule' },
      { path: 'report', loadChildren: './report/report.module#ReportModule' },
      { path: 'log', loadChildren: './log/log.module#LogModule' },
      { path: 'exception', loadChildren: './exception/exception.module#ExceptionModule' },

      // 业务子模块
      // { path: 'widgets', loadChildren: './widgets/widgets.module#WebsiteManageModule' }
    ]
  },
  // 全屏布局
  // {
  //     path: 'fullscreen',
  //     component: LayoutFullScreenComponent,
  //     children: [
  //     ]
  // },
  // passport
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      { path: 'login', component: UserLoginComponent, data: { title: '登录' } },
      { path: 'register', component: UserRegisterComponent, data: { title: '注册' } },
      { path: 'register-result', component: UserRegisterResultComponent, data: { title: '注册结果' } },
      { path: 'lock', component: UserLockComponent, data: { title: '锁屏' } },
     
    ]
  },
  // 单页不包裹Layout
  { path: 'callback/:type', component: CallbackComponent },
  { path: '**', redirectTo: 'exception/404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes, {
        useHash: environment.useHash,
        // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
        // Pls refer to https://ng-alain.com/components/reuse-tab
        scrollPositionRestoration: 'top',
      }
    )],
  exports: [RouterModule],
})
export class RouteRoutingModule { }
