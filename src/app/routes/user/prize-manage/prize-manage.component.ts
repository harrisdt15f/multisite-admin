import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-user-prize-manage',
  templateUrl: './prize-manage.component.html',
})
export class UserPrizeManageComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
