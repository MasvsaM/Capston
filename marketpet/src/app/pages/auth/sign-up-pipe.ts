import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'signUp'
})
export class SignUpPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
