import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ExcelService } from 'app/service/excel.service';


@Component({
  selector: 'app-developer-drag',
  templateUrl: './drag.component.html',
  styleUrls: ['./drag.component.less']
})
export class DeveloperDragComponent implements OnInit {
  ngOnInit(): void {

  }
  data: any = [{
    eid: 'e101',
    ename: 'ravi',
    esal: 1000
    },{
    eid: 'e102',
    ename: 'ram',
    esal: 2000
    },{
    eid: 'e103',
    ename: 'rajesh',
    esal: 3000
    }];
  timePeriods = [
    '时时彩1',
    '时时彩2',
    '时时彩3',
    '时时彩4',
    '时时彩5',
    '时时彩6',
    '时时彩7',
    '时时彩8',
    '时时彩9',
    '时时彩01',
    '时时彩11111',
    '时时彩1222',
    '时时彩1333',
    '时时彩1444',
  
  ];
  constructor(private excelService:ExcelService) {

  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
  }
  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.data, 'sample');
 }

}
