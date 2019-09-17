import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
  selector: 'header-user',
  template: `
  <div nz-dropdown [nzDropdownMenu]="menu" class="alain-default__nav-item d-flex align-items-center px-sm" nz-dropdown>
  <nz-avatar [nzSrc]="settings.user.avatar" nzSize="small" class="mr-sm"></nz-avatar>
  {{settings.user.name}}
</div>
  <nz-dropdown-menu  #menu="nzDropdownMenu" nzPlacement="bottomLeft">
    <div nz-menu class="width-sm">
      <div nz-menu-item routerLink="/personal/personal_center"><i nz-icon nzType="user" class="mr-sm"></i>
        {{ 'menu.account.center' | translate }}
      </div>
   
      <li nz-menu-divider></li>
      <div nz-menu-item (click)="logout()"><i nz-icon nzType="logout" class="mr-sm"></i>
        {{ 'menu.account.logout' | translate }}
      </div>
    </div>
  </nz-dropdown-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderUserComponent {
  constructor(
    public settings: SettingsService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) { }

  logout() {
    this.tokenService.clear();
    this.router.navigateByUrl(this.tokenService.login_url);
  }
}
