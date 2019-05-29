import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-website-manage-logo-manage',
  templateUrl: './logo-manage.component.html',
})
export class WebsiteManageLogoManageComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
