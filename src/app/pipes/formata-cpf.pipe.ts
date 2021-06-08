import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formataCpf'
})
export class FormataCpfPipe implements PipeTransform {

  
  formataCPF(cpf: string): string {
    //retira os caracteres indesejados...
    cpf = cpf.replace(/[^\d]/g, "");
  
    //realizar a formatação...
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  transform(value: string, args?: string): string {
    return this.formataCPF(value);
  }

}
