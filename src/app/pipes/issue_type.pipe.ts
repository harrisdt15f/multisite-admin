import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'issueType',
})
export class IssueTypePipe implements PipeTransform {
  /**
   * 累加模式
   * 
   * @param {number} value 
   * @returns 
   * @memberof BetStatusPipe
   */
  transform(value: string) {
    let model: string;
    switch (value) {
      case 'day': model = '每日累加'; break;
      case 'increase': model = '整体累加'; break;
      case 'random': model = '随机'; break;
      default: break;
    }
    return model;
  }
}
