import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-website-manage-ad-manage',
  templateUrl: './ad-manage.component.html',
})
export class WebsiteManageAdManageComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
