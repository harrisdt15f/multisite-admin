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
    if (!value || value === 0) return 0;
    let status: string;
    let unixTimestamp = new Date(value * 1000);
    status = unixTimestamp.toLocaleString();
    return status;
  }
}
