import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormater',
  standalone: true
})
export class DateFormaterPipe implements PipeTransform {

  transform(value: Date | undefined): string {
    if(!value) return "";

    const date: Date = new Date(value);

    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

}
