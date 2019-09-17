


import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'ifTimeEnd',
})

export class IfTimeEndPipe implements PipeTransform {
    transform(data: any) {
        let result = '';
        let startTime = new Date(data.start_time).getTime();
        let endTime = new Date(data.end_time).getTime();
        let time = new Date().getTime();
        if (time > endTime) {
            result = "<span class='red-color'>已结束</span>";
        } else if (time < startTime) {
            result = "<span >未开始</span>";
        } else {
            result = "<span class='green-color'>进行中</span>";
        }
        return result;

    }
}
