import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-operasyon-nav-two',
  templateUrl: './nav-two.component.html',
})
export class OperasyonNavTwoComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
