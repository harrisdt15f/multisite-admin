


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
            result = '已结束';
        } else if (time < startTime) {
            result = '未开始';
        } else {
            result = '进行中';
        }
        return result;

    }
}
