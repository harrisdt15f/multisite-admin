import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateChange',
})
export class DateChangePipe implements PipeTransform {
  /**
   * 投注状态
   * 
   * @param {number} value 
   * @returns 
   * @memberof BetStatusPipe
   */
  transform(value: number) {
    let status: string;
    var unixTimestamp = new Date( value*1000 ) ;
    status = unixTimestamp.toLocaleString();
    return status;
  }
}
