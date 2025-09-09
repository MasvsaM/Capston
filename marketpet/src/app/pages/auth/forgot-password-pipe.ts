import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'forgotPassword'
})
export class ForgotPasswordPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
